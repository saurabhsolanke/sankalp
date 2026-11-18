export function Header({
  prayers,
  activePrayerId,
  onSelectPrayer,
  sessionCount,
  preferences,
  onUpdatePreferences,
  onOpenHistory,
  onScrollToCounter,
}) {

  return (
    <header className="sankalp-header">
      <div className="header-top-bar">
        <div className="brand-group">
          <div className="sacred-symbol" aria-hidden="true">🕉️</div>
          <div className="brand-titles">
            <h1 className="brand-name">संकल्प <span className="brand-sub">Sankalp</span></h1>
            <p className="brand-tagline">नित्य स्तोत्र पाठ एवं सत्र गणना • Devotional Chants & Counter</p>
          </div>
        </div>

        <div className="header-controls">
          {/* Quick Jump to Counter */}
          <button
            type="button"
            className="btn-counter-jump"
            onClick={onScrollToCounter}
            title="सत्र काउंटर पर जाएं"
          >
            <span className="counter-jump-icon">📿</span>
            <span className="counter-jump-text">सत्र गणना:</span>
            <span className="counter-jump-badge">{sessionCount}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            className={`btn-icon ${preferences.soundEnabled ? 'active' : ''}`}
            onClick={() => onUpdatePreferences({ soundEnabled: !preferences.soundEnabled })}
            title={preferences.soundEnabled ? 'घंटी ध्वनि चालू (Sound On)' : 'घंटी ध्वनि बंद (Sound Off)'}
            aria-label="Toggle bell sound"
          >
            {preferences.soundEnabled ? '🔔' : '🔕'}
          </button>

          {/* Meaning Toggle */}
          <button
            type="button"
            className={`btn-pill ${preferences.showMeaning ? 'active' : ''}`}
            onClick={() => onUpdatePreferences({ showMeaning: !preferences.showMeaning })}
            title="श्लोक का अर्थ दिखाएं/छुपाएं"
          >
            अर्थ {preferences.showMeaning ? '✓' : ''}
          </button>

          {/* Script Mode Selector */}
          <div className="script-selector" title="भाषा / लिपि चुनें">
            <button
              type="button"
              className={preferences.script === 'devanagari' ? 'active' : ''}
              onClick={() => onUpdatePreferences({ script: 'devanagari' })}
            >
              हिन्दी
            </button>
            <button
              type="button"
              className={preferences.script === 'both' ? 'active' : ''}
              onClick={() => onUpdatePreferences({ script: 'both' })}
            >
              दोनो
            </button>
            <button
              type="button"
              className={preferences.script === 'transliteration' ? 'active' : ''}
              onClick={() => onUpdatePreferences({ script: 'transliteration' })}
            >
              Eng
            </button>
          </div>

          {/* Font Size Toggle */}
          <div className="font-size-control" title="अक्षर का आकार (Font size)">
            <button
              type="button"
              className={preferences.fontSize === 'sm' ? 'active' : ''}
              onClick={() => onUpdatePreferences({ fontSize: 'sm' })}
            >
              A-
            </button>
            <button
              type="button"
              className={preferences.fontSize === 'md' ? 'active' : ''}
              onClick={() => onUpdatePreferences({ fontSize: 'md' })}
            >
              A
            </button>
            <button
              type="button"
              className={preferences.fontSize === 'lg' ? 'active' : ''}
              onClick={() => onUpdatePreferences({ fontSize: 'lg' })}
            >
              A+
            </button>
          </div>

          {/* History / Stats */}
          <button
            type="button"
            className="btn-icon"
            onClick={onOpenHistory}
            title="पाठ इतिहास व आंकड़े (History)"
            aria-label="View history"
          >
            📊
          </button>

          {/* Theme Selector */}
          <button
            type="button"
            className="btn-icon"
            onClick={() => {
              const nextTheme = preferences.theme === 'temple' ? 'dark' : preferences.theme === 'dark' ? 'light' : 'temple';
              onUpdatePreferences({ theme: nextTheme });
            }}
            title={`थीम बदलें (वर्तमान: ${preferences.theme})`}
            aria-label="Toggle theme"
          >
            {preferences.theme === 'temple' ? '🪔' : preferences.theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      {/* Stotra Selector Tabs */}
      <nav className="stotra-tabs" aria-label="स्तोत्र सूची">
        {prayers.map((prayer) => {
          const isActive = prayer.id === activePrayerId;
          return (
            <button
              key={prayer.id}
              type="button"
              className={`stotra-tab ${isActive ? 'active' : ''}`}
              onClick={() => onSelectPrayer(prayer.id)}
            >
              <span className="stotra-tab-icon">{prayer.icon}</span>
              <span className="stotra-tab-title">{prayer.title}</span>
              {prayer.id === activePrayerId && sessionCount > 0 && (
                <span className="stotra-tab-count" title="इस सत्र का पाठ">{sessionCount}</span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
