type Listener = (playing: boolean) => void;

const SOUND_PREF = "s42-sound";
const BPM = 84;
const STEP = 60 / BPM / 2;
const STEPS_PER_CHORD = 16;
const LOOKAHEAD = 0.35;

const CHORDS = [
  { bass: 40, pad: [52, 56, 59, 63, 66], arp: [64, 68, 71, 75, 78, 80] },
  { bass: 37, pad: [49, 52, 56, 59, 63], arp: [61, 64, 68, 71, 73, 75] },
  { bass: 45, pad: [57, 61, 64, 68, 71], arp: [69, 73, 76, 80, 81, 83] },
  { bass: 47, pad: [54, 59, 61, 63, 66], arp: [66, 71, 73, 75, 78, 83] },
];
const ARP_SHAPE = [0, 2, 4, 3, 1, 3, 5, 2];
const SPARKLE = [76, 78, 80, 83, 85, 88, 90, 92];

let ctx: AudioContext | null = null;
let master: GainNode;
let musicBus: GainNode;
let musicIn: GainNode;
let reverbIn: GainNode;
let sfxBus: GainNode;
let musicPlaying = false;
let schedulerId = 0;
let nextTime = 0;
let step = 0;
const listeners = new Set<Listener>();

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

const impulse = (context: AudioContext, seconds: number, decay: number) => {
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buffer;
};

const ensure = () => {
  if (ctx) return ctx;
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  ctx = new Ctor();

  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -16;
  limiter.ratio.value = 6;
  limiter.connect(ctx.destination);

  master = ctx.createGain();
  master.gain.value = 0.85;
  master.connect(limiter);

  musicBus = ctx.createGain();
  musicBus.gain.value = 0;
  musicBus.connect(master);

  musicIn = ctx.createGain();
  musicIn.connect(musicBus);

  const reverb = ctx.createConvolver();
  reverb.buffer = impulse(ctx, 3.4, 2.6);
  const reverbOut = ctx.createGain();
  reverbOut.gain.value = 0.6;
  reverbIn = ctx.createGain();
  reverbIn.connect(reverb).connect(reverbOut).connect(musicBus);

  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.9;
  sfxBus.connect(master);

  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (musicPlaying) ctx.resume();
  });

  return ctx;
};

const voice = (
  context: AudioContext,
  pan: number,
  send: number,
  output: AudioNode = musicIn,
) => {
  const gain = context.createGain();
  const panner = context.createStereoPanner();
  panner.pan.value = pan;
  gain.connect(panner).connect(output);
  if (send > 0) {
    const sendGain = context.createGain();
    sendGain.gain.value = send;
    panner.connect(sendGain).connect(reverbIn);
  }
  return gain;
};

const bell = (
  context: AudioContext,
  time: number,
  midi: number,
  velocity: number,
  output?: AudioNode,
) => {
  const out = voice(context, Math.random() * 0.8 - 0.4, 0.55, output);
  const partials: [number, number, number, OscillatorType][] = [
    [1, 1, 1.8, "sine"],
    [2.01, 0.35, 0.6, "sine"],
    [3.98, 0.12, 0.35, "triangle"],
  ];
  for (const [ratio, level, decay, type] of partials) {
    const osc = context.createOscillator();
    osc.type = type;
    osc.frequency.value = hz(midi) * ratio;
    const env = context.createGain();
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(velocity * level, time + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, time + decay);
    osc.connect(env).connect(out);
    osc.start(time);
    osc.stop(time + decay + 0.05);
  }
};

const pad = (
  context: AudioContext,
  time: number,
  notes: number[],
  duration: number,
) => {
  const out = voice(context, 0, 0.9);
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, time);
  filter.frequency.linearRampToValueAtTime(1700, time + duration / 2);
  filter.frequency.linearRampToValueAtTime(1000, time + duration);
  const env = context.createGain();
  env.gain.setValueAtTime(0, time);
  env.gain.linearRampToValueAtTime(1, time + 1.6);
  env.gain.setValueAtTime(1, time + duration - 0.4);
  env.gain.linearRampToValueAtTime(0, time + duration + 1.4);
  filter.connect(env).connect(out);

  for (const midi of notes) {
    for (const detune of [-7, 7]) {
      const osc = context.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = hz(midi);
      osc.detune.value = detune;
      const level = context.createGain();
      level.gain.value = 0.018;
      osc.connect(level).connect(filter);
      osc.start(time);
      osc.stop(time + duration + 1.5);
    }
  }
};

