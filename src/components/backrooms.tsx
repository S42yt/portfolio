"use client";

import { useEffect, useRef } from "react";
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
  playWallTouch,
} from "@/lib/backrooms-audio";
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
  "/backrooms/ceiling.webp",
  "/backrooms/noise.png",
];

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
  const timecodeRef = useRef<HTMLSpanElement>(null);

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
        el.style.setProperty("--bk-x", `${(Math.random() * 2 - 1) * 28}px`);
        el.style.setProperty("--bk-y", `${(Math.random() * 2 - 1) * 14}px`);
        el.style.setProperty("--bk-r", `${r}deg`);
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

    const startBreaking = () => {
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
        root.classList.remove("bk-wall", "aero");
        root.classList.add("backrooms", "bk-entering");
        setPhase("fall");
        scatter();
        startShader();
      };

      if (reducedMotion.matches) {
        await withTimeout(assets, 3000);
        enterState();
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
      await wait(1150);
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

      if (sound) playFall();
      await wait(1150);

      setPhase("dark");
      if (sound) playImpact();
      pulse("bk-shake", 600);
      await wait(480);

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
      if (root.classList.contains("backrooms")) exit();
      else enter();
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest("[data-noclip]")) enter();
      else if (target?.closest("[data-bk-exit]")) exit();
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
      stopBreaking();
      stopShader();
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };
  }, []);

  return (
    <>
      <button
        type="button"
        data-noclip
        aria-label="A strange bubble"
        className="bk-bubble"
      />

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
      </div>

      <button type="button" data-bk-exit className="bk-exit">
        <span aria-hidden="true">←</span> EXIT
      </button>

      <div
        ref={introRef}
        aria-hidden="true"
        className="bk-intro"
        data-phase=""
      />

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
