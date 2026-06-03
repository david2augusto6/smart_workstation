#ifndef CHAIR_NETWORK_MANAGER_H
#define CHAIR_NETWORK_MANAGER_H

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <time.h>

class ChairNetworkManager {
private:
    const char* _ssid;
    const char* _password;
    const char* _mqttBroker;
    int _mqttPort;
    
    WiFiClient _wifiClient;
    PubSubClient _mqttClient;

    void connectWiFi();
    void connectMQTT();
    unsigned long getEpochTime();

public:
    ChairNetworkManager(const char* ssid, const char* password, const char* mqttBroker, int mqttPort = 1883);
    
    void begin();
    void handleConnection(); // Mantém as conexões ativas (chamar no loop)
    
    // Envia a telemetria formatada em JSON com QoS 0
    bool sendTelemetry(const char* deviceId, float distance, float angle, 
                       const char* state);
};

#endif