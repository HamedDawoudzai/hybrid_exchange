"use client";

import { usePortfolios } from "@/hooks/usePortfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";

/**
 * Dashboard Page
 * Main dashboard showing portfolio overview and stats.
 * 
 * TODO: Calculate total portfolio value
 * TODO: Add stats cards
 * TODO: Show recent activity
 * TODO: Add loading states
 */
export default function DashboardPage() {
  const { portfolios, isLoading } = usePortfolios();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards - TODO: Implement with real data */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card variant="bordered">
          <CardContent className="pt-6">
            <p className="text-sm">Total Portfolio Value</p>
            <p className="text-3xl font-bold mt-1">$0.00</p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-6">
            <p className="text-sm">Total Cash</p>
            <p className="text-3xl font-bold mt-1">$0.00</p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="pt-6">
            <p className="text-sm">Total Invested</p>
            <p className="text-3xl font-bold mt-1">$0.00</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolios */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Your Portfolios</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg" />
              ))}
            </div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-12">
              <p>You don&apos;t have any portfolios yet.</p>
              <p className="text-sm mt-2">
                Create your first portfolio to start trading!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {portfolios.map((portfolio) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
