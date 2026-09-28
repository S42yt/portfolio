type Point = { x: number; y: number };

type Crack = {
  points: Point[];
  dist: number[];
  width: number;
};

type Impact = {
  x: number;
  y: number;
  start: number;
  reach: number;
  cracks: Crack[];
};

const SPEED = 1.9;

const along = (cx: number, cy: number, angle: number, length: number) => ({
  x: cx + Math.cos(angle) * length,
  y: cy + Math.sin(angle) * length,
});

const jagged = (
  from: Point,
  angle: number,
  length: number,
  offset: number,
  width: number,
  cracks: Crack[],
  depth = 0,
) => {
  const points = [from];
  const dist = [offset];
  let x = from.x;
  let y = from.y;
  let travelled = 0;
  let heading = angle;
  while (travelled < length) {
    const segment = 7 + Math.random() * 16;
    heading += (Math.random() - 0.5) * 0.42;
    x += Math.cos(heading) * segment;
    y += Math.sin(heading) * segment;
    travelled += segment;
    points.push({ x, y });
    dist.push(offset + travelled);
    if (depth < 2 && Math.random() < 0.09 && travelled < length * 0.8) {
      jagged(
        { x, y },
        heading + (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 0.6),
        (length - travelled) * (0.25 + Math.random() * 0.35),
        offset + travelled,
        width * 0.7,
        cracks,
        depth + 1,
      );
    }
  }
  cracks.push({ points, dist, width });
  return { points, dist };
};

const pointAt = (points: Point[], dist: number[], target: number) => {
  const base = dist[0];
  for (let i = 1; i < points.length; i++) {
    if (dist[i] - base >= target) {
      const span = dist[i] - dist[i - 1] || 1;
      const t = (target - (dist[i - 1] - base)) / span;
      return {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * t,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * t,
      };
    }
  }
  return null;
};

