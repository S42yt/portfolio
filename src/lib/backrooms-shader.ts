import { BACTERIA } from "./bacteria";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_res;
uniform vec2 u_img;
uniform float u_time;
uniform float u_flicker;
uniform float u_glitch;
uniform vec4 u_ent;
uniform vec2 u_clip;
uniform float u_tilt;
varying vec2 v_uv;

const float LENS = 0.07;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 cover(vec2 uv) {
  float s = max(u_res.x / u_img.x, u_res.y / u_img.y);
  vec2 size = u_img * s / u_res;
  return (uv - 0.5) / size + 0.5;
}

vec3 room(vec2 uv) {
  return texture2D(u_tex, clamp(cover(uv), 0.001, 0.999)).rgb;
}

float capsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
${BACTERIA}
float entity(vec2 uv) {
  if (u_ent.w <= 0.001) return 0.0;
  vec2 px = cover(uv) * u_img;
  vec2 p = (px - u_ent.xy) / u_ent.z;
  p.y = -p.y;
  float c = cos(u_tilt);
  float s = sin(u_tilt);
  p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  float d = bacteria(p, u_time);
  float soft = 1.6 / u_ent.z;
  float mask = 1.0 - smoothstep(-soft, soft * 2.0, d);
  mask *= step(u_clip.x, px.x) * step(px.x, u_clip.y);
  return mask * u_ent.w;
}

