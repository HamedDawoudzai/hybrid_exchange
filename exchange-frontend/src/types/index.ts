// Enums
export type AssetType = "STOCK" | "CRYPTO";
export type OrderType = "BUY" | "SELL";
export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED";
export type StopOrderStatus = "PENDING" | "TRIGGERED" | "FILLED" | "CANCELLED";
export type LimitOrderStatus = "PENDING" | "FILLED" | "CANCELLED" | "EXPIRED";

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  cashBalance?: number;
  reservedCash?: number; // Cash reserved for pending limit buy orders
  totalDeposits?: number;
  totalWithdrawals?: number;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

// Auth types
export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Portfolio types
export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  totalValue?: number;
  holdings?: Holding[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
}

// Asset types
export interface Asset {
  id: number;
  symbol: string;
  name: string;
  type: AssetType;
  description?: string;
  logoUrl?: string;
  currentPrice?: number;
  priceChange24h?: number;
  priceChangePercent24h?: number;
}

// Holding types
export interface Holding {
  id: number;
  symbol: string;
  assetName: string;
  assetType: AssetType;
  quantity: number;
  averageBuyPrice: number;
  currentPrice?: number;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercent?: number;
}

// Order types
export interface Order {
  id: number;
  symbol: string;
  assetName: string;
  assetType: AssetType;
  type: OrderType;
  status: OrderStatus;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  createdAt: string;
}

export interface OrderRequest {
  portfolioId: number;
  symbol: string;
  type: OrderType;
  quantity: number;
}

// Price types
export interface PriceData {
  symbol: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  previousClose?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  timestamp: string;
}

// Watchlist types
export interface WatchlistItem {
  id: number;
  assetId: number;
  symbol: string;
  name: string;
  assetType: AssetType;
  currentPrice?: number;
  priceChange24h?: number;
  priceChangePercent24h?: number;
  addedAt: string;
}

// Limit Order types
export interface LimitOrder {
  id: number;
  portfolioId: number;
  portfolioName: string;
  assetId: number;
  symbol: string;
  assetName: string;
  assetType: AssetType;
  type: OrderType;
  targetPrice: number;
  quantity: number;
  reservedAmount: number;
  status: LimitOrderStatus;
  filledPrice?: number;
  filledAt?: string;
  createdAt: string;
  currentPrice?: number;
}

export interface LimitOrderRequest {
  portfolioId: number;
  symbol: string;
  type: OrderType;
  targetPrice: number;
  quantity: number;
}

// Stop Order types
export interface StopOrder {
  id: number;
  portfolioId: number;
  portfolioName: string;
  assetId: number;
  symbol: string;
  assetName: string;
  assetType: AssetType;
  type: OrderType;
  stopPrice: number;
  quantity: number;
  status: StopOrderStatus;
  filledPrice?: number;
  triggeredAt?: string;
  filledAt?: string;
  createdAt: string;
  currentPrice?: number;
}

export interface StopOrderRequest {
  portfolioId: number;
  symbol: string;
  type: OrderType;
  stopPrice: number;
  quantity: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}