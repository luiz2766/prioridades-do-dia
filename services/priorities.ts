import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getTodayMaceioBounds } from "@/lib/date";
import { CreatePriorityInput, Priority, PriorityStatus } from "@/types/priority";
import {
  createPriorityMock,
  listTodayPrioritiesMock,
  setPriorityAcceptedMock,
} from "./priorities.mock";

/**
 * Camada de serviço de Prioridades.
 * Quando o Supabase estiver configurado com credenciais válidas (.env.local),
 * conecta diretamente ao Postgres com RLS e Auth. Caso contrário, opera
 * no modo MOCK em memória para testes e prototipação rápida.
 */

export async function listTodayPriorities(): Promise<Priority[]> {
  if (!isSupabaseConfigured()) {
    return listTodayPrioritiesMock();
  }

  const supabase = createClient();
  if (!supabase) {
    return listTodayPrioritiesMock();
  }

  const { startOfDay, endOfDay } = getTodayMaceioBounds();

  const { data, error } = await supabase
    .from("priorities")
    .select("*")
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)
    .order("status", { ascending: false }) // 'pendente' vem antes de 'aceito' em ordem descendente
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar prioridades do Supabase:", error);
    throw new Error(
      error.message || "Não foi possível carregar as prioridades de hoje. Tente novamente."
    );
  }

  // Garantir ordenação estrita: pendentes primeiro, depois mais recentes
  const priorities = (data as Priority[]) || [];
  return priorities.sort((a, b) => {
    if (a.status === "pendente" && b.status === "aceito") return -1;
    if (a.status === "aceito" && b.status === "pendente") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function createPriority(data: CreatePriorityInput): Promise<Priority> {
  if (!isSupabaseConfigured()) {
    return createPriorityMock(data);
  }

  const supabase = createClient();
  if (!supabase) {
    return createPriorityMock(data);
  }

  const trimmedData = {
    customer_code: data.customer_code.trim(),
    customer_name: data.customer_name.trim(),
    reason: data.reason.trim(),
    notes: data.notes && data.notes.trim().length > 0 ? data.notes.trim() : null,
    status: "pendente" as PriorityStatus,
  };

  const { data: created, error } = await supabase
    .from("priorities")
    .insert([trimmedData])
    .select()
    .single();

  if (error) {
    console.error("Erro ao inserir prioridade no Supabase:", error);
    throw new Error(
      error.message || "Erro ao adicionar prioridade. Verifique os dados e tente novamente."
    );
  }

  return created as Priority;
}

export async function setPriorityAccepted(id: string, accepted: boolean): Promise<Priority> {
  if (!isSupabaseConfigured()) {
    return setPriorityAcceptedMock(id, accepted);
  }

  const supabase = createClient();
  if (!supabase) {
    return setPriorityAcceptedMock(id, accepted);
  }

  const newStatus: PriorityStatus = accepted ? "aceito" : "pendente";

  // O trigger do banco cuida de accepted_at, accepted_by e bloqueia outras colunas
  const { data, error } = await supabase
    .from("priorities")
    .update({ status: newStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar status da prioridade no Supabase:", error);
    throw new Error(
      error.message || "Falha ao atualizar o status da prioridade. Ação revertida."
    );
  }

  return data as Priority;
}
