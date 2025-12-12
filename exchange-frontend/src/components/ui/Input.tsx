import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    const errorClasses = error ? "border-rose-500/70 focus:ring-rose-500" : "";
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs uppercase tracking-[0.15em] text-slate-400">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-100",
            "placeholder:text-slate-500",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500",
            "hover:border-slate-700",
            errorClasses,
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };