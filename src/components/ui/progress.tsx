import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps): React.ReactNode {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-[var(--progress-track)]", className)}>
      <motion.div
        animate={{ width: `${safeValue}%` }}
        className="h-full rounded-full bg-[var(--primary)]"
        initial={false}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
