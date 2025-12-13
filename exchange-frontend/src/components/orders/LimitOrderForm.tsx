"use client";

import { useState, useEffect, useMemo } from "react";
import { useLimitOrders } from "@/hooks/useLimitOrders";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { toast } from "sonner";
import type { Portfolio, Holding, OrderType } from "@/types";

interface LimitOrderFormProps {
  symbol: string;
  currentPrice: number;
  portfolios: Portfolio[];
  onSuccess?: () => void;
}

export function LimitOrderForm({ symbol, currentPrice, portfolios, onSuccess }: LimitOrderFormProps) {
  const { user } = useAuth();
  const { createLimitOrder, isCreating } = useLimitOrders();
  
  const [orderType, setOrderType] = useState<OrderType>("BUY");
  const [targetPrice, setTargetPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [portfolioId, setPortfolioId] = useState<number | undefined>(undefined);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (portfolios.length > 0 && !portfolioId) {
      setPortfolioId(portfolios[0].id);
    }
  }, [portfolios, portfolioId]);

  useEffect(() => {
    // Pre-fill target price with current price
    if (currentPrice > 0 && !targetPrice) {
      setTargetPrice(currentPrice.toFixed(2));
    }
  }, [currentPrice]);

  const selectedPortfolio = portfolios.find(p => p.id === portfolioId);
  const holdingQuantity = useMemo(() => {
    if (!selectedPortfolio?.holdings) return 0;
    const holding = selectedPortfolio.holdings.find((h: Holding) => h.symbol === symbol);
    return holding?.quantity ?? 0;
  }, [selectedPortfolio, symbol]);

  const cashBalance = user?.cashBalance ?? 0;
  const parsedTargetPrice = parseFloat(targetPrice) || 0;
  const parsedQuantity = parseFloat(quantity) || 0;
  const estimatedTotal = parsedTargetPrice * parsedQuantity;

  // Max quantities for slider/percent buttons
  const maxBuyQuantity = useMemo(() => {
    if (parsedTargetPrice <= 0) return 0;
    const raw = cashBalance / parsedTargetPrice;
    // Floor to 6 decimals to avoid going over reserved cash
    return Math.floor(raw * 1_000_000) / 1_000_000;
  }, [cashBalance, parsedTargetPrice]);

  const maxSellQuantity = holdingQuantity;

  // For BUY: price discount from current
  // For SELL: price premium from current
  const priceDiff = parsedTargetPrice - currentPrice;
  const priceDiffPercent = currentPrice > 0 ? (priceDiff / currentPrice) * 100 : 0;

  const canSubmit = 
    portfolioId &&
    parsedTargetPrice > 0 &&
    parsedQuantity > 0 &&
    (orderType === "BUY" ? estimatedTotal <= cashBalance : parsedQuantity <= holdingQuantity);

  // Percent buttons
  const percentButtons = [25, 50, 75, 100];

  const handlePercentage = (pct: number) => {
    if (orderType === "BUY") {
      const qty = maxBuyQuantity * (pct / 100);
      setQuantity(qty > 0 ? qty.toFixed(6) : "");
    } else {
      const qty = maxSellQuantity * (pct / 100);
      setQuantity(qty > 0 ? qty.toFixed(6) : "");
    }
    setSliderValue(pct);
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    if (orderType === "BUY") {
      const qty = maxBuyQuantity * (value / 100);
      setQuantity(qty > 0 ? qty.toFixed(6) : "");
    } else {
      const qty = maxSellQuantity * (value / 100);
      setQuantity(qty > 0 ? qty.toFixed(6) : "");
    }
  };

  useEffect(() => {
    // Reset slider when switching type or changing target price significantly
    setSliderValue(0);
  }, [orderType, parsedTargetPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !portfolioId) return;

    try {
      await createLimitOrder({
        portfolioId,
        symbol,
        type: orderType,
        targetPrice: parsedTargetPrice,
        quantity: parsedQuantity,
      });
      
      toast.success(`Limit ${orderType.toLowerCase()} order created for ${symbol}`);
      setTargetPrice("");
      setQuantity("");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create limit order");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Order Type Toggle */}
      <div className="flex rounded overflow-hidden border border-neutral-800">
        {(["BUY", "SELL"] as OrderType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setOrderType(t)}
            className={`flex-1 py-2.5 text-sm font-semibold transition ${
              orderType === t
                ? t === "BUY"
                  ? "bg-success-500 text-white"
                  : "bg-danger-500 text-white"
                : "text-neutral-400 hover:bg-neutral-800/60 bg-neutral-900/50"
            }`}
          >
            Limit {t === "BUY" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      {/* Portfolio Selector */}
      {portfolios.length > 0 && (
        <div>
          <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
            Portfolio
          </label>
          <select
            className="w-full rounded border border-neutral-800 bg-neutral-900/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-600/50 transition"
            value={portfolioId}
            onChange={(e) => setPortfolioId(Number(e.target.value))}
          >
            {portfolios.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Available Balance/Holdings Info */}
      <div className="text-xs flex justify-between py-2.5 px-3 rounded border border-neutral-800/50 bg-neutral-900/30">
        {orderType === "BUY" ? (
          <>
            <span className="text-neutral-500">Available Cash:</span>
            <span className="text-white font-medium">{formatCurrency(cashBalance)}</span>
          </>
        ) : (
          <>
            <span className="text-neutral-500">Available to Sell:</span>
            <span className="text-white font-medium">
              {holdingQuantity > 0 ? `${formatNumber(holdingQuantity, 4)} ${symbol}` : `No ${symbol}`}
            </span>
          </>
        )}
      </div>

      {/* Target Price */}
      <div>
        <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
          Target Price
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-full rounded border border-neutral-800 bg-neutral-900/50 pl-7 pr-3 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600/50 transition"
            placeholder="0.00"
          />
        </div>
        {parsedTargetPrice > 0 && currentPrice > 0 && (
          <p className={`text-xs mt-1 ${priceDiff < 0 ? "text-success-500" : priceDiff > 0 ? "text-danger-500" : "text-neutral-500"}`}>
            {priceDiff >= 0 ? "+" : ""}{priceDiffPercent.toFixed(2)}% vs current ({formatCurrency(currentPrice)})
          </p>
        )}
      </div>

      {/* Quantity + Percent Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500">
            Quantity
          </label>
          <div className="flex gap-2">
            {percentButtons.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentage(pct)}
                disabled={orderType === "BUY" ? maxBuyQuantity === 0 : maxSellQuantity === 0}
                className={`px-2 py-1 text-[11px] rounded border transition ${
                  sliderValue === pct
                    ? orderType === "BUY"
                      ? "bg-success-500/20 border-success-500/50 text-success-400"
                      : "bg-danger-500/20 border-danger-500/50 text-danger-400"
                    : "border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
        <input
          type="number"
          step="any"
          min="0"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            const q = parseFloat(e.target.value) || 0;
            if (orderType === "BUY" && maxBuyQuantity > 0) {
              setSliderValue(Math.min(100, (q / maxBuyQuantity) * 100));
            } else if (orderType === "SELL" && maxSellQuantity > 0) {
              setSliderValue(Math.min(100, (q / maxSellQuantity) * 100));
            }
          }}
          className="w-full rounded border border-neutral-800 bg-neutral-900/50 px-3 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600/50 transition"
          placeholder="0.00"
        />
      </div>

      {/* Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          disabled={
            (orderType === "BUY" && (parsedTargetPrice <= 0 || maxBuyQuantity === 0)) ||
            (orderType === "SELL" && maxSellQuantity === 0)
          }
          className="w-full h-2 rounded-lg appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, ${
              orderType === "BUY" ? "#22c55e" : "#ef4444"
            } 0%, ${
              orderType === "BUY" ? "#22c55e" : "#ef4444"
            } ${sliderValue}%, #262626 ${sliderValue}%, #262626 100%)`
          }}
        />
        <div className="flex justify-between text-[11px] text-neutral-600">
          <span>0%</span>
          <span className={`font-medium ${orderType === "BUY" ? "text-success-500" : "text-danger-500"}`}>
            {sliderValue}%
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded border border-neutral-800/50 bg-neutral-900/30 p-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Target Price</span>
          <span className="text-white">{parsedTargetPrice > 0 ? formatCurrency(parsedTargetPrice) : "--"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Quantity</span>
          <span className="text-white">{parsedQuantity > 0 ? formatNumber(parsedQuantity, 6) : "0"}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-neutral-800/50">
          <span className="text-neutral-500">{orderType === "BUY" ? "Reserved Amount" : "Est. Proceeds"}</span>
          <span className={`font-semibold ${orderType === "BUY" ? "text-danger-500" : "text-success-500"}`}>
            {estimatedTotal > 0 ? formatCurrency(estimatedTotal) : "--"}
          </span>
        </div>
      </div>

      {/* Validation Message */}
      {orderType === "BUY" && estimatedTotal > cashBalance && (
        <p className="text-xs text-danger-500">Insufficient cash balance</p>
      )}
      {orderType === "SELL" && parsedQuantity > holdingQuantity && (
        <p className="text-xs text-danger-500">Insufficient holdings</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!canSubmit || isCreating}
        className={`w-full py-2.5 text-sm font-semibold rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          orderType === "BUY"
            ? "bg-success-500 text-white hover:bg-success-600"
            : "bg-danger-500 text-white hover:bg-danger-600"
        }`}
      >
        {isCreating ? "Creating..." : `Place Limit ${orderType === "BUY" ? "Buy" : "Sell"} Order`}
      </button>

      <p className="text-[10px] text-neutral-500 text-center">
        {orderType === "BUY" 
          ? "Cash will be reserved until the order is filled or cancelled"
          : "Order will execute when price reaches target"}
      </p>
    </form>
  );
}

