#include "NetworkManager.h"

ChairNetworkManager::ChairNetworkManager(const char* ssid, const char* password, const char* mqttBroker, int mqttPort) 
    : _mqttClient(_wifiClient) {
    _ssid = ssid;
    _password = password;
    _mqttBroker = mqttBroker;
    _mqttPort = mqttPort;
}

void ChairNetworkManager::begin() {
    connectWiFi();
    
    _mqttClient.setServer(_mqttBroker, _mqttPort);
    
    // Configura a sincronização de tempo via servidores NTP com fuso horário GMT-4:00 (Manaus)
    // gmtOffset_sec = -4 * 3600 = -14400; daylightOffset_sec = 0
    configTime(-14400, 0, "pool.ntp.org", "time.nist.gov");
    Serial.println("[NTP] Sincronizando hora com o servidor (GMT-4:00 - Manaus)...");
}

void ChairNetworkManager::connectWiFi() {
    if (WiFi.status() == WL_CONNECTED) return;

    Serial.print("[Wi-Fi] Conectando a: ");
    Serial.println(_ssid);
    WiFi.begin(_ssid, _password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\n[Wi-Fi] Conectado com sucesso!");
    Serial.print("[Wi-Fi] IP obtido: ");
    Serial.println(WiFi.localIP());
}

void ChairNetworkManager::connectMQTT() {
    while (!_mqttClient.connected()) {
        Serial.print("[MQTT] Tentando conexão com o Broker... ");
        
        String clientId = "ESP32ChairClient-" + String(random(0, 9999));
        
        if (_mqttClient.connect(clientId.c_str())) {
            Serial.println("CONECTADO!");
        } else {
            Serial.print("FALHOU, rc=");
            Serial.print(_mqttClient.state());
            Serial.println(" Intentando novamente em 5 segundos...");
            delay(5000);
        }
    }
}

void ChairNetworkManager::handleConnection() {
    if (WiFi.status() != WL_CONNECTED) {
        connectWiFi();
    }
    if (!_mqttClient.connected()) {
        connectMQTT();
    }
    _mqttClient.loop();
}

unsigned long ChairNetworkManager::getEpochTime() {
    time_t now;
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
        return 0;
    }
    time(&now);
    return now;
}

// Implementação ajustada para receber apenas os 4 parâmetros coletados até aqui
bool ChairNetworkManager::sendTelemetry(const char* deviceId, float distance, float angle, const char* state) {
    StaticJsonDocument<400> doc;
    
    doc["device_id"] = deviceId;
    doc["timestamp"] = getEpochTime();
    
    JsonObject sensors = doc.createNestedObject("sensors");
    
    // Injetamos os valores provisórios dos FSRs de forma automática aqui dentro 
    // para manter o padrão do relatório sem poluir a chamada no seu valid.ino
        
    sensors["backrest_angle_deg"] = angle;
    sensors["cervical_distance_cm"] = distance;
    
    doc["current_state"] = state;

    String jsonString;
    serializeJson(doc, jsonString);

    const char* topic = "cadeira/telemetria/v1";
    bool success = _mqttClient.publish(topic, jsonString.c_str());
    
    if (success) {
        Serial.println("[MQTT] Telemetria enviada com sucesso!");
        Serial.println(jsonString);
    } else {
        Serial.println("[MQTT] Erro ao publicar telemetria.");
    }
    
    return success;
}