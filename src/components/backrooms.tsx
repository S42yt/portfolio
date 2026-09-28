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
  playGlassKnock,
  playImpact,
  playLightsOn,
  playPowerOut,
  playShatter,
  playSlabCrunch,
  playThud,
} from "@/lib/backrooms-audio";
import { createRagdoll } from "@/lib/ragdoll";
import { playFallScene } from "@/lib/backrooms-fall";
import { startRoomShader, type RoomShader } from "@/lib/backrooms-shader";
import { createGlass, shatter, voronoi } from "@/lib/glass-crack";

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

const HITS = 5;
const HEAL_MS = 7000;
const SOLID = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "label",
  "summary",
  "video",
  "iframe",
  "img",
  "nav",
  "footer",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "li",
  "[role=button]",
  "[data-aero-trigger]",
  ".panel",
  ".glass",
  ".glass-strong",
  ".chip",
  ".hero-card",
  ".aero-window",
  ".media-frame",
  ".project-card",
  ".aero-sound",
  ".ticker",
].join(", ");

const snapshot = () => {
  const frame = document.createElement("div");
  frame.className = "bk-shard-page";
  const background = document.querySelector("[data-page-bg]");
  const page = document.querySelector<HTMLElement>("[data-page]");
  if (background) frame.appendChild(background.cloneNode(true));
  if (page) {
    const copy = page.cloneNode(true) as HTMLElement;
    copy.style.position = "absolute";
    copy.style.inset = "auto 0 auto 0";
    copy.style.top = `${-window.scrollY}px`;
    const selector = "main > *, main > * > *, main > * > * > *";
    const originals = page.querySelectorAll(selector);
    const copies = copy.querySelectorAll<HTMLElement>(selector);
    originals.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -40 || rect.top > window.innerHeight + 40) {
        copies[index]?.style.setProperty("visibility", "hidden");
      }
    });
    frame.appendChild(copy);
  }
  frame
    .querySelectorAll("canvas, video, iframe, script")
    .forEach((el) => el.remove());
  frame.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  return frame;
};

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
  const glassRef = useRef<HTMLCanvasElement>(null);
  const shardsRef = useRef<HTMLDivElement>(null);
  const fallRef = useRef<HTMLDivElement>(null);
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
    let healTimer = 0;
    let healFinish = 0;
    let preloading: Promise<unknown> | null = null;
    const glass = glassRef.current ? createGlass(glassRef.current) : null;
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
        const r = (Math.random() * 2 - 1) * 1.6;
        const x = (Math.random() * 2 - 1) * 10;
        const y = (Math.random() * 2 - 1) * 6;
        el.style.setProperty("--bk-x", `${x}px`);
        el.style.setProperty("--bk-y", `${y}px`);
        el.style.setProperty("--bk-r", `${r}deg`);
        el.style.translate = `${x}px ${y}px`;
        el.style.rotate = `${r}deg`;
        const roll = Math.random();
        if (roll < 0.2) el.dataset.bk = "drift";
        else if (roll < 0.28) el.dataset.bk = "ghost";
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

    const preload = () => {
      if (preloading) return preloading;
      const portrait = window.matchMedia("(max-aspect-ratio: 4 / 5)").matches;
      preloading = Promise.all([
        loadImage(
          portrait
            ? "/backrooms/level0-portrait.webp"
            : "/backrooms/level0.webp",
        ),
        ...IMAGES.map(loadImage),
        document.fonts?.load('32px "VT323"').catch(() => undefined),
        loadBackroomsAudio(),
      ]);
      return preloading;
    };

    const stopHealing = () => {
      window.clearTimeout(healTimer);
      window.clearTimeout(healFinish);
      root.classList.remove("bk-healing");
    };

    const heal = () => {
      if (busy) return;
      root.classList.add("bk-healing");
      healFinish = window.setTimeout(() => {
        glass?.clear();
        root.classList.remove("bk-glass", "bk-healing");
      }, 1400);
    };

    const knock = (x: number, y: number) => {
      if (!glass || busy) return;
      stopHealing();
      sound = soundEnabled();
      if (sound) unlockAudio();
      const count = glass.hit(x, y);
      root.classList.add("bk-glass");
      root.style.setProperty("--knock", `${1 + count * 1.6}px`);
      if (!reducedMotion.matches) pulse("bk-knock", 380);
      if (sound) preload().then(() => playGlassKnock(count));
      else preload();
      if (count >= HITS) {
        enter();
        return;
      }
      healTimer = window.setTimeout(heal, HEAL_MS);
    };

    const autoKnock = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cx = width * (0.35 + Math.random() * 0.3);
      const cy = height * (0.35 + Math.random() * 0.3);
      for (let i = 0; i < HITS; i++) {
        later(() => {
          if (!root.classList.contains("aero")) return;
          const spread = i === 0 ? 0 : 60 + i * 40;
          const angle = Math.random() * Math.PI * 2;
          knock(
            cx + Math.cos(angle) * spread,
            cy + Math.sin(angle) * spread * 0.7,
          );
        }, i * 420);
      }
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
      stopHealing();
      sound = soundEnabled();
      if (sound) unlockAudio();

      const enterState = () => {
        glass?.clear();
        root.classList.remove("bk-glass", "aero");
        root.classList.add("backrooms", "bk-entering");
        scatter();
        window.dispatchEvent(new Event("resize"));
      };

      if (reducedMotion.matches) {
        await withTimeout(preload(), 3000);
        enterState();
        startShader();
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

      const width = window.innerWidth;
      const height = window.innerHeight;
      const origin = glass?.last() ?? { x: width / 2, y: height / 2 };
      await withTimeout(preload(), 1200);

      if (sound) {
        tapeStop();
        playShatter();
      }
      pulse("bk-flash", 450);
      const host = shardsRef.current;
      const cells = voronoi(glass?.seeds() ?? [], width, height);
      const page = snapshot();

      root.classList.add("bk-shattering");
      setPhase("fall");
      const canvas = document.createElement("canvas");
      canvas.className = "bk-fall";
      fallRef.current?.appendChild(canvas);
      if (sound) playFall(3);
      const falling = playFallScene(canvas, {
        duration: 3000,
        onCeiling: () => {
          if (sound) playSlabCrunch();
        },
        onLand: () => {
          if (sound) playImpact();
          pulse("bk-shake", 600);
        },
      });

      if (host && cells.length) {
        await shatter({
          host,
          cells,
          origin,
          content: () => page.cloneNode(true) as HTMLElement,
          duration: 1150,
        });
      }
      enterState();
      root.classList.remove("bk-shattering");

      const rendered = await falling;
      if (!rendered) {
        await wait(1400);
        if (sound) playImpact();
      }
      canvas.remove();

      setPhase("dark");
      startShader();
      await wait(320);

      setPhase("lights");
      root.classList.add("bk-rising");
      if (sound) {
        playLightsOn();
        setSceneAudio(ambience);
        startMusic();
      }
      await wait(1800);

      setPhase("");
      root.classList.remove("bk-entering", "bk-rising");
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
      window.dispatchEvent(new Event("resize"));
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
        if (root.classList.contains("aero") && !busy) autoKnock();
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
      if (sign?.dataset.bkSign === "decoy") decoyTrap(sign);
      else if (sign) exit();
      else onBackground(event);
    };

    const onBackground = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        !root.classList.contains("aero") ||
        root.classList.contains("backrooms") ||
        root.classList.contains("theme-switching")
      ) {
        return;
      }
      const target = event.target as Element | null;
      if (!target || target.closest(SOLID)) return;
      if (window.getSelection()?.toString()) return;
      knock(event.clientX, event.clientY);
    };

    const onResize = () => {
      glass?.resize();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      stopHealing();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("click", onClick);
      stopBreaking();
      stopShader();
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };
  }, []);

  return (
    <>
      <canvas ref={glassRef} aria-hidden="true" className="bk-glass-cracks" />
      <div ref={shardsRef} aria-hidden="true" className="bk-shards" />

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
        <div ref={fallRef} className="bk-fall-wrap" />
      </div>
    </>
  );
}
