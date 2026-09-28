type Listener = (playing: boolean) => void;

export type SceneAudio = { start: () => void; stop: (fade: number) => void };

const SOUND_PREF = "s42-sound";
const BPM = 118;
const STEP = 60 / BPM / 2;
const SWING = 0.3;
const STEPS_PER_BAR = 8;
const LOOKAHEAD = 0.35;

const CHORDS = [
  { root: 41, comp: [57, 60, 64, 67] },
  { root: 38, comp: [53, 57, 60, 64] },
  { root: 43, comp: [58, 62, 65, 69] },
  { root: 36, comp: [58, 62, 64, 69] },
  { root: 45, comp: [55, 60, 64, 67] },
  { root: 38, comp: [54, 60, 64, 69] },
  { root: 43, comp: [53, 58, 62, 65] },
  { root: 36, comp: [52, 58, 62, 67] },
];

type Note = [step: number, midi: number];

const MELODY: Note[][] = [
  [
    [0, 72],
    [2, 76],
    [3, 79],
    [5, 77],
    [6, 76],
  ],
  [
    [1, 74],
    [2, 76],
    [4, 72],
    [6, 69],
  ],
  [
    [0, 70],
    [2, 74],
    [3, 77],
    [5, 81],
    [6, 79],
  ],
  [
    [0, 76],
    [3, 74],
    [4, 72],
    [6, 69],
    [7, 70],
  ],
  [
    [0, 72],
    [2, 76],
    [3, 79],
    [5, 81],
    [6, 79],
  ],
  [
    [1, 78],
    [2, 81],
    [4, 84],
    [6, 81],
  ],
  [
    [0, 79],
    [2, 77],
    [3, 74],
    [5, 70],
    [6, 72],
  ],
  [
    [0, 74],
    [2, 76],
    [4, 79],
    [6, 82],
  ],
  [
    [0, 72],
    [2, 76],
    [3, 79],
    [5, 77],
    [6, 76],
  ],
  [
    [1, 74],
    [2, 76],
    [4, 72],
    [6, 69],
  ],
  [
    [0, 70],
    [2, 74],
    [3, 77],
    [5, 81],
    [6, 79],
  ],
  [
    [0, 76],
    [3, 74],
    [4, 72],
    [6, 69],
    [7, 70],
  ],
  [
    [0, 81],
    [2, 79],
    [3, 76],
    [5, 72],
    [6, 76],
  ],
  [
    [0, 78],
    [2, 74],
    [4, 72],
    [5, 69],
    [6, 66],
  ],
  [
    [0, 70],
    [1, 74],
    [2, 77],
    [4, 82],
    [6, 81],
  ],
  [
    [0, 79],
    [4, 77],
    [6, 76],
  ],
];
const COMP_STEPS = [1, 4, 6];
const SPARKLE = [76, 78, 80, 83, 85, 88, 90, 92];

let ctx: AudioContext | null = null;
let master: GainNode;
let musicBus: GainNode;
let musicIn: GainNode;
let reverbIn: GainNode;
let sfxBus: GainNode;
let musicTone: BiquadFilterNode;
let musicPlaying = false;
let sceneAudio: SceneAudio | null = null;
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

  musicTone = ctx.createBiquadFilter();
  musicTone.type = "lowpass";
  musicTone.frequency.value = 20000;
  musicTone.connect(master);

  musicBus = ctx.createGain();
  musicBus.gain.value = 0;
  musicBus.connect(musicTone);

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

const marimba = (
  context: AudioContext,
  time: number,
  midi: number,
  velocity: number,
) => {
  const out = voice(context, 0.15, 0.35);
  const partials: [number, number, number][] = [
    [1, 1, 0.55],
    [3.93, 0.3, 0.09],
    [10.2, 0.08, 0.03],
  ];
  for (const [ratio, level, decay] of partials) {
    const osc = context.createOscillator();
    osc.type = "sine";
    osc.frequency.value = hz(midi) * ratio;
    const env = context.createGain();
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(velocity * level, time + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, time + decay);
    osc.connect(env).connect(out);
    osc.start(time);
    osc.stop(time + decay + 0.05);
  }
};

const electricPiano = (
  context: AudioContext,
  time: number,
  notes: number[],
  velocity: number,
) => {
  const out = voice(context, -0.25, 0.45);
  for (const midi of notes) {
    const partials: [number, number, number][] = [
      [1, 1, 0.7],
      [2.002, 0.22, 0.25],
    ];
    for (const [ratio, level, decay] of partials) {
      const osc = context.createOscillator();
      osc.type = "sine";
      osc.frequency.value = hz(midi) * ratio;
      const env = context.createGain();
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(velocity * level, time + 0.008);
      env.gain.exponentialRampToValueAtTime(0.0001, time + decay);
      osc.connect(env).connect(out);
      osc.start(time);
      osc.stop(time + decay + 0.05);
    }
  }
};

