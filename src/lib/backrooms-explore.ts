import { createScene, defaultState, EYE, G, STANDING } from "./backrooms-scene";

type Callbacks = {
  onStep?: (index: number) => void;
  onBump?: () => void;
  onBeacon?: (gain: number, pan: number, signal: number) => void;
  onEntity?: (pan: number) => void;
  onOpen?: () => void;
  onExit?: () => void;
  onLeave?: () => void;
};

type Walk = {
  fromX: number;
  fromZ: number;
  toX: number;
  toZ: number;
  start: number;
  duration: number;
  heading: number | null;
  stepped: number;
  then?: () => void;
};

const TAU = Math.PI * 2;
const EDGE = 0.13;
const TURN_SPEED = 1.7;

const wrap = (angle: number) => {
  let a = angle % TAU;
  if (a > Math.PI) a -= TAU;
  if (a < -Math.PI) a += TAU;
  return a;
};

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const onLine = (value: number) =>
  Math.abs(((Math.round(value) % G) + G) % G) < 0.01;

const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

export const startExplore = async (
  canvas: HTMLCanvasElement,
  callbacks: Callbacks,
  { reduced = false, yaw: startYaw = 1.9 } = {},
) => {
  const scene = await createScene(canvas, { quality: 0.6 });
  if (!scene) return null;

  const state = defaultState();
  state.depth = STANDING;
  state.fov = 0.85;

  const doors: [number, number][] = [];
  for (let cx = -5; cx <= 4; cx++) {
    for (let cz = -5; cz <= 4; cz++) {
      const x = (cx + 0.5) * G;
      const z = (cz + 0.5) * G;
      const distance = Math.abs(x) + Math.abs(z);
      if (distance >= 10 && distance <= 18) doors.push([x, z]);
    }
  }
  const [doorX, doorZ] = pick(doors);
  const side = Math.random() < 0.5 ? -1 : 1;
  const door = {
    x: doorX,
    z: doorZ,
    side,
    face: doorZ + side * 0.09,
    nodeX: doorX,
    nodeZ: doorZ + side * 2,
  };
  state.door = [door.x, door.z, door.side];

  let x = 0;
  let z = 0;
  let yaw = startYaw;
  let turn = 0;
  let keyTurn = 0;
  let walk: Walk | null = null;
  let opening = false;
  let bump = 0;
  let glitch = 0;
  let dim = 1;
  let dimUntil = 0;
  let entity: {
    x: number;
    z: number;
    born: number;
    gone: number;
  } | null = null;
  let nextEntity = performance.now() + 9000 + Math.random() * 7000;
  let nextFlicker = performance.now() + 8000 + Math.random() * 8000;
  let lastBeacon = 0;
  let drag: {
    x: number;
    y: number;
    last: number;
    moved: boolean;
    id: number;
  } | null = null;
  let raf = 0;
  let stopped = false;
  const start = performance.now();

  const rect = () => canvas.getBoundingClientRect();

  const project = (px: number, py: number, pz: number) => {
    const vx = px - x;
    const vy = py;
    const vz = pz - z;
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);
    const depth = vx * fx + vz * fz;
    if (depth < 0.3) return null;
    const side = -vx * fz + vz * fx;
    const { width, height, left, top } = rect();
    return {
      x: left + width / 2 + (side / (depth * state.fov)) * height,
      y: top + height / 2 - (vy / (depth * state.fov)) * height,
      depth,
    };
  };

  const panOf = (px: number, pz: number) => {
    const dx = px - x;
    const dz = pz - z;
    const length = Math.hypot(dx, dz) || 1;
    const rightX = -Math.cos(yaw);
    const rightZ = Math.sin(yaw);
    return Math.max(-1, Math.min(1, (dx * rightX + dz * rightZ) / length));
  };

  const beginWalk = (
    toX: number,
    toZ: number,
    heading: number | null,
    then?: () => void,
  ) => {
    const distance = Math.hypot(toX - x, toZ - z);
    walk = {
      fromX: x,
      fromZ: z,
      toX,
      toZ,
      start: performance.now(),
      duration: (reduced ? 260 : 620) * Math.max(1, distance / 2),
      heading,
      stepped: 0,
      then,
    };
  };

  const open = () => {
    opening = true;
    const facing = side > 0 ? Math.PI : 0;
    const target = yaw + wrap(facing - yaw);
    const from = yaw;
    const began = performance.now();
    const turnTo = (now: number) => {
      const t = Math.min(1, (now - began) / 450);
      yaw = from + (target - from) * ease(t);
      if (t < 1) {
        requestAnimationFrame(turnTo);
        return;
      }
      callbacks.onOpen?.();
      const openedAt = performance.now();
      const swing = (at: number) => {
        const k = Math.min(1, (at - openedAt) / 1100);
        state.open = ease(k);
        if (k < 1) {
          requestAnimationFrame(swing);
          return;
        }
        beginWalk(door.nodeX, door.nodeZ - side * 1.7, null);
        const whiteAt = performance.now();
        const fadeWhite = (w: number) => {
          const f = Math.min(1, (w - whiteAt) / 950);
          state.white = f * f;
          if (f < 1) requestAnimationFrame(fadeWhite);
          else callbacks.onExit?.();
        };
        requestAnimationFrame(fadeWhite);
      };
      requestAnimationFrame(swing);
    };
    requestAnimationFrame(turnTo);
  };

  const doorHit = (clientX: number, clientY: number) => {
    if ((z - door.face) * side <= 0) return false;
    const distance = Math.hypot(door.nodeX - x, door.nodeZ - z);
    if (distance > 7) return false;
    const corners = [
      project(door.x - 0.6, 2.4 - EYE, door.face),
      project(door.x + 0.6, 2.4 - EYE, door.face),
      project(door.x - 0.6, -EYE, door.face),
      project(door.x + 0.6, -EYE, door.face),
    ];
    if (corners.some((corner) => !corner)) return false;
    const xs = corners.map((corner) => corner!.x);
    const ys = corners.map((corner) => corner!.y);
    const pad = 40;
    return (
      clientX > Math.min(...xs) - pad &&
      clientX < Math.max(...xs) + pad &&
      clientY > Math.min(...ys) - pad &&
      clientY < Math.max(...ys) + pad
    );
  };

  const tryWalk = (angle: number) => {
    const options = [0, 1, 2, 3]
      .map((k) => {
        const heading = (k * Math.PI) / 2;
        return {
          heading,
          dx: Math.round(Math.sin(heading)),
          dz: Math.round(Math.cos(heading)),
          diff: Math.abs(wrap(angle - heading)),
        };
      })
      .sort((a, b) => a.diff - b.diff);
    for (const option of options) {
      if (option.diff > 1.05) break;
      const free = option.dx !== 0 ? onLine(z) : onLine(x);
      if (!free) continue;
      beginWalk(x + option.dx * 2, z + option.dz * 2, option.heading);
      return;
    }
    bump = 1;
    callbacks.onBump?.();
  };

  const click = (clientX: number, clientY: number) => {
    if (walk || opening) return;
    if (doorHit(clientX, clientY)) {
      const atNode =
        Math.abs(x - door.nodeX) < 0.01 && Math.abs(z - door.nodeZ) < 0.01;
      if (atNode) {
        open();
        return;
      }
      if (Math.hypot(door.nodeX - x, door.nodeZ - z) <= 4.1) {
        beginWalk(door.nodeX, door.nodeZ, null, open);
        return;
      }
    }
    const { width, height, left } = rect();
    const offset = Math.atan(
      ((clientX - left - width / 2) / height) * state.fov,
    );
    tryWalk(yaw - offset);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    drag = {
      x: event.clientX,
      y: event.clientY,
      last: event.clientX,
      moved: false,
      id: event.pointerId,
    };
    canvas.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (drag && drag.id === event.pointerId) {
      const dx = event.clientX - drag.x;
      if (drag.moved || Math.hypot(dx, event.clientY - drag.y) > 6) {
        if (!opening) yaw += (event.clientX - drag.last) * 0.0045;
        drag.moved = true;
      }
      drag.last = event.clientX;
      turn = 0;
      return;
    }
    if (event.pointerType !== "mouse") return;
    const { width, left } = rect();
    const fraction = (event.clientX - left) / width;
    if (fraction < EDGE) turn = (1 - fraction / EDGE) * TURN_SPEED;
    else if (fraction > 1 - EDGE)
      turn = -((fraction - (1 - EDGE)) / EDGE) * TURN_SPEED;
    else turn = 0;
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    const wasDrag = drag.moved;
    drag = null;
    if (!wasDrag) click(event.clientX, event.clientY);
  };

  const onPointerLeave = () => {
    turn = 0;
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (opening) return;
    const key = event.key.toLowerCase();
    if (key === "escape") {
      callbacks.onLeave?.();
      return;
    }
    if (key === "arrowleft" || key === "a") keyTurn = TURN_SPEED;
    else if (key === "arrowright" || key === "d") keyTurn = -TURN_SPEED;
    else if (key === "arrowup" || key === "w") {
      if (!walk) {
        const { left, width, top, height } = rect();
        click(left + width / 2, top + height * 0.9);
      }
    } else if (key === "enter" || key === " ") {
      const { left, width, top, height } = rect();
      if (doorHit(left + width / 2, top + height / 2)) {
        click(left + width / 2, top + height / 2);
      }
    } else return;
    event.preventDefault();
  };

  const onKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (["arrowleft", "a", "arrowright", "d"].includes(key)) keyTurn = 0;
  };

  const spawnEntity = (now: number) => {
    if (reduced || walk || opening || entity) return;
    const heading = Math.round(yaw / (Math.PI / 2)) * (Math.PI / 2);
    const dx = Math.round(Math.sin(heading));
    const dz = Math.round(Math.cos(heading));
    if (dx !== 0 ? !onLine(z) : !onLine(x)) return;
    const steps = 3 + Math.floor(Math.random() * 3);
    const ex = x + dx * 2 * steps;
    const ez = z + dz * 2 * steps;
    if (Math.hypot(ex - door.nodeX, ez - door.nodeZ) < 3) return;
    entity = { x: ex, z: ez, born: now, gone: 0 };
    callbacks.onEntity?.(panOf(ex, ez));
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(0.05, (now - (state.time * 1000 + start)) / 1000);
    state.time = (now - start) / 1000;

    if (!opening) yaw += (turn + keyTurn) * dt;

    let bob = 0;
    if (walk) {
      const t = Math.min(1, (now - walk.start) / walk.duration);
      const k = ease(t);
      x = walk.fromX + (walk.toX - walk.fromX) * k;
      z = walk.fromZ + (walk.toZ - walk.fromZ) * k;
      if (!reduced)
        bob = Math.sin(t * Math.PI * 2 * Math.max(1, walk.duration / 620));
      if (walk.heading !== null && !opening) {
        yaw += wrap(walk.heading - yaw) * Math.min(1, dt * 3.2);
      }
      const steps = Math.floor(t * 2 * Math.max(1, walk.duration / 620));
      while (walk.stepped <= steps && t < 1) {
        callbacks.onStep?.(walk.stepped);
        walk.stepped++;
      }
      if (t >= 1) {
        x = walk.toX;
        z = walk.toZ;
        const then = walk.then;
        walk = null;
        then?.();
      }
    }

    if (now > nextFlicker && !opening) {
      dimUntil = now + 700;
      nextFlicker = now + 9000 + Math.random() * 12000;
    }
    if (now < dimUntil) {
      const phase = (dimUntil - now) / 700;
      dim = phase > 0.75 ? 0.35 : phase > 0.55 ? 1 : phase > 0.3 ? 0.5 : 1;
    } else {
      dim = 1;
    }

    if (now > nextEntity) {
      spawnEntity(now);
      nextEntity = now + 11000 + Math.random() * 9000;
    }
    let entityAlpha = 0;
    if (entity) {
      const age = (now - entity.born) / 1000;
      const near = Math.hypot(entity.x - x, entity.z - z) < 4.5;
      if (!entity.gone && (near || age > 4.2)) {
        entity.gone = now;
        glitch = Math.max(glitch, 0.9);
      }
      entityAlpha = entity.gone
        ? now - entity.gone < 90
          ? 0.5
          : 0
        : Math.min(0.96, age / 0.7);
      if (entity.gone && now - entity.gone > 140) entity = null;
    }

    glitch = Math.max(0, glitch - dt * 2.4);
    bump = Math.max(0, bump - dt * 4);

    state.x = x;
    state.z = z;
    state.yaw = yaw + Math.sin(now * 0.05) * bump * 0.03;
    state.pitch = bob * 0.012 - bump * 0.02;
    state.roll = Math.sin(now * 0.0007) * 0.006 + bob * 0.004;
    state.depth = STANDING + Math.abs(bob) * 0.035;
    state.glitch = glitch;
    state.dim = dim;
    state.entity = entity ? [entity.x, entity.z, entityAlpha] : [0, 0, 0];
    scene.draw(state);

    if (now - lastBeacon > 120) {
      lastBeacon = now;
      const sx = door.x;
      const sz = door.z + side * 0.3;
      const distance = Math.hypot(sx - x, sz - z);
      const front = (z - door.face) * side > 0 ? 1 : 0.45;
      const gain = (0.04 + 0.7 * Math.exp(-distance / 7)) * front;
      const signal = Math.max(
        0,
        Math.min(5, Math.round(5.4 * Math.exp(-distance / 11) * front)),
      );
      callbacks.onBeacon?.(gain, panOf(sx, sz), signal);
    }
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("resize", scene.resize);
  raf = requestAnimationFrame(frame);

  return {
    flicker() {
      dimUntil = performance.now() + 700;
    },
    glitch(amount: number) {
      glitch = Math.max(glitch, amount);
    },
    get opening() {
      return opening;
    },
    stop() {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", scene.resize);
      scene.dispose();
    },
  };
};

export type Explore = NonNullable<Awaited<ReturnType<typeof startExplore>>>;
