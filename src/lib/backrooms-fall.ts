const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_depth;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_roll;
uniform float u_fov;
uniform float u_time;
uniform float u_glitch;
uniform float u_fade;
uniform float u_final;
uniform sampler2D u_wall;
uniform sampler2D u_carpet;
uniform sampler2D u_ceiling;

const float H = 3.2;
const float SLAB = 0.35;
const float P = H + SLAB;
const float G = 4.0;
const float L = 2.0;
const vec3 LAMP = vec3(1.0, 0.95, 0.78);
const vec3 FOG = vec3(0.3, 0.26, 0.12);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 boxSize(vec2 cell, float level) {
  if (level > u_final - 0.5 && cell.x >= -1.0 && cell.x <= 0.0 && cell.y >= -1.0 && cell.y <= 0.0) {
    return vec2(0.0);
  }
  float h = hash(cell + level * 17.31);
  if (h < 0.28) return vec2(0.0);
  if (h < 0.66) return vec2(0.42);
  if (h < 0.86) return vec2(G * 0.42, 0.09);
  return vec2(0.09, G * 0.42);
}

float lampOn(vec2 cell, float level) {
  float h = hash(cell * 1.7 + level * 3.1 + 9.0);
  if (h < 0.1) return 0.0;
  if (h < 0.16) return step(0.5, hash(vec2(floor(u_time * 14.0), h)));
  return 1.0;
}

float lampLight(vec2 xz, float level) {
  vec2 cell = floor(xz / L);
  float total = 0.0;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      vec2 c = cell + vec2(float(i), float(j));
      vec2 d = xz - (c + 0.5) * L;
      total += lampOn(c, level) / (1.0 + dot(d, d) * 0.55);
    }
  }
  return total;
}

float boxDistance(vec2 xz, float level) {
  vec2 cell = floor(xz / G);
  float best = 9.0;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      vec2 c = cell + vec2(float(i), float(j));
      vec2 he = boxSize(c, level);
      if (he.x <= 0.0) continue;
      vec2 q = abs(xz - (c + 0.5) * G) - he;
      best = min(best, length(max(q, 0.0)) + min(max(q.x, q.y), 0.0));
    }
  }
  return best;
}

vec3 shadeFloor(vec2 xz, float level) {
  vec3 carpet = texture2D(u_carpet, xz * 0.9).rgb;
  float light = 0.28 + 0.62 * lampLight(xz, level);
  float ao = 0.35 + 0.65 * smoothstep(0.0, 0.9, boxDistance(xz, level));
  return carpet * light * ao * LAMP;
}

vec3 shadeCeiling(vec2 xz, float level) {
  vec3 tile = texture2D(u_ceiling, xz * 0.55).rgb;
  vec2 cell = floor(xz / L);
  vec2 f = fract(xz / L) - 0.5;
  float on = lampOn(cell, level);
  float edge = max(abs(f.x), abs(f.y));
  float panel = on * (1.0 - smoothstep(0.17, 0.19, edge));
  float halo = on * exp(-max(edge - 0.18, 0.0) * 9.0);
  vec3 col = tile * (0.42 + 0.35 * lampLight(xz, level) + halo * 0.6) * LAMP;
  return mix(col, LAMP * 1.9, panel);
}

vec3 shadeWall(vec3 p, bool xFace, float ceilY, float floorY, float level) {
  float along = xFace ? p.z : p.x;
  float fromFloor = p.y - floorY;
  float below = ceilY - p.y;
  vec3 paper = texture2D(u_wall, vec2(along, fromFloor) * 0.62).rgb;
  float light = 0.32 + 0.5 * lampLight(p.xz, level) * (0.45 + 0.55 * smoothstep(0.0, H, fromFloor));
  light *= 0.55 + 0.45 * smoothstep(0.0, 0.5, fromFloor);
  light *= 0.75 + 0.25 * smoothstep(0.0, 0.3, below);
  vec3 col = paper * light * LAMP;
  if (fromFloor < 0.12) col = vec3(0.34, 0.27, 0.13) * light;
  return col;
}

