// dados simulados por enquanto; depois isso pode vir do mqtt ou do backend
export const telemetry = {
  device_id: "esp32_chair_01",

  sensors: {
    fsr_matrix: {
      front_left: 412,
      front_right: 430,
      back_left: 120,
      back_right: 540,
    },

    backrest_angle_deg: 12.5,
    cervical_distance_cm: 45.2,
  },

  current_state: "ALERTA",
};