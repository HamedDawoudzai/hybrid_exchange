/**
 * Footer Component
 * Site footer with brand, links, and social.
 */
export function Footer() {
  return (
    <footer className="border-t border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-8 text-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold">
              HX
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-50">HybridExchange</p>
              <p className="text-xs text-slate-400">Stocks & Crypto Unified</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-300">
            <a
              href="https://github.com/HamedDawoudzai/hybrid_exchange"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-300 transition"
            >
              GitHub
            </a>
            {/* Add socials as needed */}
            <span className="text-slate-500">|</span>
            <a href="mailto:hamed.dawoudzai@gmail.com" className="hover:text-indigo-300 transition">
              Contact
            </a>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} HybridExchange. Portfolio project.
          </p>
        </div>
      </div>
    </footer>
  );
}