import { create } from "zustand";
import type { Portfolio } from "@/types";

/**
 * Portfolio Store State Interface
 */
interface PortfolioState {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPortfolios: (portfolios: Portfolio[]) => void;
  addPortfolio: (portfolio: Portfolio) => void;
  updatePortfolio: (portfolio: Portfolio) => void;
  removePortfolio: (id: number) => void;
  selectPortfolio: (portfolio: Portfolio | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Portfolio Store
 * Manages portfolio state including list of portfolios and selected portfolio.
 * 
 * TODO: Implement portfolio state management
 * TODO: Implement CRUD operations for portfolios
 * TODO: Implement portfolio selection logic
 */
export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolios: [],
  selectedPortfolio: null,
  isLoading: false,
  error: null,

  setPortfolios: (portfolios) => {
    // TODO: Implement setPortfolios
    set({ portfolios });
  },

  addPortfolio: (portfolio) => {
    // TODO: Implement addPortfolio
    set((state) => ({ portfolios: [...state.portfolios, portfolio] }));
  },

  updatePortfolio: (portfolio) => {
    // TODO: Implement updatePortfolio
    set({ portfolios: [] });
  },

  removePortfolio: (id) => {
    // TODO: Implement removePortfolio
    set({ portfolios: [] });
  },

  selectPortfolio: (portfolio) => {
    // TODO: Implement selectPortfolio
    set({ selectedPortfolio: portfolio });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
