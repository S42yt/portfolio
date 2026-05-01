"use client";

import { useState, useEffect } from "react";

export default function KofiToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isClosed) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
        isVisible ? "translate-y-0 translate-x-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-90"
      }`}
    >
      <div className="relative group bg-white/5 backdrop-blur-xl border border-white/10 p-3 pr-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center gap-4 hover:shadow-[0_8px_40px_rgba(100,22,201,0.2)] hover:border-white/20 transition-all hover:-translate-y-1 duration-300">
        
        <button
          onClick={() => setIsClosed(true)}
          className="absolute -top-2 -right-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          aria-label="Close"
        >
          ×
        </button>

        <a
          href="https://ko-fi.com/G2G21YPX94"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 outline-none"
        >
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300 overflow-hidden">
            <img 
              src="https://storage.ko-fi.com/cdn/brandasset/v2/kofi_symbol.png" 
              alt="Ko-fi" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold">
              Support on Ko-fi
            </span>
            <span className="text-white/60 text-sm">
              Buy me a coffee
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
