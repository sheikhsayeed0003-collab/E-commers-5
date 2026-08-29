import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed",
    {
      "bg-primary text-white hover:bg-primary-dark": variant === "primary",
      "bg-secondary text-white hover:bg-secondary/90": variant === "secondary",
      "border border-border bg-white text-secondary hover:bg-surface": variant === "outline",
      "text-secondary hover:bg-surface": variant === "ghost",
      "px-3 py-1.5 text-sm": size === "sm",
      "px-4 py-2 text-sm": size === "md",
      "px-6 py-3 text-base": size === "lg",
    },
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
