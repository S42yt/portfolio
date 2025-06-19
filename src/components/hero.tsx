export default function Hero() {
  return (
    <div className="text-center mb-16 max-w-4xl mx-auto px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl opacity-30 animate-pulse"></div>
      
      <div className="relative z-10">
        <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight font-mono">
          S42.site
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono">
            My personal dev portfolio 
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/emojis/kuromi_hey.gif" alt="Kuromi Hey" className="w-6 h-6 object-contain animate-bounce" />
        </div>
      </div>
    </div>
  );
}