import { createScene, defaultState, H, LEVELS, P } from "./backrooms-scene";

const START = -0.35;
const LANDED = (LEVELS - 1) * P + H - 0.32;
const FALLING = 0.8;
const SLABS = Array.from({ length: LEVELS - 1 }, (_, k) => k * P + H);

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
  const scene = await createScene(canvas, { blur: true });
  if (!scene) return false;

  const state = defaultState();
  const crossed = new Set<number>();
  let landed = false;
  let lastCross = -1;

  await new Promise<void>((resolve) => {
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
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
      state.depth = depth;
      state.yaw = 0.6 + fall * 1.3 + Math.sin(now * 0.021) * shake;
      state.pitch =
        -0.74 -
        Math.sin(fall * 7) * 0.1 * (1 - turn) +
        turn * 0.62 +
        Math.cos(now * 0.017) * shake +
        bounce * 0.8;
      state.roll =
        Math.sin(fall * 5) * 0.08 * (1 - turn) +
        turn * 0.38 +
        Math.sin(now * 0.029) * shake;
      state.fov = 1.25 - turn * 0.4;
      state.time = (now - start) / 1000;
      state.glitch =
        Math.max(0, 1 - sinceCross) +
        (depth < 0.1 ? 1 : 0) +
        (after > 0 ? Math.exp(-after * 8) : 0);
      state.fade = 1 - smooth(0.55, 1, after);
      scene.draw(state, t < FALLING ? 0.55 * Math.min(1, speed) : 0);

      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });

  scene.dispose();
  return true;
};
