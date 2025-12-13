/**
 * Footer Component
 * Elegant site footer matching HD Investing Corp branding.
 */
export function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-black">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/HD_investing_logo.png"
              alt="HD Investing Corp"
              className="w-10 h-10 object-contain"
            />
            <div>
              <p className="text-sm font-serif text-white">HD INVESTING</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gold-600">Corporation</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://github.com/HamedDawoudzai/hybrid_exchange"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-gold-600 transition-colors duration-200"
            >
              GitHub
            </a>
            <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
            <a 
              href="mailto:hamed.dawoudzai@gmail.com" 
              className="text-neutral-500 hover:text-gold-600 transition-colors duration-200"
            >
              Contact
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold-600/30"></span>
            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-600">
              © {new Date().getFullYear()} HD Investing Corp
            </p>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold-600/30"></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
