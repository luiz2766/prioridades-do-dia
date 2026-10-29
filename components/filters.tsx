"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { PriorityFilter, PriorityMetrics } from "@/types/priority";

interface FiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  currentFilter: PriorityFilter;
  onFilterChange: (filter: PriorityFilter) => void;
  metrics: PriorityMetrics;
}

export function Filters({
  search,
  onSearchChange,
  currentFilter,
  onFilterChange,
  metrics,
}: FiltersProps) {
  return (
    <div className="bg-white rounded-2xl p-3 md:p-4 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por código ou nome do cliente..."
          className="w-full bg-slate-50 text-slate-800 pl-10 pr-9 py-2.5 rounded-xl text-sm placeholder:text-slate-400 border border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all min-h-[44px]"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Filter Tabs / Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
        <button
          type="button"
          onClick={() => onFilterChange("todos")}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] flex items-center gap-1.5 ${
            currentFilter === "todos"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <span>Todos</span>
          <span
            className={`font-mono text-[11px] px-1.5 py-0.5 rounded-full ${
              currentFilter === "todos"
                ? "bg-slate-900 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {metrics.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("pendente")}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] flex items-center gap-1.5 ${
            currentFilter === "pendente"
              ? "bg-white text-amber-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <span>Pendentes</span>
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
            {metrics.pendentes}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("aceito")}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] flex items-center gap-1.5 ${
            currentFilter === "aceito"
              ? "bg-white text-emerald-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <span>Aceitos</span>
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            {metrics.aceitos}
          </span>
        </button>
      </div>
    </div>
  );
}
