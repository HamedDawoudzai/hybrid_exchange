"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { OrderType, Portfolio } from "@/types";

interface OrderFormProps {
  symbol: string;
  currentPrice: number;
  onSubmit: (type: OrderType, quantity: number, portfolioId?: number) => void;
  isLoading?: boolean;
  portfolios?: Portfolio[]; // optional; if provided, allows selecting a portfolio
}

export function OrderForm({
  symbol,
  currentPrice,
  onSubmit,
  isLoading,
  portfolios = [],
}: OrderFormProps) {
  const [orderType, setOrderType] = useState<OrderType>("BUY");
  const [quantity, setQuantity] = useState("");
  const [portfolioId, setPortfolioId] = useState<number | undefined>(
    portfolios.length ? portfolios[0].id : undefined
  );

  const total = parseFloat(quantity || "0") * currentPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(quantity) > 0) {
      onSubmit(orderType, parseFloat(quantity), portfolioId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Order Type Toggle */}
      <div className="flex rounded-lg overflow-hidden border border-slate-800/70 bg-slate-900/60">
        {(["BUY", "SELL"] as OrderType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setOrderType(t)}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              orderType === t
                ? t === "BUY"
                  ? "bg-emerald-500 text-white"
                  : "bg-rose-500 text-white"
                : "text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            {t === "BUY" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      {/* Portfolio selector (optional) */}
      {portfolios.length > 0 && (
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-[0.15em] text-slate-400">
            Portfolio
          </label>
          <select
            className="w-full rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={portfolioId}
            onChange={(e) => setPortfolioId(Number(e.target.value))}
          >
            {portfolios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

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
      <div className="rounded-lg border border-slate-800/70 bg-slate-900/60 p-4 space-y-2 text-slate-100">
        <div className="flex justify-between text-sm">
          <span>Symbol</span>
          <span className="font-medium">{symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Price</span>
          <span>{currentPrice ? `$${currentPrice.toFixed(2)}` : "--"}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-slate-800/70">
          <span>Total</span>
          <span className="font-bold">
            {currentPrice ? `$${total.toFixed(2)}` : "--"}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant={orderType === "BUY" ? "primary" : "danger"}
        className="w-full"
        isLoading={isLoading}
        disabled={!quantity || parseFloat(quantity) <= 0 || !currentPrice}
      >
        {orderType === "BUY" ? "Buy" : "Sell"} {symbol}
      </Button>
    </form>
  );
}