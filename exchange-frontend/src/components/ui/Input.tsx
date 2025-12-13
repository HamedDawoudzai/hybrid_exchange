import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    const errorClasses = error ? "border-danger-500/50 focus:ring-danger-500/50" : "";
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-white",
            "placeholder:text-neutral-600",
            "focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20",
            "hover:border-neutral-700",
            "transition-all duration-200",
            errorClasses,
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger-400 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
