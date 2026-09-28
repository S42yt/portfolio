"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const NOISE = `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float v = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    v += amp * noise(p);
    p = rot * p * 2.03;
    amp *= 0.5;
  }
  return v;
}`;

const SIM_FRAG = `
precision highp float;
${NOISE}

uniform sampler2D u_prev;
uniform vec2 u_res;
uniform float u_aspect;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_mousePrev;
uniform vec2 u_mouseVel;
uniform float u_inject;

vec2 curl(vec2 p) {
  float e = 0.06;
  float n1 = fbm(p + vec2(0.0, e), 3);
  float n2 = fbm(p - vec2(0.0, e), 3);
  float n3 = fbm(p + vec2(e, 0.0), 3);
  float n4 = fbm(p - vec2(e, 0.0), 3);
  return vec2(n1 - n2, n4 - n3) / (2.0 * e);
}

float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec4 prev = texture2D(u_prev, uv);

  vec2 vel = (prev.gb - 0.5) * 2.0;
  vec2 flow = curl(vec2(uv.x * u_aspect, uv.y) * 2.4 + vec2(0.0, u_time * 0.05));
  vec2 total = vel + flow * 0.05;

  vec2 src = uv - total * 0.006;
  vec4 adv = texture2D(u_prev, src);

  float dens = adv.r * 0.994;
  vec2 nvel = (adv.gb - 0.5) * 2.0 * 0.985;

  vec2 ap = vec2(uv.x * u_aspect, uv.y);
  float d = segDist(ap, vec2(u_mousePrev.x * u_aspect, u_mousePrev.y),
                        vec2(u_mouse.x * u_aspect, u_mouse.y));
  float brush = exp(-d * d / 0.006);
  brush *= brush;
  dens += brush * 0.13 * u_inject;
  nvel += u_mouseVel * brush * 1.1;

  dens = clamp(dens, 0.0, 1.0);
  nvel = clamp(nvel, -1.0, 1.0);
  gl_FragColor = vec4(dens, nvel * 0.5 + 0.5, 1.0);
}`;

const RENDER_FRAG = `
precision highp float;
${NOISE}

uniform sampler2D u_field;
uniform vec2 u_res;
uniform vec2 u_fieldRes;
uniform float u_aspect;
uniform float u_time;

