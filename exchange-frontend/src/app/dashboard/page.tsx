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
      // total value should still include available cash
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

    // add cash to overall portfolio value
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Overview</p>
            <h1 className="text-3xl font-semibold text-slate-50">Dashboard</h1>
            <p className="text-sm text-slate-400">
              Your portfolios, cash, and recent performance at a glance.
            </p>
          </div>
          <button
            onClick={() => setShowDeposit(true)}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-50 shadow hover:bg-emerald-400/90 transition"
          >
            Deposit
          </button>
        </header>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Total Portfolio Value"
            value={formatCurrency(totalValue)}
            accent="from-indigo-500/20 to-indigo-400/10"
          />
          <StatCard
            label="Total Cash"
            value={formatCurrency(totalCash)}
            accent="from-emerald-500/20 to-emerald-400/10"
          />
          <StatCard
            label="Portfolios"
            value={totalPortfolios.toString()}
            accent="from-amber-500/20 to-amber-400/10"
          />
        </div>

        {/* Portfolios */}
        <Card className="border border-slate-800/70 bg-white/5 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs">
                PF
              </span>
              Your Portfolios
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-32 rounded-xl border border-slate-800/70 bg-slate-900/60 animate-pulse"
                  />
                ))}
              </div>
            ) : portfolios.length === 0 ? (
              <div className="text-center py-12 text-slate-300">
                <p className="text-lg font-medium">No portfolios yet</p>
                <p className="text-sm text-slate-400 mt-2">
                  Create your first portfolio to start trading.
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

      {showDeposit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-50 mb-4">Deposit Cash</h2>
            <form className="space-y-4" onSubmit={onSubmitDeposit}>
              <div>
                <label className="text-sm text-slate-300">Amount</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. 1000"
                />
              </div>
              {depositError && (
                <p className="text-sm text-amber-400">
                  {(depositError as Error)?.message ?? "Deposit failed"}
                </p>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeposit(false);
                    setAmount("");
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800/70 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDepositing}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-50 shadow hover:bg-emerald-400/90 transition disabled:opacity-70"
                >
                  {isDepositing ? "Depositing..." : "Deposit"}
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
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <Card className="border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-900/60 backdrop-blur-xl shadow-lg">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</p>
            <p className="text-2xl font-semibold text-slate-50 mt-2">{value}</p>
          </div>
          <span
            className={`h-10 w-10 rounded-full bg-gradient-to-br ${accent} border border-slate-800/80`}
          />
        </div>
      </CardContent>
    </Card>
  );
}