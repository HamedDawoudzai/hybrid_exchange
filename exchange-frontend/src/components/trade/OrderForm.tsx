"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { OrderType, Portfolio, Holding } from "@/types";

interface OrderFormProps {
  symbol: string;
  currentPrice: number;
  onSubmit: (type: OrderType, quantity: number, portfolioId?: number) => void;
  isLoading?: boolean;
  portfolios?: Portfolio[];
  cashBalance?: number;
}

export function OrderForm({
  symbol,
  currentPrice,
  onSubmit,
  isLoading,
  portfolios = [],
  cashBalance = 0,
}: OrderFormProps) {
  const [orderType, setOrderType] = useState<OrderType>("BUY");
  const [quantity, setQuantity] = useState("");
  const [portfolioId, setPortfolioId] = useState<number | undefined>(undefined);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (portfolios.length > 0 && !portfolioId) {
      setPortfolioId(portfolios[0].id);
    } else if (portfolios.length > 0 && portfolioId && !portfolios.find(p => p.id === portfolioId)) {
      setPortfolioId(portfolios[0].id);
    }
  }, [portfolios, portfolioId]);

  const currentHolding = useMemo(() => {
    if (!portfolioId) return null;
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (!portfolio?.holdings) return null;
    return portfolio.holdings.find((h: Holding) => h.symbol === symbol) || null;
  }, [portfolioId, portfolios, symbol]);

  const holdingQuantity = currentHolding?.quantity ?? 0;
  
  // Calculate max buy quantity with precision handling to avoid going over cash balance
  const maxBuyQuantity = useMemo(() => {
    if (currentPrice <= 0) return 0;
    // Floor to 6 decimal places to ensure we don't exceed cash balance
    const rawQty = cashBalance / currentPrice;
    return Math.floor(rawQty * 1000000) / 1000000;
  }, [cashBalance, currentPrice]);

  const total = parseFloat(quantity || "0") * currentPrice;

  const handlePercentage = (percent: number) => {
    if (orderType === "BUY") {
      if (percent === 100) {
        // For 100%, use exact max quantity to avoid exceeding balance
        setQuantity(maxBuyQuantity > 0 ? maxBuyQuantity.toFixed(6) : "");
      } else {
        const qty = (maxBuyQuantity * percent) / 100;
        setQuantity(qty > 0 ? qty.toFixed(6) : "");
      }
      setSliderValue(percent);
    } else {
      const qty = (holdingQuantity * percent) / 100;
      setQuantity(qty > 0 ? qty.toFixed(6) : "");
      setSliderValue(percent);
    }
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    if (orderType === "BUY") {
      if (value === 100) {
        setQuantity(maxBuyQuantity > 0 ? maxBuyQuantity.toFixed(6) : "");
      } else {
        const qty = (maxBuyQuantity * value) / 100;
        setQuantity(qty > 0 ? qty.toFixed(6) : "");
      }
    } else {
      const qty = (holdingQuantity * value) / 100;
      setQuantity(qty > 0 ? qty.toFixed(6) : "");
    }
  };

  useEffect(() => {
    setSliderValue(0);
    setQuantity("");
  }, [orderType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(quantity) > 0) {
      onSubmit(orderType, parseFloat(quantity), portfolioId);
      setQuantity("");
      setSliderValue(0);
    }
  };

  const percentButtons = [25, 50, 75, 100];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Order Type Toggle */}
      <div className="flex rounded overflow-hidden border border-neutral-800">
        {(["BUY", "SELL"] as OrderType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setOrderType(t)}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              orderType === t
                ? t === "BUY"
                  ? "bg-success-500 text-white"
                  : "bg-danger-500 text-white"
                : "text-neutral-400 hover:bg-neutral-800/60 bg-neutral-900/50"
            }`}
          >
            {t === "BUY" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      {/* Portfolio selector */}
      {portfolios.length > 0 && (
        <div className="space-y-1">
          <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
            Portfolio
          </label>
          <select
            className="w-full rounded border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
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

      {/* Available Balance / Holdings Info */}
      <div className="text-xs flex justify-between py-3 px-4 rounded border border-neutral-800/50 bg-neutral-900/30">
        {orderType === "BUY" ? (
          <>
            <span className="text-neutral-500">Available Cash:</span>
            <span className="text-white font-medium">{formatCurrency(cashBalance)}</span>
          </>
        ) : (
          <>
            <span className="text-neutral-500">Available to Sell:</span>
            <span className="text-white font-medium">
              {holdingQuantity > 0 ? `${formatNumber(holdingQuantity, 4)} ${symbol}` : `No ${symbol} holdings`}
            </span>
          </>
        )}
      </div>

      {/* Percentage Buttons */}
      <div className="flex gap-2">
        {percentButtons.map((pct) => (
          <button
            key={pct}
            type="button"
            onClick={() => handlePercentage(pct)}
            disabled={orderType === "SELL" && holdingQuantity === 0}
            className={`flex-1 py-2 text-xs font-bold rounded border transition ${
              sliderValue === pct
                ? orderType === "BUY"
                  ? "bg-success-500/20 border-success-500/50 text-success-500"
                  : "bg-danger-500/20 border-danger-500/50 text-danger-500"
                : "border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {pct}%
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          disabled={orderType === "SELL" && holdingQuantity === 0}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, ${
              orderType === "BUY" ? "#22c55e" : "#ef4444"
            } 0%, ${
              orderType === "BUY" ? "#22c55e" : "#ef4444"
            } ${sliderValue}%, #262626 ${sliderValue}%, #262626 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-neutral-600">
          <span>0%</span>
          <span className={`font-medium ${orderType === "BUY" ? "text-success-500" : "text-danger-500"}`}>
            {sliderValue}%
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Quantity Input */}
      <Input
        label="Quantity"
        type="number"
        step="any"
        min="0"
        value={quantity}
        onChange={(e) => {
          setQuantity(e.target.value);
          const qty = parseFloat(e.target.value) || 0;
          if (orderType === "BUY" && maxBuyQuantity > 0) {
            setSliderValue(Math.min(100, (qty / maxBuyQuantity) * 100));
          } else if (orderType === "SELL" && holdingQuantity > 0) {
            setSliderValue(Math.min(100, (qty / holdingQuantity) * 100));
          }
        }}
        placeholder="0.00"
      />

      {/* Order Summary */}
      <div className="rounded border border-neutral-800/50 bg-neutral-900/30 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Symbol</span>
          <span className="font-medium text-white">{symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Market Price</span>
          <span className="text-neutral-300">{currentPrice ? formatCurrency(currentPrice) : "--"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Quantity</span>
          <span className="text-neutral-300">{quantity ? formatNumber(parseFloat(quantity), 6) : "0"}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-neutral-800/50">
          <span className="text-neutral-500">Estimated {orderType === "BUY" ? "Cost" : "Proceeds"}</span>
          <span className={`font-bold ${orderType === "BUY" ? "text-danger-500" : "text-success-500"}`}>
            {currentPrice ? formatCurrency(total) : "--"}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !quantity || parseFloat(quantity) <= 0 || !currentPrice}
        className={`w-full py-3 text-sm font-semibold rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          orderType === "BUY"
            ? "bg-success-500 text-white hover:bg-success-600"
            : "bg-danger-500 text-white hover:bg-danger-600"
        }`}
      >
        {isLoading ? "Processing..." : `${orderType === "BUY" ? "Buy" : "Sell"} ${symbol}`}
      </button>
    </form>
  );
}