const buildImpact = (
  x: number,
  y: number,
  strength: number,
  previous: Impact[],
): Impact => {
  const cracks: Crack[] = [];
  const diagonal = Math.hypot(window.innerWidth, window.innerHeight);
  const reach = Math.min(diagonal, 110 + strength * 120);
  const count = 9 + Math.floor(Math.random() * 5);
  const offset = Math.random() * Math.PI * 2;
  const radials: { points: Point[]; dist: number[]; length: number }[] = [];

  for (let i = 0; i < count; i++) {
    const angle =
      offset + (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
    const length = reach * (0.55 + Math.random() * 0.6);
    const radial = jagged({ x, y }, angle, length, 0, 1.5, cracks);
    radials.push({ ...radial, length });
  }

  const rings = [12, 26, 46, 74, 112, 160, 220].filter(
    (radius) => radius < reach * (0.35 + strength * 0.1),
  );
  for (const radius of rings) {
    for (let i = 0; i < radials.length; i++) {
      if (Math.random() < 0.3) continue;
      const a = radials[i];
      const b = radials[(i + 1) % radials.length];
      const r1 = radius * (0.85 + Math.random() * 0.3);
      const r2 = radius * (0.85 + Math.random() * 0.3);
      if (r1 > a.length || r2 > b.length) continue;
      const p1 = pointAt(a.points, a.dist, r1);
      const p2 = pointAt(b.points, b.dist, r2);
      if (!p1 || !p2) continue;
      const mid = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
      const pull = 0.1 + Math.random() * 0.12;
      const bend = {
        x: mid.x + (x - mid.x) * pull + (Math.random() - 0.5) * 4,
        y: mid.y + (y - mid.y) * pull + (Math.random() - 0.5) * 4,
      };
      const d = Math.min(r1, r2);
      cracks.push({
        points: [p1, bend, p2],
        dist: [d, d + 3, d + 6],
        width: 0.9,
      });
    }
  }

  for (let i = 0; i < 16; i++) {
    const angle = Math.random() * Math.PI * 2;
    const start = along(x, y, angle, Math.random() * 3);
    const end = along(
      x,
      y,
      angle + (Math.random() - 0.5) * 0.8,
      4 + Math.random() * 9,
    );
    cracks.push({ points: [start, end], dist: [0, 6], width: 0.8 });
  }

  const nearest = previous.reduce<Impact | null>(
    (best, impact) =>
      !best ||
      Math.hypot(impact.x - x, impact.y - y) <
        Math.hypot(best.x - x, best.y - y)
        ? impact
        : best,
    null,
  );
  if (nearest) {
    const gap = Math.hypot(nearest.x - x, nearest.y - y);
    if (gap > 30) {
      jagged(
        { x, y },
        Math.atan2(nearest.y - y, nearest.x - x),
        gap * 0.92,
        0,
        1.3,
        cracks,
        2,
      );
    }
  }

  return { x, y, start: performance.now(), reach, cracks };
};

export const createGlass = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d");
  let impacts: Impact[] = [];
  let raf = 0;
  let ratio = 1;

  const resize = () => {
    ratio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
  };

  const stroke = (
    ctx: CanvasRenderingContext2D,
    crack: Crack,
    progress: number,
  ) => {
    const { points, dist } = crack;
    if (dist[0] > progress) return false;
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      if (dist[i] <= progress) {
        ctx.lineTo(points[i].x, points[i].y);
        continue;
      }
      const t = (progress - dist[i - 1]) / (dist[i] - dist[i - 1]);
      ctx.lineTo(
        points[i - 1].x + (points[i].x - points[i - 1].x) * t,
        points[i - 1].y + (points[i].y - points[i - 1].y) * t,
      );
      return true;
    }
    return false;
  };

  const draw = (now: number) => {
    if (!context) return;
    const ctx = context;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    let growing = false;

    const passes: [string, number, number, number][] = [
      ["rgba(255, 255, 255, 0.14)", 4.5, 0, 0],
      ["rgba(10, 30, 60, 0.55)", 1.2, 0.9, 0.9],
      ["rgba(255, 255, 255, 0.95)", 1, 0, 0],
    ];

    for (const impact of impacts) {
      const progress = (now - impact.start) * SPEED;
      const glow = ctx.createRadialGradient(
        impact.x,
        impact.y,
        0,
        impact.x,
        impact.y,
        22,
      );
      glow.addColorStop(0, "rgba(255, 255, 255, 0.7)");
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(impact.x, impact.y, 22, 0, Math.PI * 2);
      ctx.fill();

      for (const [color, width, dx, dy] of passes) {
        ctx.save();
        ctx.translate(dx, dy);
        ctx.strokeStyle = color;
        for (const crack of impact.cracks) {
          ctx.lineWidth = width * crack.width;
          ctx.beginPath();
          if (stroke(ctx, crack, progress)) growing = true;
          ctx.stroke();
        }
        ctx.restore();
      }
    }
    raf = growing ? requestAnimationFrame(draw) : 0;
  };

  resize();

  return {
    get count() {
      return impacts.length;
    },
    hit(x: number, y: number) {
      impacts.push(buildImpact(x, y, impacts.length, impacts));
      if (!raf) raf = requestAnimationFrame(draw);
      return impacts.length;
    },
    clear() {
      impacts = [];
      cancelAnimationFrame(raf);
      raf = 0;
      context?.clearRect(0, 0, canvas.width, canvas.height);
    },
    resize() {
      resize();
      if (!raf) raf = requestAnimationFrame(draw);
    },
    seeds() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const points: Point[] = [];
      for (const impact of impacts) {
        points.push({ x: impact.x + 3, y: impact.y + 2 });
        for (let i = 0; i < 4; i++) {
          const angle = Math.random() * Math.PI * 2;
          const r = 40 + Math.random() * 110;
          points.push(along(impact.x, impact.y, angle, r));
        }
      }
      const columns = width > height ? 4 : 3;
      const rows = width > height ? 3 : 4;
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          points.push({
            x: ((i + 0.2 + Math.random() * 0.6) / columns) * width,
            y: ((j + 0.2 + Math.random() * 0.6) / rows) * height,
          });
        }
      }
      return points
        .filter((p) => p.x > 0 && p.x < width && p.y > 0 && p.y < height)
        .slice(0, 30);
    },
    last() {
      const impact = impacts[impacts.length - 1];
      return impact ? { x: impact.x, y: impact.y } : null;
    },
  };
};

