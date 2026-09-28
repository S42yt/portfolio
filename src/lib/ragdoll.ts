type Body = {
  el: HTMLElement;
  fixed: boolean;
  w: number;
  h: number;
  bx: number;
  by: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  av: number;
  m: number;
  inertia: number;
  floor: number;
  still: number;
  asleep: boolean;
};

type Drag = {
  body: Body;
  lx: number;
  ly: number;
  cx: number;
  cy: number;
  startX: number;
  startY: number;
  moved: boolean;
};

type Options = {
  selector: string;
  onImpact?: (speed: number, pan: number) => void;
};

const GRAVITY = 2600;
const STIFFNESS = 190;
const DAMPING = 17;
const RESTITUTION = 0.28;
const FRICTION = 0.55;
const HOLD_MS = 260;

const isFixed = (el: HTMLElement) => {
  for (let node: HTMLElement | null = el; node; node = node.parentElement) {
    if (getComputedStyle(node).position === "fixed") return true;
  }
  return false;
};

const readPx = (el: HTMLElement, name: string) =>
  parseFloat(el.style.getPropertyValue(name)) || 0;

export const createRagdoll = ({ selector, onImpact }: Options) => {
  const bodies = new Map<HTMLElement, Body>();
  let enabled = false;
  let raf = 0;
  let last = 0;
  let drag: Drag | null = null;
  let hold: { el: HTMLElement; x: number; y: number; timer: number } | null =
    null;
  let lastImpact = 0;

  const floorFor = (fixed: boolean) =>
    (fixed ? 0 : window.scrollY) + window.innerHeight - 2;

  const toWorld = (body: Body, clientX: number, clientY: number) => ({
    x: clientX + (body.fixed ? 0 : window.scrollX),
    y: clientY + (body.fixed ? 0 : window.scrollY),
  });

  const render = (body: Body) => {
    body.el.style.translate = `${body.x - body.bx}px ${body.y - body.by}px`;
    body.el.style.rotate = `${body.a}rad`;
  };

  const detach = (el: HTMLElement) => {
    const existing = bodies.get(el);
    if (existing) return existing;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return null;

    const fixed = isFixed(el);
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + (fixed ? 0 : window.scrollX);
    const y = rect.top + rect.height / 2 + (fixed ? 0 : window.scrollY);
    const tx = readPx(el, "--bk-x");
    const ty = readPx(el, "--bk-y");
    const deg = readPx(el, "--bk-r");
    const m = Math.max(1, (w * h) / 1000);

    delete el.dataset.bk;
    el.style.transition = "none";
    el.style.willChange = "translate, rotate";
    el.dataset.body = "free";

    const body: Body = {
      el,
      fixed,
      w,
      h,
      bx: x - tx,
      by: y - ty,
      x,
      y,
      vx: 0,
      vy: 0,
      a: (deg * Math.PI) / 180,
      av: 0,
      m,
      inertia: (m * (w * w + h * h)) / 12,
      floor: floorFor(fixed),
      still: 0,
      asleep: false,
    };
    bodies.set(el, body);
    return body;
  };

  const contact = (
    body: Body,
    nx: number,
    ny: number,
    rx: number,
    ry: number,
    depth: number,
  ) => {
    body.x += nx * depth * 0.8;
    body.y += ny * depth * 0.8;
    const vcx = body.vx - body.av * ry;
    const vcy = body.vy + body.av * rx;
    const vn = vcx * nx + vcy * ny;
    if (vn >= 0) return;

    const rn = rx * ny - ry * nx;
    const j =
      (-(1 + RESTITUTION) * vn) / (1 / body.m + (rn * rn) / body.inertia);
    body.vx += (j * nx) / body.m;
    body.vy += (j * ny) / body.m;
    body.av += (rn * j) / body.inertia;

    const tx = -ny;
    const ty = nx;
    const vt = vcx * tx + vcy * ty;
    const rt = rx * ty - ry * tx;
    let jt = -vt / (1 / body.m + (rt * rt) / body.inertia);
    const limit = FRICTION * j;
    jt = Math.max(-limit, Math.min(limit, jt));
    body.vx += (jt * tx) / body.m;
    body.vy += (jt * ty) / body.m;
    body.av += (rt * jt) / body.inertia;

    const now = performance.now();
    if (-vn > 380 && now - lastImpact > 70) {
      lastImpact = now;
      const pan = (body.x / window.innerWidth) * 2 - 1;
      onImpact?.(-vn, Math.max(-1, Math.min(1, pan)));
    }
  };

  const step = (body: Body, dt: number) => {
    body.vy += GRAVITY * dt;

    const c = Math.cos(body.a);
    const s = Math.sin(body.a);

    if (drag?.body === body) {
      const rx = drag.lx * c - drag.ly * s;
      const ry = drag.lx * s + drag.ly * c;
      const gx = body.x + rx;
      const gy = body.y + ry;
      const vgx = body.vx - body.av * ry;
      const vgy = body.vy + body.av * rx;
      const ax = (drag.cx - gx) * STIFFNESS - vgx * DAMPING;
      const ay = (drag.cy - gy) * STIFFNESS - vgy * DAMPING;
      body.vx += ax * dt;
      body.vy += ay * dt;
      body.av += (((rx * ay - ry * ax) * body.m) / body.inertia) * dt;
    }

    body.x += body.vx * dt;
    body.y += body.vy * dt;
    body.a += body.av * dt;
    body.vx *= 0.999;
    body.vy *= 0.999;
    body.av *= 0.993;

    const width = window.innerWidth;
    let grounded = false;
    const hw = body.w / 2;
    const hh = body.h / 2;
    const cc = Math.cos(body.a);
    const ss = Math.sin(body.a);
    for (const [sx, sy] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ]) {
      const rx = sx * hw * cc - sy * hh * ss;
      const ry = sx * hw * ss + sy * hh * cc;
      const px = body.x + rx;
      const py = body.y + ry;
      if (py > body.floor) {
        grounded = true;
        contact(body, 0, -1, rx, ry, py - body.floor);
      }
      if (px < 0) contact(body, 1, 0, rx, ry, -px);
      if (px > width) contact(body, -1, 0, rx, ry, px - width);
    }

    const speed = Math.hypot(body.vx, body.vy);
    if (
      drag?.body !== body &&
      grounded &&
      speed < 14 &&
      Math.abs(body.av) < 0.25
    ) {
      body.still += dt;
      if (body.still > 0.5) {
        body.asleep = true;
        body.vx = 0;
        body.vy = 0;
        body.av = 0;
      }
    } else {
      body.still = 0;
    }
    render(body);
  };

  const frame = (now: number) => {
    const dt = Math.min(Math.max(0, (now - last) / 1000), 1 / 30);
    last = Math.max(last, now);
    let awake = false;
    for (const body of bodies.values()) {
      if (body.asleep) continue;
      awake = true;
      step(body, dt / 2);
      step(body, dt / 2);
    }
    raf = awake || drag ? requestAnimationFrame(frame) : 0;
  };

  const wake = () => {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const grab = (el: HTMLElement, clientX: number, clientY: number) => {
    const body = detach(el);
    if (!body) return;
    body.asleep = false;
    body.still = 0;
    const world = toWorld(body, clientX, clientY);
    const dx = world.x - body.x;
    const dy = world.y - body.y;
    const c = Math.cos(body.a);
    const s = Math.sin(body.a);
    drag = {
      body,
      lx: dx * c + dy * s,
      ly: -dx * s + dy * c,
      cx: world.x,
      cy: world.y,
      startX: clientX,
      startY: clientY,
      moved: false,
    };
    document.documentElement.classList.add("bk-grabbing");
    wake();
  };

  const suppressClick = () => {
    const block = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener("click", block, { capture: true, once: true });
    window.setTimeout(
      () => window.removeEventListener("click", block, { capture: true }),
      50,
    );
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!enabled || event.button !== 0) return;
    const el = (event.target as Element | null)?.closest<HTMLElement>(selector);
    if (!el) return;

    if (event.pointerType === "touch") {
      hold = {
        el,
        x: event.clientX,
        y: event.clientY,
        timer: window.setTimeout(() => {
          if (!hold) return;
          grab(hold.el, hold.x, hold.y);
          if (drag) drag.moved = true;
          hold = null;
        }, HOLD_MS),
      };
      return;
    }

    event.preventDefault();
    grab(el, event.clientX, event.clientY);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (hold) {
      if (Math.hypot(event.clientX - hold.x, event.clientY - hold.y) > 8) {
        window.clearTimeout(hold.timer);
        hold = null;
      } else {
        hold.x = event.clientX;
        hold.y = event.clientY;
      }
    }
    if (!drag) return;
    const world = toWorld(drag.body, event.clientX, event.clientY);
    drag.cx = world.x;
    drag.cy = world.y;
    if (
      Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6
    ) {
      drag.moved = true;
    }
  };

  const release = () => {
    if (hold) {
      window.clearTimeout(hold.timer);
      hold = null;
    }
    if (!drag) return;
    if (drag.moved) suppressClick();
    drag.body.floor = floorFor(drag.body.fixed);
    drag = null;
    document.documentElement.classList.remove("bk-grabbing");
    wake();
  };

  const onTouchMove = (event: TouchEvent) => {
    if (drag) event.preventDefault();
  };

  const onDragStart = (event: DragEvent) => {
    if (enabled) event.preventDefault();
  };

  return {
    enable() {
      if (enabled) return;
      enabled = true;
      window.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("dragstart", onDragStart);
    },
    disable() {
      enabled = false;
      release();
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("dragstart", onDragStart);
      for (const body of bodies.values()) {
        const { style } = body.el;
        style.removeProperty("translate");
        style.removeProperty("rotate");
        style.removeProperty("transition");
        style.removeProperty("will-change");
        delete body.el.dataset.body;
      }
      bodies.clear();
    },
  };
};
