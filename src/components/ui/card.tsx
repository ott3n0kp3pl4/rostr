import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"section">): React.ReactNode {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-[var(--border)] bg-[var(--card)] shadow-[0_20px_50px_-30px_rgba(26,23,39,0.35)]",
        className,
      )}
      {...props}
    />
  );
}
