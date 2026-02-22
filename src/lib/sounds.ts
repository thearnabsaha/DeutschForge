let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function loadMuteState(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('df-muted') === '1';
}

export function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  muted = loadMuteState();
  return muted;
}

export function setMuted(val: boolean) {
  muted = val;
  if (typeof window !== 'undefined') localStorage.setItem('df-muted', val ? '1' : '0');
}

export function toggleMute(): boolean {
  setMuted(!isMuted());
  return muted;
}

function play(fn: (ac: AudioContext, t: number) => void) {
  if (typeof window === 'undefined') return;
  if (loadMuteState()) return;
  try {
    const ac = getCtx();
    fn(ac, ac.currentTime);
  } catch {}
}

function osc(ac: AudioContext, type: OscillatorType, freq: number, start: number, dur: number, vol = 0.15) {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  o.connect(g).connect(ac.destination);
  o.start(start);
  o.stop(start + dur);
}

export const sfx = {
  correct() {
    play((ac, t) => {
      osc(ac, 'sine', 523.25, t, 0.12, 0.18);
      osc(ac, 'sine', 659.25, t + 0.08, 0.12, 0.18);
      osc(ac, 'sine', 783.99, t + 0.16, 0.2, 0.2);
    });
  },

  wrong() {
    play((ac, t) => {
      osc(ac, 'square', 200, t, 0.15, 0.08);
      osc(ac, 'square', 180, t + 0.12, 0.25, 0.06);
    });
  },

  click() {
    play((ac, t) => {
      osc(ac, 'sine', 800, t, 0.05, 0.08);
    });
  },

  flip() {
    play((ac, t) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(300, t);
      o.frequency.exponentialRampToValueAtTime(600, t + 0.1);
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + 0.12);
    });
  },

  levelUp() {
    play((ac, t) => {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        osc(ac, 'sine', freq, t + i * 0.1, 0.18, 0.15);
        osc(ac, 'triangle', freq * 2, t + i * 0.1, 0.12, 0.05);
      });
    });
  },

  streak() {
    play((ac, t) => {
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        osc(ac, 'sine', freq, t + i * 0.08, 0.15, 0.12);
      });
      osc(ac, 'triangle', 1318.5, t + 0.35, 0.35, 0.08);
    });
  },

  complete() {
    play((ac, t) => {
      const melody = [523.25, 587.33, 659.25, 783.99, 1046.5];
      melody.forEach((freq, i) => {
        osc(ac, 'sine', freq, t + i * 0.12, 0.22, 0.14);
        osc(ac, 'triangle', freq / 2, t + i * 0.12, 0.2, 0.04);
      });
    });
  },

  tap() {
    play((ac, t) => {
      osc(ac, 'sine', 1200, t, 0.03, 0.06);
      osc(ac, 'sine', 900, t + 0.02, 0.04, 0.04);
    });
  },

  swoosh() {
    play((ac, t) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(1200, t);
      o.frequency.exponentialRampToValueAtTime(200, t + 0.15);
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + 0.2);
    });
  },

  xp() {
    play((ac, t) => {
      osc(ac, 'sine', 880, t, 0.06, 0.1);
      osc(ac, 'sine', 1108.73, t + 0.05, 0.06, 0.1);
      osc(ac, 'sine', 1318.5, t + 0.1, 0.12, 0.12);
    });
  },
};
