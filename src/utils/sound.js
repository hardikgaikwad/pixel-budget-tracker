/**
 * 8-Bit Retro Sound Synthesizer via Web Audio API.
 * Zero external audio files, zero latency, completely offline.
 */

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
 * Play authentic 8-bit coin chime (rising two-tone square wave)
 */
export function playCoinSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    // Classic Mario/arcade coin: B5 (987.77Hz) jumping to E6 (1318.51Hz)
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (err) {
    // Ignore sound errors
  }
}

/**
 * Play retro cash register sound (drawer slide click + register bell)
 */
export function playCashRegisterSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Bell chime
    const bell = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bell.type = 'triangle';
    bell.frequency.setValueAtTime(800, now + 0.04);
    bell.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

    bellGain.gain.setValueAtTime(0.15, now + 0.04);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    bell.connect(bellGain);
    bellGain.connect(ctx.destination);

    bell.start(now + 0.04);
    bell.stop(now + 0.3);

    // Click/drawer noise
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = 'sawtooth';
    click.frequency.setValueAtTime(150, now);
    click.frequency.exponentialRampToValueAtTime(60, now + 0.06);

    clickGain.gain.setValueAtTime(0.08, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    click.connect(clickGain);
    clickGain.connect(ctx.destination);

    click.start(now);
    click.stop(now + 0.06);
  } catch (err) {
    // Ignore sound errors
  }
}

/**
 * Play small retro UI click blip
 */
export function playBlipSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(650, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (err) {
    // Ignore sound errors
  }
}

/**
 * Play retro error buzz
 */
export function playErrorSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.setValueAtTime(110, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (err) {
    // Ignore sound errors
  }
}
