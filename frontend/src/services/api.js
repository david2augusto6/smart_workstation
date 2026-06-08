// frontend/src/services/api.js

// camada preparada para backend
// centraliza os endpoints e evita espalhar URL pelo projeto

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchTelemetryLatest() {
  const response = await fetch(`${API_BASE_URL}/telemetry/latest`);

  if (!response.ok) {
    throw new Error("erro ao buscar telemetria mais recente");
  }

  return response.json();
}

export async function fetchTelemetryHistory(limit = 12) {
  const response = await fetch(`${API_BASE_URL}/telemetry/history?limit=${limit}`);

  if (!response.ok) {
    throw new Error("erro ao buscar historico de telemetria");
  }

  return response.json();
}

export async function sendControlCommand(command) {
  const response = await fetch(`${API_BASE_URL}/control`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error("erro ao enviar comando");
  }

  return response.json();
}
