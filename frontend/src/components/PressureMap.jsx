function PressureMap({ fsrMatrix }) {
  return (
    <section className="card pressure-card">
      <h2>Mapa de Pressão do Assento</h2>

      <div className="pressure-grid">
        <div className="pressure-cell">
          <span>Frente esquerda</span>
          <strong>{fsrMatrix.front_left}</strong>
        </div>

        <div className="pressure-cell">
          <span>Frente direita</span>
          <strong>{fsrMatrix.front_right}</strong>
        </div>

        {/* classe temporaria para destacar ponto com menor pressao */}
        <div className="pressure-cell warning">
          <span>Trás esquerda</span>
          <strong>{fsrMatrix.back_left}</strong>
        </div>

        {/* classe temporaria para destacar maior concentracao de peso */}
        <div className="pressure-cell danger">
          <span>Trás direita</span>
          <strong>{fsrMatrix.back_right}</strong>
        </div>
      </div>
    </section>
  );
}

export default PressureMap;
