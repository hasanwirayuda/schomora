import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      <div
        className="absolute inset-0 bg-[url('/apple-bg.jpg')] bg-cover bg-center"
        aria-hidden="true"
      />

      {/* Navbar Container */}
      <header className="absolute top-8 w-full px-6 flex justify-center">
        <nav className="w-full max-w-6xl flex items-center justify-between px-8 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg">
          <div className="text-white font-medium text-lg tracking-tight">
            @Schomora
          </div>
          <button className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/5 text-white text-sm hover:bg-white/15 transition-all">
            <span className="opacity-80 text-[10px]">🌐</span> EN
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center gap-8">
        <h1 className="text-4xl md:text-6xl text-white">Schomora</h1>

        {/* Liquid Glass Box */}
        <div className="relative group">
          {/* Glass Effect Card */}
          <div className="flex flex-col gap-2 p-4 border border-white/20 rounded-md bg-white/2 backdrop-blur-xs shadow-2xl overflow-hidden">
            {/* Get Started Button */}
            <Link
              href="/register"
              className="px-10 py-2.5 rounded-md bg-[#004D4D] text-white text-center text-lg hover:bg-[#005a5a] transition-colors border border-white/10 shadow-md/50"
            >
              Get Started
            </Link>

            {/* Login Button */}
            <Link
              href="/login"
              className="px-10 py-2.5 border-2 box-border border-white/50 rounded-md text-lg bg-transparent text-white text-center hover:bg-white/5 transition-all"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Decorative Overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
    </main>
  );
}
