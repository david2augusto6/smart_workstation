function SensorCard({ title, value, unit, description }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {/* valor principal do sensor */}
      <p className="sensor-value">
        {value}
        {unit}
      </p>
      {/* descricao curta do sensor usado */}
      <span>{description}</span>
    </section>
  );
}

export default SensorCard;
