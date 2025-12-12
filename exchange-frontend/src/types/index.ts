// Enums
export type AssetType = "STOCK" | "CRYPTO";
export type OrderType = "BUY" | "SELL";
export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED";

// User types
export interface User {
  id: number;
  username: string;
  email: string;
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
  cashBalance: number;
  totalValue?: number;
  holdings?: Holding[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
  initialBalance?: number;
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

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

