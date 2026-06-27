"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

/**
 * Labelled text input with a calm underline-to-box treatment. Focus ring is the
 * global olive ring; the border deepens on focus rather than glowing.
 */
export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, hint, className, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={fieldId}
          className="text-[0.78rem] font-medium tracking-wide text-ink-soft"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            "h-12 rounded bg-surface px-4 text-[0.95rem] text-ink",
            "border border-line placeholder:text-ink-soft/55",
            "transition-colors duration-150 ease-out",
            "hover:border-ink/25 focus:border-olive focus:outline-none",
            className
          )}
          {...props}
        />
        {hint && <p className="text-[0.78rem] text-ink-soft/80">{hint}</p>}
      </div>
    );
  }
);
Field.displayName = "Field";
