import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:shadow-gold border-0",
  secondary:
    "bg-neutral-800 text-neutral-100 hover:bg-neutral-700 border border-neutral-700",
  outline:
    "border border-neutral-700 text-neutral-300 hover:border-gold-600/50 hover:text-white hover:bg-gold-600/5",
  ghost:
    "text-neutral-300 hover:bg-neutral-800/60 hover:text-white",
  danger:
    "bg-danger-500 text-white hover:bg-danger-600 border border-danger-500/70",
  gold:
    "bg-gradient-to-r from-gold-600 to-gold-500 text-black font-semibold hover:shadow-gold",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-sm rounded",
  md: "px-5 py-2.5 text-sm rounded",
  lg: "px-6 py-3 text-base rounded",
};

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"
    />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-gold-600/50 focus:ring-offset-1 focus:ring-offset-black",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner />}
        {isLoading && <span className="ml-2">Loading...</span>}
        {!isLoading && children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
