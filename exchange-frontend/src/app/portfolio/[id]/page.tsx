"use client";

import { useParams } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { HoldingsList } from "@/components/portfolio/HoldingsList";

/**
 * Portfolio Detail Page
 * Shows detailed portfolio information including holdings.
 * 
 * TODO: Fetch portfolio with holdings
 * TODO: Calculate total value with current prices
 * TODO: Add deposit/withdraw functionality
 * TODO: Add loading and error states
 */
export default function PortfolioDetailPage() {
  const params = useParams();
  const portfolioId = Number(params.id);
  const { portfolio, isLoading } = usePortfolio(portfolioId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card variant="bordered">
          <CardContent className="py-16 text-center">
            Portfolio not found
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{portfolio.name}</h1>
      {portfolio.description && (
        <p className="mb-8">{portfolio.description}</p>
      )}

      {/* Stats - TODO: Calculate with real data */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card variant="bordered">
          <CardContent className="pt-6">
            <p className="text-sm">Total Value</p>
            <p className="text-3xl font-bold mt-1">
              ${portfolio.totalValue ?? portfolio.cashBalance}
            </p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-6">
            <p className="text-sm">Cash Balance</p>
            <p className="text-3xl font-bold mt-1">${portfolio.cashBalance}</p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-6">
            <p className="text-sm">Invested</p>
            <p className="text-3xl font-bold mt-1">$0.00</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <HoldingsList holdings={portfolio.holdings ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
