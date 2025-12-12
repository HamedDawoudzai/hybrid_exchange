"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi, userApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest, RegisterRequest, User } from "@/types";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, login: storeLogin, logout: storeLogout } = useAuthStore();

  // Fetch current user if token exists
  const {
    data: currentUser,
    isFetching: isFetchingUser,
  } = useQuery<User | undefined>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await userApi.getCurrentUser();
      return res.data.data;
    },
    enabled: !!token,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (currentUser && token) {
      storeLogin(currentUser, token);
    }
  }, [currentUser, token, storeLogin]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload).then((r) => r.data.data),
    onSuccess: (data) => {
      storeLogin(
        {
          id: data.userId,
          username: data.username,
          email: data.email,
          cashBalance: undefined,
          firstName: data.username,
          lastName: "",
          createdAt: new Date().toISOString(),
        },
        data.token
      );
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/dashboard");
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload).then((r) => r.data.data),
    onSuccess: (data) => {
      storeLogin(
        {
          id: data.userId,
          username: data.username,
          email: data.email,
          cashBalance: undefined,
          firstName: data.username,
          lastName: "",
          createdAt: new Date().toISOString(),
        },
        data.token
      );
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/dashboard");
    },
  });

  // Deposit cash mutation
  const depositMutation = useMutation({
    mutationFn: (amount: number) => userApi.depositCash(amount).then((r) => r.data.data),
    onSuccess: (updatedUser) => {
      if (token) {
        // keep local store in sync
        storeLogin(
          {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            cashBalance: updatedUser.cashBalance,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            createdAt: updatedUser.createdAt,
          },
          token
        );
      }
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  // Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout errors
    }
    storeLogout();
    queryClient.clear();
    router.push("/login");
  };

  return {
    user: currentUser ?? user,
    isAuthenticated,
    isLoadingUser: isFetchingUser,
    login: (payload: LoginRequest) => loginMutation.mutate(payload),
    register: (payload: RegisterRequest) => registerMutation.mutate(payload),
    depositCash: (amount: number) => depositMutation.mutate(amount),
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isDepositing: depositMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    depositError: depositMutation.error,
  };
}