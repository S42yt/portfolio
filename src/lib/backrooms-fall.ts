const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_depth;
uniform float u_speed;
uniform float u_roll;
uniform float u_tilt;
uniform float u_time;
uniform sampler2D u_wall;
uniform sampler2D u_carpet;
uniform sampler2D u_ceiling;

const float S = 1.0;
const float THICK = 0.35;
const float FLOOR = 15.0;
const float L0 = 3.2;
const float L1 = 7.4;
const float L2 = 11.6;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

float slabAbove(float y) {
  float top = -10.0;
  if (y >= L0 + THICK) top = L0 + THICK;
  if (y >= L1 + THICK) top = L1 + THICK;
  if (y >= L2 + THICK) top = L2 + THICK;
  return top;
}

float wallLight(float y) {
  float top = slabAbove(y);
  float below = top < -5.0 ? y + 1.2 : y - top;
  float fixture = exp(-below * 1.1) * 1.55;
  float glow = exp(-(FLOOR - y) * 0.45) * 0.55;
  return 0.42 + fixture + glow;
}

vec3 wall(vec2 uv, float blur) {
  vec3 c = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    float o = (float(i) - 2.0) * blur;
    c += texture2D(u_wall, fract(uv + vec2(0.0, o))).rgb;
  }
  return c / 5.0;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float fov = 1.15 + u_speed * 0.3;
  vec3 rd = normalize(vec3(uv.x * fov, -1.0, uv.y * fov));
  rd.yz = rot(u_tilt) * rd.yz;
  rd.xz = rot(u_roll) * rd.xz;
  float dy = max(-rd.y, 1e-4);

  float tx = S / max(abs(rd.x), 1e-4);
  float tz = S / max(abs(rd.z), 1e-4);
  float tw = min(tx, tz);

  float hitT = tw;
  int kind = 0;
  float layers[4];
  layers[0] = L0;
  layers[1] = L1;
  layers[2] = L2;
  layers[3] = FLOOR;
  for (int i = 0; i < 4; i++) {
    float rel = layers[i] - u_depth;
    if (rel > 0.0) {
      float t = rel / dy;
      if (t < hitT) {
        hitT = t;
        kind = i == 3 ? 2 : 1;
      }
    }
  }

  bool inside = false;
  for (int i = 0; i < 3; i++) {
    float rel = layers[i] - u_depth;
    if (rel <= 0.0 && rel > -THICK) inside = true;
  }

  vec3 p = rd * hitT;
  float worldY = u_depth - p.y;
  vec3 col;

  if (kind == 0) {
    float side = tx < tz ? p.z : p.x;
    vec2 tuv = vec2(side * 0.5 + 0.5, worldY * 0.42);
    col = wall(tuv, u_speed * 0.018) * wallLight(worldY);
    float seam = 1.0 - smoothstep(0.0, 0.035, abs(abs(tx - tz) / hitT));
    col *= 1.0 - seam * 0.45;
  } else {
    vec2 fuv = p.xz * 0.9;
    vec3 carpet = texture2D(u_carpet, fract(fuv)).rgb;
    float edge = smoothstep(0.0, 0.35, S - max(abs(p.x), abs(p.z)));
    float lit = kind == 2 ? 1.35 : 0.85;
    col = carpet * lit * (0.55 + 0.45 * edge);
    if (kind == 2) {
      col += vec3(1.0, 0.93, 0.7) * 0.18 * exp(-length(p.xz) * 1.2);
    }
  }

  float fog = exp(-hitT * 0.06);
  col = mix(vec3(0.03, 0.022, 0.005), col, fog);

  if (inside) {
    float n = hash(floor(gl_FragCoord.xy / 3.0) + floor(u_time * 40.0));
    col = mix(vec3(0.05, 0.04, 0.01), vec3(n * 0.55, n * 0.5, n * 0.3), 0.7);
    vec3 tile = texture2D(u_ceiling, fract(uv * 2.0 + u_time)).rgb;
    col = mix(col, tile * 0.5, 0.35);
  }

  vec2 q = gl_FragCoord.xy / u_res;
  col *= smoothstep(1.15, 0.35, length((q - 0.5) * vec2(1.0, 1.1)));
  col += (hash(q * u_res + u_time) - 0.5) * 0.06;
  col = mix(col, col * vec3(1.06, 1.0, 0.82), 0.4);
  gl_FragColor = vec4(col, 1.0);
}`;

const FLOOR = 15;
const END = FLOOR - 0.28;
const SLABS = [3.2, 7.4, 11.6];

const load = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

type FallOptions = {
  duration: number;
  onSlab?: (index: number) => void;
};

export const playFallScene = async (
  canvas: HTMLCanvasElement,
  { duration, onSlab }: FallOptions,
) => {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
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

  const [wall, carpet, ceiling] = await Promise.all([
    load("/backrooms/wall.webp"),
    load("/backrooms/carpet.webp"),
    load("/backrooms/ceiling.webp"),
  ]);
  if (!wall || !carpet || !ceiling) return false;

  [wall, carpet, ceiling].forEach((image, unit) => {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  });

  const u = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform1i(u("u_wall"), 0);
  gl.uniform1i(u("u_carpet"), 1);
  gl.uniform1i(u("u_ceiling"), 2);
  const uniforms = {
    res: u("u_res"),
    depth: u("u_depth"),
    speed: u("u_speed"),
    roll: u("u_roll"),
    tilt: u("u_tilt"),
    time: u("u_time"),
  };

  const rect = canvas.getBoundingClientRect();
  const scale = Math.min(0.7, 1100 / Math.max(rect.width, 1));
  canvas.width = Math.max(1, Math.round(rect.width * scale));
  canvas.height = Math.max(1, Math.round(rect.height * scale));
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(uniforms.res, canvas.width, canvas.height);

  const crossed = new Set<number>();

  await new Promise<void>((resolve) => {
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const depth = END * (0.18 * t + 0.82 * t * t);
      const speed = Math.min(1, (0.18 + 1.64 * t) / 1.82);
      const shake = speed * 0.012;

      gl.uniform1f(uniforms.depth, depth);
      gl.uniform1f(uniforms.speed, speed);
      gl.uniform1f(uniforms.roll, t * 0.9 + Math.sin(now * 0.021) * shake * 3);
      gl.uniform1f(
        uniforms.tilt,
        0.08 * Math.sin(t * 5) + Math.cos(now * 0.017) * shake,
      );
      gl.uniform1f(uniforms.time, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      SLABS.forEach((slab, index) => {
        if (depth >= slab && !crossed.has(index)) {
          crossed.add(index);
          onSlab?.(index);
        }
      });

      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });

  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return true;
};
