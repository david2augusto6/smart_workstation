const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Configurações do Ambiente
const mqttBroker = process.env.MQTT_BROKER;
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

let dbClient;
let telemetryCollection;

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

// ==========================================
// 2. ERGONOMY ENGINE
// ==========================================
function processErgonomics(payload) {
    console.log(`[Ergonomy Engine] Analisando postura do dispositivo: ${payload.device_id}`);
    
    // Verificação puramente local no terminal, sem chamadas externas
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
    const client = mqtt.connect(mqttBroker);
    const targetTopic = 'cadeira/telemetria/v1';

    client.on('connect', () => {
        console.log(`[MQTTListener] Conectado ao Broker: ${mqttBroker}`);
        client.subscribe(targetTopic, (err) => {
            if (!err) {
                console.log(`[MQTTListener] Subscrito com sucesso no tópico: ${targetTopic}`);
            }
        });
    });

    client.on('message', async (topic, message) => {
        if (topic === targetTopic) {
            try {
                // Validação do pacote JSON de entrada
                const payload = JSON.parse(message.toString());
                console.log('\n-----------------------------------------');
                console.log('[MQTTListener] Novo payload recebido do ESP32:', payload);

                // Adiciona uma propriedade com a data/hora de recepção do servidor
                const documentToStore = {
                    ...payload,
                    received_at: new Date()
                };

                // Persistência e Confirmação no Banco de Dados
                if (telemetryCollection) {
                    const result = await telemetryCollection.insertOne(documentToStore);
                    console.log(`[Database Manager] ✅ Dados salvos com sucesso! ID no MongoDB: ${result.insertedId}`);
                }

                // Execução da lógica de negócio local
                processErgonomics(payload);

            } catch (error) {
                console.error('[MQTTListener] Erro ao processar ou validar o JSON recebido:', error.message);
            }
        }
    });

    client.on('error', (err) => {
        console.error('[MQTTListener] Erro de conexão MQTT:', err.message);
    });
}

// ==========================================
// INICIALIZAÇÃO DO BACKEND
// ==========================================
async function main() {
    await connectDatabase();
    startMQTTListener();
}

main();