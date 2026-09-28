import { getAudio, type SceneAudio } from "./aero-audio";

const SOUNDS = [
  "drone",
  "hum",
  "hiss",
  "entity-1",
  "entity-2",
  "entity-3",
  "entity-4",
  "breath",
  "glass-hit",
  "glass-break",
  "impact",
  "clank-1",
  "clank-2",
] as const;

type SoundName = (typeof SOUNDS)[number];

const buffers: Partial<Record<SoundName, AudioBuffer>> = {};
let loading: Promise<void> | null = null;
let reverb: ConvolverNode | null = null;

const pick = <T>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)];

export const loadBackroomsAudio = () => {
  if (loading) return loading;
  const audio = getAudio();
  if (!audio) return Promise.resolve();

  loading = Promise.all(
    SOUNDS.map(async (name) => {
      const response = await fetch(`/backrooms/${name}.mp3`);
      const data = await response.arrayBuffer();
      buffers[name] = await audio.ctx.decodeAudioData(data);
    }),
  )
    .then(() => undefined)
    .catch(() => undefined);
  return loading;
};

const darkReverb = (ctx: AudioContext, out: AudioNode) => {
  if (reverb) return reverb;
  const length = Math.floor(ctx.sampleRate * 5);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1.8);
    }
  }
  reverb = ctx.createConvolver();
  reverb.buffer = buffer;
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 2200;
  const level = ctx.createGain();
  level.gain.value = 0.7;
  reverb.connect(tone).connect(level).connect(out);
  return reverb;
};

type PlayOptions = {
  gain?: number;
  rate?: number;
  pan?: number;
  wet?: number;
  delay?: number;
  out?: AudioNode;
};

const play = (name: SoundName, options: PlayOptions = {}) => {
  const audio = getAudio();
  const buffer = buffers[name];
  if (!audio || !buffer) return;
  const { ctx } = audio;
  const out = options.out ?? audio.sfx;
  const when = ctx.currentTime + (options.delay ?? 0);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = options.rate ?? 1;
  const gain = ctx.createGain();
  gain.gain.value = options.gain ?? 1;
  const panner = ctx.createStereoPanner();
  panner.pan.value = options.pan ?? 0;
  source.connect(gain).connect(panner).connect(out);

  if (options.wet) {
    const send = ctx.createGain();
    send.gain.value = options.wet;
    panner.connect(send).connect(darkReverb(ctx, audio.out));
  }
  source.start(when);
};

const loop = (
  ctx: AudioContext,
  name: SoundName,
  destination: AudioNode,
  rate = 1,
) => {
  const buffer = buffers[name];
  if (!buffer) return null;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.loopStart = 0.08;
  source.loopEnd = Math.max(0.2, buffer.duration - 0.08);
  source.playbackRate.value = rate;
  source.connect(destination);
  source.start(ctx.currentTime, 0.08 + Math.random() * (buffer.duration / 2));
  return source;
};

const synthSweep = (
  from: number,
  to: number,
  duration: number,
  level: number,
  type: OscillatorType = "sine",
) => {
  const audio = getAudio();
  if (!audio) return;
  const { ctx, sfx } = audio;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(to, now + duration);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(level, now + duration * 0.2);
  env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(env).connect(sfx);
  osc.start(now);
  osc.stop(now + duration + 0.05);
};

const wind = (duration: number, level: number) => {
  const audio = getAudio();
  if (!audio) return;
  const { ctx, sfx } = audio;
  const now = ctx.currentTime;
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    last = (last + 0.04 * (Math.random() * 2 - 1)) / 1.04;
    data[i] = last * 3.5;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 0.8;
  band.frequency.setValueAtTime(200, now);
  band.frequency.exponentialRampToValueAtTime(1800, now + duration);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(level, now + duration * 0.85);
  env.gain.linearRampToValueAtTime(0, now + duration);
  source.connect(band).connect(env).connect(sfx);
  source.start(now);
};

export type BackroomsAmbience = SceneAudio & { buzz: () => void };

