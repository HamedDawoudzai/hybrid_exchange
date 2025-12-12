import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl transition shadow-lg",
        variant === "bordered"
          ? "border border-slate-800/70 bg-white/5 backdrop-blur-xl"
          : "bg-slate-900/60 backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader Component
 */
export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4 border-b border-slate-800/50", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardTitle Component
 */
export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-slate-100", className)} {...props}>
      {children}
    </h3>
  );
}

/**
 * CardContent Component
 */
export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4 text-slate-100", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardFooter Component
 */
export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4 border-t border-slate-800/50", className)} {...props}>
      {children}
    </div>
  );
}