const bass = (context: AudioContext, time: number, midi: number) => {
  const out = voice(context, 0, 0.1);
  const osc = context.createOscillator();
  osc.type = "sine";
  osc.frequency.value = hz(midi);
  const env = context.createGain();
  env.gain.setValueAtTime(0, time);
  env.gain.linearRampToValueAtTime(0.16, time + 0.02);
  env.gain.exponentialRampToValueAtTime(0.0001, time + STEP * 3.5);
  osc.connect(env).connect(out);
  osc.start(time);
  osc.stop(time + STEP * 3.6);
};

const bubble = (
  context: AudioContext,
  time: number,
  output?: AudioNode,
  level = 0.1,
) => {
  const out = voice(context, Math.random() * 1.2 - 0.6, 0.8, output);
  const osc = context.createOscillator();
  osc.type = "sine";
  const base = 380 + Math.random() * 380;
  osc.frequency.setValueAtTime(base, time);
  osc.frequency.exponentialRampToValueAtTime(base * 2.6, time + 0.07);
  const env = context.createGain();
  env.gain.setValueAtTime(0, time);
  env.gain.linearRampToValueAtTime(level, time + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);
  osc.connect(env).connect(out);
  osc.start(time);
  osc.stop(time + 0.25);
};

const scheduleStep = (context: AudioContext, index: number, time: number) => {
  const chord = CHORDS[Math.floor(index / STEPS_PER_CHORD) % CHORDS.length];
  const inChord = index % STEPS_PER_CHORD;

  if (inChord === 0) pad(context, time, chord.pad, STEP * STEPS_PER_CHORD);
  if (inChord === 0 || inChord === 6 || inChord === 10) {
    bass(context, time, chord.bass);
  }

  if (Math.random() > 0.22) {
    const shape =
      ARP_SHAPE[(index + Math.floor(index / 32)) % ARP_SHAPE.length];
    const lift = Math.random() < 0.12 ? 12 : 0;
    bell(context, time, chord.arp[shape] + lift, 0.07 + Math.random() * 0.05);
  }

  if (Math.random() < 0.1) bubble(context, time + STEP * 0.5);
};

const tick = () => {
  if (!ctx) return;
  while (nextTime < ctx.currentTime + LOOKAHEAD) {
    scheduleStep(ctx, step, nextTime);
    nextTime += STEP;
    step++;
  }
};

const notify = () => listeners.forEach((listener) => listener(musicPlaying));

export const soundEnabled = () => {
  try {
    return localStorage.getItem(SOUND_PREF) !== "off";
  } catch {
    return true;
  }
};

const rememberSound = (on: boolean) => {
  try {
    if (on) localStorage.removeItem(SOUND_PREF);
    else localStorage.setItem(SOUND_PREF, "off");
  } catch {}
};

export const unlockAudio = () => {
  const context = ensure();
  if (context?.state === "suspended") context.resume();
};

export const startMusic = () => {
  const context = ensure();
  if (!context || musicPlaying) return;
  context.resume();
  musicPlaying = true;
  const now = context.currentTime;
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(musicBus.gain.value, now);
  musicBus.gain.linearRampToValueAtTime(1, now + 2.5);
  nextTime = now + 0.1;
  step = 0;
  tick();
  schedulerId = window.setInterval(tick, 90);
  notify();
};

export const stopMusic = (fade = 1.2) => {
  if (!ctx || !musicPlaying) return;
  musicPlaying = false;
  window.clearInterval(schedulerId);
  const now = ctx.currentTime;
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(musicBus.gain.value, now);
  musicBus.gain.linearRampToValueAtTime(0, now + fade);
  notify();
};

