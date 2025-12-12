import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Portfolio } from "@/types";

interface PortfolioCardProps {
  portfolio: Portfolio;
}

/**
 * PortfolioCard Component
 * Displays portfolio summary in a card format.
 * 
 * TODO: Format currency values
 * TODO: Add total value calculation
 * TODO: Style card
 */
export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  return (
    <Link href={`/portfolio/${portfolio.id}`}>
      <Card className="cursor-pointer" variant="bordered">
        <CardHeader>
          <CardTitle>{portfolio.name}</CardTitle>
          {portfolio.description && (
            <p className="text-sm mt-1">{portfolio.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm">Total Value</p>
              <p className="text-2xl font-bold">
                ${portfolio.totalValue ?? portfolio.cashBalance}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p>Cash Balance</p>
                <p>${portfolio.cashBalance}</p>
              </div>
              <div className="text-right">
                <p>Holdings</p>
                <p>{portfolio.holdings?.length ?? 0} assets</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
