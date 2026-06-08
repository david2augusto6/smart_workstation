// frontend/src/App.jsx

import { useEffect, useMemo, useState } from "react";
import { Gauge, Ruler } from "lucide-react";

import Header from "./components/Header";
import StatusCard from "./components/StatusCard";
import SensorCard from "./components/SensorCard";
import ControlPanel from "./components/ControlPanel";
import AlertHistory from "./components/AlertHistory";
import TelemetryChart from "./components/TelemetryChart";

import { fetchTelemetryHistory, fetchTelemetryLatest } from "./services/api";

import "./index.css";

function App() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const [latestData, historyData] = await Promise.all([
          fetchTelemetryLatest(),
          fetchTelemetryHistory(12),
        ]);

        setLatest(latestData);
        setHistory(historyData);
      } catch (err) {
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }

    loadTelemetry();
  }, []);

  const alerts = useMemo(() => {
    if (!history.length) {
      return [];
    }

    return history
      .filter((item) => item.current_state && item.current_state !== "OK")
      .map((item) => ({
        title: `${item.current_state} detectado`,
        message: `Dispositivo ${item.device_id} registrou ${item.current_state.toLowerCase()}`,
        time: item.time,
        type: item.current_state === "CRÍTICO" ? "critical" : "warning",
      }));
  }, [history]);

  if (loading) {
    return <div className="app-shell">Carregando dados...</div>;
  }

  if (error) {
    return <div className="app-shell">Erro: {error}</div>;
  }

  const telemetry = latest || {
    current_state: "OK",
    device_id: "desconhecido",
    sensors: {
      backrest_angle_deg: 0,
      cervical_distance_cm: 0,
    },
  };

  return (
    <div className="app-shell">
      <div className="main-area">
        <Header currentState={telemetry.current_state} deviceId={telemetry.device_id} />

        <main className="dashboard">
          <StatusCard currentState={telemetry.current_state} deviceId={telemetry.device_id} />

          <SensorCard
            icon={<Gauge size={22} />}
            title="Ângulo do Encosto"
            value={telemetry.sensors.backrest_angle_deg}
            unit="°"
            description="Sensor MPU6050"
            detail="dado enviado pelo embarcado"
          />

          <SensorCard
            icon={<Ruler size={22} />}
            title="Distância Cervical"
            value={telemetry.sensors.cervical_distance_cm}
            unit=" cm"
            description="Sensor ultrassônico HC-SR04"
            detail="dado enviado pelo embarcado"
          />

          <ControlPanel />

          <TelemetryChart history={history} />

          <AlertHistory alerts={alerts} />
        </main>
      </div>
    </div>
  );
}

export default App;
