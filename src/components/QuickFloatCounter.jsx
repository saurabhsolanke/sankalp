import { playTempleBell, triggerHaptic } from '../utils/audio';

export function QuickFloatCounter({
  prayer,
  sessionCount,
  target,
  onIncrement,
  onScrollToCounter,
  soundEnabled,
  hapticEnabled,
}) {
  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (soundEnabled) playTempleBell();
    if (hapticEnabled) triggerHaptic(40);
    onIncrement();
  };

  return (
    <div className="quick-float-counter">
      <div
        className="quick-float-info"
        onClick={onScrollToCounter}
        role="button"
        tabIndex={0}
        title="अंत में काउंटर पर जाएं"
      >
        <span className="quick-float-icon">{prayer.icon}</span>
        <div className="quick-float-text">
          <span className="quick-float-title">{prayer.title}</span>
          <span className="quick-float-count">
            सत्र: <strong>{sessionCount}</strong> {target > 0 ? `/ ${target}` : ''}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="btn-quick-increment"
        onClick={handleQuickAdd}
        title="पाठ पूर्ण (+1)"
      >
        🔔 +1
      </button>

      <button
        type="button"
        className="btn-quick-scroll"
        onClick={onScrollToCounter}
        title="काउंटर पर जाएं (Scroll to Counter)"
      >
        ⬇️
      </button>
    </div>
  );
}
