import { CreatePriorityInput, Priority } from "@/types/priority";

/**
 * Registros MOCK fiéis ao protótipo operacional Stitch ("Executive Precision")
 */
let mockPriorities: Priority[] = [
  {
    id: "mock-1",
    customer_code: "CLI-1048",
    customer_name: "Alfa Logística e Transportes",
    reason: "Pedido urgente",
    notes: "Carga retida no CD-2. Requer emissão prioritária antes das 12h.",
    status: "pendente",
    created_at: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
    accepted_at: null,
  },
  {
    id: "mock-2",
    customer_code: "CLI-2089",
    customer_name: "Farmácias Rede Central",
    reason: "Negociação em andamento",
    notes: "Contrato de renovação anual aprovado pelo comitê regional.",
    status: "aceito",
    created_at: new Date(Date.now() - 3.2 * 3600 * 1000).toISOString(),
    accepted_at: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
  },
  {
    id: "mock-3",
    customer_code: "CLI-3401",
    customer_name: "Superatacado Gaúcho",
    reason: "Inadimplência",
    notes: "Comprovante de quitação enviado no canal financeiro.",
    status: "pendente",
    created_at: new Date(Date.now() - 2.8 * 3600 * 1000).toISOString(),
    accepted_at: null,
  },
  {
    id: "mock-4",
    customer_code: "CLI-4920",
    customer_name: "Construtora Horizonte Azul",
    reason: "Pedido urgente",
    notes: "Lote de perfis de aço para concretagem de laje amanhã cedo.",
    status: "pendente",
    created_at: new Date(Date.now() - 2.1 * 3600 * 1000).toISOString(),
    accepted_at: null,
  },
  {
    id: "mock-5",
    customer_code: "CLI-5114",
    customer_name: "Vargas & Silva Máquinas Industriais",
    reason: "Reclamação",
    notes: "Atendimento gerencial realizado por telefone às 09:30.",
    status: "pendente",
    created_at: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
    accepted_at: null,
  },
  {
    id: "mock-6",
    customer_code: "CLI-6780",
    customer_name: "Padaria e Confeitaria Moinho",
    reason: "Outro",
    notes: "Solicitação de bonificação comercial especial de inauguração.",
    status: "pendente",
    created_at: new Date(Date.now() - 0.8 * 3600 * 1000).toISOString(),
    accepted_at: null,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listTodayPrioritiesMock(): Promise<Priority[]> {
  await delay(250);
  // Pendentes primeiro, depois os mais recentes (created_at desc)
  return [...mockPriorities].sort((a, b) => {
    if (a.status === "pendente" && b.status === "aceito") return -1;
    if (a.status === "aceito" && b.status === "pendente") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function createPriorityMock(data: CreatePriorityInput): Promise<Priority> {
  await delay(350);
  const newPriority: Priority = {
    id: "mock-" + Math.random().toString(36).substring(2, 9),
    customer_code: data.customer_code.trim(),
    customer_name: data.customer_name.trim(),
    reason: data.reason.trim(),
    notes: data.notes && data.notes.trim().length > 0 ? data.notes.trim() : null,
    status: "pendente",
    created_at: new Date().toISOString(),
    accepted_at: null,
  };

  mockPriorities = [newPriority, ...mockPriorities];
  return newPriority;
}

export async function setPriorityAcceptedMock(id: string, accepted: boolean): Promise<Priority> {
  await delay(200);
  const index = mockPriorities.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Prioridade não encontrada.");
  }

  const updated: Priority = {
    ...mockPriorities[index],
    status: accepted ? "aceito" : "pendente",
    accepted_at: accepted ? new Date().toISOString() : null,
  };

  mockPriorities[index] = updated;
  return updated;
}
