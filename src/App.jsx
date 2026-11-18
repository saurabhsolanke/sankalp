import { useState, useEffect } from 'react';
import { PRAYERS } from './data/prayers';
import { loadStoredData, saveStoredData } from './utils/storage';
import { Header } from './components/Header';
import { PrayerReader } from './components/PrayerReader';
import { SessionCounter } from './components/SessionCounter';
import { QuickFloatCounter } from './components/QuickFloatCounter';
import { CelebrationModal } from './components/CelebrationModal';
import { HistoryModal } from './components/HistoryModal';
import './App.css';

export default function App() {
  const [data, setData] = useState(() => loadStoredData());
  const [activePrayerId, setActivePrayerId] = useState('hanuman-chalisa');
  const [sessionCounts, setSessionCounts] = useState({});
  const [completedSession, setCompletedSession] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  const activePrayer = PRAYERS.find((p) => p.id === activePrayerId) || PRAYERS[0];
  const currentSessionCount = sessionCounts[activePrayerId] || 0;
  const currentTarget = data.targets[activePrayerId] ?? activePrayer.defaultTarget;
  const currentLifetime = data.lifetimeCounts[activePrayerId] || 0;

  // Handlers
  const handleSelectPrayer = (id) => {
    setActivePrayerId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIncrement = () => {
    setSessionCounts((prev) => ({
      ...prev,
      [activePrayerId]: (prev[activePrayerId] || 0) + 1,
    }));
  };

  const handleDecrement = () => {
    setSessionCounts((prev) => ({
      ...prev,
      [activePrayerId]: Math.max(0, (prev[activePrayerId] || 0) - 1),
    }));
  };

  const handleReset = () => {
    setSessionCounts((prev) => ({
      ...prev,
      [activePrayerId]: 0,
    }));
  };

  const handleUpdateTarget = (newTarget) => {
    setData((prev) => ({
      ...prev,
      targets: {
        ...prev.targets,
        [activePrayerId]: newTarget,
      },
    }));
  };

  const handleUpdatePreferences = (patch) => {
    setData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...patch,
      },
    }));
  };

  const handleFinishSession = ({ count, seconds }) => {
    // 1. Add to lifetime count
    const updatedLifetime = {
      ...data.lifetimeCounts,
      [activePrayerId]: (data.lifetimeCounts[activePrayerId] || 0) + count,
    };

    // 2. Add to session history
    const newHistoryItem = {
      prayerId: activePrayerId,
      count,
      seconds,
      timestamp: Date.now(),
    };

    setData((prev) => ({
      ...prev,
      lifetimeCounts: updatedLifetime,
      sessionHistory: [newHistoryItem, ...prev.sessionHistory],
    }));

    // 3. Trigger celebration modal
    setCompletedSession({ count, seconds });

    // 4. Reset session counter for this prayer
    setSessionCounts((prev) => ({
      ...prev,
      [activePrayerId]: 0,
    }));
  };

  const handleClearHistory = () => {
    setData((prev) => ({
      ...prev,
      sessionHistory: [],
      lifetimeCounts: {},
    }));
  };

  const scrollToCounter = () => {
    const el = document.getElementById('session-counter');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`app-wrapper theme-${data.preferences.theme}`}>
      {/* Top Navigation & Controls */}
      <Header
        prayers={PRAYERS}
        activePrayerId={activePrayerId}
        onSelectPrayer={handleSelectPrayer}
        sessionCount={currentSessionCount}
        preferences={data.preferences}
        onUpdatePreferences={handleUpdatePreferences}
        onOpenHistory={() => setShowHistoryModal(true)}
        onScrollToCounter={scrollToCounter}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Sacred Prayer Verses */}
        <PrayerReader
          prayer={activePrayer}
          preferences={data.preferences}
          onScrollToCounter={scrollToCounter}
        />

        {/* The End-of-Prayer Session Counter */}
        <SessionCounter
          prayer={activePrayer}
          sessionCount={currentSessionCount}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onReset={handleReset}
          onFinishSession={handleFinishSession}
          target={currentTarget}
          onUpdateTarget={handleUpdateTarget}
          lifetimeCount={currentLifetime}
          soundEnabled={data.preferences.soundEnabled}
          hapticEnabled={data.preferences.hapticEnabled}
        />
      </main>

      {/* Footer */}
      <footer className="sankalp-footer">
        <p className="footer-mantra">॥ ॐ तत्सत् ॥</p>
        <p className="footer-credits">
          संकल्प (Sankalp) - नित्य पाठ एवं साधना ट्रैकर • सभी भक्तों की सुविधा हेतु
        </p>
      </footer>

      {/* Quick Floating Mini Counter */}
      <QuickFloatCounter
        prayer={activePrayer}
        sessionCount={currentSessionCount}
        target={currentTarget}
        onIncrement={handleIncrement}
        onScrollToCounter={scrollToCounter}
        soundEnabled={data.preferences.soundEnabled}
        hapticEnabled={data.preferences.hapticEnabled}
      />

      {/* Modals */}
      {completedSession && (
        <CelebrationModal
          sessionData={completedSession}
          prayer={activePrayer}
          onClose={() => setCompletedSession(null)}
        />
      )}

      {showHistoryModal && (
        <HistoryModal
          prayers={PRAYERS}
          history={data.sessionHistory}
          lifetimeCounts={data.lifetimeCounts}
          onClearHistory={handleClearHistory}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
}
