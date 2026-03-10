"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  if (message.role === "system") return null;

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-gradient-to-br from-gold-600/20 to-gold-500/10 border border-gold-600/30 text-white"
            : "bg-neutral-800/80 border border-neutral-700/50 text-neutral-100"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
