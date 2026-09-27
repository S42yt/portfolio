"use client";

import { useEffect } from "react";

const STORAGE_KEY = "s42-theme";
const SECRET_WORD = "aero";
const TAPS_NEEDED = 5;
const GLITCH_MS = 460;

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const depth = (el: Element) => {
  let count = 0;
  for (let node = el.parentElement; node; node = node.parentElement) count++;
  return count;
};

const isOnScreen = (el: Element) => {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
};

export default function AeroMode() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers = new Set<number>();
    let busy = false;

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const glitch = (el: Element) => {
      el.classList.remove("glitching");
      void (el as HTMLElement).offsetWidth;
      el.classList.add("glitching");
      later(() => el.classList.remove("glitching"), GLITCH_MS);
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

    const toggle = () => {
      if (busy) return;
      const toAero = !root.classList.contains("aero");

      try {
        if (toAero) sessionStorage.setItem(STORAGE_KEY, "aero");
        else sessionStorage.removeItem(STORAGE_KEY);
      } catch {}

      if (reducedMotion.matches) {
        root.classList.toggle("aero", toAero);
        return;
      }

      busy = true;
      const all = targets();
      const visible = all.filter(isOnScreen);
      const wallpaper = document.querySelector(".aero-wallpaper");
      const order = toAero
        ? shuffle(visible)
        : shuffle(visible).sort((a, b) => depth(a) - depth(b));
      const gap = Math.min(140, Math.max(55, 1000 / Math.max(order.length, 1)));
      const total = order.length * gap + GLITCH_MS + 120;

      showOverlay(total);

      if (toAero) {
        wallpaper?.classList.add("aero");
        order.forEach((el, index) =>
          later(() => {
            glitch(el);
            later(() => el.classList.add("aero"), GLITCH_MS * 0.35);
          }, index * gap),
        );
        later(() => {
          root.classList.add("aero");
          wallpaper?.classList.remove("aero");
          all.forEach((el) => el.classList.remove("aero"));
          busy = false;
        }, total);
      } else {
        all.forEach((el) => el.classList.add("aero"));
        wallpaper?.classList.add("aero");
        root.classList.remove("aero");
        order.forEach((el, index) =>
          later(() => {
            glitch(el);
            later(() => el.classList.remove("aero"), GLITCH_MS * 0.35);
          }, index * gap),
        );
        later(() => wallpaper?.classList.remove("aero"), total * 0.45);
        later(() => {
          all.forEach((el) => el.classList.remove("aero"));
          busy = false;
        }, total);
      }
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
          later(() => el.classList.add("aero"), GLITCH_MS * 0.35);
          later(() => {
            glitch(el);
            later(() => el.classList.remove("aero"), GLITCH_MS * 0.35);
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
