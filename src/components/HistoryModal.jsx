export function HistoryModal({
  prayers,
  history,
  lifetimeCounts,
  onClearHistory,
  onClose,
}) {
  const totalAllChants = Object.values(lifetimeCounts || {}).reduce((acc, c) => acc + c, 0);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="history-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">📿</span>
            <h2 className="modal-title">पाठ डायरी व इतिहास (Sadhana Log)</h2>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Lifetime Totals per Prayer */}
        <div className="lifetime-summary-section">
          <div className="total-badge-banner">
            <span className="total-badge-label">सम्पूर्ण जीवनकाल पाठ:</span>
            <span className="total-badge-value">{totalAllChants}</span>
          </div>

          <div className="stotra-totals-grid">
            {prayers.map((prayer) => {
              const count = lifetimeCounts[prayer.id] || 0;
              return (
                <div key={prayer.id} className="stotra-total-card">
                  <span className="card-icon">{prayer.icon}</span>
                  <div className="card-text">
                    <span className="card-title">{prayer.title}</span>
                    <span className="card-count">{count} बार</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session History List */}
        <div className="history-list-section">
          <h3 className="history-list-heading">पिछले सत्र (Recent Sessions)</h3>
          {(!history || history.length === 0) ? (
            <div className="empty-history-state">
              <p>अभी तक कोई सत्र सहेजा नहीं गया है।</p>
              <p className="empty-hint">पाठ पूर्ण करने के बाद काउंटर के "सत्र सहेजें" बटन पर क्लिक करें।</p>
            </div>
          ) : (
            <div className="history-items-scroll">
              {history.slice(0, 50).map((item, idx) => {
                const prayer = prayers.find((p) => p.id === item.prayerId);
                const dateStr = new Date(item.timestamp).toLocaleString('hi-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });
                const mins = Math.floor(item.seconds / 60);
                const secs = item.seconds % 60;
                const durationStr = `${mins > 0 ? `${mins}m ` : ''}${secs}s`;

                return (
                  <div key={idx} className="history-item-row">
                    <div className="item-stotra-col">
                      <span className="item-icon">{prayer?.icon || '🕉️'}</span>
                      <div className="item-names">
                        <strong className="item-title">{prayer?.title || item.prayerId}</strong>
                        <span className="item-date">{dateStr}</span>
                      </div>
                    </div>
                    <div className="item-stats-col">
                      <span className="item-count-badge">+{item.count} पाठ</span>
                      <span className="item-duration">{durationStr}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {history && history.length > 0 && (
            <button
              type="button"
              className="btn-clear-history"
              onClick={() => {
                if (window.confirm('क्या आप सम्पूर्ण इतिहास हटाना चाहते हैं?')) {
                  onClearHistory();
                }
              }}
            >
              🗑️ इतिहास साफ करें
            </button>
          )}
          <button type="button" className="btn-done" onClick={onClose}>
            बन्द करें
          </button>
        </div>
      </div>
    </div>
  );
}
