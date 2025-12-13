"use client";

import { useState, useEffect } from "react";
import { useWatchlist, useIsInWatchlist } from "@/hooks/useWatchlist";
import { toast } from "sonner";

interface WatchlistStarProps {
  symbol: string;
  size?: "sm" | "md" | "lg";
}

export function WatchlistStar({ symbol, size = "md" }: WatchlistStarProps) {
  const { inWatchlist, isLoading: isCheckingWatchlist } = useIsInWatchlist(symbol);
  const { addToWatchlist, removeFromWatchlist, isAdding, isRemoving } = useWatchlist();
  const [isInList, setIsInList] = useState(false);

  useEffect(() => {
    setIsInList(inWatchlist);
  }, [inWatchlist]);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || isRemoving || isCheckingWatchlist) return;

    try {
      if (isInList) {
        await removeFromWatchlist(symbol);
        setIsInList(false);
        toast.success(`Removed ${symbol} from watchlist`);
      } else {
        await addToWatchlist(symbol);
        setIsInList(true);
        toast.success(`Added ${symbol} to watchlist`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update watchlist");
    }
  };

  const isLoading = isAdding || isRemoving || isCheckingWatchlist;

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`transition-all duration-200 ${
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
      } ${isInList ? "text-gold-500" : "text-neutral-500 hover:text-gold-400"}`}
      title={isInList ? "Remove from watchlist" : "Add to watchlist"}
    >
      <svg
        className={sizeClasses[size]}
        fill={isInList ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  );
}

