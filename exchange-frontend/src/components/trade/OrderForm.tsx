"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { OrderType } from "@/types";

interface OrderFormProps {
  symbol: string;
  currentPrice: number;
  onSubmit: (type: OrderType, quantity: number) => void;
  isLoading?: boolean;
}

/**
 * OrderForm Component
 * Form for placing buy/sell orders.
 * 
 * TODO: Implement order type toggle (Buy/Sell)
 * TODO: Add quantity input with validation
 * TODO: Calculate and display order total
 * TODO: Style form
 */
export function OrderForm({
  symbol,
  currentPrice,
  onSubmit,
  isLoading,
}: OrderFormProps) {
  const [orderType, setOrderType] = useState<OrderType>("BUY");
  const [quantity, setQuantity] = useState("");

  const total = parseFloat(quantity || "0") * currentPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(quantity) > 0) {
      onSubmit(orderType, parseFloat(quantity));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Order Type Toggle - TODO: Style toggle */}
      <div className="flex rounded-lg overflow-hidden border">
        <button
          type="button"
          onClick={() => setOrderType("BUY")}
          className={`flex-1 py-3 ${orderType === "BUY" ? "bg-green-600 text-white" : ""}`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setOrderType("SELL")}
          className={`flex-1 py-3 ${orderType === "SELL" ? "bg-red-600 text-white" : ""}`}
        >
          Sell
        </button>
      </div>

      {/* Quantity Input */}
      <Input
        label="Quantity"
        type="number"
        step="any"
        min="0"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="0.00"
      />

      {/* Order Summary */}
      <div className="rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Symbol</span>
          <span className="font-medium">{symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Price</span>
          <span>${currentPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t">
          <span>Total</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant={orderType === "BUY" ? "primary" : "danger"}
        className="w-full"
        isLoading={isLoading}
        disabled={!quantity || parseFloat(quantity) <= 0}
      >
        {orderType === "BUY" ? "Buy" : "Sell"} {symbol}
      </Button>
    </form>
  );
}
