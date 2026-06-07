// frontend/src/components/TelemetryChart.jsx

function TelemetryChart({ history }) {
  // grafico simples sem biblioteca externa
  const maxAngle = Math.max(...history.map((item) => item.angle));
  const maxDistance = Math.max(...history.map((item) => item.distance));

  return (
    <section className="card chart-card">
      <div className="section-header">
        <div>
          <span className="eyebrow">histórico</span>
          <h2>Telemetria recente</h2>
        </div>

        <span className="live-chip">mock</span>
      </div>

      <div className="chart-list">
        {history.map((item) => (
          <div className="chart-row" key={item.time}>
            <span className="chart-time">{item.time}</span>

            <div className="chart-bars">
              <div className="bar-line">
                <span>ângulo</span>
                <div className="bar-track">
                  <div
                    className="bar-fill blue-fill"
                    style={{ width: `${(item.angle / maxAngle) * 100}%` }}
                  ></div>
                </div>
                <strong>{item.angle}°</strong>
              </div>

              <div className="bar-line">
                <span>distância</span>
                <div className="bar-track">
                  <div
                    className="bar-fill yellow-fill"
                    style={{ width: `${(item.distance / maxDistance) * 100}%` }}
                  ></div>
                </div>
                <strong>{item.distance} cm</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TelemetryChart;