vec4 blurField(vec2 uv, vec2 texel) {
  vec4 sum = texture2D(u_field, uv) * 0.25;
  sum += texture2D(u_field, uv + vec2(texel.x, 0.0)) * 0.125;
  sum += texture2D(u_field, uv - vec2(texel.x, 0.0)) * 0.125;
  sum += texture2D(u_field, uv + vec2(0.0, texel.y)) * 0.125;
  sum += texture2D(u_field, uv - vec2(0.0, texel.y)) * 0.125;
  sum += texture2D(u_field, uv + texel) * 0.0625;
  sum += texture2D(u_field, uv - texel) * 0.0625;
  sum += texture2D(u_field, uv + vec2(texel.x, -texel.y)) * 0.0625;
  sum += texture2D(u_field, uv + vec2(-texel.x, texel.y)) * 0.0625;
  return sum;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 texel = 2.2 / u_fieldRes;
  vec4 fld = blurField(uv, texel);
  vec2 vel = (fld.gb - 0.5) * 2.0;
  float dens = fld.r;

  vec2 p = uv * 3.0;
  p.x *= u_aspect;
  p += vel * 0.85;

  vec2 q = vec2(
    fbm(p + vec2(0.0, u_time * 0.10), 4),
    fbm(p + vec2(5.2, 1.3) + vec2(u_time * 0.07, 0.0), 4)
  );
  float f = fbm(p + 2.2 * q + vec2(u_time * 0.03, -u_time * 0.05), 5);

  float painted = smoothstep(0.0, 0.5, dens);
  f += painted * 0.4;

  float smoke = smoothstep(0.26, 1.02, f);
  smoke *= smoke * (3.0 - 2.0 * smoke);

  vec3 colA = vec3(0.22, 0.16, 0.42);
  vec3 colB = vec3(0.55, 0.44, 0.95);
  vec3 col = mix(colA, colB, smoke * 0.6 + painted * 0.28);

  float alpha = smoke * 0.17 + painted * 0.05;
  alpha += (hash(uv * u_res) - 0.5) * 0.006;
  gl_FragColor = vec4(col * max(alpha, 0.0), max(alpha, 0.0));
}`;

export default function SmokeBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
    });
    if (!gl) return;

    const build = (fragSrc: string) => {
      const compile = (type: number, src: string) => {
        const sh = gl.createShader(type)!;
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        return sh;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
      return prog;
    };

    const simProg = build(SIM_FRAG);
    const renderProg = build(RENDER_FRAG);
    if (!simProg || !renderProg) return;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    for (const prog of [simProg, renderProg]) {
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    const u = (prog: WebGLProgram, name: string) =>
      gl.getUniformLocation(prog, name);
    const sim = {
      prev: u(simProg, "u_prev"),
      res: u(simProg, "u_res"),
      aspect: u(simProg, "u_aspect"),
      time: u(simProg, "u_time"),
      mouse: u(simProg, "u_mouse"),
      mousePrev: u(simProg, "u_mousePrev"),
      mouseVel: u(simProg, "u_mouseVel"),
      inject: u(simProg, "u_inject"),
    };
    const draw = {
      field: u(renderProg, "u_field"),
      res: u(renderProg, "u_res"),
      fieldRes: u(renderProg, "u_fieldRes"),
      aspect: u(renderProg, "u_aspect"),
      time: u(renderProg, "u_time"),
    };

    const SIM_SCALE = 0.2;
    const VIEW_SCALE = Math.min(0.42, 640 / Math.max(innerWidth, 1));
    const FRAME_MS = 1000 / 24;
    let simW = 1;
    let simH = 1;

    type Target = { fb: WebGLFramebuffer; tex: WebGLTexture };
    let targets: Target[] = [];

    const makeTarget = (w: number, h: number): Target => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      const zeroed = new Uint8Array(w * h * 4);
      for (let i = 0; i < w * h; i++) {
        zeroed[i * 4 + 1] = 128;
        zeroed[i * 4 + 2] = 128;
        zeroed[i * 4 + 3] = 255;
      }
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        w,
        h,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        zeroed,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0,
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { fb, tex };
    };

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(innerWidth * VIEW_SCALE));
      canvas.height = Math.max(1, Math.floor(innerHeight * VIEW_SCALE));
      simW = Math.max(1, Math.floor(innerWidth * SIM_SCALE));
      simH = Math.max(1, Math.floor(innerHeight * SIM_SCALE));
      targets.forEach((t) => {
        gl.deleteFramebuffer(t.fb);
        gl.deleteTexture(t.tex);
      });
      targets = [makeTarget(simW, simH), makeTarget(simW, simH)];
    };
    resize();
    let resizeTimer = 0;
    let lastW = innerWidth;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (
          innerWidth === lastW &&
          Math.abs(canvas.height - innerHeight * VIEW_SCALE) < 80
        )
          return;
        lastW = innerWidth;
        resize();
      }, 150);
    };
    addEventListener("resize", onResize);

    const pointer = {
      x: 0.5,
      y: 0.5,
      px: 0.5,
      py: 0.5,
      vx: 0,
      vy: 0,
      active: 0,
    };
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / innerWidth;
      const ny = 1 - e.clientY / innerHeight;
      pointer.vx += (nx - pointer.x) * 3.5;
      pointer.vy += (ny - pointer.y) * 3.5;
      pointer.x = nx;
      pointer.y = ny;
      pointer.active = 1;
    };
    addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const start = performance.now();
    let read = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      last = now;
      const t = (now - start) / 1000;
      const write = 1 - read;
      const aspect = innerWidth / innerHeight;

      gl.useProgram(simProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, targets[write].fb);
      gl.viewport(0, 0, simW, simH);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, targets[read].tex);
      gl.uniform1i(sim.prev, 0);
      gl.uniform2f(sim.res, simW, simH);
      gl.uniform1f(sim.aspect, aspect);
      gl.uniform1f(sim.time, t);
      gl.uniform2f(sim.mouse, pointer.x, pointer.y);
      gl.uniform2f(sim.mousePrev, pointer.px, pointer.py);
      gl.uniform2f(sim.mouseVel, pointer.vx, pointer.vy);
      gl.uniform1f(sim.inject, pointer.active);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.useProgram(renderProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, targets[write].tex);
      gl.uniform1i(draw.field, 0);
      gl.uniform2f(draw.res, canvas.width, canvas.height);
      gl.uniform2f(draw.fieldRes, simW, simH);
      gl.uniform1f(draw.aspect, aspect);
      gl.uniform1f(draw.time, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      read = write;
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.vx *= 0.86;
      pointer.vy *= 0.86;
      pointer.active *= 0.9;
    };
    const root = document.documentElement;
    const sync = () => {
      cancelAnimationFrame(raf);
      const hidden =
        root.classList.contains("aero") || root.classList.contains("backrooms");
      if (!document.hidden && !hidden) {
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", sync);
    const classWatch = new MutationObserver(sync);
    classWatch.observe(root, { attributes: true, attributeFilter: ["class"] });
    sync();

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      removeEventListener("resize", onResize);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", sync);
      classWatch.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
