import { useState, useEffect } from 'react';
import { playTempleBell, playCelebrationChime, triggerHaptic } from '../utils/audio';

const TARGET_PRESETS = [1, 3, 7, 11, 21, 51, 108];

export function SessionCounter({
  prayer,
  sessionCount,
  onIncrement,
  onDecrement,
  onReset,
  onFinishSession,
  target,
  onUpdateTarget,
  lifetimeCount,
  soundEnabled,
  hapticEnabled,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [customTargetInput, setCustomTargetInput] = useState('');
  const [showCustomTarget, setShowCustomTarget] = useState(false);

  // Start timer on first count increment if not already active
  useEffect(() => {
    if (sessionCount > 0 && !isTimerActive) {
      setIsTimerActive(true);
    }
  }, [sessionCount, isTimerActive]);

  // Session elapsed timer
  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive]);

  const handleIncrement = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (soundEnabled) {
      playTempleBell();
    }
    if (hapticEnabled) {
      triggerHaptic(45);
    }

    const nextCount = sessionCount + 1;
    onIncrement();

    // Check if target is just reached
    if (target > 0 && nextCount === target) {
      if (soundEnabled) {
        setTimeout(() => playCelebrationChime(), 350);
      }
    }
  };

  const handleDecrement = () => {
    if (sessionCount > 0) {
      if (hapticEnabled) triggerHaptic(25);
      onDecrement();
    }
  };

  const handleReset = () => {
    if (sessionCount === 0) return;
    if (window.confirm('क्या आप इस सत्र की गणना 0 पर रीसेट करना चाहते हैं?')) {
      onReset();
      setSessionSeconds(0);
      setIsTimerActive(false);
    }
  };

  const handleFinish = () => {
    if (sessionCount === 0) {
      alert('कृपया सत्र समाप्त करने से पहले कम से कम 1 पाठ पूरा करें।');
      return;
    }
    onFinishSession({
      count: sessionCount,
      seconds: sessionSeconds,
    });
    setSessionSeconds(0);
    setIsTimerActive(false);
  };

  // Format timer into mm:ss
  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = target > 0 ? Math.min(100, Math.round((sessionCount / target) * 100)) : 0;
  const isTargetAchieved = target > 0 && sessionCount >= target;

  return (
    <section id="session-counter" className="session-counter-section">
      <div className="counter-card-ornament top-ornament">
        <span>☸</span> <span>ॐ</span> <span>☸</span>
      </div>

      <div className="counter-header">
        <span className="counter-sub-badge">सत्र पाठ डायरी • Session Tracker</span>
        <h3 className="counter-title">
          {prayer.title} - पाठ गणना
        </h3>
        <p className="counter-desc">
          हर बार पाठ पूरा होने पर नीचे <strong>"पाठ पूर्ण (+1)"</strong> बटन दबाएं।
        </p>
      </div>

      {/* Target Sankalp Preset Selection */}
      <div className="target-selection-box">
        <div className="target-label-row">
          <span className="target-label">🎯 आपका संकल्प लक्ष्य (Sankalp Target):</span>
          <span className="target-current-value">
            {target > 0 ? `${target} पाठ` : 'कोई लक्ष्य नहीं'}
          </span>
        </div>

        <div className="target-presets">
          {TARGET_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`target-pill ${target === preset ? 'active' : ''}`}
              onClick={() => onUpdateTarget(preset)}
            >
              {preset}
            </button>
          ))}
          <button
            type="button"
            className={`target-pill ${showCustomTarget ? 'active' : ''}`}
            onClick={() => setShowCustomTarget(!showCustomTarget)}
          >
            अन्य...
          </button>
        </div>

        {showCustomTarget && (
          <form
            className="custom-target-form"
            onSubmit={(e) => {
              e.preventDefault();
              const val = parseInt(customTargetInput, 10);
              if (val > 0) {
                onUpdateTarget(val);
                setShowCustomTarget(false);
                setCustomTargetInput('');
              }
            }}
          >
            <input
              type="number"
              min="1"
              max="10000"
              placeholder="लक्ष्य संख्या (उदा. 108)"
              value={customTargetInput}
              onChange={(e) => setCustomTargetInput(e.target.value)}
            />
            <button type="submit" className="btn-set-target">सेट करें</button>
          </form>
        )}
      </div>

      {/* Progress Bar */}
      {target > 0 && (
        <div className="counter-progress-container">
          <div className="progress-info-row">
            <span>प्रगति (Progress):</span>
            <span>
              {sessionCount} / {target} ({progressPercent}%)
            </span>
          </div>
          <div className="progress-track">
            <div
              className={`progress-fill ${isTargetAchieved ? 'achieved' : ''}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {isTargetAchieved && (
            <div className="target-congrats-banner">
              🎉 साधु! आपका {target} पाठ का संकल्प पूरा हुआ! 🪷
            </div>
          )}
        </div>
      )}

      {/* Main Counter Display & Big Tap Button */}
      <div className="counter-core-grid">
        <div className="counter-display-card">
          <div className="counter-timer-pill">
            ⏱️ सत्र समय: {formatTime(sessionSeconds)}
          </div>

          <div
            className={`counter-big-circle ${isAnimating ? 'pulse' : ''} ${isTargetAchieved ? 'glow-gold' : ''}`}
            onClick={handleIncrement}
            role="button"
            tabIndex={0}
            title="क्लिक करके पाठ जोड़ें (+1)"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleIncrement();
              }
            }}
          >
            <span className="counter-circle-label">वर्तमान सत्र (Session)</span>
            <span className="counter-circle-value">{sessionCount}</span>
            <span className="counter-circle-hint">
              {target > 0 ? `लक्ष्य: ${target}` : 'टैप करें +1'}
            </span>
          </div>

          <div className="counter-meta-row">
            <div className="meta-stat">
              <span className="stat-label">इस स्तोत्र के कुल पाठ:</span>
              <span className="stat-value">{lifetimeCount + sessionCount}</span>
            </div>
            {target > 0 && sessionCount < target && (
              <div className="meta-stat">
                <span className="stat-label">शेष पाठ:</span>
                <span className="stat-value highlight">{target - sessionCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Counter Action Buttons */}
        <div className="counter-actions-box">
          <button
            type="button"
            className={`btn-primary-count ${isAnimating ? 'active' : ''}`}
            onClick={handleIncrement}
          >
            <span className="btn-icon-bell">🔔</span>
            <span className="btn-text-main">पाठ पूर्ण (+1)</span>
            <span className="btn-text-sub">Completed Once</span>
          </button>

          <div className="counter-secondary-actions">
            <button
              type="button"
              className="btn-action-secondary"
              onClick={handleDecrement}
              disabled={sessionCount === 0}
              title="गलती से दब गया हो तो घटाएं"
            >
              ↩️ -1 (सुधार)
            </button>

            <button
              type="button"
              className="btn-action-secondary"
              onClick={handleReset}
              disabled={sessionCount === 0}
              title="सत्र गणना शून्य करें"
            >
              🔄 सत्र रीसेट
            </button>
          </div>

          <button
            type="button"
            className="btn-finish-session"
            onClick={handleFinish}
            disabled={sessionCount === 0}
          >
            ✅ संकल्प पूरा हुआ • सत्र सहेजें
          </button>
        </div>
      </div>
    </section>
  );
}
