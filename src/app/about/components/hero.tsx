export default function HeroSection() {
  return (
    <div className="text-center mb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight font-mono">
          Hi there 👋, I&apos;m S42
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono max-w-3xl mx-auto">
          I&apos;m a developer with a focus on UI/UX and creating beautiful applications.
        </p>
      </div>
    </div>
  );
}