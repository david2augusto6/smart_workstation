import "./index.css";

// dados simulados por enquanto; depois isso pode vir do mqtt ou do backend
const telemetry = {
  device_id: "esp32_chair_01",

  sensors: {
    fsr_matrix: {
      // valores dos sensores fsr do assento
      front_left: 412,
      front_right: 430,
      back_left: 120,
      back_right: 540,
    },

    // depois ajustar os limites ideais de inclinação
    backrest_angle_deg: 12.5,

    // depois definir a distância ideal entre usuário e monitor
    cervical_distance_cm: 45.2,
  },

  // estados esperados: ok, alerta ou critico
  current_state: "ALERTA",
};

function App() {
  // usado para trocar a cor do status conforme o estado recebido
  const stateClass = telemetry.current_state.toLowerCase();

  return (
    <div className="app">
      <header className="header">
        <div>
          {/* título pode mudar depois para o nome final do sistema */}
          <h1>Smart Workstation</h1>
          <p>Dashboard de monitoramento postural inteligente</p>
        </div>

        <div className={`status ${stateClass}`}>
          {telemetry.current_state}
        </div>
      </header>

      <main className="dashboard">
        <section className="card main-card">
          <h2>Estado Postural</h2>
          <p className="big-text">{telemetry.current_state}</p>
          <span>Dispositivo: {telemetry.device_id}</span>
        </section>

        <section className="card">
          <h2>Ângulo do Encosto</h2>
          <p className="sensor-value">
            {telemetry.sensors.backrest_angle_deg}°
          </p>
          <span>Sensor MPU6050</span>
        </section>

        <section className="card">
          <h2>Distância Cervical</h2>
          <p className="sensor-value">
            {telemetry.sensors.cervical_distance_cm} cm
          </p>
          <span>Sensor ultrassônico HC-SR04</span>
        </section>

        <section className="card pressure-card">
          <h2>Mapa de Pressão do Assento</h2>

          <div className="pressure-grid">
            <div className="pressure-cell">
              <span>Frente esquerda</span>
              <strong>{telemetry.sensors.fsr_matrix.front_left}</strong>
            </div>

            <div className="pressure-cell">
              <span>Frente direita</span>
              <strong>{telemetry.sensors.fsr_matrix.front_right}</strong>
            </div>

            {/* marcar como alerta porque a pressão está muito baixa nesse ponto */}
            <div className="pressure-cell warning">
              <span>Trás esquerda</span>
              <strong>{telemetry.sensors.fsr_matrix.back_left}</strong>
            </div>

            {/* marcar como crítico porque há concentração maior de peso */}
            <div className="pressure-cell danger">
              <span>Trás direita</span>
              <strong>{telemetry.sensors.fsr_matrix.back_right}</strong>
            </div>
          </div>
        </section>

        <section className="card control-card">
          <h2>Controle Manual</h2>

          {/* depois conectar esse campo ao comando mqtt set_mode */}
          <label>
            <input type="checkbox" defaultChecked />
            Modo automático
          </label>

          {/* depois enviar true/false para vibration_enabled */}
          <label>
            <input type="checkbox" defaultChecked />
            Vibração habilitada
          </label>

          {/* depois enviar esse valor como led_brightness */}
          <label>
            Brilho do LED
            <input type="range" min="0" max="100" defaultValue="50" />
          </label>

          {/* depois transformar em envio real para o esp32/backend */}
          <button>Enviar comando</button>
        </section>
      </main>
    </div>
  );
}

export default App;
