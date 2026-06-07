// frontend/src/App.jsx

import { Gauge, Ruler } from "lucide-react";

import Header from "./components/Header";
import StatusCard from "./components/StatusCard";
import SensorCard from "./components/SensorCard";
import ControlPanel from "./components/ControlPanel";
import AlertHistory from "./components/AlertHistory";
import TelemetryChart from "./components/TelemetryChart";

import { telemetry } from "./data/mockTelemetry";
import { alertHistory, telemetryHistory } from "./data/mockHistory";

import "./index.css";

function App() {
  const sensors = telemetry.sensors;

  return (
    <div className="app-shell">
      <div className="main-area">
        <Header
          currentState={telemetry.current_state}
          deviceId={telemetry.device_id}
        />

        <main className="dashboard">
          <StatusCard
            currentState={telemetry.current_state}
            deviceId={telemetry.device_id}
          />

          <SensorCard
            icon={<Gauge size={22} />}
            title="Ângulo do Encosto"
            value={sensors.backrest_angle_deg}
            unit="°"
            description="Sensor MPU6050"
            detail="dado enviado pelo embarcado"
          />

          <SensorCard
            icon={<Ruler size={22} />}
            title="Distância Cervical"
            value={sensors.cervical_distance_cm}
            unit=" cm"
            description="Sensor ultrassônico HC-SR04"
            detail="dado enviado pelo embarcado"
          />

          <ControlPanel />

          <TelemetryChart history={telemetryHistory} />

          <AlertHistory alerts={alertHistory} />
        </main>
      </div>
    </div>
  );
}

export default App;
