import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-24 text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">
            HybridExchange
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-slate-50">
            Trade Stocks & Crypto
            <br />
            in one unified platform
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-300">
            Unified market data from Finnhub and Coinbase, multi-portfolio management,
            and secure trading with JWT auth.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="px-6">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            title="Real-Time Prices"
            body="Live stock and crypto quotes powered by Finnhub and Coinbase APIs."
          />
          <FeatureCard
            title="Portfolio Control"
            body="Create multiple portfolios, track balances, holdings, and orders."
          />
          <FeatureCard
            title="Secure Trading"
            body="JWT authentication, rate limiting, and Redis-backed session/token controls."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-800/70 bg-white/5 backdrop-blur-xl shadow-lg p-6 space-y-2">
      <h3 className="text-xl font-semibold text-slate-50">{title}</h3>
      <p className="text-sm text-slate-300">{body}</p>
    </div>
  );
}