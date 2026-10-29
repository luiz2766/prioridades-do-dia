import React from "react";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { PriorityMetrics } from "@/types/priority";

interface MetricCardsProps {
  metrics: PriorityMetrics;
}

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] uppercase tracking-wider mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Fluxo de Triagem Operacional
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Gerenciamento de Prioridades
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Controle diário de contas críticas, autorizações e despachos prioritários da força de vendas.
        </p>
      </div>

      {/* Quick Metric Pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Total */}
        <div className="bg-white px-4 py-3 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5 min-w-[160px]">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-xl font-bold text-slate-900 leading-tight">
              {metrics.total}
            </div>
            <div className="text-xs text-slate-500">Registradas Hoje</div>
          </div>
        </div>

        {/* Pendentes */}
        <div className="bg-white px-4 py-3 rounded-xl border border-amber-200/80 shadow-sm flex items-center gap-3.5 min-w-[160px]">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-xl font-bold text-amber-700 leading-tight">
              {metrics.pendentes}
            </div>
            <div className="text-xs text-slate-500">Aguardando Aceite</div>
          </div>
        </div>

        {/* Aceitos */}
        <div className="bg-white px-4 py-3 rounded-xl border border-emerald-200/80 shadow-sm flex items-center gap-3.5 min-w-[160px]">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-xl font-bold text-emerald-700 leading-tight">
              {metrics.aceitos}
            </div>
            <div className="text-xs text-slate-500">Aceitos Hoje</div>
          </div>
        </div>
      </div>
    </section>
  );
}
