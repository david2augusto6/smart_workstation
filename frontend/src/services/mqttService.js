// frontend/src/services/mqttService.js

// servico preparado para mqtt; ainda nao conectar automaticamente
// depois usar pacote mqtt: npm install mqtt

export function normalizeTelemetry(payload) {
  return {
    device_id: payload.device_id,
    timestamp: payload.timestamp,

    sensors: {
      backrest_angle_deg: payload.sensors?.backrest_angle_deg ?? 0,
      cervical_distance_cm: payload.sensors?.cervical_distance_cm ?? 0,

      // fallback temporario enquanto o esp32 nao envia fsr
      fsr_matrix: payload.sensors?.fsr_matrix ?? {
        front_left: 0,
        front_right: 0,
        back_left: 0,
        back_right: 0,
      },
    },

    current_state: payload.current_state ?? "OK",
  };
}

export const MQTT_TOPIC_TELEMETRY = "cadeira/telemetria/v1";
export const MQTT_TOPIC_CONTROL = "cadeira/controle/esp32_chair_01";
