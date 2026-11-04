// Web Audio API ambient soundtrack generator for cinematic graduation music
// Zero external assets, loads immediately, smooth and peaceful.

class AmbientSoundtrack {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;

  // Emotional, nostalgic chord progression (Cmaj7 -> Am9 -> Fmaj7 -> Gadd9)
  private chords = [
    [261.63, 329.63, 392.0, 493.88, 523.25], // Cmaj7 (C4, E4, G4, B4, C5)
    [220.0, 261.63, 329.63, 392.0, 440.0],   // Am9 (A3, C4, E4, G4, A4)
    [174.61, 261.63, 329.63, 349.23, 440.0], // Fmaj7 (F3, C4, E4, F4, A4)
    [196.0, 293.66, 392.0, 440.0, 493.88],   // Gadd9 (G3, D4, G4, A4, B4)
  ];
  private chordIndex = 0;
  private noteIndex = 0;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public playNote(freq: number, time: number, duration = 2.4) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm, rounded bell/electric piano tone
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    // Add gentle harmonic warmth
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(320, time + duration);

    // Gentle soft attack and long gentle release
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.18, time + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private step() {
    if (!this.isRunning || !this.ctx) return;

    const now = this.ctx.currentTime;
    const currentChord = this.chords[this.chordIndex];
    const freq = currentChord[this.noteIndex];

    // Play note with subtle micro-timing
    this.playNote(freq, now, 2.2);

    // Also occasionally add a gentle bass root note on chord change
    if (this.noteIndex === 0) {
      const rootFreq = currentChord[0] / 2;
      this.playNote(rootFreq, now, 3.2);
    }

    this.noteIndex++;
    if (this.noteIndex >= currentChord.length) {
      this.noteIndex = 0;
      this.chordIndex = (this.chordIndex + 1) % this.chords.length;
    }

    // Next note in ~540ms (gentle waltz/arpeggio tempo)
    const nextInterval = 520 + Math.random() * 80;
    this.timer = window.setTimeout(() => this.step(), nextInterval);
  }

  public async start(): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    if (!this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    this.isRunning = true;
    this.step();
    return true;
  }

  public stop() {
    this.isRunning = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public get playing(): boolean {
    return this.isRunning;
  }
}

export const soundtrack = new AmbientSoundtrack();

