"use client";

import { usePortfolioStore } from "@/store/portfolioStore";
import type { CreatePortfolioRequest, Portfolio } from "@/types";

/**
 * usePortfolios Hook
 * Provides portfolio list functionality including fetch, create, delete, and deposit.
 * 
 * TODO: Implement portfolios query with React Query
 * TODO: Implement create portfolio mutation
 * TODO: Implement delete portfolio mutation
 * TODO: Implement deposit mutation
 * TODO: Sync with portfolio store
 */
export function usePortfolios() {
  const { portfolios, setPortfolios } = usePortfolioStore();

  const createPortfolio = (data: CreatePortfolioRequest) => {
    // TODO: Implement create portfolio with API call
    console.log("Create portfolio not implemented", data);
  };

  const deletePortfolio = (id: number) => {
    // TODO: Implement delete portfolio with API call
    console.log("Delete portfolio not implemented", id);
  };

  const deposit = ({ id, amount }: { id: number; amount: number }) => {
    // TODO: Implement deposit with API call
    console.log("Deposit not implemented", { id, amount });
  };

  return {
    portfolios,
    isLoading: false,
    error: null,
    refetch: () => {},
    createPortfolio,
    deletePortfolio,
    deposit,
    isCreating: false,
    isDeleting: false,
    isDepositing: false,
  };
}

/**
 * usePortfolio Hook
 * Provides single portfolio details by ID.
 * 
 * TODO: Implement portfolio query with React Query
 * TODO: Include holdings with current prices
 */
export function usePortfolio(id: number) {
  return {
    portfolio: null as Portfolio | null,
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}
