"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { usePortfolios } from "@/hooks/usePortfolio";
import type { Portfolio } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const { deletePortfolio, isDeleting } = usePortfolios();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const holdings = portfolio.holdings ?? [];

  const { total, holdingsCount, profitLoss, profitLossPercent } = useMemo(() => {
    const currentValue = holdings.reduce((sum, h) => {
      const price = h.currentPrice ?? h.averageBuyPrice ?? 0;
      return sum + h.quantity * price;
    }, 0);

    const costBasis = holdings.reduce((sum, h) => {
      return sum + h.quantity * (h.averageBuyPrice ?? 0);
    }, 0);

    const pnl = currentValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

    return {
      total: portfolio.totalValue ?? currentValue,
      holdingsCount: holdings.length,
      profitLoss: pnl,
      profitLossPercent: pnlPercent,
    };
  }, [holdings, portfolio.totalValue]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deletePortfolio(portfolio.id);
      toast.success(`Portfolio "${portfolio.name}" deleted`);
      setShowDeleteConfirm(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error?.response?.data?.message || "Failed to delete portfolio";
      toast.error(message);
      setShowDeleteConfirm(false);
    }
  };

  const pnlClass = profitLoss >= 0 ? "text-success-500" : "text-danger-500";

  return (
    <>
      <Link href={`/portfolio/${portfolio.id}`}>
        <Card className="cursor-pointer border border-neutral-800/50 bg-neutral-950/50 transition-all duration-300 hover:border-gold-600/30 hover:shadow-gold group relative card-hover">
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-0 right-0 w-px h-6 bg-gradient-to-b from-gold-600/50 to-transparent" />
            <div className="absolute top-0 right-0 w-6 h-px bg-gradient-to-l from-gold-600/50 to-transparent" />
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="absolute top-3 right-3 p-2 rounded opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-danger-400 hover:bg-danger-500/10 transition-all duration-200 z-10"
            aria-label="Delete portfolio"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <CardHeader className="border-b border-neutral-800/30">
            <CardTitle className="text-white pr-8 font-serif">{portfolio.name}</CardTitle>
            {portfolio.description && (
              <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{portfolio.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500">Total Value</p>
                <p className="text-2xl font-serif text-white mt-1">{formatCurrency(total)}</p>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-neutral-800/30">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-600">Holdings</p>
                  <p className="font-medium text-neutral-300">{holdingsCount} assets</p>
                </div>
                {holdingsCount > 0 && (
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-600">P&L</p>
                    <p className={`font-medium ${pnlClass}`}>
                      {profitLoss >= 0 ? "+" : ""}{formatCurrency(profitLoss)}
                      <span className="text-xs ml-1 opacity-70">({profitLossPercent >= 0 ? "+" : ""}{profitLossPercent.toFixed(1)}%)</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div 
            className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded bg-danger-500/10">
                <svg className="w-6 h-6 text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-serif text-white">Delete Portfolio</h2>
            </div>
            <p className="text-neutral-300 mb-2">
              Are you sure you want to delete <span className="font-semibold text-white">"{portfolio.name}"</span>?
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              This will permanently remove the portfolio and all its holdings. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 text-sm font-medium text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-danger-500 text-white rounded hover:bg-danger-600 transition-all duration-200 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Portfolio"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
