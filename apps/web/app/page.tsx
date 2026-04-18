import Link from "next/link";
import { Globe } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[url('/apple-bg.jpg')] bg-cover bg-center"
        aria-hidden="true"
      />

      <header className="absolute top-8 w-full px-6 flex justify-center">
        <nav className="w-full max-w-6xl flex items-center justify-between px-6 py-4.5 rounded-full border border-white/20 bg-white/2 backdrop-blur-xs shadow-lg">
          <h1 className="text-lg text-white">@Schomora</h1>
          <button className="flex items-center cursor-pointer gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white text-sm hover:bg-white/15 transition-all">
            <Globe size={14} /> EN
          </button>
        </nav>
      </header>

      <section className="relative flex flex-col items-center gap-8">
        <h1 className="text-4xl md:text-6xl text-white">Schomora</h1>

        <div className="flex flex-col gap-2 p-4 border border-white/20 rounded-md bg-white/2 backdrop-blur-xs text-center">
          <Link
            href="/register"
            className="px-10 py-2.5 rounded-md bg-[#004D4D] text-white text-lg hover:bg-[#005a5a] transition-colors border border-white/10 shadow-md/50"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="px-10 py-2.5 border-2 box-border border-white/50 rounded-md text-lg bg-transparent text-white hover:bg-white/5 transition-all"
          >
            I already have an account
          </Link>
        </div>
      </section>
    </main>
  );
}
