"use client";

import { useEffect, useMemo, useState } from "react";
import { useStopOrders } from "@/hooks/useStopOrders";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { toast } from "sonner";
import type { Portfolio, Holding } from "@/types";

interface StopLossFormProps {
  symbol: string;
  currentPrice: number;
  portfolios: Portfolio[];
  onSuccess?: () => void;
}

export function StopLossForm({ symbol, currentPrice, portfolios, onSuccess }: StopLossFormProps) {
  const { user } = useAuth();
  const { createStopOrder, isCreating } = useStopOrders();

  const [stopPrice, setStopPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [portfolioId, setPortfolioId] = useState<number | undefined>(undefined);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (portfolios.length > 0 && !portfolioId) {
      setPortfolioId(portfolios[0].id);
    }
  }, [portfolios, portfolioId]);

  useEffect(() => {
    if (currentPrice > 0 && !stopPrice) {
      // common pattern: set stop a bit below current, but leave blank to avoid assumptions
      setStopPrice("");
    }
  }, [currentPrice]);

  const selectedPortfolio = portfolios.find((p) => p.id === portfolioId);
  const holdingQuantity = useMemo(() => {
    if (!selectedPortfolio?.holdings) return 0;
    const holding = selectedPortfolio.holdings.find((h: Holding) => h.symbol === symbol);
    return holding?.quantity ?? 0;
  }, [selectedPortfolio, symbol]);

  const parsedStopPrice = parseFloat(stopPrice) || 0;
  const parsedQuantity = parseFloat(quantity) || 0;

  const maxSellQuantity = holdingQuantity;

  const canSubmit =
    portfolioId &&
    parsedStopPrice > 0 &&
    parsedQuantity > 0 &&
    parsedQuantity <= holdingQuantity;

  // Percent buttons
  const percentButtons = [25, 50, 75, 100];

  const handlePercentage = (pct: number) => {
    const qty = maxSellQuantity * (pct / 100);
    setQuantity(qty > 0 ? qty.toFixed(6) : "");
    setSliderValue(pct);
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    const qty = maxSellQuantity * (value / 100);
    setQuantity(qty > 0 ? qty.toFixed(6) : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !portfolioId) return;

    try {
      await createStopOrder({
        portfolioId,
        symbol,
        type: "SELL",
        stopPrice: parsedStopPrice,
        quantity: parsedQuantity,
      });
      toast.success(`Stop-loss set for ${symbol}`);
      setQuantity("");
      setSliderValue(0);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create stop-loss");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Holdings Info */}
      <div className="text-xs flex justify-between py-2.5 px-3 rounded border border-neutral-800/50 bg-neutral-900/30">
        <span className="text-neutral-500">Available to Sell:</span>
        <span className="text-white font-medium">
          {holdingQuantity > 0 ? `${formatNumber(holdingQuantity, 4)} ${symbol}` : `No ${symbol}`}
        </span>
      </div>

      {/* Stop Price */}
      <div>
        <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
          Stop Price
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={stopPrice}
            onChange={(e) => setStopPrice(e.target.value)}
            className="w-full rounded border border-neutral-800 bg-neutral-900/50 pl-7 pr-3 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-gold-600/50 transition"
            placeholder="0.00"
          />
        </div>
        {parsedStopPrice > 0 && currentPrice > 0 && (
          <p className="text-xs mt-1 text-neutral-500">
            Current: {formatCurrency(currentPrice)} | Trigger when ≤ {formatCurrency(parsedStopPrice)}
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
                disabled={maxSellQuantity === 0}
                className={`px-2 py-1 text-[11px] rounded border transition ${
                  sliderValue === pct
                    ? "bg-danger-500/20 border-danger-500/50 text-danger-400"
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
            if (maxSellQuantity > 0) {
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
          disabled={maxSellQuantity === 0}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${sliderValue}%, #262626 ${sliderValue}%, #262626 100%)`,
          }}
        />
        <div className="flex justify-between text-[11px] text-neutral-600">
          <span>0%</span>
          <span className="font-medium text-danger-500">{sliderValue}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded border border-neutral-800/50 bg-neutral-900/30 p-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Stop Price</span>
          <span className="text-white">{parsedStopPrice > 0 ? formatCurrency(parsedStopPrice) : "--"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Quantity</span>
          <span className="text-white">{parsedQuantity > 0 ? formatNumber(parsedQuantity, 6) : "0"}</span>
        </div>
      </div>

      {/* Validation */}
      {parsedQuantity > holdingQuantity && (
        <p className="text-xs text-danger-500">Insufficient holdings</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit || isCreating}
        className="w-full py-2.5 text-sm font-semibold rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-danger-500 text-white hover:bg-danger-600"
      >
        {isCreating ? "Creating..." : "Place Stop-Loss Sell"}
      </button>

      <p className="text-[10px] text-neutral-500 text-center">
        Order triggers when price ≤ stop price, then sells at market.
      </p>
    </form>
  );
}

