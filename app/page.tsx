"use client";

import React from "react";
import { Header } from "@/components/header";
import { MetricCards } from "@/components/metric-cards";
import { PriorityForm } from "@/components/priority-form";
import { PriorityList } from "@/components/priority-list";
import { usePriorities } from "@/hooks/use-priorities";

export default function HomePage() {
  const {
    filteredPriorities,
    isLoading,
    error,
    filter,
    setFilter,
    search,
    setSearch,
    metrics,
    addPriority,
    togglePriorityAccepted,
    refresh,
  } = usePriorities();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      {/* Cabeçalho Superior Fixo */}
      <Header />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Faixa de Métricas e Título Operacional */}
        <MetricCards metrics={metrics} />

        {/* Grid Principal: 4 Colunas Formulário (Esquerda) + 8 Colunas Feed (Direita) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">
          {/* Coluna do Formulário */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <PriorityForm onSubmitPriority={addPriority} />
          </aside>

          {/* Coluna da Lista de Prioridades */}
          <section className="lg:col-span-8 order-1 lg:order-2">
            <PriorityList
              priorities={filteredPriorities}
              isLoading={isLoading}
              error={error}
              filter={filter}
              onFilterChange={setFilter}
              search={search}
              onSearchChange={setSearch}
              metrics={metrics}
              onToggleAccepted={togglePriorityAccepted}
              onRetry={refresh}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
