const mqtt = require('mqtt');
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

if (typeof crypto === 'undefined') {
    globalThis.crypto = require('crypto');
}

// Configurações do Ambiente
const mqttBroker = process.env.MQTT_BROKER;
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;
const httpPort = process.env.PORT || 3000;

let dbClient;
let telemetryCollection;
let mqttClient;
let io;

// ==========================================
// 1. DATABASE MANAGER
// ==========================================
async function connectDatabase() {
    try {
        dbClient = new MongoClient(mongoUri);
        await dbClient.connect();
        const db = dbClient.db(dbName);
        telemetryCollection = db.collection('telemetry');
        console.log('[Database Manager] Conectado ao MongoDB com sucesso.');
    } catch (error) {
        console.error('[Database Manager] Erro ao conectar ao MongoDB:', error.message);
        process.exit(1);
    }
}

function normalizeTelemetry(doc) {
    if (!doc) return null;

    const sensors = doc.sensors || {};
    return {
        id: doc._id,
        device_id: doc.device_id || 'desconhecido',
        current_state: doc.current_state || 'OK',
        received_at: doc.received_at,
        sensors: {
            backrest_angle_deg: sensors.backrest_angle_deg ?? 0,
            cervical_distance_cm: sensors.cervical_distance_cm ?? 0,
        },
    };
}

function buildHistoryItem(doc) {
    const telemetry = normalizeTelemetry(doc);
    const date = new Date(doc.received_at);
    
    // Converte para fuso horário GMT-4:00 (Manaus)
    const manausDate = new Date(date.getTime() - (4 * 60 * 60 * 1000));

    return {
        time: manausDate.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        }),
        angle: telemetry.sensors.backrest_angle_deg,
        distance: telemetry.sensors.cervical_distance_cm,
        current_state: telemetry.current_state,
        device_id: telemetry.device_id,
    };
}

// ==========================================
// 2. ERGONOMY ENGINE
// ==========================================
function processErgonomics(payload) {
    console.log(`[Ergonomy Engine] Analisando postura do dispositivo: ${payload.device_id}`);

    if (payload.current_state === 'CRÍTICO') {
        console.warn(`\x1b[31m[Ergonomy Engine] [ALERTA] Estado CRÍTICO detectado no dispositivo ${payload.device_id}! (Usuário há muito tempo em postura nociva)\x1b[0m`);
    } else if (payload.current_state === 'ALERTA') {
        console.log(`\x1b[33m[Ergonomy Engine] [AVISO] Estado de ALERTA no dispositivo ${payload.device_id}.\x1b[0m`);
    } else {
        console.log(`[Ergonomy Engine] Estado OK no dispositivo ${payload.device_id}.`);
    }
}

// ==========================================
// 3. MQTT LISTENER
// ==========================================
function startMQTTListener() {
    mqttClient = mqtt.connect(mqttBroker);
    const targetTopic = 'cadeira/telemetria/v1';

    mqttClient.on('connect', () => {
        console.log(`[MQTTListener] Conectado ao Broker: ${mqttBroker}`);
        mqttClient.subscribe(targetTopic, (err) => {
            if (!err) {
                console.log(`[MQTTListener] Subscrito com sucesso no tópico: ${targetTopic}`);
            }
        });
    });

    mqttClient.on('message', async (topic, message) => {
        if (topic === targetTopic) {
            try {
                const payload = JSON.parse(message.toString());
                console.log('\n-----------------------------------------');
                console.log('[MQTTListener] Novo payload recebido do ESP32:', payload);

                const documentToStore = {
                    ...payload,
                    received_at: new Date(),
                };

                if (telemetryCollection) {
                    const result = await telemetryCollection.insertOne(documentToStore);
                    console.log(`[Database Manager] ✅ Dados salvos com sucesso! ID no MongoDB: ${result.insertedId}`);
                    
                    // Emitir via WebSocket para todos os clientes conectados
                    if (io) {
                        const telemetry = normalizeTelemetry(documentToStore);
                        io.emit('telemetry:update', telemetry);
                    }
                }

                processErgonomics(payload);
            } catch (error) {
                console.error('[MQTTListener] Erro ao processar ou validar o JSON recebido:', error);
            }
        }
    });

    mqttClient.on('error', (err) => {
        console.error('[MQTTListener] Erro de conexão MQTT:', err.message);
    });
}

// ==========================================
// 4. HTTP API SERVER COM WEBSOCKET
// ==========================================
function createApiServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    app.get('/telemetry/latest', async (req, res) => {
        try {
            if (!telemetryCollection) {
                return res.status(500).json({ error: 'Banco de dados não inicializado' });
            }

            const doc = await telemetryCollection.findOne({}, { sort: { received_at: -1 } });
            if (!doc) {
                return res.status(404).json({ error: 'Nenhum dado de telemetria encontrado' });
            }

            return res.json(normalizeTelemetry(doc));
        } catch (error) {
            console.error('[API] Erro em /telemetry/latest:', error.message);
            res.status(500).json({ error: 'Erro interno ao buscar telemetria' });
        }
    });

    app.get('/telemetry/history', async (req, res) => {
        try {
            if (!telemetryCollection) {
                return res.status(500).json({ error: 'Banco de dados não inicializado' });
            }

            const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
            const docs = await telemetryCollection
                .find({})
                .sort({ received_at: -1 })
                .limit(limit)
                .toArray();

            const history = docs.map(buildHistoryItem).reverse();
            return res.json(history);
        } catch (error) {
            console.error('[API] Erro em /telemetry/history:', error.message);
            res.status(500).json({ error: 'Erro interno ao buscar histórico de telemetria' });
        }
    });

    app.post('/control', (req, res) => {
        const command = req.body;
        if (!mqttClient || !mqttClient.connected) {
            return res.status(503).json({ error: 'MQTT indisponível' });
        }

        mqttClient.publish('cadeira/control/v1', JSON.stringify(command), (err) => {
            if (err) {
                console.error('[API] Erro ao publicar comando:', err.message);
                return res.status(500).json({ error: 'Erro ao enviar comando' });
            }
            res.json({ success: true, command });
        });
    });

    // Criar servidor HTTP e configurar socket.io
    const httpServer = createServer(app);
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`[WebSocket] Cliente conectado: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`[WebSocket] Cliente desconectado: ${socket.id}`);
        });
    });

    httpServer.listen(httpPort, '0.0.0.0', () => {
        console.log(`[HTTP API] Servindo em http://0.0.0.0:${httpPort}`);
    });
}

// ==========================================
// INICIALIZAÇÃO DO BACKEND
// ==========================================
async function main() {
    await connectDatabase();
    startMQTTListener();
    createApiServer();
}

main();
