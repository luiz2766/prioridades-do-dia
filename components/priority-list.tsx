"use client";

import React from "react";
import { Priority, PriorityFilter, PriorityMetrics } from "@/types/priority";
import { PriorityRow } from "./priority-row";
import { PriorityCard } from "./priority-card";
import { Filters } from "./filters";
import { Inbox, AlertCircle, RefreshCw } from "lucide-react";

interface PriorityListProps {
  priorities: Priority[];
  isLoading: boolean;
  error: string | null;
  filter: PriorityFilter;
  onFilterChange: (filter: PriorityFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  metrics: PriorityMetrics;
  onToggleAccepted: (id: string, currentAccepted: boolean) => void;
  onRetry: () => void;
}

export function PriorityList({
  priorities,
  isLoading,
  error,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  metrics,
  onToggleAccepted,
  onRetry,
}: PriorityListProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Barra de Filtros e Busca */}
      <Filters
        search={search}
        onSearchChange={onSearchChange}
        currentFilter={filter}
        onFilterChange={onFilterChange}
        metrics={metrics}
      />

      {/* Container Principal da Lista */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Estado de Carregamento (Skeleton) */}
        {isLoading && (
          <div className="p-6 flex flex-col gap-4 animate-pulse">
            <div className="h-10 bg-slate-100 rounded-lg w-full" />
            <div className="h-14 bg-slate-100/70 rounded-lg w-full" />
            <div className="h-14 bg-slate-100/70 rounded-lg w-full" />
            <div className="h-14 bg-slate-100/70 rounded-lg w-full" />
          </div>
        )}

        {/* Estado de Erro */}
        {!isLoading && error && (
          <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-base font-semibold text-slate-900">
              Erro ao carregar dados
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Tentar novamente
            </button>
          </div>
        )}

        {/* Estado Vazio */}
        {!isLoading && !error && priorities.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-base font-semibold text-slate-800">
              {search || filter !== "todos"
                ? "Nenhuma prioridade encontrada para este filtro"
                : "Nenhuma prioridade cadastrada hoje"}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs">
              {search || filter !== "todos"
                ? "Ajuste os termos da busca ou selecione outra aba de status."
                : "Utilize o formulário lateral para registrar a primeira prioridade do dia."}
            </p>
          </div>
        )}

        {/* Visualização em Tabela para Desktop */}
        {!isLoading && !error && priorities.length > 0 && (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                    <th scope="col" className="py-3 px-4 w-14 text-center">
                      Aceite
                    </th>
                    <th scope="col" className="py-3 px-4 w-28">
                      Código
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Cliente
                    </th>
                    <th scope="col" className="py-3 px-4 w-44">
                      Motivo
                    </th>
                    <th scope="col" className="py-3 px-4 max-w-xs">
                      Observação
                    </th>
                    <th scope="col" className="py-3 px-4 w-32">
                      Status
                    </th>
                    <th scope="col" className="py-3 px-4 w-28 text-center">
                      Data
                    </th>
                    <th scope="col" className="py-3 px-4 w-24 text-right">
                      Horário
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {priorities.map((item) => (
                    <PriorityRow
                      key={item.id}
                      priority={item}
                      onToggleAccepted={onToggleAccepted}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visualização em Cards para Dispositivos Móveis */}
            <div className="md:hidden flex flex-col gap-3 p-3 bg-slate-50/50">
              {priorities.map((item) => (
                <PriorityCard
                  key={item.id}
                  priority={item}
                  onToggleAccepted={onToggleAccepted}
                />
              ))}
            </div>
          </>
        )}

        {/* Rodapé informativo */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
          <span>Auditoria contínua de pedidos prioritários</span>
          <span className="font-mono">Fuso: America/Maceio (UTC-3)</span>
        </div>
      </div>
    </div>
  );
}
