import Link from "next/link";
import { Button } from "@/components/ui/Button";

/**
 * Home Page
 * Landing page with hero section and features.
 * 
 * TODO: Style hero section
 * TODO: Add feature cards
 * TODO: Add animations
 */
export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Trade Stocks & Crypto
          <br />
          All in One Place
        </h1>

        <p className="text-xl max-w-2xl mx-auto mb-10">
          HybridExchange brings together traditional stock trading and
          cryptocurrency markets into a single, unified platform.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section - TODO: Implement feature cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-xl p-6 border">
            <h3 className="text-xl font-semibold mb-2">Real-Time Prices</h3>
            <p>
              Get live market data from Finnhub and Coinbase APIs.
            </p>
          </div>

          <div className="rounded-xl p-6 border">
            <h3 className="text-xl font-semibold mb-2">Portfolio Management</h3>
            <p>
              Create multiple portfolios and track your investments.
            </p>
          </div>

          <div className="rounded-xl p-6 border">
            <h3 className="text-xl font-semibold mb-2">Secure Trading</h3>
            <p>
              JWT authentication and secure API design.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
