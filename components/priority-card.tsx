"use client";

import React from "react";
import { Priority } from "@/types/priority";
import { StatusBadge } from "./status-badge";
import { ReasonBadge } from "./reason-badge";
import { formatTimeShort } from "@/lib/date";
import { Check } from "lucide-react";

interface PriorityCardProps {
  priority: Priority;
  onToggleAccepted: (id: string, currentAccepted: boolean) => void;
}

export function PriorityCard({ priority, onToggleAccepted }: PriorityCardProps) {
  const isAccepted = priority.status === "aceito";

  return (
    <div
      className={`rounded-xl p-4 border transition-all duration-200 flex flex-col gap-3 ${
        isAccepted
          ? "bg-slate-50/70 border-emerald-200/70 opacity-75"
          : "bg-white border-slate-200/90 shadow-sm"
      }`}
    >
      {/* Top Header: Código e Horário */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200/80">
          {priority.customer_code}
        </span>
        <span className="font-mono text-xs text-slate-500">
          {formatTimeShort(priority.created_at)}
        </span>
      </div>

      {/* Nome do Cliente */}
      <div>
        <h3
          className={`font-heading text-base font-semibold leading-tight ${
            isAccepted ? "text-slate-600" : "text-slate-900"
          }`}
        >
          {priority.customer_name}
        </h3>
      </div>

      {/* Motivo */}
      <div className="flex items-center gap-2">
        <ReasonBadge reason={priority.reason} />
      </div>

      {/* Observação se houver */}
      {priority.notes && (
        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed">
          {priority.notes}
        </p>
      )}

      {/* Ação de Aceite (Hit-target 48px) e Status */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
        <label
          className="flex items-center gap-2.5 cursor-pointer py-2 px-1 -ml-1 rounded-lg hover:bg-slate-100/60 transition-colors select-none min-h-[44px]"
        >
          <input
            type="checkbox"
            checked={isAccepted}
            onChange={() => onToggleAccepted(priority.id, isAccepted)}
            className="sr-only peer"
            aria-label={`Marcar prioridade do cliente ${priority.customer_name} como ${
              isAccepted ? "pendente" : "aceita"
            }`}
          />
          <div
            className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
              isAccepted
                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                : "border-slate-300 bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-slate-900"
            }`}
          >
            {isAccepted && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
          <span className="text-xs font-semibold text-slate-700">
            {isAccepted ? "Aceito" : "Marcar Aceite"}
          </span>
        </label>

        <StatusBadge status={priority.status} />
      </div>
    </div>
  );
}
