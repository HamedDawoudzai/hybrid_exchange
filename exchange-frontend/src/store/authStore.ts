import { create } from "zustand";
import type { User } from "@/types";

/**
 * Auth Store State Interface
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Auth Store
 * Manages authentication state including user, token, and auth status.
 * 
 * TODO: Implement Zustand store with persist middleware
 * TODO: Implement login action (set user, token, save to localStorage)
 * TODO: Implement logout action (clear user, token, remove from localStorage)
 * TODO: Implement token persistence across sessions
 */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    // TODO: Implement setUser
    set({ user });
  },

  setToken: (token) => {
    // TODO: Implement setToken with localStorage persistence
    set({ token });
  },

  login: (user, token) => {
    // TODO: Implement login with localStorage persistence
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    // TODO: Implement logout with localStorage cleanup
    set({ user: null, token: null, isAuthenticated: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
