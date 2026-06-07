function SensorCard({ icon, title, value, unit, description, detail }) {
  return (
    <section className="card sensor-card">
      <div className="section-header">
        <div>
          <span className="eyebrow">{description}</span>
          <h2>{title}</h2>
        </div>

        <div className="mini-icon blue">{icon}</div>
      </div>

      {/* valor principal do sensor */}
      <p className="sensor-value">
        {value} {unit}
      </p>

      {/* descricao curta para reforcar o significado do dado */}
      <span className="muted-text">{detail}</span>
    </section>
  );
}

export default SensorCard;
