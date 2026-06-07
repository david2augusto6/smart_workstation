// frontend/src/App.jsx

import { Activity, Gauge, Ruler } from "lucide-react";

import Header from "./components/Header";
import StatusCard from "./components/StatusCard";
import SensorCard from "./components/SensorCard";
import PressureMap from "./components/PressureMap";
import ControlPanel from "./components/ControlPanel";
import AlertHistory from "./components/AlertHistory";
import TelemetryChart from "./components/TelemetryChart";

import { telemetry } from "./data/mockTelemetry";
import { alertHistory, telemetryHistory } from "./data/mockHistory";

import "./index.css";

function App() {
  // atalho para evitar repetir telemetry.sensors varias vezes
  const sensors = telemetry.sensors;

  return (
    <div className="app-shell">
      <div className="main-area">
        <Header
          currentState={telemetry.current_state}
          deviceId={telemetry.device_id}
        />

        <main className="dashboard premium-grid">
          <section className="hero-card">
            <div className="hero-content">
              <span className="eyebrow">estação inteligente</span>

              <h1>Monitoramento postural em tempo real</h1>

              <p>
                Dados atuais vindos do formato MQTT do ESP32. A matriz FSR ainda
                permanece simulada até ser adicionada no embarcado.
              </p>

              <div className="hero-metrics">
                <div>
                  <strong>{telemetry.current_state}</strong>
                  <span>estado atual</span>
                </div>

                <div>
                  <strong>{sensors.backrest_angle_deg}°</strong>
                  <span>encosto</span>
                </div>

                <div>
                  <strong>{sensors.cervical_distance_cm} cm</strong>
                  <span>distância</span>
                </div>
              </div>
            </div>

            <div className="workstation-visual">
              <div className="monitor"></div>
              <div className="desk"></div>

              <div className="chair">
                <span className="sensor-dot dot-a"></span>
                <span className="sensor-dot dot-b"></span>
                <span className="sensor-dot dot-c"></span>
              </div>

              <div className="signal-card">
                <Activity size={16} />
                <span>telemetria ativa</span>
              </div>
            </div>
          </section>

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

          <PressureMap fsrMatrix={sensors.fsr_matrix} />

          <AlertHistory alerts={alertHistory} />

          <TelemetryChart history={telemetryHistory} />
        </main>
      </div>
    </div>
  );
}

export default App;
