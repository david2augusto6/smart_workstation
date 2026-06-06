function ControlPanel() {
  return (
    <section className="card control-card">
      <h2>Controle Manual</h2>

      {/* depois conectar ao comando mqtt set_mode */}
      <label>
        <input type="checkbox" defaultChecked />
        Modo automático
      </label>

      {/* depois enviar esse valor como vibration_enabled */}
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
  );
}

export default ControlPanel;
