"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Ask about investing, diversification, risk management...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }
  }, [value]);

  return (
    <div className="flex gap-3 items-end p-4 border-t border-neutral-800/50 bg-neutral-950/30">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          "flex-1 min-h-[44px] max-h-[120px] resize-none rounded-xl",
          "border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-white",
          "placeholder:text-neutral-500",
          "focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all duration-200"
        )}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className={cn(
          "h-11 px-5 rounded-xl font-medium",
          "bg-gradient-to-r from-gold-600 to-gold-500 text-black",
          "hover:shadow-lg hover:shadow-gold-600/20 transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        )}
      >
        Send
      </button>
    </div>
  );
}
