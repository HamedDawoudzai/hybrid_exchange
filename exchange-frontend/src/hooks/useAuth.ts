"use client";

import { useAuthStore } from "@/store/authStore";
import type { LoginRequest, RegisterRequest } from "@/types";

/**
 * useAuth Hook
 * Provides authentication functionality including login, register, and logout.
 * 
 * TODO: Implement login mutation with React Query
 * TODO: Implement register mutation with React Query
 * TODO: Implement logout with API call and store cleanup
 * TODO: Implement current user query
 * TODO: Handle auth redirects
 */
export function useAuth() {
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogin = (data: LoginRequest) => {
    // TODO: Implement login with API call and store update
    console.log("Login not implemented", data);
  };

  const handleRegister = (data: RegisterRequest) => {
    // TODO: Implement register with API call and store update
    console.log("Register not implemented", data);
  };

  const handleLogout = async () => {
    // TODO: Implement logout with API call and redirect
    logout();
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isLoggingIn: false,
    isRegistering: false,
    loginError: null,
    registerError: null,
  };
}
