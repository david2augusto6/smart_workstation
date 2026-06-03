#include "UltrassonicSensor.h"
#include "IMUSensor.h"
#include "NetworkManager.h"

// --- CONFIGURAÇÕES DE REDE ---
const char* WIFI_SSID     = "David";
const char* WIFI_PASSWORD = "d4v1d4u9u5t0";
const char* MQTT_BROKER   = "35.156.131.125"; // Broker público de teste, mude se usar o Mosquitto local

// Instanciação dos módulos
UltrassonicSensor sensorCervical(5, 18);
IMUSensor        sensorInclinacao(21, 22);
ChairNetworkManager   rede(WIFI_SSID, WIFI_PASSWORD, MQTT_BROKER);

// Variáveis de controle de tempo
unsigned long tempoAnterior = 0;
const long intervaloEnvio = 5000; // Envia telemetria a cada 5 segundos

void setup() {
    Serial.begin(115200);
    Serial.println("\n--- Inicializando Sistema IoT ---");

    sensorCervical.begin();
    
    if (!sensorInclinacao.begin()) {
        Serial.println("ERRO: MPU6050 não encontrado!");
        while(1);
    }

    // Inicializa a rede (WiFi, NTP e MQTT)
    rede.begin();
    Serial.println("--- Sistema Pronto para Transmissão ---");
}

void loop() {
    // Garante que o ESP32 continua conectado antes de qualquer ação de rede
    rede.handleConnection();

    unsigned long tempoAtual = millis();

    // Executa o envio periódico (sem travar o loop com delay)
    if (tempoAtual - tempoAnterior >= intervaloEnvio) {
        tempoAnterior = tempoAtual;

        // 1. Coleta os dados reais dos sensores
        float distancia = sensorCervical.readDistanceCm();
        float angulo = sensorInclinacao.getPitchAngle();
        
               
        // Estado postural provisório (vamos implementar a máquina de estados a seguir)
        const char* estadoPostura = "OK"; 

        // 2. Dispara o JSON estruturado para o Broker MQTT
        rede.sendTelemetry("esp32_chair_01", distancia, angulo, estadoPostura);
    }
}