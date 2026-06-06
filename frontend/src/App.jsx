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
    <div className="app">
      {/* cabecalho principal; depois pode receber mais infos do dispositivo */}
      <Header currentState={telemetry.current_state} />

      <main className="dashboard">
        {/* card principal do estado atual da postura */}
        <StatusCard
          currentState={telemetry.current_state}
          deviceId={telemetry.device_id}
        />

        {/* sensor de inclinacao do encosto; depois ajustar limites ideais */}
        <SensorCard
          title="Ângulo do Encosto"
          value={sensors.backrest_angle_deg}
          unit="°"
          description="Sensor MPU6050"
        />

        {/* sensor de distancia cervical; depois definir faixa ideal */}
        <SensorCard
          title="Distância Cervical"
          value={sensors.cervical_distance_cm}
          unit=" cm"
          description="Sensor ultrassônico HC-SR04"
        />

        {/* mapa dos sensores fsr do assento */}
        <PressureMap fsrMatrix={sensors.fsr_matrix} />

        {/* controles visuais; depois conectar ao mqtt ou backend */}
        <ControlPanel />
      </main>
    </div>
  );
}

export default App;
