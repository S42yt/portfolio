"use client";

import { CSSProperties, useEffect, useRef } from "react";
import {
  playGlitch,
  playShimmer,
  setSceneAudio,
  soundEnabled,
  startMusic,
  stopMusic,
  tapeStop,
  unlockAudio,
} from "@/lib/aero-audio";
import {
  backroomsAmbience,
  loadBackroomsAudio,
  playEntityCue,
  playFall,
  playImpact,
  playLightsOn,
  playMirrorBreak,
  playPowerOut,
  playThud,
  playWallCrack,
  playWallTouch,
} from "@/lib/backrooms-audio";
import { createRagdoll } from "@/lib/ragdoll";
import { startRoomShader, type RoomShader } from "@/lib/backrooms-shader";

const SECRET_WORD = "noclip";
const SCRAMBLE = "█▓▒░#@%&?!/\\|<>";
const MESSAGES = [
  "LEVEL 0",
  "IT CAN HEAR YOU",
  "NO EXIT",
  "DON'T LOOK BACK",
  "YOU'VE BEEN HERE BEFORE",
  "THE HUM NEVER STOPS",
  "KEEP MOVING",
];
const IMAGES = [
  "/backrooms/wall.webp",
  "/backrooms/wall-rot.webp",
  "/backrooms/carpet.webp",
  "/backrooms/ceiling.webp",
  "/backrooms/noise.png",
];

const BODY_SELECTOR = [
  "main [data-glitch]",
  "main .chip",
  "main h2",
  "main .media-frame",
  "main .btn",
  "main .project-card",
  "main .eyebrow",
  "footer [data-glitch]",
  "nav ul",
].join(", ");

const seeded = (start: number) => {
  let seed = start;
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
};

const CRACKS = (() => {
  const rand = seeded(7);
  const cx = 52;
  const cy = 46;
  const paths: string[] = [];
  for (let i = 0; i < 13; i++) {
    let angle = (i / 13) * Math.PI * 2 + rand() * 0.35;
    let x = cx;
    let y = cy;
    let d = `M${cx} ${cy}`;
    for (let travelled = 0; travelled < 95; ) {
      const segment = 4 + rand() * 9;
      angle += (rand() - 0.5) * 0.5;
      x += Math.cos(angle) * segment;
      y += Math.sin(angle) * segment * 0.9;
      travelled += segment;
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
      if (x < -5 || x > 105 || y < -5 || y > 105) break;
    }
    paths.push(d);
  }
  for (const radius of [5, 11, 19]) {
    let d = "";
    for (let k = 0; k <= 14; k++) {
      const angle = (k / 14) * Math.PI * 2;
      const r = radius * (0.8 + rand() * 0.4);
      d += `${k ? "L" : "M"}${(cx + Math.cos(angle) * r).toFixed(1)} ${(
        cy +
        Math.sin(angle) * r * 0.9
      ).toFixed(1)} `;
    }
    paths.push(d.trim());
  }
  return paths;
})();

const DEBRIS = (() => {
  const rand = seeded(19);
  return Array.from({ length: 12 }, (_, i) => ({
    "--dx": `${(rand() * 2 - 1) * 55}vmax`,
    "--dy": `${(rand() * 2 - 1) * 55}vmax`,
    "--rx": (rand() * 2 - 1).toFixed(2),
    "--spin": `${Math.round(360 + rand() * 720)}deg`,
    "--delay": `${(0.15 + rand() * 1.1).toFixed(2)}s`,
    "--size": `${Math.round(50 + rand() * 90)}px`,
    "--tex":
      i % 3 === 0
        ? "linear-gradient(135deg, rgba(235, 248, 255, 0.85), rgba(150, 205, 240, 0.25))"
        : i % 3 === 1
          ? "url(/backrooms/wall.webp)"
          : "url(/backrooms/ceiling.webp)",
    "--shape":
      i % 3 === 0
        ? "polygon(50% 0, 100% 70%, 20% 100%)"
        : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  }));
})();

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const withTimeout = (promise: Promise<unknown>, ms: number) =>
  Promise.race([promise, wait(ms)]);

