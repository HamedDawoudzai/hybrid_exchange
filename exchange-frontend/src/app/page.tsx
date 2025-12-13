import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0">
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gold-600/5 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gold-500/5 blur-[100px]" />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(201, 169, 98, 0.3) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(201, 169, 98, 0.3) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
          
          {/* Decorative lines */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-600/10 to-transparent" />
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-600/10 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          {/* Logo - Large and prominent */}
          <div className="flex justify-center mb-8 animate-fade-in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/HD_investing_logo.png"
              alt="HD Investing Corp"
              className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
            />
          </div>

          {/* Tagline */}
          <div className="flex items-center justify-center gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-gold-600/60"></span>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gold-600">Premium Trading Platform</span>
            <span className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-gold-600/60"></span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-white mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Trade with
            <span className="block mt-2 text-gradient-gold font-normal">Confidence</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Access global stock markets and cryptocurrency trading on a unified platform 
            designed for discerning investors seeking excellence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/register">
              <button className="px-10 py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-semibold rounded hover:shadow-gold transition-all duration-300 min-w-[200px]">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="px-10 py-4 border border-neutral-700 text-neutral-300 font-medium rounded hover:border-gold-600/50 hover:text-white hover:bg-gold-600/5 transition-all duration-300 min-w-[200px]">
                Sign In
              </button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-gold-600/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-gradient-to-b from-black via-neutral-950 to-black">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="w-8 h-px bg-gold-600/50"></span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600">Why Choose Us</span>
              <span className="w-8 h-px bg-gold-600/50"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-white">
              Built for Excellence
            </h2>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <FeatureCard
              title="Real-Time Data"
              description="Live market quotes from Polygon and Coinbase APIs, ensuring you always have the latest information."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
            <FeatureCard
              title="Portfolio Control"
              description="Create multiple portfolios, track your holdings, monitor performance, and analyze your investments."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
            <FeatureCard
              title="Bank-Grade Security"
              description="JWT authentication, rate limiting, and encrypted sessions protect your assets and data."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-neutral-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <StatItem value="$1M+" label="Demo Balance" />
            <StatItem value="100+" label="Tradable Assets" />
            <StatItem value="24/7" label="Crypto Trading" />
            <StatItem value="Secure" label="JWT Auth" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600/5 via-transparent to-gold-600/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/HD_investing_logo.png"
                alt="HD Investing"
                className="w-24 h-24 object-contain opacity-80"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-neutral-400 mb-8">
              Join HD Investing Corp and experience premium trading at its finest.
            </p>
            <Link href="/register">
              <button className="px-12 py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-semibold rounded hover:shadow-gold transition-all duration-300">
                Create Free Account
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/HD_investing_logo.png"
                alt="HD Investing"
                className="w-10 h-10 object-contain"
              />
              <div>
                <p className="text-sm font-serif text-white">HD INVESTING</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-gold-600">Corporation</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm text-neutral-500">
              <Link href="/login" className="hover:text-gold-600 transition-colors">Sign In</Link>
              <Link href="/register" className="hover:text-gold-600 transition-colors">Register</Link>
            </div>
            <p className="text-xs text-neutral-600">
              © 2024 HD Investing Corp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative p-8 rounded-lg border border-neutral-800/50 bg-neutral-950/50 hover:border-gold-600/30 hover:bg-neutral-900/30 transition-all duration-300 card-hover">
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-gold-600/50 to-transparent" />
        <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-gold-600/50 to-transparent" />
      </div>
      
      <div className="text-gold-600 mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-serif text-white mb-3">{title}</h3>
      <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-serif text-white mb-1">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{label}</p>
    </div>
  );
}