void main() {
  vec2 c = v_uv - 0.5;
  float r2 = dot(c, c);
  vec2 uv = 0.5 + c * (1.0 + LENS * r2);

  float bandY = fract(u_time * 0.045);
  float band = 1.0 - smoothstep(0.0, 0.035, abs(uv.y - bandY));
  float line = floor(uv.y * 260.0);
  float jitter = (hash(vec2(line, floor(u_time * 24.0))) - 0.5);
  float shift = jitter * (0.0012 + band * 0.012 + u_glitch * 0.03);
  uv.x += shift;

  float ca = 0.0018 + r2 * 0.012 + u_glitch * 0.012;
  vec3 col;
  col.r = room(uv + vec2(ca, 0.0)).r;
  col.g = room(uv).g;
  col.b = room(uv - vec2(ca, 0.0)).b;

  vec3 glow = vec3(0.0);
  for (int i = 0; i < 6; i++) {
    float a = float(i) * 1.0472;
    vec2 o = vec2(cos(a), sin(a)) * 0.014;
    glow += max(room(uv + o) - 0.72, 0.0);
  }
  col += glow * 0.55 * (1.0 - u_flicker);

  float ent = entity(uv);
  col = mix(col, vec3(0.018, 0.014, 0.008), ent);

  col *= 1.0 - u_flicker * 0.55;
  col *= 0.975 + 0.025 * sin(u_time * 1.3);

  col = mix(col, vec3(hash(uv * u_res + u_time)), band * 0.18);
  col += (hash(v_uv * u_res + fract(u_time) * 91.0) - 0.5) * 0.075;
  col *= 0.93 + 0.07 * step(0.5, fract(gl_FragCoord.y * 0.5));

  float roll = fract(u_time * 0.06);
  col *= 1.0 - 0.07 * (1.0 - smoothstep(0.0, 0.08, abs(v_uv.y - roll)));

  col *= smoothstep(1.05, 0.32, length(c * vec2(1.0, 1.15)));
  col = mix(col, col * vec3(1.05, 1.0, 0.8), 0.45);

  gl_FragColor = vec4(col, 1.0);
}`;

type Spot = {
  kind: "peek" | "stand" | "run" | "scare";
  x: number;
  y: number;
  h: number;
  dir?: 1 | -1;
  to?: number;
  clip?: [number, number];
};

const LANDSCAPE = {
  src: "/backrooms/level0.webp",
  size: [1920, 1080] as const,
  spots: [
    { kind: "peek", x: 722, y: 725, h: 470, dir: 1 },
    { kind: "peek", x: 1152, y: 650, h: 330, dir: -1 },
    { kind: "peek", x: 1056, y: 590, h: 170, dir: 1 },
    { kind: "stand", x: 780, y: 572, h: 105 },
    { kind: "run", x: 700, y: 572, h: 100, to: 910, clip: [724, 885] },
  ] as Spot[],
};

const PORTRAIT = {
  src: "/backrooms/level0-portrait.webp",
  size: [900, 1600] as const,
  spots: [
    { kind: "peek", x: 382, y: 1060, h: 560, dir: 1 },
    { kind: "peek", x: 632, y: 880, h: 300, dir: -1 },
    { kind: "stand", x: 420, y: 842, h: 95 },
    { kind: "run", x: 360, y: 842, h: 90, to: 500, clip: [392, 470] },
  ] as Spot[],
};

export type RoomShader = {
  appear: (kind?: Spot["kind"]) => { kind: Spot["kind"]; pan: number } | null;
  flicker: () => void;
  glitch: (amount: number) => void;
  pause: (paused: boolean) => void;
  stop: () => void;
};

const ease = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

export const startRoomShader = (
  canvas: HTMLCanvasElement,
  animate: boolean,
): RoomShader | null => {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;
  const context = gl;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const loc = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uniforms = {
    res: u("u_res"),
    img: u("u_img"),
    time: u("u_time"),
    flicker: u("u_flicker"),
    glitch: u("u_glitch"),
    ent: u("u_ent"),
    clip: u("u_clip"),
    tilt: u("u_tilt"),
  };

  const portrait = window.matchMedia("(max-aspect-ratio: 4 / 5)").matches;
  const scene = portrait ? PORTRAIT : LANDSCAPE;
  let ready = false;

  const texture = gl.createTexture();
  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    ready = true;
    draw(performance.now());
    canvas.dataset.ready = "true";
  };
  image.src = scene.src;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(0.6, 1280 / Math.max(rect.width, 1));
    canvas.width = Math.max(1, Math.round(rect.width * scale));
    canvas.height = Math.max(1, Math.round(rect.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener("resize", resize);

  const start = performance.now();
  let flicker = 0;
  let flickerUntil = 0;
  let glitch = 0;
  let pointer = { x: -9999, y: -9999 };
  let current: {
    spot: Spot;
    begin: number;
    vanishAt: number;
  } | null = null;

  const onPointer = (event: PointerEvent) => {
    pointer = { x: event.clientX, y: event.clientY };
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const toScreen = (ix: number, iy: number) => {
    const rect = canvas.getBoundingClientRect();
    const s = Math.max(rect.width / scene.size[0], rect.height / scene.size[1]);
    const sizeX = (scene.size[0] * s) / rect.width;
    const sizeY = (scene.size[1] * s) / rect.height;
    const dx = (ix / scene.size[0] - 0.5) * sizeX;
    const dy = (iy / scene.size[1] - 0.5) * sizeY;
    let qx = dx;
    let qy = dy;
    for (let i = 0; i < 3; i++) {
      const k = 1 + 0.07 * (qx * qx + qy * qy);
      qx = dx / k;
      qy = dy / k;
    }
    return {
      x: rect.left + (qx + 0.5) * rect.width,
      y: rect.top + (qy + 0.5) * rect.height,
    };
  };

  const entityState = (now: number) => {
    if (!current) return null;
    const { spot } = current;
    const t = (now - current.begin) / 1000;
    const dir = spot.dir ?? 1;
    let x = spot.x;
    let y = spot.y;
    let alpha = 0.92;
    let tilt = 0;
    let clip: [number, number] = [-1e5, 1e5];
    let done = false;

    if (spot.kind === "peek") {
      const out = ease(t / 1.6);
      const back = ease((t - 3.4) / 0.45);
      const reveal = out - back;
      x = spot.x + dir * spot.h * (-0.3 + 0.2 * reveal);
      tilt = dir * 0.24 * reveal;
      clip = dir === 1 ? [spot.x, 1e5] : [-1e5, spot.x];
      done = t > 3.9;
    } else if (spot.kind === "stand") {
      alpha = 0.88 * ease(t / 1.3);
      if (t > 3.6) alpha = t < 3.75 ? 0.15 : t < 3.9 ? 0.7 : 0;
      if (current.vanishAt) {
        const since = now - current.vanishAt;
        alpha = since < 70 ? 0.6 : 0;
        if (since > 120) done = true;
      }
      done = done || t > 4;
    } else if (spot.kind === "scare") {
      alpha = t < 0.06 ? t / 0.06 : 0.97;
      x = spot.x + Math.sin(t * 90) * spot.h * 0.012;
      glitch = Math.max(glitch, 0.75);
      done = t > 0.5;
    } else {
      const progress = Math.min(t / 0.9, 1);
      x = spot.x + ((spot.to ?? spot.x) - spot.x) * progress;
      y = spot.y - Math.abs(Math.sin(t * 18)) * spot.h * 0.03;
      alpha = 0.86;
      clip = spot.clip ?? clip;
      done = t > 0.95;
    }

    if (spot.kind === "stand" && !current.vanishAt && alpha > 0.3) {
      const head = toScreen(x, y - spot.h * 0.5);
      if (Math.hypot(pointer.x - head.x, pointer.y - head.y) < 110) {
        current.vanishAt = now;
        glitch = Math.max(glitch, 0.8);
      }
    }

    if (done) {
      current = null;
      return null;
    }
    return { x, y, h: spot.h, alpha, tilt, clip };
  };

  let raf = 0;
  let last = 0;
  let paused = false;

  function draw(now: number) {
    if (!ready) return;
    if (now > flickerUntil) flicker = Math.max(0, flicker - 0.08);
    glitch = Math.max(0, glitch - 0.05);
    const ent = entityState(now);

    context.uniform2f(uniforms.res, canvas.width, canvas.height);
    context.uniform2f(uniforms.img, scene.size[0], scene.size[1]);
    context.uniform1f(uniforms.time, (now - start) / 1000);
    context.uniform1f(uniforms.flicker, flicker);
    context.uniform1f(uniforms.glitch, glitch);
    context.uniform4f(
      uniforms.ent,
      ent?.x ?? 0,
      ent?.y ?? 0,
      ent?.h ?? 1,
      ent?.alpha ?? 0,
    );
    context.uniform2f(uniforms.clip, ent?.clip[0] ?? 0, ent?.clip[1] ?? 0);
    context.uniform1f(uniforms.tilt, ent?.tilt ?? 0);
    context.drawArrays(context.TRIANGLES, 0, 3);
  }

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (paused || now - last < 1000 / 30) return;
    last = now;
    draw(now);
  };

  const onVisibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden && animate) raf = requestAnimationFrame(frame);
  };
  document.addEventListener("visibilitychange", onVisibility);
  if (animate) raf = requestAnimationFrame(frame);

  return {
    appear(kind) {
      if (current || !animate) return null;
      if (kind === "scare") {
        const spot: Spot = {
          kind: "scare",
          x: scene.size[0] * (0.38 + Math.random() * 0.24),
          y: scene.size[1] * 1.95,
          h: scene.size[1] * 1.85,
        };
        current = { spot, begin: performance.now(), vanishAt: 0 };
        return { kind: "scare", pan: 0 };
      }
      const pool = scene.spots.filter((spot) => !kind || spot.kind === kind);
      const spot = pool[Math.floor(Math.random() * pool.length)];
      if (!spot) return null;
      current = { spot, begin: performance.now(), vanishAt: 0 };
      return {
        kind: spot.kind,
        pan: Math.max(-1, Math.min(1, (spot.x / scene.size[0]) * 2 - 1)),
      };
    },
    flicker() {
      flicker = 1;
      flickerUntil = performance.now() + 140;
      window.setTimeout(() => {
        flicker = 0.8;
        flickerUntil = performance.now() + 120;
      }, 420);
    },
    glitch(amount) {
      glitch = Math.max(glitch, amount);
    },
    pause(value) {
      paused = value;
    },
    stop() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      delete canvas.dataset.ready;
    },
  };
};
