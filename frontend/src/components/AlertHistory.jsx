// frontend/src/components/AlertHistory.jsx

import { Bell } from "lucide-react";

function AlertHistory({ alerts }) {
  return (
    <section className="card alerts-card">
      <div className="section-header">
        <div>
          <span className="eyebrow">eventos</span>
          <h2>Histórico de alertas</h2>
        </div>

        <Bell size={20} />
      </div>

      <div className="alert-list">
        {alerts.map((alert, index) => (
          <div className={`alert-item ${alert.type}-alert`} key={index}>
            <span></span>

            <div>
              <strong>{alert.title}</strong>
              <p>{alert.message}</p>
              <small>{alert.time}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AlertHistory;