export type Glass = ReturnType<typeof createGlass>;

const clip = (polygon: Point[], a: Point, b: Point) => {
  const nx = b.x - a.x;
  const ny = b.y - a.y;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const side = (p: Point) => (p.x - mx) * nx + (p.y - my) * ny;
  const result: Point[] = [];
  for (let i = 0; i < polygon.length; i++) {
    const current = polygon[i];
    const next = polygon[(i + 1) % polygon.length];
    const sc = side(current);
    const sn = side(next);
    if (sc <= 0) result.push(current);
    if (sc * sn < 0) {
      const t = sc / (sc - sn);
      result.push({
        x: current.x + (next.x - current.x) * t,
        y: current.y + (next.y - current.y) * t,
      });
    }
  }
  return result;
};

export const voronoi = (seeds: Point[], width: number, height: number) =>
  seeds
    .map((seed) => {
      let cell: Point[] = [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: width, y: height },
        { x: 0, y: height },
      ];
      for (const other of seeds) {
        if (other === seed) continue;
        cell = clip(cell, seed, other);
        if (cell.length < 3) break;
      }
      return cell;
    })
    .filter((cell) => cell.length >= 3);

type ShatterOptions = {
  host: HTMLElement;
  cells: Point[][];
  origin: Point;
  content: () => HTMLElement;
  duration: number;
  reverse?: boolean;
};

export const shatter = ({
  host,
  cells,
  origin,
  content,
  duration,
  reverse = false,
}: ShatterOptions) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const diagonal = Math.hypot(width, height);
  host.style.perspectiveOrigin = `${origin.x}px ${origin.y}px`;

  const shards = cells.map((cell) => {
    const cx = cell.reduce((sum, p) => sum + p.x, 0) / cell.length;
    const cy = cell.reduce((sum, p) => sum + p.y, 0) / cell.length;
    const dx = cx - origin.x;
    const dy = cy - origin.y;
    const distance = Math.hypot(dx, dy) || 1;
    const push =
      (380 + Math.random() * 520) *
      (1 - Math.min(distance / diagonal, 0.8) * 0.6);

    const el = document.createElement("div");
    el.className = "bk-shard";
    const polygon = cell
      .map((p) => `${p.x.toFixed(1)}px ${p.y.toFixed(1)}px`)
      .join(", ");
    el.style.clipPath = `polygon(${polygon})`;
    el.style.transformOrigin = `${cx}px ${cy}px`;
    el.appendChild(content());

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "bk-shard-edge");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    const shape = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon",
    );
    shape.setAttribute("points", cell.map((p) => `${p.x},${p.y}`).join(" "));
    svg.appendChild(shape);
    el.appendChild(svg);
    host.appendChild(el);

    return {
      el,
      delay: (distance / diagonal) * 0.14,
      vx: (dx / distance) * push,
      vy: (dy / distance) * push - 120,
      vz: 350 + Math.random() * 650,
      rx: (Math.random() - 0.5) * 7,
      ry: (Math.random() - 0.5) * 7,
      rz: (Math.random() - 0.5) * 3,
    };
  });

  return new Promise<void>((resolve) => {
    const start = performance.now();
    const seconds = duration / 1000;
    const frame = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(1, elapsed / seconds);
      const clock = reverse ? seconds * Math.pow(1 - progress, 2.2) : elapsed;
      for (const shard of shards) {
        const t = Math.max(0, clock - shard.delay);
        const x = shard.vx * t;
        const y = shard.vy * t + 1500 * t * t;
        const z = shard.vz * t;
        shard.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${(shard.rx * t).toFixed(3)}rad) rotateY(${(shard.ry * t).toFixed(3)}rad) rotateZ(${(shard.rz * t).toFixed(3)}rad)`;
        shard.el.style.opacity = String(
          1 - Math.max(0, (t - seconds * 0.55) / (seconds * 0.4)),
        );
      }
      if (elapsed < seconds) {
        requestAnimationFrame(frame);
      } else {
        host.replaceChildren();
        resolve();
      }
    };
    requestAnimationFrame(frame);
  });
};
