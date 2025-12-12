import { create } from "zustand";
import type { Portfolio } from "@/types";

interface PortfolioState {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  setPortfolios: (portfolios: Portfolio[]) => void;
  addPortfolio: (portfolio: Portfolio) => void;
  updatePortfolio: (portfolio: Portfolio) => void;
  removePortfolio: (id: number) => void;
  selectPortfolio: (portfolio: Portfolio | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolios: [],
  selectedPortfolio: null,
  isLoading: false,
  error: null,

  setPortfolios: (portfolios) => set({ portfolios }),
  addPortfolio: (portfolio) => set((state) => ({ portfolios: [...state.portfolios, portfolio] })),
  updatePortfolio: (portfolio) =>
    set((state) => ({
      portfolios: state.portfolios.map((p) => (p.id === portfolio.id ? portfolio : p)),
    })),
  removePortfolio: (id) =>
    set((state) => ({
      portfolios: state.portfolios.filter((p) => p.id !== id),
      selectedPortfolio:
        state.selectedPortfolio && state.selectedPortfolio.id === id
          ? null
          : state.selectedPortfolio,
    })),
  selectPortfolio: (portfolio) => set({ selectedPortfolio: portfolio }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));