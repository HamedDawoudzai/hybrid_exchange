"use client";

import { useParams } from "next/navigation";
import { usePortfolios } from "@/hooks/usePortfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PriceChart } from "@/components/charts/PriceChart";
import { OrderForm } from "@/components/trade/OrderForm";
import type { OrderType } from "@/types";

/**
 * Trade Symbol Page
 * Trading interface for a specific asset.
 * 
 * TODO: Fetch asset details
 * TODO: Fetch real-time price
 * TODO: Fetch price history for chart
 * TODO: Implement order placement
 * TODO: Add portfolio selector
 */
export default function TradeSymbolPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const { portfolios } = usePortfolios();

  // TODO: Replace with real data
  const currentPrice = 0;
  const priceChange = 0;
  const isLoading = false;

  const handleOrder = (type: OrderType, quantity: number) => {
    // TODO: Implement order placement
    console.log("Order placed:", { symbol, type, quantity });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl" />
            <div className="h-96 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{symbol}</h1>
          <p>Asset Name</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">${currentPrice.toFixed(2)}</p>
          <p className={priceChange >= 0 ? "text-green-500" : "text-red-500"}>
            {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card variant="bordered" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <PriceChart data={[]} isLoading={false} />
          </CardContent>
        </Card>

        {/* Order Form */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Place Order</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolios.length === 0 ? (
              <p className="text-center py-8">
                Create a portfolio first to start trading
              </p>
            ) : (
              <OrderForm
                symbol={symbol}
                currentPrice={currentPrice}
                onSubmit={handleOrder}
                isLoading={false}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