const loadImage = (src: string) => {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => undefined);
};

const pad = (value: number) => String(value).padStart(2, "0");

export default function Backrooms() {
  const introRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const messageRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const intro = introRef.current;
    const timers = new Set<number>();
    const ambience = backroomsAmbience();
    let busy = false;
    let breaking = 0;
    let events = 0;
    let clock = 0;
    let shader: RoomShader | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let bubbleTimer = 0;
    let exitTimer = 0;
    let flees = 0;
    let noclipTries = 0;
    const ragdoll = createRagdoll({
      selector: BODY_SELECTOR,
      onImpact: (speed, pan) => {
        if (sound) playThud(speed, pan);
      },
    });
    let sound = false;

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const setPhase = (phase: string) => {
      if (intro) intro.dataset.phase = phase;
    };

    const glitch = (el: Element) => {
      el.classList.remove("glitching");
      void (el as HTMLElement).offsetWidth;
      el.classList.add("glitching");
      later(() => el.classList.remove("glitching"), 360);
    };

    const onScreen = (el: Element) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const glitchTargets = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-glitch]"));

    const scatter = () => {
      glitchTargets().forEach((el) => {
        const r = (Math.random() * 2 - 1) * 3.5;
        const x = (Math.random() * 2 - 1) * 28;
        const y = (Math.random() * 2 - 1) * 14;
        el.style.setProperty("--bk-x", `${x}px`);
        el.style.setProperty("--bk-y", `${y}px`);
        el.style.setProperty("--bk-r", `${r}deg`);
        el.style.translate = `${x}px ${y}px`;
        el.style.rotate = `${r}deg`;
        const roll = Math.random();
        if (roll < 0.3) el.dataset.bk = "drift";
        else if (roll < 0.42) el.dataset.bk = "ghost";
      });
    };

    const unscatter = () => {
      glitchTargets().forEach((el) => {
        el.style.removeProperty("--bk-x");
        el.style.removeProperty("--bk-y");
        el.style.removeProperty("--bk-r");
        el.style.removeProperty("translate");
        el.style.removeProperty("rotate");
        delete el.dataset.bk;
      });
    };

    const textTargets = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          "main h1, main h2, main h3, main p, main li, main a, main span",
        ),
      ).filter((el) => {
        const node = el.firstChild;
        return (
          el.childNodes.length === 1 &&
          node?.nodeType === Node.TEXT_NODE &&
          (node.nodeValue?.trim().length ?? 0) > 2 &&
          (node.nodeValue?.length ?? 0) < 160 &&
          onScreen(el)
        );
      });

    const scramble = (el: HTMLElement, message?: string) => {
      const node = el.firstChild as Text | null;
      if (!node || el.dataset.scrambling) return;
      const original = node.nodeValue ?? "";
      el.dataset.scrambling = "1";
      let frame = 0;
      const frames = message ? 14 : 8;
      const tick = () => {
        frame++;
        if (frame >= frames) {
          node.nodeValue = original;
          delete el.dataset.scrambling;
          return;
        }
        if (message && frame > 3 && frame < frames - 2) {
          node.nodeValue = message;
        } else {
          node.nodeValue = original.replace(/\S/g, (char) =>
            Math.random() < 0.45
              ? SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
              : char,
          );
        }
        later(tick, message ? 110 : 70);
      };
      tick();
    };

    const scrambleSome = (count: number) => {
      const pool = textTargets();
      for (let i = 0; i < count && pool.length; i++) {
        const el = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
        const heading = /^H[1-3]$/.test(el.tagName);
        scramble(
          el,
          heading && Math.random() < 0.45
            ? MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
            : undefined,
        );
      }
    };

    const pulse = (className: string, ms: number) => {
      root.classList.remove(className);
      void root.offsetWidth;
      root.classList.add(className);
      later(() => root.classList.remove(className), ms);
    };

    const startShader = () => {
      const room = roomRef.current;
      if (!room || shader) return;
      canvas = document.createElement("canvas");
      canvas.className = "bk-shader";
      room.appendChild(canvas);
      shader = startRoomShader(canvas, !reducedMotion.matches);
    };

    const stopShader = () => {
      shader?.stop();
      shader = null;
      canvas?.remove();
      canvas = null;
    };

    const runEvent = () => {
      if (!root.classList.contains("backrooms")) return;
      const roll = Math.random();
      if (roll < 0.4) {
        pulse("bk-flicker", 1100);
        shader?.flicker();
        if (sound) ambience.buzz();
        glitchTargets()
          .filter(onScreen)
          .slice(0, 2)
          .forEach((el) => glitch(el));
      } else {
        const seen = shader?.appear();
        if (seen) {
          if (sound) playEntityCue(seen.kind, seen.pan);
          later(() => shader?.glitch(0.5), seen.kind === "run" ? 100 : 900);
          later(() => scrambleSome(seen.kind === "stand" ? 3 : 1), 1200);
          if (seen.kind === "stand") later(() => pulse("bk-shake", 500), 1300);
        }
      }
      events = window.setTimeout(runEvent, 5000 + Math.random() * 6000);
    };

    const signs = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-bk-sign]"));

    const placeSign = (sign: HTMLElement, avoid?: { x: number; y: number }) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let left = 0;
      let top = 0;
      for (let attempt = 0; attempt < 12; attempt++) {
        left = width * (0.06 + Math.random() * 0.74);
        top = height * (0.18 + Math.random() * 0.6);
        if (!avoid || Math.hypot(left - avoid.x, top - avoid.y) > 320) break;
      }
      sign.style.left = `${left}px`;
      sign.style.top = `${top}px`;
    };

    const revealExits = () => {
      if (!root.classList.contains("backrooms")) return;
      flees = 0;
      signs().forEach((sign) => {
        placeSign(sign);
        sign.dataset.shown = "";
      });
    };

    const hideExits = () => {
      window.clearTimeout(exitTimer);
      signs().forEach((sign) => delete sign.dataset.shown);
    };

    const flashMessage = (text: string) => {
      const message = messageRef.current;
      if (!message) return;
      message.textContent = text;
      message.classList.remove("bk-hud-msg-show");
      void message.offsetWidth;
      message.classList.add("bk-hud-msg-show");
    };

    const decoyTrap = (sign: HTMLElement) => {
      delete sign.dataset.shown;
      pulse("bk-flicker", 1100);
      pulse("bk-shake", 500);
      shader?.flicker();
      shader?.glitch(1);
      if (sound) ambience.buzz();
      const seen = shader?.appear("stand");
      if (seen && sound) playEntityCue(seen.kind, seen.pan);
      scrambleSome(3);
      flashMessage("WRONG WAY");
      const real = signs().find((el) => el.dataset.bkSign === "real");
      if (real?.dataset.shown !== undefined) {
        glitch(real);
        placeSign(real);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (busy || flees >= 3 || !root.classList.contains("backrooms")) return;
      const real = signs().find((el) => el.dataset.bkSign === "real");
      if (!real || real.dataset.shown === undefined) return;
      const rect = real.getBoundingClientRect();
      const distance = Math.hypot(
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
      );
      if (distance > 130) return;
      flees++;
      glitch(real);
      shader?.glitch(0.6);
      if (sound) playGlitch();
      placeSign(real, { x: event.clientX, y: event.clientY });
    };

    const startBreaking = () => {
      ragdoll.enable();
      noclipTries = 0;
      exitTimer = window.setTimeout(
        revealExits,
        reducedMotion.matches ? 8000 : 20000 + Math.random() * 10000,
      );
      if (!reducedMotion.matches) {
        events = window.setTimeout(runEvent, 3000);
        const loopScramble = () => {
          scrambleSome(1 + Math.floor(Math.random() * 2));
          breaking = window.setTimeout(
            loopScramble,
            2200 + Math.random() * 2800,
          );
        };
        breaking = window.setTimeout(loopScramble, 1500);
      }
      const start = Date.now() - (47 * 60 + 13) * 1000;
      clock = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        const frames = Math.floor((Date.now() % 1000) / 40);
        if (timecodeRef.current) {
          timecodeRef.current.textContent = `${pad(Math.floor(elapsed / 3600))}:${pad(
            Math.floor(elapsed / 60) % 60,
          )}:${pad(elapsed % 60)}:${pad(frames)}`;
        }
      }, 120);
    };

    const stopBreaking = () => {
      ragdoll.disable();
      hideExits();
      window.clearTimeout(events);
      window.clearTimeout(breaking);
      window.clearInterval(clock);
    };

    const enter = async () => {
      if (
        busy ||
        !root.classList.contains("aero") ||
        root.classList.contains("backrooms") ||
        root.classList.contains("theme-switching")
      ) {
        return;
      }
      busy = true;
      sound = soundEnabled();
      if (sound) unlockAudio();

      const portrait = window.matchMedia("(max-aspect-ratio: 4 / 5)").matches;
      const assets = Promise.all([
        loadImage(
          portrait
            ? "/backrooms/level0-portrait.webp"
            : "/backrooms/level0.webp",
        ),
        ...IMAGES.map(loadImage),
        document.fonts?.load('32px "VT323"').catch(() => undefined),
        sound ? loadBackroomsAudio() : Promise.resolve(),
      ]);

      const enterState = () => {
        root.classList.remove("bk-wall", "bk-cracked", "aero");
        root.classList.add("backrooms", "bk-entering");
        setPhase("pre");
        scatter();
      };

      if (reducedMotion.matches) {
        await withTimeout(assets, 3000);
        enterState();
        startShader();
        setPhase("");
        root.classList.remove("bk-entering");
        if (sound) {
          tapeStop();
          setSceneAudio(ambience);
          startMusic();
        }
        startBreaking();
        busy = false;
        return;
      }

      if (sound) {
        playWallTouch();
        tapeStop();
      }
      root.classList.add("bk-wall");
      await wait(550);
      root.classList.add("bk-cracked");
      if (sound) playWallCrack();
      await wait(800);
      await withTimeout(assets, 2500);

      if (typeof document.startViewTransition === "function") {
        root.classList.add("bk-vt");
        const transition = document.startViewTransition(enterState);
        await transition.ready.catch(() => undefined);
        if (sound) later(playMirrorBreak, 520);
        await transition.finished.catch(() => undefined);
        root.classList.remove("bk-vt");
      } else {
        if (sound) playMirrorBreak();
        enterState();
      }

      setPhase("fall");
      const approach = intro
        ?.querySelector(".bk-shaft-end")
        ?.getAnimations()[0];
      await withTimeout(
        approach?.ready.catch(() => undefined) ?? wait(0),
        1500,
      );
      if (sound) playFall();
      await withTimeout(
        approach?.finished.catch(() => undefined) ?? wait(1850),
        2600,
      );

      setPhase("dark");
      startShader();
      if (sound) playImpact();
      pulse("bk-shake", 600);
      await wait(380);

      setPhase("lights");
      if (sound) {
        playLightsOn();
        setSceneAudio(ambience);
        startMusic();
      }
      await wait(1700);

      setPhase("");
      root.classList.remove("bk-entering");
      startBreaking();
      busy = false;
    };

    const exit = async () => {
      if (busy || !root.classList.contains("backrooms")) return;
      busy = true;
      sound = soundEnabled();
      if (sound) unlockAudio();
      stopBreaking();

      if (!reducedMotion.matches) {
        setPhase("lightsoff");
        if (sound) playPowerOut();
        stopMusic(1.2);
        await wait(1300);
      } else {
        stopMusic(0.6);
      }

      root.classList.remove("backrooms");
      unscatter();
      stopShader();
      root.classList.add("aero");
      setSceneAudio(null);
      setPhase("wake");
      if (sound) {
        playGlitch();
        playShimmer();
        startMusic();
      }
      glitchTargets()
        .filter(onScreen)
        .slice(0, 4)
        .forEach((el, index) => later(() => glitch(el), 200 + index * 120));
      await wait(reducedMotion.matches ? 300 : 1400);
      setPhase("");
      busy = false;
    };

    let typed = "";
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key.length !== 1 || event.ctrlKey || event.metaKey) return;
      typed = (typed + event.key.toLowerCase()).slice(-SECRET_WORD.length);
      if (typed !== SECRET_WORD) return;
      typed = "";
      if (!root.classList.contains("backrooms")) {
        enter();
        return;
      }
      noclipTries++;
      if (noclipTries >= 3) {
        exit();
        return;
      }
      flashMessage("NOCLIP FAILED");
      shader?.glitch(1);
      if (sound) playGlitch();
      scrambleSome(2);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const sign = target?.closest<HTMLElement>("[data-bk-sign]");
      if (target?.closest("[data-noclip]")) enter();
      else if (sign?.dataset.bkSign === "decoy") decoyTrap(sign);
      else if (sign) exit();
    };

    const bubble = bubbleRef.current;
    const spawnBubble = (delay: number) => {
      bubbleTimer = window.setTimeout(() => {
        const canSpawn =
          bubble &&
          !busy &&
          !document.hidden &&
          root.classList.contains("aero") &&
          !root.classList.contains("backrooms") &&
          !root.classList.contains("theme-switching");
        if (canSpawn) {
          const duration = 9 + Math.random() * 6;
          bubble.style.setProperty("--size", `${30 + Math.random() * 26}px`);
          bubble.style.setProperty("--x", `${6 + Math.random() * 82}vw`);
          bubble.style.setProperty("--y", `${45 + Math.random() * 45}vh`);
          bubble.style.setProperty(
            "--drift",
            `${(Math.random() * 2 - 1) * 10}vw`,
          );
          bubble.style.setProperty("--dur", `${duration}s`);
          bubble.removeAttribute("data-live");
          void bubble.offsetWidth;
          bubble.setAttribute("data-live", "");
          later(() => bubble.removeAttribute("data-live"), duration * 1000);
        }
        spawnBubble(25000 + Math.random() * 45000);
      }, delay);
    };
    spawnBubble(12000 + Math.random() * 18000);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("click", onClick);
      stopBreaking();
      stopShader();
      window.clearTimeout(bubbleTimer);
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };
  }, []);

  return (
    <>
      <button
        ref={bubbleRef}
        type="button"
        data-noclip
        aria-label="A strange bubble"
        className="bk-bubble"
      />

      <svg
        aria-hidden="true"
        className="bk-cracks"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {CRACKS.map((d, index) => (
          <path
            key={index}
            d={d}
            pathLength={1}
            style={{ "--i": index } as CSSProperties}
          />
        ))}
      </svg>

      <div ref={roomRef} aria-hidden="true" className="bk-room" />

      <div aria-hidden="true" className="bk-static" />
      <div aria-hidden="true" className="bk-lights" />

      <div aria-hidden="true" className="bk-hud">
        <span className="bk-hud-rec">
          <span className="bk-hud-dot" /> REC
        </span>
        <span className="bk-hud-level">LEVEL 0</span>
        <span className="bk-hud-time" ref={timecodeRef}>
          00:47:13:00
        </span>
        <span className="bk-hud-play">PLAY ▶ &nbsp;SP</span>
        <span className="bk-hud-msg" ref={messageRef} />
      </div>

      {["real", "decoy", "decoy"].map((kind, index) => (
        <button
          key={index}
          type="button"
          data-bk-sign={kind}
          className="bk-exit"
        >
          <span aria-hidden="true">←</span> EXIT
        </button>
      ))}

      <div ref={introRef} aria-hidden="true" className="bk-intro" data-phase="">
        <div className="bk-shaft">
          <div className="bk-tube">
            <div className="bk-face bk-face-l" />
            <div className="bk-face bk-face-r" />
            <div className="bk-face bk-face-t" />
            <div className="bk-face bk-face-b" />
            <div className="bk-shaft-end" />
            {DEBRIS.map((style, index) => (
              <span
                key={index}
                className="bk-debris"
                style={style as CSSProperties}
              />
            ))}
          </div>
          <div className="bk-speed" />
        </div>
      </div>

      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id="bk-ripple">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.02"
            numOctaves="2"
            seed="4"
          >
            <animate
              attributeName="baseFrequency"
              dur="1.2s"
              values="0.008 0.02;0.012 0.03;0.008 0.02"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="14" />
        </filter>
      </svg>
    </>
  );
}
