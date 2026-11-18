// Web Audio API Synthesizer for Temple Bell (घंटी) and Sankalp completion chime

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a resonant Indian Temple Brass Bell chime
 */
export function playTempleBell() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Temple bell harmonic profile (rich brass harmonics)
    const partials = [
      { freqRatio: 1.0, gain: 0.5, decay: 2.4 },      // Fundamental
      { freqRatio: 1.503, gain: 0.35, decay: 1.9 },   // Fifth
      { freqRatio: 1.99, gain: 0.28, decay: 1.6 },    // Octave
      { freqRatio: 2.74, gain: 0.22, decay: 1.2 },    // Minor 7th above octave
      { freqRatio: 3.52, gain: 0.15, decay: 0.8 },    // High sparkle
      { freqRatio: 4.18, gain: 0.09, decay: 0.5 },    // Shimmer
    ];

    const baseFreq = 587.33; // D5 - warm resonant devotional pitch

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.8, now);
    masterGain.connect(ctx.destination);

    partials.forEach(({ freqRatio, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * freqRatio, now);

      // Fast attack, exponential devotional decay
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay + 0.05);
    });
  } catch (err) {
    console.debug('Audio playback note:', err);
  }
}

/**
 * Plays a joyous fanfare chime when a devotee fulfills their Sankalp goal
 */
export function playCelebrationChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Purna Sankalp)
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.15;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 2.0);
    });
  } catch (err) {
    console.debug('Audio error:', err);
  }
}

/**
 * Triggers subtle haptic feedback on mobile devices
 */
export function triggerHaptic(duration = 40) {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  } catch {
    // Ignore unsupported devices
  }
}
