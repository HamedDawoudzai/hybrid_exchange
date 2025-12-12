import axios from "axios";
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Portfolio,
  CreatePortfolioRequest,
  Asset,
  Order,
  OrderRequest,
  PriceData,
  User,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Axios instance configured for API calls
 * TODO: Add request interceptor for auth token
 * TODO: Add response interceptor for error handling
 */
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO: Implement request interceptor to add auth token

// TODO: Implement response interceptor for error handling

/**
 * Auth API endpoints
 */
export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login", data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register", data),

  logout: () => api.post<ApiResponse<void>>("/auth/logout"),
};

/**
 * User API endpoints
 */
export const userApi = {
  getCurrentUser: () => api.get<ApiResponse<User>>("/users/me"),
};

/**
 * Portfolio API endpoints
 */
export const portfolioApi = {
  getAll: () => api.get<ApiResponse<Portfolio[]>>("/portfolios"),

  getById: (id: number) => api.get<ApiResponse<Portfolio>>(`/portfolios/${id}`),

  create: (data: CreatePortfolioRequest) =>
    api.post<ApiResponse<Portfolio>>("/portfolios", data),

  deposit: (id: number, amount: number) =>
    api.post<ApiResponse<Portfolio>>(`/portfolios/${id}/deposit`, { amount }),

  delete: (id: number) => api.delete<ApiResponse<void>>(`/portfolios/${id}`),
};

/**
 * Asset API endpoints
 */
export const assetApi = {
  getAll: () => api.get<ApiResponse<Asset[]>>("/assets"),

  getStocks: () => api.get<ApiResponse<Asset[]>>("/assets/stocks"),

  getCrypto: () => api.get<ApiResponse<Asset[]>>("/assets/crypto"),

  getBySymbol: (symbol: string) =>
    api.get<ApiResponse<Asset>>(`/assets/${symbol}`),
};

/**
 * Order API endpoints
 */
export const orderApi = {
  place: (data: OrderRequest) =>
    api.post<ApiResponse<Order>>("/orders", data),

  getAll: () => api.get<ApiResponse<Order[]>>("/orders"),

  getByPortfolio: (portfolioId: number) =>
    api.get<ApiResponse<Order[]>>(`/orders/portfolio/${portfolioId}`),

  getById: (id: number) => api.get<ApiResponse<Order>>(`/orders/${id}`),
};

/**
 * Price API endpoints
 */
export const priceApi = {
  getStockPrice: (symbol: string) =>
    api.get<ApiResponse<PriceData>>(`/prices/stock/${symbol}`),

  getCryptoPrice: (symbol: string) =>
    api.get<ApiResponse<PriceData>>(`/prices/crypto/${symbol}`),

  getStockHistory: (symbol: string, resolution: string, from: number, to: number) =>
    api.get<ApiResponse<PriceData[]>>(`/prices/stock/${symbol}/history`, {
      params: { resolution, from, to },
    }),

  getCryptoHistory: (symbol: string, granularity: string, from: number, to: number) =>
    api.get<ApiResponse<PriceData[]>>(`/prices/crypto/${symbol}/history`, {
      params: { granularity, from, to },
    }),
};
