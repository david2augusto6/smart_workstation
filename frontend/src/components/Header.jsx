function Header({ currentState }) {
// transforma o estado em classe css: ok, alerta ou critico
  const stateClass = currentState.toLowerCase();

  return (
    <header className="header">
      <div>
        {/* nome do sistema*/}
        <h1>Smart Workstation</h1>
        <p>Dashboard de monitoramento postural inteligente</p>
      </div>
{/* badge muda de cor conforme o estado recebido */}
      <div className={`status ${stateClass}`}>
        {currentState}
      </div>
    </header>
  );
}

export default Header;
