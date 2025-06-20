"use client";
export default function DemoSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-medium text-white mb-6 text-center">
            Plugin Demo
          </h2>
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://raw.githubusercontent.com/CuteCraft-Network/TradeCycle/refs/heads/master/assets/cycle_success.gif"
              alt="TradeCycle Plugin Demo"
              className="w-full max-w-md mx-auto rounded-lg"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='300' viewBox='0 0 500 300'%3E%3Crect width='500' height='300' fill='%23111827'/%3E%3Ctext x='250' y='150' font-family='monospace' font-size='18' fill='%236B7280' text-anchor='middle' dy='0.35em'%3ETradeCycle Demo%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}