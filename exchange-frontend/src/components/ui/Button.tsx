import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-indigo-500 text-white hover:bg-indigo-600 border border-indigo-500/70 shadow-sm shadow-indigo-500/20",
  secondary:
    "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
  outline:
    "border border-slate-700 text-slate-100 hover:bg-slate-800/60",
  ghost:
    "text-slate-100 hover:bg-slate-800/60",
  danger:
    "bg-rose-500 text-white hover:bg-rose-600 border border-rose-500/70 shadow-sm shadow-rose-500/20",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-2 text-sm rounded-md",
  md: "px-4 py-2.5 text-sm rounded-lg",
  lg: "px-5 py-3 text-base rounded-lg",
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
          "inline-flex items-center justify-center font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-slate-900",
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