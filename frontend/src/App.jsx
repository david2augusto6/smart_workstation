import { Activity, Bell, Gauge, Ruler } from "lucide-react";

import Header from "./components/Header";
import StatusCard from "./components/StatusCard";
import SensorCard from "./components/SensorCard";
import PressureMap from "./components/PressureMap";
import ControlPanel from "./components/ControlPanel";

import { telemetry } from "./data/mockTelemetry";

import "./index.css";

function App() {
  // atalho para evitar repetir telemetry.sensors varias vezes
  const sensors = telemetry.sensors;

  return (
    <div className="app-shell">
      <div className="main-area">
        {/* header limpo; sem menu lateral e sem busca por enquanto */}
        <Header
          currentState={telemetry.current_state}
          deviceId={telemetry.device_id}
        />

        <main className="dashboard premium-grid">
          {/* card visual principal para identidade do dashboard */}
          <section className="hero-card">
            <div className="hero-content">
              <span className="eyebrow">estação inteligente</span>

              <h1>Monitoramento postural em tempo real</h1>

              <p>
                Leitura integrada dos sensores de pressão, inclinação do encosto
                e distância cervical para acompanhamento ergonômico.
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

            {/* ilustracao feita em css; depois pode trocar por imagem 3d */}
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

          {/* card principal do estado atual da postura */}
          <StatusCard
            currentState={telemetry.current_state}
            deviceId={telemetry.device_id}
          />

          {/* sensor de inclinacao do encosto; depois ajustar limites ideais */}
          <SensorCard
            icon={<Gauge size={22} />}
            title="Ângulo do Encosto"
            value={sensors.backrest_angle_deg}
            unit="°"
            description="Sensor MPU6050"
            detail="inclinação monitorada"
          />

          {/* sensor de distancia cervical; depois definir a faixa ideal */}
          <SensorCard
            icon={<Ruler size={22} />}
            title="Distância Cervical"
            value={sensors.cervical_distance_cm}
            unit=" cm"
            description="Sensor ultrassônico HC-SR04"
            detail="distância até o monitor"
          />

          {/* controles visuais; depois conectar ao mqtt ou backend */}
          <ControlPanel />

          {/* mapa dos quatro sensores fsr do assento */}
          <PressureMap fsrMatrix={sensors.fsr_matrix} />

          {/* area visual para eventos recentes; depois pode vir do backend */}
          <section className="card alerts-card">
            <div className="section-header">
              <div>
                <span className="eyebrow">eventos</span>
                <h2>Alertas recentes</h2>
              </div>

              <Bell size={20} />
            </div>

            <div className="alert-list">
              <div className="alert-item warning-alert">
                <span></span>

                <div>
                  <strong>Postura em alerta</strong>
                  <p>Assimetria detectada no assento.</p>
                </div>
              </div>

              <div className="alert-item info-alert">
                <span></span>

                <div>
                  <strong>Leitura atualizada</strong>
                  <p>Dados recebidos do dispositivo simulado.</p>
                </div>
              </div>

              <div className="alert-item danger-alert">
                <span></span>

                <div>
                  <strong>Concentração de peso</strong>
                  <p>Maior carga na região traseira direita.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
