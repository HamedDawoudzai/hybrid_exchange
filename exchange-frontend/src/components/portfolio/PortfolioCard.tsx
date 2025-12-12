import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Portfolio } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const holdings = portfolio.holdings ?? [];

  const holdingsValue = holdings.reduce((sum, h) => {
    const unit = h.currentPrice ?? h.averageBuyPrice ?? 0;
    const val = h.currentValue ?? h.quantity * unit;
    return sum + val;
  }, 0);

  const total = portfolio.totalValue ?? holdingsValue;
  const holdingsCount = holdings.length;

  return (
    <Link href={`/portfolio/${portfolio.id}`}>
      <Card className="cursor-pointer border border-slate-800/70 bg-white/5 backdrop-blur-xl shadow-lg transition hover:border-indigo-500/40 hover:shadow-indigo-500/10">
        <CardHeader>
          <CardTitle className="text-slate-100">{portfolio.name}</CardTitle>
          {portfolio.description && (
            <p className="text-sm text-slate-400 mt-1">{portfolio.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-slate-100">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Total Value</p>
              <p className="text-2xl font-semibold mt-1">{formatCurrency(total)}</p>
            </div>
            <div className="flex justify-between text-sm text-slate-200">
              <div className="text-right w-full">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Holdings</p>
                <p className="font-semibold">{holdingsCount} assets</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}