vec3 staticFrame(vec2 frag) {
  float n = hash(floor(frag / 3.0) + floor(u_time * 40.0));
  float band = hash(vec2(floor(frag.y / 7.0), floor(u_time * 25.0)));
  vec3 carpet = texture2D(u_carpet, frag / u_res.y * 3.0 + u_time).rgb;
  return mix(carpet * 0.25, vec3(n) * 0.6, 0.55) * (0.6 + band * 0.5);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float band = floor(frag.y / 10.0);
  float jitter = step(0.6, hash(vec2(band, floor(u_time * 30.0))));
  frag.x += (hash(vec2(band, floor(u_time * 60.0))) - 0.5) * u_glitch * jitter * 90.0;

  vec2 q = gl_FragCoord.xy / u_res;
  vec2 uv = (frag - 0.5 * u_res) / u_res.y;
  uv *= 1.0 + 0.08 * dot(uv, uv);

  vec3 fwd = vec3(cos(u_pitch) * sin(u_yaw), sin(u_pitch), cos(u_pitch) * cos(u_yaw));
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, fwd);
  vec3 r = right * cos(u_roll) + up * sin(u_roll);
  vec3 u = up * cos(u_roll) - right * sin(u_roll);
  vec3 rd = normalize(fwd + (uv.x * r + uv.y * u) * u_fov);

  float level = floor(u_depth / P);
  float local = u_depth - level * P;
  vec3 col;

  if (u_depth < 0.0 || local > H) {
    col = staticFrame(frag);
  } else {
    float ceilY = -level * P;
    float floorY = ceilY - H;
    vec3 ro = vec3(0.0, -u_depth, 0.0);
    float tPlane = rd.y < 0.0 ? (floorY - ro.y) / rd.y : (ceilY - ro.y) / rd.y;

    vec2 o = ro.xz;
    vec2 d = rd.xz;
    d = sign(d) * max(abs(d), vec2(1e-5));
    vec2 cell = floor(o / G);
    vec2 stepv = sign(d);
    vec2 tDelta = abs(G / d);
    vec2 tMax = ((cell + max(stepv, 0.0)) * G - o) / d;
    float tHit = 1e9;
    bool xFace = false;
    for (int i = 0; i < 28; i++) {
      vec2 he = boxSize(cell, level);
      if (he.x > 0.0) {
        vec2 c = (cell + 0.5) * G;
        vec2 t1 = (c - he - o) / d;
        vec2 t2 = (c + he - o) / d;
        vec2 tn = min(t1, t2);
        vec2 tf = max(t1, t2);
        float enter = max(tn.x, tn.y);
        float leave = min(tf.x, tf.y);
        if (enter > 0.0 && enter < leave) {
          tHit = enter;
          xFace = tn.x > tn.y;
          break;
        }
      }
      if (min(tMax.x, tMax.y) > tPlane) break;
      if (tMax.x < tMax.y) {
        tMax.x += tDelta.x;
        cell.x += stepv.x;
      } else {
        tMax.y += tDelta.y;
        cell.y += stepv.y;
      }
    }

    float t;
    if (tHit < tPlane) {
      t = tHit;
      col = shadeWall(ro + rd * t, xFace, ceilY, floorY, level);
    } else {
      t = tPlane;
      vec3 p = ro + rd * t;
      col = rd.y < 0.0 ? shadeFloor(p.xz, level) : shadeCeiling(p.xz, level);
    }
    col = mix(col, FOG, 1.0 - exp(-t * 0.055));
  }

  float glow = max(max(col.r, col.g), col.b);
  col += col * smoothstep(0.8, 1.6, glow) * 0.3;
  col *= smoothstep(1.25, 0.3, length((q - 0.5) * vec2(1.0, 1.15)));
  col *= 0.94 + 0.06 * sin(gl_FragCoord.y * 1.8);
  col += (hash(q * u_res + fract(u_time)) - 0.5) * 0.06;
  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luma), col, 0.72) * vec3(1.02, 0.97, 0.84);
  col = pow(max(col, 0.0), vec3(0.95, 0.97, 1.1));
  gl_FragColor = vec4(col * u_fade, 1.0);
}`;

const H = 3.2;
const SLAB = 0.35;
const P = H + SLAB;
const LEVELS = 3;
const START = -0.35;
const LANDED = (LEVELS - 1) * P + H - 0.32;
const FALLING = 0.8;
const SLABS = Array.from({ length: LEVELS - 1 }, (_, k) => k * P + H);

const TEXTURE_SIZE = 512;

const load = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const smooth = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

type FallOptions = {
  duration: number;
  onCeiling?: (index: number) => void;
  onLand?: () => void;
};

export const playFallScene = async (
  canvas: HTMLCanvasElement,
  { duration, onCeiling, onLand }: FallOptions,
) => {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) return false;

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
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
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

  const images = await Promise.all([
    load("/backrooms/wall.webp"),
    load("/backrooms/carpet.webp"),
    load("/backrooms/ceiling.webp"),
  ]);
  if (images.some((image) => !image)) return false;

  const anisotropy = gl.getExtension("EXT_texture_filter_anisotropic");
  const scratch = document.createElement("canvas");
  scratch.width = TEXTURE_SIZE;
  scratch.height = TEXTURE_SIZE;
  const context = scratch.getContext("2d");
  if (!context) return false;

  images.forEach((image, unit) => {
    context.drawImage(image!, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, scratch);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    if (anisotropy) {
      gl.texParameterf(
        gl.TEXTURE_2D,
        anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,
        Math.min(
          8,
          gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number,
        ),
      );
    }
  });

  const u = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform1i(u("u_wall"), 0);
  gl.uniform1i(u("u_carpet"), 1);
  gl.uniform1i(u("u_ceiling"), 2);
  gl.uniform1f(u("u_final"), LEVELS - 1);
  const uniforms = {
    res: u("u_res"),
    depth: u("u_depth"),
    yaw: u("u_yaw"),
    pitch: u("u_pitch"),
    roll: u("u_roll"),
    fov: u("u_fov"),
    time: u("u_time"),
    glitch: u("u_glitch"),
    fade: u("u_fade"),
  };

  const rect = canvas.getBoundingClientRect();
  const scale = Math.min(0.75, 1100 / Math.max(rect.width, 1));
  canvas.width = Math.max(1, Math.round(rect.width * scale));
  canvas.height = Math.max(1, Math.round(rect.height * scale));
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(uniforms.res, canvas.width, canvas.height);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);

  const crossed = new Set<number>();
  let landed = false;
  let lastCross = -1;

  await new Promise<void>((resolve) => {
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const elapsed = (now - start) / 1000;
      const fall = Math.min(1, t / FALLING);
      const after = Math.max(0, (t - FALLING) / (1 - FALLING));
      const eased = 0.45 * fall + 0.55 * fall * fall;
      const bounce =
        after > 0
          ? Math.sin(after * Math.PI * 2) * Math.exp(-after * 5) * 0.08
          : 0;
      const depth = START + (LANDED - START) * eased - bounce;
      const speed = t < FALLING ? 0.3 + 1.4 * fall : 0;
      const turn = smooth(0.68, 1, fall);
      const shake =
        speed * 0.012 + (after > 0 ? Math.exp(-after * 6) * 0.06 : 0);

      SLABS.forEach((slab, index) => {
        if (depth >= slab && !crossed.has(index)) {
          crossed.add(index);
          lastCross = now;
          onCeiling?.(index);
        }
      });
      if (!landed && t >= FALLING) {
        landed = true;
        onLand?.();
      }

      const sinceCross = lastCross < 0 ? 1 : (now - lastCross) / 260;
      const glitch =
        Math.max(0, 1 - sinceCross) +
        (depth < 0.1 ? 1 : 0) +
        (after > 0 ? Math.exp(-after * 8) : 0);

      gl.blendColor(0, 0, 0, t < FALLING ? 1 - 0.55 * Math.min(1, speed) : 1);
      gl.uniform1f(uniforms.depth, depth);
      gl.uniform1f(
        uniforms.yaw,
        0.6 + fall * 1.3 + Math.sin(now * 0.021) * shake,
      );
      gl.uniform1f(
        uniforms.pitch,
        -0.74 -
          Math.sin(fall * 7) * 0.1 * (1 - turn) +
          turn * 0.62 +
          Math.cos(now * 0.017) * shake +
          bounce * 0.8,
      );
      gl.uniform1f(
        uniforms.roll,
        Math.sin(fall * 5) * 0.08 * (1 - turn) +
          turn * 0.38 +
          Math.sin(now * 0.029) * shake,
      );
      gl.uniform1f(uniforms.fov, 1.25 - turn * 0.4);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.glitch, Math.min(1, glitch));
      gl.uniform1f(uniforms.fade, 1 - smooth(0.55, 1, after));
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });

  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return true;
};
