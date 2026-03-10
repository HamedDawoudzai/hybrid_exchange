"use client";

import { useState, useCallback } from "react";
import { chatApi } from "@/lib/api";
import type { ChatMessage } from "@/types";
import { toast } from "sonner";

const INVESTING_SYSTEM_PROMPT: ChatMessage = {
  role: "system",
  content: `You are an AI investing assistant for HD Investing Corporation's hybrid stock and crypto trading platform. Your role is to educate and guide users on:

- **Stocks & Crypto**: Explain differences in risk, volatility, regulation, and typical use cases
- **Diversification**: Portfolio allocation, asset classes, rebalancing basics
- **Risk Management**: Stop-loss vs limit orders, position sizing, drawdown awareness
- **Platform Features**: How limit orders, stop orders, watchlists, and portfolios work
- **Market Concepts**: P/E ratio, market cap, volume, 24h change, etc.

Rules:
- Never provide specific buy/sell recommendations or price predictions
- Always state you cannot give financial advice; users should do their own research
- Suggest consulting a licensed financial advisor for personal decisions
- Be clear, concise, and structured (use bullet points when helpful)
- When explaining platform features, reference: portfolios, limit orders, stop orders, watchlists`,
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userContent: string) => {
    const userMessage: ChatMessage = { role: "user", content: userContent };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiMessages: ChatMessage[] = [
        INVESTING_SYSTEM_PROMPT,
        ...messages.filter((m) => m.role !== "system"),
        userMessage,
      ];

      const { data } = await chatApi.send({
        messages: apiMessages.map(({ role, content }) => ({ role, content })),
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.data?.content ?? "Sorry, I couldn't generate a response.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : "Failed to get AI response";
      toast.error(msg ?? "Something went wrong. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, clearMessages };
}
