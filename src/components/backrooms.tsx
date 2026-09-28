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
  createBeacon,
  playBump,
  playDoorOpen,
  playLightsOn,
  playScare,
  playShatter,
  playStep,
  playUnshatter,
  playSlabCrunch,
  playThud,
} from "@/lib/backrooms-audio";
import { createRagdoll } from "@/lib/ragdoll";
import { playFallScene } from "@/lib/backrooms-fall";
import { startExplore, type Explore } from "@/lib/backrooms-explore";
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
const STORAGE_KEY = "s42-bk";
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
  const exploreRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLSpanElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
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
    let noclipTries = 0;
    let explore: Explore | null = null;
    let exploreCanvas: HTMLCanvasElement | null = null;
    let exploring = false;
    let scared = false;
    let enteredAt = 0;
    let looking = 0;
    const beacon = createBeacon();
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
      if (exploring) {
        if (roll < 0.35) {
          pulse("bk-flicker", 1100);
          explore?.flicker();
          if (sound) ambience.buzz();
        }
      } else if (roll < 0.4) {
        pulse("bk-flicker", 1100);
        shader?.flicker();
        if (sound) ambience.buzz();
        glitchTargets()
          .filter(onScreen)
          .slice(0, 2)
          .forEach((el) => glitch(el));
      } else if (
        !scared &&
        !reducedMotion.matches &&
        Date.now() - enteredAt > 40000 &&
        roll > 0.88
      ) {
        if (shader?.appear("scare")) scare();
      } else {
        const seen = shader?.appear();
        if (seen && seen.kind !== "scare") {
          if (sound) playEntityCue(seen.kind, seen.pan);
          later(() => shader?.glitch(0.5), seen.kind === "run" ? 100 : 900);
          later(() => scrambleSome(seen.kind === "stand" ? 3 : 1), 1200);
          if (seen.kind === "stand") later(() => pulse("bk-shake", 500), 1300);
        }
      }
      events = window.setTimeout(runEvent, 5000 + Math.random() * 6000);
    };

    const scare = () => {
      scared = true;
      if (sound) playScare();
      pulse("bk-scare", 650);
      pulse("bk-shake", 500);
      if (!exploring) later(() => scrambleSome(3), 200);
    };

    const flashMessage = (text: string) => {
      const message = messageRef.current;
      if (!message) return;
      message.textContent = text;
      message.classList.remove("bk-hud-msg-show");
      void message.offsetWidth;
      message.classList.add("bk-hud-msg-show");
    };

    const startBreaking = () => {
      ragdoll.enable();
      noclipTries = 0;
      enteredAt = Date.now();
      later(() => {
        if (!root.classList.contains("backrooms") || exploring) return;
        flashMessage("FIND THE EXIT");
        root.classList.add("bk-wander-hint");
        later(() => root.classList.remove("bk-wander-hint"), 7000);
      }, 9000);
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
      root.classList.remove("bk-wander-hint");
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

    const remember = (inside: boolean) => {
      try {
        if (inside) sessionStorage.setItem(STORAGE_KEY, "1");
        else sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
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
        remember(true);
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

    const closeExplore = () => {
      exploring = false;
      explore?.stop();
      explore = null;
      exploreCanvas?.remove();
      exploreCanvas = null;
      beacon.stop();
      root.classList.remove(
        "bk-exploring",
        "bk-opening",
        "bk-pan-left",
        "bk-pan-right",
      );
    };

    const exit = async (viaDoor = false) => {
      if (busy || !root.classList.contains("backrooms")) return;
      busy = true;
      sound = soundEnabled();
      if (sound) unlockAudio();
      stopBreaking();
      const reduced = reducedMotion.matches;

      if (!viaDoor) {
        stopMusic(reduced ? 0.6 : 1.2);
        if (!reduced) {
          shader?.glitch(1);
          explore?.glitch(1);
          pulse("bk-flicker", 1100);
          if (sound) playGlitch();
          await wait(450);
          setPhase("lightfade");
          await wait(700);
        }
      }
      setPhase("light");

      closeExplore();
      await withTimeout(
        Promise.all([
          loadImage(
            window.matchMedia("(max-aspect-ratio: 4 / 5)").matches
              ? "/aero/meadow-portrait.webp"
              : "/aero/meadow.webp",
          ),
          loadImage("/aero/bubble.png"),
        ]),
        1200,
      );
      root.classList.remove("backrooms", "bk-bg-hover");
      remember(false);
      roomRef.current?.style.removeProperty("translate");
      unscatter();
      stopShader();
      root.classList.add("aero");
      window.dispatchEvent(new Event("resize"));
      setSceneAudio(null);

      if (reduced) {
        setPhase("wake");
        if (sound) {
          playShimmer();
          startMusic();
        }
        await wait(300);
        setPhase("");
        busy = false;
        return;
      }

      await wait(120);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const host = shardsRef.current;
      const cells = voronoi(glass?.seeds() ?? [], width, height);
      const page = snapshot();
      if (sound) playUnshatter(1.3);
      if (host && cells.length) {
        await shatter({
          host,
          cells,
          origin: { x: width / 2, y: height / 2 },
          content: () => page.cloneNode(true) as HTMLElement,
          duration: 1300,
          reverse: true,
        });
      }
      setPhase("");
      pulse("bk-healed", 1400);
      if (sound) {
        playShimmer();
        startMusic();
      }
      glitchTargets()
        .filter(onScreen)
        .slice(0, 3)
        .forEach((el, index) => later(() => glitch(el), 350 + index * 140));
      busy = false;
    };

    const leaveExplore = () => {
      if (!exploring || explore?.opening || busy) return;
      closeExplore();
      shader?.pause(false);
      shader?.glitch(0.9);
      pulse("bk-flicker", 1100);
      if (sound) playGlitch();
    };

    const wander = async () => {
      if (
        busy ||
        exploring ||
        !root.classList.contains("backrooms") ||
        root.classList.contains("bk-entering")
      ) {
        return;
      }
      const host = exploreRef.current;
      if (!host) return;
      exploring = true;
      sound = soundEnabled();
      if (sound) unlockAudio();
      root.classList.remove("bk-wander-hint");
      const view = document.createElement("canvas");
      view.className = "bk-explore";
      host.appendChild(view);
      exploreCanvas = view;
      root.classList.add("bk-exploring");
      pulse("bk-flicker", 1100);
      shader?.glitch(1);
      if (sound) playGlitch();

      const started = await startExplore(
        view,
        {
          onStep: (index) => {
            if (sound) playStep(index);
          },
          onBump: () => {
            if (sound) playBump();
          },
          onBeacon: (gain, pan, signal) => {
            if (sound) beacon.set(gain, pan);
            if (signalRef.current) {
              signalRef.current.dataset.level = String(signal);
            }
          },
          onEntity: (pan) => {
            if (sound) playEntityCue("stand", pan);
          },
          onScare: scare,
          onPan: (direction) => {
            root.classList.toggle("bk-pan-left", direction < 0);
            root.classList.toggle("bk-pan-right", direction > 0);
          },
          onOpen: () => {
            root.classList.add("bk-opening");
            if (sound) playDoorOpen();
            stopMusic(1.4);
            beacon.stop();
          },
          onExit: () => {
            exit(true);
          },
          onLeave: leaveExplore,
        },
        { reduced: reducedMotion.matches },
      );

      if (!started || !exploring || exploreCanvas !== view) {
        started?.stop();
        if (exploreCanvas === view) closeExplore();
        return;
      }
      explore = started;
      view.dataset.ready = "true";
      shader?.pause(true);
      if (sound) beacon.start();
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
        exit(false);
        return;
      }
      flashMessage("NOCLIP FAILED");
      shader?.glitch(1);
      if (sound) playGlitch();
      scrambleSome(2);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (root.classList.contains("backrooms")) {
        if (target?.closest("[data-bk-return]")) leaveExplore();
        else if (
          !exploring &&
          event.button === 0 &&
          target &&
          !target.closest(`${SOLID}, ${BODY_SELECTOR}, .bk-explore`) &&
          !window.getSelection()?.toString()
        ) {
          wander();
        }
        return;
      }
      onBackground(event);
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

    const onPointerMove = (event: PointerEvent) => {
      if (!root.classList.contains("backrooms") || exploring || busy) {
        root.classList.remove("bk-bg-hover");
        return;
      }
      const { clientX, clientY } = event;
      const target = event.target as Element | null;
      const empty =
        event.pointerType === "mouse" &&
        !!target &&
        !root.classList.contains("bk-grabbing") &&
        !target.closest(`${SOLID}, ${BODY_SELECTOR}`);
      root.classList.toggle("bk-bg-hover", empty);
      if (empty && tagRef.current) {
        tagRef.current.style.translate = `${clientX}px ${clientY}px`;
        tagRef.current.dataset.flip = String(clientX > window.innerWidth - 180);
      }
      if (looking || reducedMotion.matches) return;
      looking = requestAnimationFrame(() => {
        looking = 0;
        const room = roomRef.current;
        if (!room) return;
        const lx = clientX / window.innerWidth - 0.5;
        const ly = clientY / window.innerHeight - 0.5;
        room.style.translate = `${(-lx * 2.4).toFixed(2)}% ${(-ly * 1.4).toFixed(2)}%`;
      });
    };

    const restore = async () => {
      busy = true;
      remember(true);
      scatter();
      startShader();
      window.dispatchEvent(new Event("resize"));
      if (!reducedMotion.matches) {
        setPhase("lights");
        root.classList.add("bk-rising");
        await wait(1800);
        setPhase("");
        root.classList.remove("bk-rising");
      }
      startBreaking();
      busy = false;
      later(() => flashMessage("YOU NEVER LEFT"), 400);

      const wake = (event: Event) => {
        const target = event.target as Element | null;
        if (target?.closest(".aero-sound")) return;
        window.removeEventListener("pointerdown", wake);
        window.removeEventListener("keydown", wake);
        sound = soundEnabled();
        if (!sound || !root.classList.contains("backrooms")) return;
        unlockAudio();
        preload().then(() => {
          if (!root.classList.contains("backrooms")) return;
          setSceneAudio(ambience);
          startMusic();
        });
      };
      window.addEventListener("pointerdown", wake);
      window.addEventListener("keydown", wake);
    };

    if (root.classList.contains("backrooms")) restore();

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(looking);
      stopHealing();
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
      stopBreaking();
      closeExplore();
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
        <span className="bk-edge bk-edge-left">‹</span>
        <span className="bk-edge bk-edge-right">›</span>
        <span className="bk-room-hint">
          <span className="bk-hint-mouse">◀ CLICK THE ROOM TO WANDER ▶</span>
          <span className="bk-hint-touch">◀ TAP THE ROOM TO WANDER ▶</span>
        </span>
      </div>

      <div ref={exploreRef} className="bk-explore-wrap" />

      <div aria-hidden="true" className="bk-explore-hud">
        <span className="bk-signal" ref={signalRef} data-level="0">
          SIGNAL <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="bk-hint">
          ◀ EDGES / DRAG TO LOOK ▶ · CLICK TO WALK · ESC
        </span>
      </div>

      <span ref={tagRef} aria-hidden="true" className="bk-tag">
        ▸ WALK IN
      </span>
      <button type="button" data-bk-return className="bk-return">
        ◂ PAGES
      </button>

      <div ref={introRef} aria-hidden="true" className="bk-intro" data-phase="">
        <div ref={fallRef} className="bk-fall-wrap" />
      </div>
    </>
  );
}
