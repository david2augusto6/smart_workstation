// frontend/src/data/mockHistory.js

// historico simulado para testar graficos e alertas antes do mqtt real

export const telemetryHistory = [
  { time: "10:00", angle: 8.2, distance: 52.1, state: "OK" },
  { time: "10:05", angle: 10.4, distance: 49.8, state: "OK" },
  { time: "10:10", angle: 14.1, distance: 45.2, state: "ALERTA" },
];

export const alertHistory = [
  {
    type: "info",
    title: "Telemetria recebida",
    message: "Dados simulados carregados no dashboard.",
    time: "10:00",
  },
  {
    type: "warning",
    title: "Inclinação elevada",
    message: "Ângulo do encosto passou do limite definido.",
    time: "10:10",
  },
  {
    type: "danger",
    title: "Distância cervical reduzida",
    message: "Usuário muito próximo do monitor.",
    time: "10:15",
  },
];
