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

export const playGlassKnock = (count: number) => {
  play("glass-hit", {
    rate: 0.8 + count * 0.12 + Math.random() * 0.08,
    gain: 0.55 + count * 0.1,
    wet: 0.35,
  });
  if (count >= 2) {
    play("glass-break", {
      rate: 1.9 - count * 0.12,
      gain: 0.08 + count * 0.05,
      wet: 0.3,
      delay: 0.03,
    });
  }
  synthSweep(160, 45, 0.28, 0.06 + count * 0.02);
};

export const playShatter = () => {
  play("glass-break", { rate: 0.85, gain: 1, wet: 0.6 });
  play("glass-break", {
    rate: 1.25,
    gain: 0.5,
    wet: 0.4,
    delay: 0.08,
    pan: 0.4,
  });
  play("glass-hit", { rate: 0.6, gain: 0.8, wet: 0.7 });
  synthSweep(320, 40, 1.2, 0.12, "sawtooth");
};

export const playFall = (duration = 2.8) => {
  wind(duration, 0.6);
  synthSweep(140, 38, duration, 0.14);
  synthSweep(60, 30, duration, 0.2, "triangle");
};

export const playSlabCrunch = () => {
  play("impact", { rate: 1.5, gain: 0.45, wet: 0.5 });
  play("glass-break", { rate: 0.55, gain: 0.22, wet: 0.7 });
  synthSweep(900, 90, 0.35, 0.06, "square");
};

const noiseBurst = (duration: number, level: number) => {
  const audio = getAudio();
  if (!audio) return;
  const { ctx, sfx } = audio;
  const now = ctx.currentTime;
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const tone = ctx.createBiquadFilter();
  tone.type = "highpass";
  tone.frequency.value = 900;
  const env = ctx.createGain();
  env.gain.setValueAtTime(level, now);
  env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(tone).connect(env).connect(sfx);
  source.start(now);
};

export const playScare = () => {
  const growl = pick(["entity-1", "entity-2", "entity-3", "entity-4"] as const);
  play(growl, { rate: 1.3, gain: 0.75, wet: 0.35 });
  play("glass-hit", { rate: 0.45, gain: 0.35, wet: 0.2 });
  noiseBurst(0.45, 0.22);
  synthSweep(95, 32, 0.5, 0.28, "sawtooth");
};

export const playStep = (index: number) => {
  play("impact", {
    rate: 2.2 + Math.random() * 0.35,
    gain: 0.16,
    wet: 0.35,
    pan: index % 2 ? 0.18 : -0.18,
  });
};

export const playBump = () => {
  play("impact", { rate: 1.1, gain: 0.35, wet: 0.3 });
  synthSweep(110, 45, 0.25, 0.08);
};

export const playDoorOpen = () => {
  play("clank-1", { rate: 0.7, gain: 0.5, wet: 0.8 });
  play("clank-2", { rate: 0.5, gain: 0.35, wet: 1, delay: 0.25 });
  synthSweep(180, 900, 1.6, 0.05, "triangle");
};

let reversed: AudioBuffer | null = null;

export const playUnshatter = (ending = 1.3) => {
  const audio = getAudio();
  const source = buffers["glass-break"];
  if (!audio || !source) return;
  if (!reversed) {
    reversed = audio.ctx.createBuffer(
      source.numberOfChannels,
      source.length,
      source.sampleRate,
    );
    for (let channel = 0; channel < source.numberOfChannels; channel++) {
      const input = source.getChannelData(channel);
      const output = reversed.getChannelData(channel);
      for (let i = 0; i < input.length; i++) {
        output[i] = input[input.length - 1 - i];
      }
    }
  }
  const node = audio.ctx.createBufferSource();
  node.buffer = reversed;
  node.playbackRate.value = 1.15;
  const gain = audio.ctx.createGain();
  gain.gain.value = 0.7;
  node.connect(gain).connect(audio.sfx);
  const length = reversed.duration / node.playbackRate.value;
  node.start(audio.ctx.currentTime + Math.max(0, ending - length));
};

export const createBeacon = () => {
  let source: AudioBufferSourceNode | null = null;
  let gain: GainNode | null = null;
  let panner: StereoPannerNode | null = null;

  return {
    start() {
      const audio = getAudio();
      if (!audio || source) return;
      const { ctx } = audio;
      gain = ctx.createGain();
      gain.gain.value = 0;
      panner = ctx.createStereoPanner();
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 820;
      band.Q.value = 1.4;
      gain.connect(band).connect(panner).connect(audio.sfx);
      source = loop(ctx, "hum", gain, 1.85);
    },
    set(level: number, pan: number) {
      const audio = getAudio();
      if (!audio || !gain || !panner) return;
      const now = audio.ctx.currentTime;
      gain.gain.setTargetAtTime(level, now, 0.15);
      panner.pan.setTargetAtTime(pan, now, 0.15);
    },
    stop() {
      const audio = getAudio();
      if (audio && gain) {
        gain.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.1);
      }
      const ending = source;
      window.setTimeout(() => ending?.stop(), 500);
      source = null;
      gain = null;
      panner = null;
    },
  };
};

export const playThud = (speed: number, pan: number) => {
  play("impact", {
    rate: 0.9 + Math.random() * 0.6,
    gain: Math.min(1, speed / 1800) * 0.7,
    wet: 0.45,
    pan,
  });
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
