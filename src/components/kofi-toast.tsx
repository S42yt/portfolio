"use client";

import { useState, useEffect } from "react";

const DISMISS_KEY = "kofi-toast-dismissed";

export default function KofiToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    localStorage.removeItem(DISMISS_KEY);
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    setIsDismissed(false);
    const timer = setTimeout(() => setIsVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div
      role="complementary"
      aria-label="Support link"
      className="fixed bottom-24 right-4 z-40 transition-all duration-500 md:bottom-6 md:right-6"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(1rem)",
        opacity: isVisible ? 1 : 0,
        transitionTimingFunction: "var(--ease-spring)",
      }}
    >
      <div className="glass-strong flex items-center gap-3 rounded-[var(--radius-md)] p-2 pr-3 transition-transform duration-300 hover:-translate-y-1">
        <a
          href="https://ko-fi.com/G2G21YPX94"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-[var(--radius-lg)] p-1"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://storage.ko-fi.com/cdn/brandasset/v2/kofi_symbol.png"
              alt=""
              aria-hidden="true"
              className="h-7 w-7 object-contain"
            />
          </span>
          <span className="flex flex-col pr-1">
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text)" }}
            >
              Support on Ko-fi
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Buy me a coffee
            </span>
          </span>
        </a>

        <button
          onClick={dismiss}
          aria-label="Dismiss Ko-fi support link"
          className="toast-close flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
}
