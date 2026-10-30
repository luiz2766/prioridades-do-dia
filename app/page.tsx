"use client";

import React, { useState } from "react";
import { Header } from "@/components/header";
import { MetricCards } from "@/components/metric-cards";
import { PriorityForm } from "@/components/priority-form";
import { PriorityList } from "@/components/priority-list";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { usePriorities } from "@/hooks/use-priorities";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"operacao" | "dashboard">("operacao");

  const {
    priorities,
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
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={metrics.pendentes}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === "operacao" ? (
          <>
            <MetricCards metrics={metrics} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">
              <aside className="lg:col-span-4 order-2 lg:order-1">
                <PriorityForm onSubmitPriority={addPriority} />
              </aside>
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
          </>
        ) : (
          <AnalyticsDashboard
            priorities={priorities}
            onGoToOperation={() => setActiveTab("operacao")}
            onFilterByStatus={(status) => {
              setFilter(status);
              setActiveTab("operacao");
            }}
          />
        )}
      </main>
    </div>
  );
}
