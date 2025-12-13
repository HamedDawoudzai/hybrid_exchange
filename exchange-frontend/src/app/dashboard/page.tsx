"use client";

import { useMemo, useState } from "react";
import { usePortfolios } from "@/hooks/usePortfolio";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { WatchlistPanel } from "@/components/watchlist/WatchlistPanel";
import { PendingLimitOrders } from "@/components/orders/PendingLimitOrders";
import { PendingStopOrders } from "@/components/orders/PendingStopOrders";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function DashboardPage() {
  const { portfolios, isLoading, createPortfolio, isCreating } = usePortfolios();
  const { user, depositCash, isDepositing, withdrawCash, isWithdrawing } = useAuth();

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [portfolioName, setPortfolioName] = useState("");

  // Get user's cash balance and reserved cash
  const cashBalance = user?.cashBalance ?? 0;
  const reservedCash = user?.reservedCash ?? 0;

  // Derive simple stats including P&L (realized+unrealized)
  const { totalNetWorth, holdingsValue, totalPnL, totalPnLPercent, totalPortfolios } = useMemo(() => {
    let marketValue = 0;
    let costBasis = 0;

    if (portfolios?.length) {
      for (const p of portfolios) {
        const holdings = p.holdings ?? [];
        for (const h of holdings) {
          const currentPrice = h.currentPrice ?? h.averageBuyPrice ?? 0;
          const holdingValue = h.currentValue ?? h.quantity * currentPrice;
          const holdingCost = h.quantity * (h.averageBuyPrice ?? 0);
          
          marketValue += holdingValue;
          costBasis += holdingCost;
        }
      }
    }

    const netContributed = (user?.totalDeposits ?? 0) - (user?.totalWithdrawals ?? 0);
    // Include reserved cash in net worth since it's still part of user's assets
    const netWorth = marketValue + cashBalance + reservedCash;

    // Realized+unrealized P&L vs net contributed cash
    const pnl = netWorth - netContributed;
    const pnlPercent = netContributed > 0 ? (pnl / netContributed) * 100 : 0;

    return { 
      totalNetWorth: netWorth,
      holdingsValue: marketValue,
      totalPnL: pnl,
      totalPnLPercent: pnlPercent,
      totalPortfolios: portfolios?.length ?? 0 
    };
  }, [portfolios, cashBalance, reservedCash, user]);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    depositCash(amount);
    toast.success(`Deposited ${formatCurrency(amount)}`);
    setDepositAmount("");
    setShowDepositModal(false);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > cashBalance) {
      toast.error(`Insufficient balance. Available: ${formatCurrency(cashBalance)}`);
      return;
    }
    withdrawCash(amount);
    toast.success(`Withdrew ${formatCurrency(amount)}`);
    setWithdrawAmount("");
    setShowWithdrawModal(false);
  };

  const handleCreatePortfolio = () => {
    if (!portfolioName.trim()) {
      toast.error("Please enter a portfolio name");
      return;
    }
    createPortfolio({ name: portfolioName.trim() });
    toast.success(`Portfolio "${portfolioName}" created`);
    setPortfolioName("");
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gold-600/3 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/3 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-px bg-gold-600/50"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600">Overview</p>
            </div>
            <h1 className="text-3xl font-serif font-light text-white">Dashboard</h1>
            <p className="text-sm text-neutral-500">
              Your portfolios, cash, and recent performance at a glance.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDepositModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-medium rounded-lg hover:shadow-lg hover:shadow-gold-600/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Deposit Cash
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-neutral-700 text-neutral-300 font-medium rounded-lg hover:bg-neutral-800 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              Withdraw
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Total Net Worth"
            value={formatCurrency(totalNetWorth)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Total P&L"
            value={`${totalPnL >= 0 ? "+" : ""}${formatCurrency(totalPnL)}`}
            subValue={`${totalPnLPercent >= 0 ? "+" : ""}${totalPnLPercent.toFixed(2)}%`}
            valueColor={totalPnL >= 0 ? "text-success-500" : "text-danger-500"}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <StatCard
            label="Cash Balance"
            value={formatCurrency(cashBalance)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </div>

        {/* Main Content Grid - Portfolios + Watchlist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolios - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card className="border border-neutral-800/50 bg-neutral-950/50">
              <CardHeader className="border-b border-neutral-800/50 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gold-600/10 text-gold-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </span>
                  <span className="font-serif">Your Portfolios</span>
                </CardTitle>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-neutral-800/80 text-neutral-300 rounded-lg hover:bg-neutral-800 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Portfolio
                </button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-32 rounded-xl border border-neutral-800/50 bg-neutral-900/50 animate-pulse"
                      />
                    ))}
                  </div>
                ) : portfolios.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">
                    <p className="text-lg font-medium">No portfolios yet</p>
                    <p className="text-sm text-neutral-500 mt-2">
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

          {/* Watchlist & Pending Orders - 1 column on large screens */}
          <div className="space-y-6">
            {/* Watchlist */}
            <Card className="border border-neutral-800/50 bg-neutral-950/50">
              <CardHeader className="border-b border-neutral-800/50">
                <CardTitle className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gold-600/10 text-gold-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </span>
                  <span className="font-serif">Watchlist</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WatchlistPanel />
              </CardContent>
            </Card>

            {/* Pending Limit Orders */}
            <Card className="border border-neutral-800/50 bg-neutral-950/50">
              <CardHeader className="border-b border-neutral-800/50">
                <CardTitle className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gold-600/10 text-gold-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="font-serif">Pending Limit Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PendingLimitOrders />
              </CardContent>
            </Card>

            {/* Pending Stop Orders */}
            <Card className="border border-neutral-800/50 bg-neutral-950/50">
              <CardHeader className="border-b border-neutral-800/50">
                <CardTitle className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gold-600/10 text-gold-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="font-serif">Pending Stop Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PendingStopOrders />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-gold-600/10 flex items-center justify-center text-gold-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                <h2 className="text-lg font-serif text-white">Deposit Cash</h2>
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-white placeholder-neutral-600 focus:border-gold-600/50 focus:outline-none focus:ring-1 focus:ring-gold-600/20 transition-all"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2">
                {[1000, 5000, 10000, 50000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDepositAmount(amount.toString())}
                    className="flex-1 py-2 text-sm rounded border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-gold-600/50 hover:text-gold-500 transition-all"
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>

              <button
                onClick={handleDeposit}
                disabled={isDepositing || !depositAmount}
                className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDepositing ? "Depositing..." : "Deposit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                  </svg>
                </span>
                <h2 className="text-lg font-serif text-white">Withdraw Cash</h2>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800">
                <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 mb-1">Available Balance</p>
                <p className="text-xl font-serif text-white">{formatCurrency(cashBalance)}</p>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-white placeholder-neutral-600 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all"
                  placeholder="Enter amount"
                  min="0"
                  max={cashBalance}
                  step="0.01"
                />
              </div>

              {/* Quick percentages */}
              <div className="flex gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setWithdrawAmount((cashBalance * pct / 100).toFixed(2))}
                    className="flex-1 py-2 text-sm rounded border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-red-500/50 hover:text-red-400 transition-all"
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) > cashBalance}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Portfolio Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-gold-600/10 flex items-center justify-center text-gold-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </span>
                <h2 className="text-lg font-serif text-white">Create Portfolio</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                  Portfolio Name
                </label>
                <input
                  type="text"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-white placeholder-neutral-600 focus:border-gold-600/50 focus:outline-none focus:ring-1 focus:ring-gold-600/20 transition-all"
                  placeholder="e.g., Tech Stocks, Crypto Holdings"
                />
              </div>

              <button
                onClick={handleCreatePortfolio}
                disabled={isCreating || !portfolioName.trim()}
                className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Portfolio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  subValue,
  valueColor,
  icon,
}: {
  label: string;
  value: string;
  subValue?: string;
  valueColor?: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border border-neutral-800/50 bg-neutral-950/50">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{label}</p>
            <p className={`text-2xl font-serif mt-2 ${valueColor ?? "text-white"}`}>{value}</p>
            {subValue && (
              <p className={`text-sm mt-1 ${valueColor ?? "text-neutral-400"}`}>{subValue}</p>
            )}
          </div>
          <span className="h-10 w-10 rounded-lg bg-gold-600/10 border border-gold-600/20 flex items-center justify-center text-gold-600">
            {icon}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
