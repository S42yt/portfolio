const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_depth;
uniform vec2 u_pos;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_roll;
uniform float u_fov;
uniform float u_time;
uniform float u_glitch;
uniform float u_fade;
uniform float u_final;
uniform float u_dim;
uniform vec3 u_door;
uniform float u_open;
uniform float u_white;
uniform vec3 u_entity;
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
const vec3 SIGN = vec3(0.25, 1.0, 0.45);
const vec3 SKY = vec3(1.0, 0.99, 0.95);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

bool doorLevel(float level) {
  return u_door.z != 0.0 && level > u_final - 0.5;
}

vec2 doorCell() {
  return floor(u_door.xy / G);
}

vec2 boxSize(vec2 cell, float level) {
  if (level > u_final - 0.5) {
    if (cell.x >= -1.0 && cell.x <= 0.0 && cell.y >= -1.0 && cell.y <= 0.0) return vec2(0.0);
    if (doorLevel(level) && cell == doorCell()) return vec2(G * 0.42, 0.09);
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
  return total * u_dim;
}

vec3 doorLight(vec3 p, float level) {
  if (!doorLevel(level)) return vec3(0.0);
  vec2 front = vec2(u_door.x, u_door.y + u_door.z * 0.4);
  vec2 d = p.xz - front;
  float r = dot(d, d);
  float facing = step(0.0, (p.z - u_door.y) * u_door.z + 0.3);
  vec3 green = SIGN * 0.5 / (1.0 + r * 0.7);
  vec3 spill = SKY * u_open * 2.2 / (1.0 + r * 0.35);
  return (green + spill) * facing;
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

vec3 shadeFloor(vec3 p, float level) {
  vec3 carpet = texture2D(u_carpet, p.xz * 0.9).rgb;
  float light = 0.28 + 0.62 * lampLight(p.xz, level);
  float ao = 0.35 + 0.65 * smoothstep(0.0, 0.9, boxDistance(p.xz, level));
  return carpet * (light * LAMP + doorLight(p, level)) * ao;
}

vec3 shadeCeiling(vec2 xz, float level) {
  vec3 tile = texture2D(u_ceiling, xz * 0.55).rgb;
  vec2 cell = floor(xz / L);
  vec2 f = fract(xz / L) - 0.5;
  float on = lampOn(cell, level) * u_dim;
  float edge = max(abs(f.x), abs(f.y));
  float panel = on * (1.0 - smoothstep(0.17, 0.19, edge));
  float halo = on * exp(-max(edge - 0.18, 0.0) * 9.0);
  vec3 col = tile * (0.42 + 0.35 * lampLight(xz, level) + halo * 0.6) * LAMP;
  return mix(col, LAMP * 1.9, panel);
}

float letterRow(int letter, int row) {
  if (letter == 0) return (row == 1 || row == 3) ? 4.0 : 7.0;
  if (letter == 1) return row == 2 ? 2.0 : 5.0;
  if (letter == 2) return (row == 0 || row == 4) ? 7.0 : 2.0;
  return row == 0 ? 7.0 : 2.0;
}

float exitText(vec2 uv) {
  float col = floor(uv.x * 17.0) - 1.0;
  float row = floor((1.0 - uv.y) * 7.0) - 1.0;
  if (col < 0.0 || col > 14.0 || row < 0.0 || row > 4.0) return 0.0;
  float letter = floor(col / 4.0);
  float inLetter = col - letter * 4.0;
  if (inLetter > 2.5) return 0.0;
  float bits = letterRow(int(letter), int(row));
  return mod(floor(bits / pow(2.0, 2.0 - inLetter)), 2.0);
}

vec3 shadeWall(vec3 p, bool xFace, float ceilY, float floorY, float level) {
  float along = xFace ? p.z : p.x;
  float fromFloor = p.y - floorY;
  float below = ceilY - p.y;
  vec3 paper = texture2D(u_wall, vec2(along, fromFloor) * 0.62).rgb;
  float light = 0.32 + 0.5 * lampLight(p.xz, level) * (0.45 + 0.55 * smoothstep(0.0, H, fromFloor));
  light *= 0.55 + 0.45 * smoothstep(0.0, 0.5, fromFloor);
  light *= 0.75 + 0.25 * smoothstep(0.0, 0.3, below);
  vec3 col = paper * (light * LAMP + doorLight(p, level) * 0.8);
  if (fromFloor < 0.12) col = vec3(0.34, 0.27, 0.13) * light;

  if (doorLevel(level) && !xFace && abs(p.z - (u_door.y + u_door.z * 0.09)) < 0.03) {
    float dx = (p.x - u_door.x) * u_door.z;
    if (abs(dx) < 0.6 && fromFloor < 2.08) {
      col = vec3(0.14, 0.12, 0.09) * (light + 0.3);
      if (abs(dx) < 0.5 && fromFloor < 2.0) {
        float seam = 0.5 - 1.0 * u_open;
        if (dx > seam) {
          col = SKY * (1.4 + u_open * 2.0);
        } else {
          float shade = light * 1.05 + 0.22;
          vec3 metal = mix(vec3(0.5, 0.47, 0.4), vec3(0.34, 0.33, 0.28), fromFloor / 2.0);
          col = metal * shade + SIGN * 0.1;
          float inset = step(0.07, min(seam - dx, dx + 0.5)) * step(0.07, 2.0 - fromFloor) * step(0.3, fromFloor);
          col *= 0.9 + 0.1 * inset;
          if (fromFloor < 0.28) col = vec3(0.22, 0.21, 0.18) * shade;
          if (fromFloor > 0.95 && fromFloor < 1.04 && dx > -0.42 && dx < seam - 0.08) {
            col = vec3(0.72, 0.7, 0.62) * shade * (1.2 - 0.4 * smoothstep(0.95, 1.04, fromFloor));
          }
          col *= 0.8 + 0.2 * smoothstep(0.0, 0.04, seam - dx);
          col += SKY * u_open * 0.25;
          if (fromFloor < 0.025) col = SKY * (1.1 + u_open);
        }
      }
    }
    if (abs(dx) < 0.34 && fromFloor > 2.12 && fromFloor < 2.38) {
      vec2 uv = vec2(dx / 0.68 + 0.5, (fromFloor - 2.12) / 0.26);
      float text = exitText(uv);
      float buzz = 0.85 + 0.15 * step(0.08, hash(vec2(floor(u_time * 20.0), 3.0)));
      col = mix(SIGN * 0.45, vec3(0.85, 1.0, 0.88) * 1.6, text) * buzz;
    }
  }
  return col;
}

vec3 staticFrame(vec2 frag) {
  float n = hash(floor(frag / 3.0) + floor(u_time * 40.0));
  float band = hash(vec2(floor(frag.y / 7.0), floor(u_time * 25.0)));
  vec3 carpet = texture2D(u_carpet, frag / u_res.y * 3.0 + u_time).rgb;
  return mix(carpet * 0.25, vec3(n) * 0.6, 0.55) * (0.6 + band * 0.5);
}

float cylinder(vec2 o, vec2 d, vec2 c, float r) {
  vec2 oc = o - c;
  float a = dot(d, d);
  float b = dot(oc, d);
  float k = dot(oc, oc) - r * r;
  float disc = b * b - a * k;
  if (disc < 0.0) return -1.0;
  return (-b - sqrt(disc)) / a;
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
    vec3 ro = vec3(u_pos.x, -u_depth, u_pos.y);
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
      col = rd.y < 0.0 ? shadeFloor(p, level) : shadeCeiling(p.xz, level);
    }

    if (u_entity.z > 0.0) {
      float tb = cylinder(o, rd.xz, u_entity.xy, 0.2);
      float th = cylinder(o, rd.xz, u_entity.xy, 0.13);
      float yb = ro.y + rd.y * tb - floorY;
      float yh = ro.y + rd.y * th - floorY;
      bool body = tb > 0.0 && tb < t && yb > 0.0 && yb < 1.58;
      bool head = th > 0.0 && th < t && yh > 1.58 && yh < 1.9;
      if (body || head) {
        float te = body ? tb : th;
        vec3 figure = vec3(0.015, 0.012, 0.008) + FOG * 0.05 * (1.0 - exp(-te * 0.05));
        col = mix(col, figure, u_entity.z);
        t = mix(t, te, u_entity.z);
      }
    }

    col = mix(col, FOG * u_dim, 1.0 - exp(-t * 0.055));
  }

  float glow = max(max(col.r, col.g), col.b);
  col += col * smoothstep(0.8, 1.6, glow) * 0.3;
  col *= smoothstep(1.25, 0.3, length((q - 0.5) * vec2(1.0, 1.15)));
  col *= 0.94 + 0.06 * sin(gl_FragCoord.y * 1.8);
  col += (hash(q * u_res + fract(u_time)) - 0.5) * 0.06;
  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luma), col, 0.72) * vec3(1.02, 0.97, 0.84);
  col = pow(max(col, 0.0), vec3(0.95, 0.97, 1.1));
  col = mix(col * u_fade, SKY, u_white);
  gl_FragColor = vec4(col, 1.0);
}`;

export const H = 3.2;
export const SLAB = 0.35;
export const P = H + SLAB;
export const G = 4;
export const LEVELS = 3;
export const EYE = 1.6;
export const STANDING = (LEVELS - 1) * P + H - EYE;

const TEXTURE_SIZE = 512;

const load = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

export type SceneState = {
  depth: number;
  x: number;
  z: number;
  yaw: number;
  pitch: number;
  roll: number;
  fov: number;
  time: number;
  glitch: number;
  fade: number;
  dim: number;
  door: [number, number, number];
  open: number;
  white: number;
  entity: [number, number, number];
};

export const defaultState = (): SceneState => ({
  depth: 0,
  x: 0,
  z: 0,
  yaw: 0,
  pitch: 0,
  roll: 0,
  fov: 0.85,
  time: 0,
  glitch: 0,
  fade: 1,
  dim: 1,
  door: [0, 0, 0],
  open: 0,
  white: 0,
  entity: [0, 0, 0],
});

export const createScene = async (
  canvas: HTMLCanvasElement,
  { blur = false, quality = 0.75 }: { blur?: boolean; quality?: number } = {},
) => {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: blur,
  });
  if (!gl) return null;

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

  const images = await Promise.all([
    load("/backrooms/wall.webp"),
    load("/backrooms/carpet.webp"),
    load("/backrooms/ceiling.webp"),
  ]);
  if (images.some((image) => !image)) return null;

  const anisotropy = gl.getExtension("EXT_texture_filter_anisotropic");
  const scratch = document.createElement("canvas");
  scratch.width = TEXTURE_SIZE;
  scratch.height = TEXTURE_SIZE;
  const context = scratch.getContext("2d");
  if (!context) return null;

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
    pos: u("u_pos"),
    yaw: u("u_yaw"),
    pitch: u("u_pitch"),
    roll: u("u_roll"),
    fov: u("u_fov"),
    time: u("u_time"),
    glitch: u("u_glitch"),
    fade: u("u_fade"),
    dim: u("u_dim"),
    door: u("u_door"),
    open: u("u_open"),
    white: u("u_white"),
    entity: u("u_entity"),
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(quality, 1100 / Math.max(rect.width, 1));
    canvas.width = Math.max(1, Math.round(rect.width * scale));
    canvas.height = Math.max(1, Math.round(rect.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.res, canvas.width, canvas.height);
  };
  resize();

  if (blur) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
  }

  return {
    resize,
    draw(state: SceneState, keep = 0) {
      if (blur) gl.blendColor(0, 0, 0, 1 - keep);
      gl.uniform1f(uniforms.depth, state.depth);
      gl.uniform2f(uniforms.pos, state.x, state.z);
      gl.uniform1f(uniforms.yaw, state.yaw);
      gl.uniform1f(uniforms.pitch, state.pitch);
      gl.uniform1f(uniforms.roll, state.roll);
      gl.uniform1f(uniforms.fov, state.fov);
      gl.uniform1f(uniforms.time, state.time);
      gl.uniform1f(uniforms.glitch, Math.min(1, state.glitch));
      gl.uniform1f(uniforms.fade, state.fade);
      gl.uniform1f(uniforms.dim, state.dim);
      gl.uniform3f(uniforms.door, ...state.door);
      gl.uniform1f(uniforms.open, state.open);
      gl.uniform1f(uniforms.white, state.white);
      gl.uniform3f(uniforms.entity, ...state.entity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
};

export type Scene = NonNullable<Awaited<ReturnType<typeof createScene>>>;
