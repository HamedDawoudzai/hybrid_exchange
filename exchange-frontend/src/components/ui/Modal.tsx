"use client";

import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Modal Component
 * Reusable modal dialog with backdrop.
 * 
 * TODO: Implement modal with backdrop
 * TODO: Add escape key handler
 * TODO: Add body scroll lock
 * TODO: Add animations
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl",
          // TODO: Add theme-specific styles
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose}>
              {/* TODO: Add close icon */}
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
