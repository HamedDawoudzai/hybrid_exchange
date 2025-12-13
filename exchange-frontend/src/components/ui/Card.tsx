import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "glass";
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
        "rounded-lg transition-all duration-300",
        variant === "bordered"
          ? "border border-neutral-800/70 bg-neutral-950/50 backdrop-blur-xl"
          : variant === "glass"
          ? "border border-neutral-800/50 bg-black/40 backdrop-blur-xl"
          : "bg-neutral-900/60 backdrop-blur-xl",
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
    <div className={cn("px-6 py-4 border-b border-neutral-800/50", className)} {...props}>
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
    <h3 className={cn("text-lg font-serif font-semibold text-white", className)} {...props}>
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
    <div className={cn("px-6 py-4 text-neutral-200", className)} {...props}>
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
    <div className={cn("px-6 py-4 border-t border-neutral-800/50", className)} {...props}>
      {children}
    </div>
  );
}
