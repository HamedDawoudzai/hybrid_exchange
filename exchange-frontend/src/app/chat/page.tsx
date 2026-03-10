"use client";

import { useChat } from "@/hooks/useChat";
import { ChatMessageBubble } from "@/components/chat/ChatMessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage() {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gold-600/3 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/3 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 max-w-4xl mx-auto w-full">
        <header className="px-4 py-6 border-b border-neutral-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-px bg-gold-600/50" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600">
                  AI Assistant
                </p>
              </div>
              <h1 className="text-2xl font-serif font-light text-white">
                Investing Advisor
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Ask questions about stocks, crypto, diversification, and more
              </p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-lg transition-all"
              >
                New chat
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-600/10 border border-gold-600/20 text-gold-600 mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5m-4 0H9"
                  />
                </svg>
              </span>
              <h2 className="text-lg font-serif text-white mb-2">
                How can I help with your investing?
              </h2>
              <p className="text-sm text-neutral-500 max-w-md">
                I can explain concepts, suggest strategies, and answer questions.
                I don&apos;t give financial advice—always do your own research.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {[
                  "What is diversification?",
                  "Stocks vs crypto risk?",
                  "How do limit orders work?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="px-4 py-2 text-sm rounded-lg border border-neutral-700 text-neutral-400 hover:border-gold-600/50 hover:text-gold-500 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessageBubble key={i} message={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-neutral-800/80 border border-neutral-700/50">
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" />
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="sticky bottom-0">
          <ChatInput
            onSend={sendMessage}
            disabled={isLoading}
            placeholder="Ask about investing, diversification, risk management..."
          />
        </div>
      </div>
    </div>
  );
}
