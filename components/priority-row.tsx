"use client";

import React from "react";
import { Priority } from "@/types/priority";
import { StatusBadge } from "./status-badge";
import { ReasonBadge } from "./reason-badge";
import { formatTimeShort, formatDateShort } from "@/lib/date";
import { Check } from "lucide-react";

interface PriorityRowProps {
  priority: Priority;
  onToggleAccepted: (id: string, currentAccepted: boolean) => void;
}

export function PriorityRow({ priority, onToggleAccepted }: PriorityRowProps) {
  const isAccepted = priority.status === "aceito";

  return (
    <tr
      className={`border-b border-slate-100 transition-all duration-200 group ${
        isAccepted
          ? "bg-slate-50/50 opacity-70 hover:opacity-100 hover:bg-slate-50"
          : "hover:bg-slate-50/90 bg-white"
      }`}
    >
      {/* Coluna 1: Checkbox de Aceite (hit-target 44px) */}
      <td className="py-3 px-4 text-center align-middle w-14">
        <label
          className="inline-flex items-center justify-center w-10 h-10 -m-2 cursor-pointer rounded-lg hover:bg-slate-100/80 transition-colors"
          title={isAccepted ? "Clique para reabrir como pendente" : "Clique para marcar como aceito"}
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
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
              isAccepted
                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                : "border-slate-300 bg-white group-hover:border-slate-400 peer-focus-visible:ring-2 peer-focus-visible:ring-slate-900"
            }`}
          >
            {isAccepted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </label>
      </td>

      {/* Coluna 2: Código do Cliente */}
      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900 w-28 whitespace-nowrap">
        <span className="bg-slate-100/90 px-2.5 py-1 rounded-md border border-slate-200/60">
          {priority.customer_code}
        </span>
      </td>

      {/* Coluna 3: Razão Social / Nome Fantasia */}
      <td className="py-3.5 px-4 font-medium text-sm text-slate-900">
        <div className={isAccepted ? "text-slate-600" : "text-slate-900"}>
          {priority.customer_name}
        </div>
      </td>

      {/* Coluna 4: Motivo */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <ReasonBadge reason={priority.reason} />
      </td>

      {/* Coluna 5: Observação */}
      <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate" title={priority.notes || ""}>
        {priority.notes ? (
          <span>{priority.notes}</span>
        ) : (
          <span className="text-slate-300 italic">Sem observações</span>
        )}
      </td>

      {/* Coluna 6: Status */}
      <td className="py-3.5 px-4 w-32 whitespace-nowrap">
        <StatusBadge status={priority.status} />
      </td>

      {/* Coluna 7: Data de Inclusão */}
      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 text-center whitespace-nowrap w-28">
        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
          {formatDateShort(priority.created_at)}
        </span>
      </td>

      {/* Coluna 8: Horário de Criação */}
      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 text-right whitespace-nowrap w-24">
        {formatTimeShort(priority.created_at)}
      </td>
    </tr>
  );
}
