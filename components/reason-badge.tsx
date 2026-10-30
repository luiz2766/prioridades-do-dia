import React from "react";
import { Zap, Handshake, AlertTriangle, MessageSquare, Tag, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReasonBadgeProps {
  reason: string;
  className?: string;
}

export function ReasonBadge({ reason, className }: ReasonBadgeProps) {
  const normalized = reason.toLowerCase();

  if (normalized.includes("urgente")) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 font-medium text-xs px-2.5 py-0.5 rounded-full bg-amber-100/70 text-amber-900 border border-amber-200",
          className
        )}
      >
        <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
        {reason}
      </span>
    );
  }

  if (normalized.includes("negociação") || normalized.includes("negociacao")) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 font-medium text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200",
          className
        )}
      >
        <Handshake className="w-3 h-3 text-blue-600" />
        {reason}
      </span>
    );
  }

  if (normalized.includes("inadimplência") || normalized.includes("inadimplencia")) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 font-medium text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200",
          className
        )}
      >
        <AlertTriangle className="w-3 h-3 text-red-600" />
        {reason}
      </span>
    );
  }

  if (normalized.includes("reclamação") || normalized.includes("reclamacao")) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 font-medium text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-900 border border-orange-200",
          className
        )}
      >
        <MessageSquare className="w-3 h-3 text-orange-600" />
        {reason}
      </span>
    );
  }

  if (normalized.includes("exclusivo")) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 font-medium text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200",
          className
        )}
      >
        <Star className="w-3 h-3 text-purple-600 fill-purple-500" />
        {reason}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200",
        className
      )}
    >
      <Tag className="w-3 h-3 text-slate-500" />
      {reason}
    </span>
  );
}
