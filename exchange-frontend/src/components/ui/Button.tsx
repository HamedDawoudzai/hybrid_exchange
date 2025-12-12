import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

/**
 * Button Component
 * Reusable button with variants, sizes, and loading state.
 * 
 * TODO: Implement button styles for all variants
 * TODO: Implement size variations
 * TODO: Add loading spinner
 */
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
          "inline-flex items-center justify-center font-medium rounded-lg transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // TODO: Add variant styles
          // TODO: Add size styles
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="mr-2">Loading...</span>
          // TODO: Add loading spinner SVG
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