export const toggleSound = () => {
  if (musicPlaying) {
    rememberSound(false);
    stopMusic(0.6);
  } else {
    rememberSound(true);
    startMusic();
  }
};

export const onMusicChange = (listener: Listener) => {
  listeners.add(listener);
  listener(musicPlaying);
  return () => {
    listeners.delete(listener);
  };
};

export const playGlitch = () => {
  const context = ensure();
  if (!context) return;
  const rate = context.sampleRate;
  const buffer = context.createBuffer(1, Math.floor(rate * 0.42), rate);
  const data = buffer.getChannelData(0);

  let i = 0;
  while (i < data.length) {
    const length = Math.floor(rate * (0.012 + Math.random() * 0.045));
    const kind = Math.random();
    const amp = 0.35 + Math.random() * 0.5;
    const hold = 2 + Math.floor(Math.random() * 40);
    const freq = 140 + Math.random() * 1700;
    let held = 0;
    for (let k = 0; k < length && i < data.length; k++, i++) {
      let value: number;
      if (kind < 0.4) {
        if (k % hold === 0) held = Math.random() * 2 - 1;
        value = held;
      } else if (kind < 0.75) {
        value = Math.sign(
          Math.sin((2 * Math.PI * freq * k * (1 + k / length)) / rate),
        );
      } else if (kind < 0.87) {
        value = 0;
      } else {
        value = Math.round((Math.random() * 2 - 1) * 3) / 3;
      }
      const edge = Math.min(1, k / 30, (length - k) / 30);
      const tail = 1 - (i / data.length) * 0.6;
      data[i] = value * amp * edge * tail;
    }
  }

  const source = context.createBufferSource();
  source.buffer = buffer;
  const highpass = context.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 90;
  const level = context.createGain();
  level.gain.value = 0.2;
  source.connect(highpass).connect(level).connect(sfxBus);
  source.start();

  const thump = context.createOscillator();
  thump.type = "square";
  const now = context.currentTime;
  thump.frequency.setValueAtTime(110, now);
  thump.frequency.exponentialRampToValueAtTime(40, now + 0.08);
  const thumpEnv = context.createGain();
  thumpEnv.gain.setValueAtTime(0.12, now);
  thumpEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
  thump.connect(thumpEnv).connect(sfxBus);
  thump.start(now);
  thump.stop(now + 0.12);
};

const echo = (context: AudioContext) => {
  const input = context.createGain();
  const delay = context.createDelay(1);
  delay.delayTime.value = 0.23;
  const feedback = context.createGain();
  feedback.gain.value = 0.38;
  const wet = context.createGain();
  wet.gain.value = 0.5;
  input.connect(sfxBus);
  input.connect(delay).connect(feedback).connect(delay);
  delay.connect(wet).connect(sfxBus);
  return input;
};

export const playShimmer = () => {
  const context = ensure();
  if (!context) return;
  const now = context.currentTime;
  const out = echo(context);

  SPARKLE.forEach((midi, index) =>
    bell(context, now + index * 0.07, midi, 0.14 - index * 0.008, out),
  );
  [0.15, 0.38, 0.6].forEach((offset) =>
    bubble(context, now + offset, out, 0.12),
  );

  const length = Math.floor(context.sampleRate * 1.3);
  const noise = context.createBuffer(1, length, context.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const source = context.createBufferSource();
  source.buffer = noise;
  const band = context.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 1.4;
  band.frequency.setValueAtTime(500, now);
  band.frequency.exponentialRampToValueAtTime(7000, now + 1.1);
  const env = context.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(0.09, now + 0.35);
  env.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);
  source.connect(band).connect(env).connect(sfxBus);
  source.start(now);
};

export const playPowerDown = () => {
  const context = ensure();
  if (!context) return;
  const now = context.currentTime;
  const osc = context.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(900, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.45);
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(3000, now);
  filter.frequency.exponentialRampToValueAtTime(200, now + 0.45);
  const env = context.createGain();
  env.gain.setValueAtTime(0.08, now);
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  osc.connect(filter).connect(env).connect(sfxBus);
  osc.start(now);
  osc.stop(now + 0.55);
};
