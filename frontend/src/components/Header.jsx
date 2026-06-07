import { Activity, Wifi } from "lucide-react";

function Header({ currentState, deviceId }) {
  // transforma o estado em classe css: ok, alerta ou critico
  const stateClass = currentState.toLowerCase();

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="topbar-logo">
          <Activity size={22} />
        </div>

        <div>
          {/* nome do sistema pode mudar depois */}
          <span className="system-kicker">smart workstation</span>
          <h1>Dashboard Postural</h1>
          <p>Monitoramento ergonômico da estação inteligente</p>
        </div>
      </div>

      <div className="topbar-actions">
        {/* status de conexao visual; depois pode vir do backend */}
        <div className="connection-pill">
          <Wifi size={16} />
          <span>{deviceId}</span>
        </div>

        {/* badge muda de cor conforme o estado recebido */}
        <div className={`status ${stateClass}`}>{currentState}</div>
      </div>
    </header>
  );
}

export default Header;
