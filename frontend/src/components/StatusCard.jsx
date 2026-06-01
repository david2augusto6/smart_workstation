function StatusCard({ currentState, deviceId }) {
  return (
    <section className="card main-card">
      <h2>Estado Postural</h2>
      {/* destaque principal da tela */}
      <p className="big-text">{currentState}</p>
{/* depois pode virar seletor caso existam varios dispositivos */}
      <span>Dispositivo: {deviceId}</span>
    </section>
  );
}

export default StatusCard;