const bass = (context: AudioContext, time: number, midi: number) => {
  const out = voice(context, 0, 0.08);
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, time);
  filter.frequency.exponentialRampToValueAtTime(380, time + 0.18);
  filter.connect(out);

  const body = context.createOscillator();
  body.type = "triangle";
  body.frequency.value = hz(midi);
  const sub = context.createOscillator();
  sub.type = "sine";
  sub.frequency.value = hz(midi);
  const env = context.createGain();
  env.gain.setValueAtTime(0, time);
  env.gain.linearRampToValueAtTime(0.22, time + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0001, time + STEP * 1.8);
  body.connect(env);
  sub.connect(env);
  env.connect(filter);
  for (const osc of [body, sub]) {
    osc.start(time);
    osc.stop(time + STEP * 1.9);
  }
};

let noise: AudioBuffer | null = null;

const noiseBuffer = (context: AudioContext) => {
  if (noise) return noise;
  const length = Math.floor(context.sampleRate * 0.25);
  noise = context.createBuffer(1, length, context.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return noise;
};

const hit = (
  context: AudioContext,
  time: number,
  type: BiquadFilterType,
  frequency: number,
  level: number,
  decay: number,
  pan: number,
) => {
  const out = voice(context, pan, 0.15);
  const source = context.createBufferSource();
  source.buffer = noiseBuffer(context);
  const filter = context.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = type === "bandpass" ? 2.5 : 0.7;
  const env = context.createGain();
  env.gain.setValueAtTime(level, time);
  env.gain.exponentialRampToValueAtTime(0.0001, time + decay);
  source.connect(filter).connect(env).connect(out);
  source.start(time);
  source.stop(time + decay + 0.02);
};

const kick = (context: AudioContext, time: number) => {
  const out = voice(context, 0, 0);
  const osc = context.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(130, time);
  osc.frequency.exponentialRampToValueAtTime(48, time + 0.12);
  const env = context.createGain();
  env.gain.setValueAtTime(0.28, time);
  env.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);
  osc.connect(env).connect(out);
  osc.start(time);
  osc.stop(time + 0.24);
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

const scheduleStep = (context: AudioContext, index: number, start: number) => {
  const bar = Math.floor(index / STEPS_PER_BAR);
  const inBar = index % STEPS_PER_BAR;
  const time = inBar % 2 ? start + STEP * SWING : start;
  const chord = CHORDS[bar % CHORDS.length];
  const next = CHORDS[(bar + 1) % CHORDS.length];
  const phrase = MELODY[bar % MELODY.length];
  const pass = Math.floor(bar / MELODY.length);

  const walk = [chord.root, chord.root + 7, chord.root + 12, next.root - 1];
  if (inBar % 2 === 0) bass(context, time, walk[inBar / 2]);

  if (COMP_STEPS.includes(inBar)) {
    electricPiano(context, time, chord.comp, inBar === 1 ? 0.045 : 0.035);
  }

  for (const [noteStep, midi] of phrase) {
    if (noteStep !== inBar) continue;
    marimba(context, time, midi, 0.16);
    if (pass % 2 === 1) bell(context, time, midi + 12, 0.05);
  }

  hit(context, time, "highpass", 7000, inBar % 2 ? 0.05 : 0.028, 0.06, 0.35);
  if (inBar === 2 || inBar === 6) {
    hit(context, time, "bandpass", 1900, 0.16, 0.05, -0.1);
  }
  if (inBar === 0 || inBar === 5) kick(context, time);

  if (Math.random() < 0.05) bubble(context, time + STEP * 0.5, undefined, 0.07);
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

export const getAudio = () => {
  const context = ensure();
  return context ? { ctx: context, out: master, sfx: sfxBus } : null;
};

export const setSceneAudio = (next: SceneAudio | null) => {
  sceneAudio = next;
};

export const startMusic = () => {
  const context = ensure();
  if (!context || musicPlaying) return;
  context.resume();
  musicPlaying = true;
  if (sceneAudio) {
    sceneAudio.start();
    notify();
    return;
  }
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
  if (sceneAudio) {
    sceneAudio.stop(fade);
    notify();
    return;
  }
  window.clearInterval(schedulerId);
  const now = ctx.currentTime;
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(musicBus.gain.value, now);
  musicBus.gain.linearRampToValueAtTime(0, now + fade);
  notify();
};

export const tapeStop = () => {
  if (!ctx || !musicPlaying || sceneAudio) return;
  musicPlaying = false;
  window.clearInterval(schedulerId);
  const now = ctx.currentTime;
  musicTone.frequency.cancelScheduledValues(now);
  musicTone.frequency.setValueAtTime(20000, now);
  musicTone.frequency.exponentialRampToValueAtTime(90, now + 1.3);
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(musicBus.gain.value, now);
  musicBus.gain.linearRampToValueAtTime(0, now + 1.4);
  musicTone.frequency.setValueAtTime(20000, now + 1.6);
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
