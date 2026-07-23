import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_12px_30px_-14px_var(--primary)] hover:brightness-105",
        secondary:
          "bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--secondary-hover)]",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--secondary)]",
        ghost:
          "bg-transparent text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]",
      },
      size: {
        default: "h-12",
        lg: "h-14 text-base",
        icon: "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps): React.ReactNode {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
