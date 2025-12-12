"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  // Close on escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl border border-slate-800/70",
          "bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/40",
          "animate-in fade-in zoom-in duration-150",
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/70">
            <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 text-slate-100">{children}</div>
      </div>
    </div>
  );
}