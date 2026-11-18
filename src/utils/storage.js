const STORAGE_KEY = 'sankalp_devotional_data_v1';

export function loadStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return { ...getDefaultData(), ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load stored devotional data:', err);
    return getDefaultData();
  }
}

export function saveStoredData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save devotional data:', err);
  }
}

function getDefaultData() {
  return {
    preferences: {
      script: 'devanagari', // 'devanagari' | 'both' | 'transliteration'
      showMeaning: false,
      soundEnabled: true,
      hapticEnabled: true,
      fontSize: 'md', // 'sm' | 'md' | 'lg' | 'xl'
      theme: 'temple', // 'temple' | 'dark' | 'light'
    },
    // Lifetime chant totals per prayer { 'hanuman-chalisa': 14, ... }
    lifetimeCounts: {},
    // Custom target goals per prayer { 'hanuman-chalisa': 7, ... }
    targets: {
      'hanuman-chalisa': 7,
      'atharvashirsha': 1,
      'maha-mrityunjaya': 108,
      'gayatri-mantra': 24,
      'shiv-tandav': 1,
      'shani-mantra': 19,
    },
    // Past completed sessions
    sessionHistory: []
  };
}

