function ControlPanel() {
  return (
    <section className="card control-card">
      <div className="section-header">
        <div>
          <span className="eyebrow">atuadores</span>
          <h2>Controle Manual</h2>
        </div>

        <span className="live-chip">manual</span>
      </div>

      {/* depois conectar ao comando mqtt SET_MODE */}
      <label className="switch-row">
        <div>
          <strong>Modo automático</strong>
          <span>controle postural assistido</span>
        </div>

        <input type="checkbox" defaultChecked />
        <span className="switch-ui"></span>
      </label>

      {/* depois enviar esse valor como vibration_enabled */}
      <label className="switch-row">
        <div>
          <strong>Vibração habilitada</strong>
          <span>alerta háptico silencioso</span>
        </div>

        <input type="checkbox" defaultChecked />
        <span className="switch-ui"></span>
      </label>

      {/* depois transformar em envio real para o esp32/backend */}
      <button className="primary-button">Enviar comando</button>
    </section>
  );
}

export default ControlPanel;
