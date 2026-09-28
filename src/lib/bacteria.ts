export const BACTERIA = `
float bkHash(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}

float bkLimb(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r * (1.0 - 0.4 * h);
}

vec2 bkTwitch(float id, float t) {
  float f = floor(t * 9.0);
  return (vec2(bkHash(vec2(id, f)), bkHash(vec2(f, id + 7.0))) - 0.5) * 0.035;
}

float bacteria(vec2 p, float t) {
  vec2 hip = vec2(0.0, 0.5);
  vec2 neck = vec2(0.025, 0.83) + bkTwitch(1.0, t) * 0.4;
  vec2 head = neck + vec2(0.035, 0.075) + bkTwitch(2.0, t);
  vec2 sl = vec2(-0.075, 0.79) + bkTwitch(3.0, t) * 0.3;
  vec2 sr = vec2(0.08, 0.8) + bkTwitch(4.0, t) * 0.3;

  float d = bkLimb(p, hip, neck, 0.034);
  d = min(d, bkLimb(p, sl, sr, 0.018));
  d = min(d, bkLimb(p, neck - vec2(0.0, 0.02), head, 0.016));

  vec2 q = p - head;
  float a = 0.4 + bkTwitch(5.0, t).x * 4.0;
  q = mat2(cos(a), -sin(a), sin(a), cos(a)) * q;
  d = min(d, (length(q / vec2(0.03, 0.078)) - 1.0) * 0.03);

  vec2 el = sl + vec2(-0.075, -0.25) + bkTwitch(6.0, t);
  vec2 hl = el + vec2(0.025, -0.32) + bkTwitch(7.0, t);
  vec2 er = sr + vec2(0.08, -0.27) + bkTwitch(8.0, t);
  vec2 hr = er + vec2(-0.015, -0.34) + bkTwitch(9.0, t);
  d = min(d, bkLimb(p, sl, el, 0.016));
  d = min(d, bkLimb(p, el, hl, 0.013));
  d = min(d, bkLimb(p, sr, er, 0.016));
  d = min(d, bkLimb(p, er, hr, 0.013));
  for (int i = 0; i < 3; i++) {
    float f = float(i) - 1.0;
    d = min(d, bkLimb(p, hl, hl + vec2(f * 0.02, -0.11 - 0.02 * abs(f)), 0.006));
    d = min(d, bkLimb(p, hr, hr + vec2(f * 0.02, -0.12 + 0.02 * abs(f)), 0.006));
  }

  vec2 kl = vec2(-0.065, 0.27) + bkTwitch(10.0, t);
  vec2 kr = vec2(0.06, 0.26) + bkTwitch(11.0, t);
  d = min(d, bkLimb(p, hip - vec2(0.02, 0.0), kl, 0.02));
  d = min(d, bkLimb(p, kl, vec2(-0.04, 0.0), 0.015));
  d = min(d, bkLimb(p, hip + vec2(0.02, 0.0), kr, 0.02));
  d = min(d, bkLimb(p, kr, vec2(0.045, 0.0), 0.015));

  for (int i = 0; i < 6; i++) {
    float k = float(i) / 5.0;
    vec2 base = mix(hip + vec2(0.0, 0.08), neck, k);
    float dir = mod(float(i), 2.0) < 0.5 ? -1.0 : 1.0;
    float len = 0.045 + 0.04 * bkHash(vec2(float(i), 3.0));
    vec2 tip = base + vec2(dir * len, 0.025 + 0.02 * k) + bkTwitch(12.0 + float(i), t) * 0.6;
    d = min(d, bkLimb(p, base, tip, 0.007));
  }

  float f = floor(t * 12.0);
  d += sin(p.y * 240.0 + f * 1.7) * sin(p.x * 170.0 - f * 2.3) * 0.006;
  d += (bkHash(floor(p * 260.0) + f) - 0.5) * 0.007;
  return d;
}
`;
