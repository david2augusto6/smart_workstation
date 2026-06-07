// frontend/src/components/PressureMap.jsx

function PressureMap({ fsrMatrix }) {
  return (
    <section className="card pressure-card">
      <div className="section-header">
        <div>
          <span className="eyebrow">sensores fsr</span>
          <h2>Mapa de Pressão do Assento</h2>
          <p className="muted-text">
            valores simulados até o embarcado enviar a matriz fsr
          </p>
        </div>

        <span className="live-chip">simulado</span>
      </div>

      <div className="pressure-grid">
        <div className="pressure-cell">
          <span>Frente esquerda</span>
          <strong>{fsrMatrix.front_left}</strong>
        </div>

        <div className="pressure-cell">
          <span>Frente direita</span>
          <strong>{fsrMatrix.front_right}</strong>
        </div>

        <div className="pressure-cell warning">
          <span>Trás esquerda</span>
          <strong>{fsrMatrix.back_left}</strong>
        </div>

        <div className="pressure-cell danger">
          <span>Trás direita</span>
          <strong>{fsrMatrix.back_right}</strong>
        </div>
      </div>
    </section>
  );
}

export default PressureMap;
