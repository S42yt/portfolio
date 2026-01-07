export default function Hero() {
  return (
    <div className="text-center mb-16 max-w-4xl mx-auto px-6 relative">
      <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10">
        <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight font-mono">
        Hi there 👋, I'm S42
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono">
            This is my personal dev portfolio
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/emojis/kuromi_hey.gif"
            alt="Kuromi Hey"
            className="w-6 h-6 object-contain animate-bounce"
          />
        </div>
        <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono mt-1.5">
          I'm a developer with a focus on performance, UI/UX and creating beautiful applications. Im really interested in learning technologies that have to do with rendering.
          </p>
      </div>
    </div>
  );
}
