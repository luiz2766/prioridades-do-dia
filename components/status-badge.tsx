import React from "react";
import { Check } from "lucide-react";
import { PriorityStatus } from "@/types/priority";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PriorityStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (status === "aceito") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold tracking-wide",
          "bg-emerald-50 text-emerald-800 border border-emerald-200",
          className
        )}
      >
        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
        Aceito
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold tracking-wide",
        "bg-amber-50 text-amber-800 border border-amber-200",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
      </span>
      Pendente
    </span>
  );
}
