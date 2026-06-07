// frontend/src/data/mockTelemetry.js

// mock baseado no json atual publicado pelo esp32 em cadeira/telemetria/v1
// fsr ainda e simulado porque o embarcado atual nao envia matriz de pressao

export const telemetry = {
  device_id: "esp32_chair_01",
  timestamp: 0,

  sensors: {
    backrest_angle_deg: 12.5,
    cervical_distance_cm: 45.2,

    fsr_matrix: {
      front_left: 412,
      front_right: 430,
      back_left: 120,
      back_right: 540,
    },
  },

  // no embarcado atual o estado ainda esta fixo como OK
  current_state: "OK",
};
