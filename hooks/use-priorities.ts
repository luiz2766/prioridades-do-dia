"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { CreatePriorityInput, Priority, PriorityFilter, PriorityMetrics } from "@/types/priority";
import { createPriority, listTodayPriorities, setPriorityAccepted } from "@/services/priorities";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { toast } from "sonner";

export function usePriorities() {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PriorityFilter>("todos");
  const [search, setSearch] = useState<string>("");

  const sortPriorities = (list: Priority[]): Priority[] => {
    return [...list].sort((a, b) => {
      if (a.status === "pendente" && b.status === "aceito") return -1;
      if (a.status === "aceito" && b.status === "pendente") return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  const loadPriorities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await listTodayPriorities();
      setPriorities(sortPriorities(data));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar prioridades.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPriorities();
  }, [loadPriorities]);

  // Inscrição em Tempo Real (Supabase Realtime)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel("priorities_realtime_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "priorities" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newRecord = payload.new as Priority;
            setPriorities((prev) => {
              if (prev.some((item) => item.id === newRecord.id)) {
                return prev;
              }
              return sortPriorities([newRecord, ...prev]);
            });
          } else if (payload.eventType === "UPDATE") {
            const updatedRecord = payload.new as Priority;
            setPriorities((prev) =>
              sortPriorities(
                prev.map((item) => (item.id === updatedRecord.id ? updatedRecord : item))
              )
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = (payload.old as { id: string }).id;
            setPriorities((prev) => prev.filter((item) => item.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Adicionar Prioridade
  const addPriority = async (input: CreatePriorityInput) => {
    try {
      const created = await createPriority(input);
      setPriorities((prev) => sortPriorities([created, ...prev.filter((p) => p.id !== created.id)]));
      toast.success("Prioridade adicionada com sucesso!");
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Não foi possível adicionar a prioridade.";
      toast.error(msg);
      throw err;
    }
  };

  // Alternar Aceite com Atualização Otimista
  const togglePriorityAccepted = async (id: string, currentAccepted: boolean) => {
    const nextAccepted = !currentAccepted;
    const previousPriorities = [...priorities];

    // Atualização otimista imediata na interface
    setPriorities((prev) =>
      sortPriorities(
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              status: nextAccepted ? "aceito" : "pendente",
              accepted_at: nextAccepted ? new Date().toISOString() : null,
            };
          }
          return item;
        })
      )
    );

    try {
      const updated = await setPriorityAccepted(id, nextAccepted);
      // Confirmação com dados do servidor
      setPriorities((prev) =>
        sortPriorities(prev.map((item) => (item.id === id ? updated : item)))
      );
      if (nextAccepted) {
        toast.success("Prioridade marcada como aceita!");
      } else {
        toast.info("Prioridade retornada para pendente.");
      }
    } catch (err: unknown) {
      // Reversão em caso de falha
      setPriorities(previousPriorities);
      const msg =
        err instanceof Error ? err.message : "Falha ao atualizar prioridade. Operação revertida.";
      toast.error(msg);
    }
  };

  // Métricas
  const metrics: PriorityMetrics = useMemo(() => {
    const total = priorities.length;
    let pendentes = 0;
    let aceitos = 0;

    for (const p of priorities) {
      if (p.status === "pendente") pendentes++;
      else if (p.status === "aceito") aceitos++;
    }

    return { total, pendentes, aceitos };
  }, [priorities]);

  // Lista Filtrada por Busca e Status
  const filteredPriorities = useMemo(() => {
    const term = search.trim().toLowerCase();

    return priorities.filter((p) => {
      // Filtro de status
      if (filter === "pendente" && p.status !== "pendente") return false;
      if (filter === "aceito" && p.status !== "aceito") return false;

      // Filtro de texto (código ou cliente)
      if (term.length > 0) {
        const matchCode = p.customer_code.toLowerCase().includes(term);
        const matchName = p.customer_name.toLowerCase().includes(term);
        const matchReason = p.reason.toLowerCase().includes(term);
        return matchCode || matchName || matchReason;
      }

      return true;
    });
  }, [priorities, filter, search]);

  return {
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
    refresh: loadPriorities,
  };
}
