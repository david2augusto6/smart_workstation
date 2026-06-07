import { Armchair } from "lucide-react";

function StatusCard({ currentState, deviceId }) {
  const stateClass = currentState.toLowerCase();

  return (
    <section className="card status-card">
      <div className="section-header">
        <div>
          <span className="eyebrow">postura</span>
          <h2>Estado atual</h2>
        </div>

        <div className={`mini-icon ${stateClass}`}>
          <Armchair size={20} />
        </div>
      </div>

      {/* destaque principal da tela */}
      <p className={`big-text ${stateClass}`}>{currentState}</p>

      {/* depois pode virar seletor caso existam varios dispositivos */}
      <span className="muted-text">Dispositivo: {deviceId}</span>
    </section>
  );
}

export default StatusCard;
