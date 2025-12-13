"use client";

import { useMemo, useState } from "react";
import { usePortfolios } from "@/hooks/usePortfolio";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { portfolios, isLoading } = usePortfolios();
  const { user, depositCash, isDepositing, depositError } = useAuth();

  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState("");

  // Derive simple stats
  const { totalValue, totalCash, totalPortfolios } = useMemo(() => {
    const cash = user?.cashBalance ?? 0;

    if (!portfolios?.length) {
      return { totalValue: cash, totalCash: cash, totalPortfolios: 0 };
    }

    let value = 0;

    for (const p of portfolios) {
      const holdings = p.holdings ?? [];
      const holdingsValue = holdings.reduce((sum, h) => {
        const unit = h.currentPrice ?? h.averageBuyPrice ?? 0;
        const val = h.currentValue ?? h.quantity * unit;
        return sum + val;
      }, 0);

      const computedTotal = p.totalValue ?? holdingsValue;
      value += computedTotal;
    }

    return { totalValue: value + cash, totalCash: cash, totalPortfolios: portfolios.length };
  }, [portfolios, user?.cashBalance]);

  const onSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    depositCash(value);
    setShowDeposit(false);
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gold-600/3 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/3 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-px bg-gold-600/50"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600">Overview</p>
            </div>
            <h1 className="text-3xl font-serif font-light text-white">Dashboard</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Welcome back, <span className="text-gold-600">{user?.username}</span>
            </p>
          </div>
          <button
            onClick={() => setShowDeposit(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-semibold rounded hover:shadow-gold transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Deposit Cash
          </button>
        </header>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Total Portfolio Value"
            value={formatCurrency(totalValue)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Available Cash"
            value={formatCurrency(totalCash)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatCard
            label="Active Portfolios"
            value={totalPortfolios.toString()}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
        </div>

        {/* Portfolios */}
        <Card className="border border-neutral-800/50 bg-neutral-950/50">
          <CardHeader className="border-b border-neutral-800/50">
            <CardTitle className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gold-600/10 text-gold-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              <span className="font-serif">Your Portfolios</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-32 rounded border border-neutral-800/50 bg-neutral-900/50 animate-pulse"
                  />
                ))}
              </div>
            ) : portfolios.length === 0 ? (
              <div className="text-center py-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/HD_investing_logo.png"
                  alt="HD Investing"
                  className="w-16 h-16 mx-auto mb-4 opacity-30 object-contain"
                />
                <p className="text-lg font-serif text-white">No portfolios yet</p>
                <p className="text-sm text-neutral-500 mt-2">
                  Create your first portfolio to start trading
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {portfolios.map((portfolio) => (
                  <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded bg-gold-600/10 flex items-center justify-center text-gold-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
              <h2 className="text-lg font-serif text-white">Deposit Cash</h2>
            </div>
            <form className="space-y-5" onSubmit={onSubmitDeposit}>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-white placeholder-neutral-600 focus:border-gold-600/50 focus:outline-none focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
                  placeholder="e.g. 10000"
                />
              </div>
              {depositError && (
                <p className="text-sm text-danger-400">
                  {(depositError as Error)?.message ?? "Deposit failed"}
                </p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeposit(false);
                    setAmount("");
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDepositing}
                  className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-gold-600 to-gold-500 text-black rounded hover:shadow-gold transition-all duration-300 disabled:opacity-50"
                >
                  {isDepositing ? "Processing..." : "Deposit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border border-neutral-800/50 bg-neutral-950/50 hover:border-gold-600/20 transition-all duration-300 card-hover">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500">{label}</p>
            <p className="text-2xl font-serif text-white mt-2">{value}</p>
          </div>
          <span className="h-10 w-10 rounded bg-gold-600/10 flex items-center justify-center text-gold-600">
            {icon}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
