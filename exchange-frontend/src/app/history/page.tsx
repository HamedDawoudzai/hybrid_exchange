"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Order } from "@/types";

/**
 * History Page
 * Transaction history showing all orders.
 * 
 * TODO: Fetch orders from API
 * TODO: Add pagination
 * TODO: Add filtering by portfolio/type
 * TODO: Format dates and currencies
 */
export default function HistoryPage() {
  // TODO: Replace with real data from API
  const orders: Order[] = [];
  const isLoading = false;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Transaction History</h1>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              No transactions yet. Start trading to see your history!
            </div>
          ) : (
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-6 gap-4 px-4 py-2 text-sm">
                <span>Date</span>
                <span>Asset</span>
                <span>Type</span>
                <span className="text-right">Quantity</span>
                <span className="text-right">Price</span>
                <span className="text-right">Total</span>
              </div>

              {/* Orders - TODO: Implement order rows */}
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-6 gap-4 px-4 py-3 rounded-lg items-center"
                >
                  <span className="text-sm">{order.createdAt}</span>
                  <div>
                    <p className="font-medium">{order.symbol}</p>
                    <p className="text-xs">{order.assetName}</p>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      order.type === "BUY" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {order.type}
                  </span>
                  <span className="text-right">{order.quantity}</span>
                  <span className="text-right">${order.pricePerUnit}</span>
                  <span className="text-right font-medium">${order.totalAmount}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
