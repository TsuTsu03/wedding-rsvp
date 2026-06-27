"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  // Olive fill - the one confident accent.
  solid:
    "bg-olive text-paper hover:bg-olive-soft border border-transparent",
  // Ink hairline - the workhorse.
  outline:
    "bg-transparent text-ink border border-ink/25 hover:border-ink/55 hover:bg-ink/[0.03]",
  ghost:
    "bg-transparent text-ink-soft hover:text-ink border border-transparent",
};

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

/**
 * The pressable primitive. Press feedback is `scale(0.97)` (emil-design-eng);
 * transitions are scoped to exact properties, never `all`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "solid", size = "md", className, children, ...props }, ref) => {
    const sizes = {
      sm: "h-9 px-4 text-[0.8rem]",
      md: "h-11 px-6 text-[0.875rem]",
      lg: "h-[3.25rem] px-8 text-[0.95rem]",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-wide",
          "transition-[transform,background-color,border-color,color] duration-150 ease-out",
          "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
