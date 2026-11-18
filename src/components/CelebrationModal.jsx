import { useEffect } from 'react';
import { playCelebrationChime } from '../utils/audio';

export function CelebrationModal({ sessionData, prayer, onClose }) {
  useEffect(() => {
    playCelebrationChime();
  }, []);

  if (!sessionData) return null;

  const mins = Math.floor(sessionData.seconds / 60);
  const secs = sessionData.seconds % 60;
  const timeFormatted = `${mins > 0 ? `${mins} मिनट ` : ''}${secs} सेकंड`;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="celebration-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Flower shower effect */}
        <div className="flower-shower" aria-hidden="true">
          <span>🌸</span><span>🪷</span><span>🌼</span><span>🌺</span><span>🌸</span>
        </div>

        <div className="celebration-badge">🚩 साधु! साधु! 🚩</div>
        <h2 className="celebration-title">संकल्प संपन्न हुआ</h2>
        <p className="celebration-sub">
          {prayer.deity} की कृपा आप और आपके परिवार पर सदा बनी रहे।
        </p>

        <div className="session-summary-box">
          <div className="summary-stotra">
            <span className="summary-icon">{prayer.icon}</span>
            <span className="summary-name">{prayer.title}</span>
          </div>
          <div className="summary-stats-grid">
            <div className="summary-item">
              <span className="summary-val">{sessionData.count}</span>
              <span className="summary-lbl">पाठ संख्या</span>
            </div>
            <div className="summary-item">
              <span className="summary-val">{timeFormatted}</span>
              <span className="summary-lbl">सत्र समय</span>
            </div>
          </div>
        </div>

        <p className="celebration-verse">
          “पवन तनय संकट हरन, मंगल मूरति रूप।<br />
          राम लखन सीता सहित, हृदय बसहु सुर भूप॥”
        </p>

        <button type="button" className="btn-celebration-close" onClick={onClose}>
          🙏 जय श्री राम / ॐ गं गणपतये नमः
        </button>
      </div>
    </div>
  );
}
