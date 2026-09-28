"use client";

import { useEffect } from "react";
import {
  playGlitch,
  playPowerDown,
  playShimmer,
  soundEnabled,
  startMusic,
  stopMusic,
  unlockAudio,
} from "@/lib/aero-audio";

const STORAGE_KEY = "s42-theme";
const SECRET_WORD = "aero";
const TAPS_NEEDED = 5;
const GLITCH_MS = 360;
const REVEAL_MS = 900;
const LARGE_AREA = 260_000;

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const isOnScreen = (el: Element) => {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

let assetsReady: Promise<void> | null = null;

const loadAssets = () => {
  if (assetsReady) return assetsReady;

  const portrait = window.matchMedia("(max-aspect-ratio: 4 / 5)").matches;
  const images = [
    portrait ? "/aero/meadow-portrait.webp" : "/aero/meadow.webp",
    "/aero/bubble.png",
  ].map((src) => {
    const img = new Image();
    img.src = src;
    return img.decode().catch(() => undefined);
  });
  const fonts = ["400", "600", "700"].map((weight) =>
    document.fonts?.load(`${weight} 16px "Open Sans"`).catch(() => undefined),
  );

  assetsReady = Promise.race([
    Promise.all([...images, ...fonts]).then(() => undefined),
    wait(2500),
  ]).then(() => {
    document.documentElement.classList.add("aero-ready");
  });
  return assetsReady;
};

export default function AeroMode() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers = new Set<number>();
    let busy = false;

    if (root.classList.contains("aero")) loadAssets();

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const glitch = (el: Element) => {
      const rect = el.getBoundingClientRect();
      const name =
        rect.width * rect.height > LARGE_AREA ? "glitching-lg" : "glitching";
      el.classList.remove("glitching", "glitching-lg");
      void (el as HTMLElement).offsetWidth;
      el.classList.add(name);
      later(() => el.classList.remove(name), GLITCH_MS);
    };

    const targets = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-glitch]"));

    const showOverlay = (duration: number) => {
      const overlay = document.createElement("div");
      overlay.className = "glitch-overlay";
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.setProperty("--glitch-duration", `${duration}ms`);
      document.body.appendChild(overlay);
      later(() => overlay.remove(), duration);
    };

    const revealOrigin = () => {
      const logo = document.querySelector("[data-aero-trigger]");
      if (logo && isOnScreen(logo)) {
        const range = document.createRange();
        range.selectNodeContents(logo);
        const rect = range.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    };

    const toggle = async () => {
      if (busy) return;
      busy = true;
      const toAero = !root.classList.contains("aero");

      try {
        if (toAero) sessionStorage.setItem(STORAGE_KEY, "aero");
        else sessionStorage.removeItem(STORAGE_KEY);
      } catch {}

      const sound = soundEnabled();
      if (sound) unlockAudio();

      if (toAero) await loadAssets();

      const apply = () => root.classList.toggle("aero", toAero);
      const playArrival = () => {
        if (!sound) return;
        if (toAero) {
          playShimmer();
          startMusic();
        } else {
          playPowerDown();
        }
      };
      if (!toAero) stopMusic();

      if (reducedMotion.matches) {
        apply();
        playArrival();
        busy = false;
        return;
      }

      const visible = shuffle(targets().filter(isOnScreen));
      if (sound) playGlitch();
      showOverlay(GLITCH_MS + REVEAL_MS);
      visible.forEach((el, index) =>
        later(() => glitch(el), Math.min(index * 25, 140)),
      );
      await wait(GLITCH_MS);

      const { x, y } = revealOrigin();
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      root.style.setProperty("--reveal-x", `${x}px`);
      root.style.setProperty("--reveal-y", `${y}px`);
      root.style.setProperty("--reveal-r", `${Math.ceil(radius)}px`);

      playArrival();

      if (typeof document.startViewTransition === "function") {
        root.classList.add("theme-switching");
        const transition = document.startViewTransition(apply);
        await transition.finished.catch(() => undefined);
        root.classList.remove("theme-switching");
      } else {
        apply();
        await wait(REVEAL_MS);
      }

      shuffle(targets().filter(isOnScreen))
        .slice(0, 3)
        .forEach((el, index) => later(() => glitch(el), index * 110));
      busy = false;
    };

    const tease = () => {
      const canTease =
        !busy &&
        !root.classList.contains("aero") &&
        !reducedMotion.matches &&
        document.visibilityState === "visible";

      if (canTease) {
        const pool = targets()
          .filter(isOnScreen)
          .filter((el) => !el.querySelector("[data-glitch]"));
        const el = pool[Math.floor(Math.random() * pool.length)];
        if (el) {
          glitch(el);
          later(() => el.classList.add("aero"), GLITCH_MS * 0.4);
          later(() => {
            glitch(el);
            later(() => el.classList.remove("aero"), GLITCH_MS * 0.4);
          }, 1400);
        }
      }

      later(tease, 18000 + Math.random() * 22000);
    };

    let typed = "";
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key.length !== 1 || event.ctrlKey || event.metaKey) return;

      typed = (typed + event.key.toLowerCase()).slice(-SECRET_WORD.length);
      if (typed.endsWith(SECRET_WORD.slice(0, 2))) loadAssets();
      if (typed === SECRET_WORD) {
        typed = "";
        toggle();
      }
    };

    let taps = 0;
    let tapReset = 0;
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest(
        "[data-aero-trigger]",
      );
      if (!trigger) return;

      taps++;
      window.clearTimeout(tapReset);
      tapReset = window.setTimeout(() => (taps = 0), 1500);

      if (taps === 2) loadAssets();
      if (taps >= TAPS_NEEDED) {
        taps = 0;
        toggle();
      } else if (taps >= 2 && !reducedMotion.matches) {
        glitch(trigger);
      }
    };

    console.log(
      '%c🫧 psst... type "aero"',
      "color:#1a9be0;font-weight:700;font-size:13px",
    );

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    later(tease, 9000 + Math.random() * 6000);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
      window.clearTimeout(tapReset);
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };
  }, []);

  return null;
}