export const backroomsAmbience = (): BackroomsAmbience => {
  let bus: GainNode | null = null;
  let humGain: GainNode | null = null;
  let sources: AudioBufferSourceNode[] = [];
  let timer = 0;

  const schedule = () => {
    timer = window.setTimeout(
      () => {
        if (!bus) return;
        play(pick(["clank-1", "clank-2"] as const), {
          rate: 0.55 + Math.random() * 0.3,
          gain: 0.4,
          wet: 1.2,
          pan: Math.random() * 1.8 - 0.9,
          out: bus,
        });
        schedule();
      },
      9000 + Math.random() * 9000,
    );
  };

  return {
    start() {
      const audio = getAudio();
      if (!audio) return;
      const { ctx, out } = audio;
      const now = ctx.currentTime;

      bus = ctx.createGain();
      bus.gain.setValueAtTime(0, now);
      bus.gain.linearRampToValueAtTime(1, now + 1.2);
      bus.connect(out);

      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.55;
      droneGain.connect(bus);

      humGain = ctx.createGain();
      humGain.gain.value = 0.32;
      const humTone = ctx.createBiquadFilter();
      humTone.type = "peaking";
      humTone.frequency.value = 120;
      humTone.gain.value = 6;
      humGain.connect(humTone).connect(bus);

      const hissGain = ctx.createGain();
      hissGain.gain.value = 0.06;
      const hissTone = ctx.createBiquadFilter();
      hissTone.type = "highpass";
      hissTone.frequency.value = 2500;
      hissGain.connect(hissTone).connect(bus);

      sources = [
        loop(ctx, "drone", droneGain, 1),
        loop(ctx, "drone", droneGain, 0.79),
        loop(ctx, "hum", humGain, 1),
        loop(ctx, "hiss", hissGain, 1),
      ].filter((source): source is AudioBufferSourceNode => source !== null);

      schedule();
    },
    stop(fade) {
      window.clearTimeout(timer);
      const audio = getAudio();
      if (!audio || !bus) return;
      const now = audio.ctx.currentTime;
      bus.gain.cancelScheduledValues(now);
      bus.gain.setValueAtTime(bus.gain.value, now);
      bus.gain.linearRampToValueAtTime(0, now + fade);
      const ending = sources;
      window.setTimeout(
        () => ending.forEach((source) => source.stop()),
        fade * 1000 + 100,
      );
      sources = [];
      bus = null;
      humGain = null;
    },
    buzz() {
      const audio = getAudio();
      if (!audio || !humGain) return;
      const now = audio.ctx.currentTime;
      humGain.gain.cancelScheduledValues(now);
      humGain.gain.setValueAtTime(0.32, now);
      humGain.gain.linearRampToValueAtTime(0.9, now + 0.08);
      humGain.gain.setValueAtTime(0.1, now + 0.3);
      humGain.gain.linearRampToValueAtTime(0.85, now + 0.5);
      humGain.gain.linearRampToValueAtTime(0.32, now + 1.1);
    },
  };
};

export const playEntityCue = (kind: "peek" | "stand" | "run", pan: number) => {
  const growl = pick(["entity-1", "entity-2", "entity-3", "entity-4"] as const);
  if (kind === "stand") {
    play(growl, {
      rate: 0.55 + Math.random() * 0.15,
      gain: 0.6,
      wet: 1.1,
      pan,
      delay: 0.5,
    });
  } else if (kind === "peek") {
    play("breath", { rate: 0.6, gain: 0.5, wet: 0.7, pan, delay: 0.6 });
    play(growl, { rate: 0.5, gain: 0.3, wet: 1.2, pan, delay: 1.4 });
  } else {
    for (let i = 0; i < 5; i++) {
      play("impact", {
        rate: 2.6,
        gain: 0.12,
        wet: 0.9,
        pan: pan + i * 0.08,
        delay: i * 0.17,
      });
    }
    play(growl, { rate: 0.8, gain: 0.25, wet: 1.2, pan, delay: 0.2 });
  }
};

export const playWallTouch = () => {
  play("glass-hit", { rate: 0.75, gain: 0.9, wet: 0.6 });
  synthSweep(900, 140, 1.4, 0.05);
};

export const playMirrorBreak = () => {
  play("glass-break", { rate: 0.8, gain: 1, wet: 0.7 });
  synthSweep(320, 40, 1.2, 0.12, "sawtooth");
};

export const playFall = () => {
  wind(1.25, 0.5);
  synthSweep(160, 45, 1.3, 0.1);
};

export const playImpact = () => {
  play("impact", { rate: 0.65, gain: 1.4, wet: 0.5 });
  synthSweep(90, 28, 0.5, 0.35);
};

export const playLightsOn = () => {
  play("clank-2", { rate: 2.2, gain: 0.3, wet: 0.3 });
  play("clank-1", { rate: 2.6, gain: 0.25, wet: 0.3, delay: 0.45 });
  play("clank-2", { rate: 2.4, gain: 0.3, wet: 0.3, delay: 0.95 });
};

export const playPowerOut = () => {
  play("clank-1", { rate: 1.6, gain: 0.4, wet: 0.4 });
  synthSweep(240, 30, 1.1, 0.12, "sawtooth");
};
