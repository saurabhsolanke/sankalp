export function PrayerReader({ prayer, preferences, onScrollToCounter }) {
  if (!prayer) return null;

  const fontClass = `font-size-${preferences.fontSize}`;

  return (
    <article className={`prayer-reader ${fontClass}`}>
      {/* Prayer Banner */}
      <div className="prayer-banner">
        <div className="prayer-badge-icon" aria-hidden="true">{prayer.icon}</div>
        <div className="prayer-titles">
          <span className="prayer-deity-pill">{prayer.deity}</span>
          <h2 className="prayer-main-title">{prayer.title}</h2>
          <p className="prayer-sub-title">{prayer.englishTitle}</p>
          {prayer.tagline && (
            <p className="prayer-tagline">“{prayer.tagline}”</p>
          )}
        </div>
      </div>

      {/* Verses Container */}
      <div className="verses-container">
        {prayer.sections.map((section, sIdx) => (
          <section key={sIdx} className="verse-section">
            {section.heading && (
              <div className="section-divider">
                <span className="section-divider-flower">🪷</span>
                <h3 className="section-heading">{section.heading}</h3>
                <span className="section-divider-flower">🪷</span>
              </div>
            )}

            <div className="verses-list">
              {section.verses.map((verse, vIdx) => (
                <div key={vIdx} className="verse-card">
                  {verse.num !== undefined && (
                    <div className="verse-number-badge">
                      <span>{verse.num}</span>
                    </div>
                  )}

                  <div className="verse-text-content">
                    {/* Devanagari Script */}
                    {(preferences.script === 'devanagari' || preferences.script === 'both') && (
                      <p className="verse-devanagari">
                        {verse.devanagari.split('\n').map((line, lIdx) => (
                          <span key={lIdx} className="verse-line">
                            {line}
                          </span>
                        ))}
                      </p>
                    )}

                    {/* Transliteration */}
                    {(preferences.script === 'transliteration' || preferences.script === 'both') && (
                      <p className="verse-transliteration">
                        {verse.transliteration.split('\n').map((line, lIdx) => (
                          <span key={lIdx} className="verse-trans-line">
                            {line}
                          </span>
                        ))}
                      </p>
                    )}

                    {/* Meaning / Translation */}
                    {preferences.showMeaning && verse.meaning && (
                      <div className="verse-meaning">
                        <span className="meaning-label">अर्थ:</span> {verse.meaning}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Completion Indicator Leading to Counter */}
      <div className="prayer-completion-banner">
        <div className="completion-flourish">ॐ नमो भगवते वासुदेवाय • जय श्री राम • ॐ गं गणपतये नमः</div>
        <h3 className="completion-title">✨ पाठ संपन्न हुआ ✨</h3>
        <p className="completion-desc">
          आपकी यह आवृत्ति पूर्ण हुई। नीचे दिए गए काउंटर पर <strong>"पाठ पूर्ण (+1)"</strong> दबाकर अपनी सत्र गणना दर्ज करें।
        </p>
        <button
          type="button"
          className="btn-goto-counter"
          onClick={onScrollToCounter}
        >
          ⬇️ नीचे काउंटर पर गणना दर्ज करें ⬇️
        </button>
      </div>
    </article>
  );
}
