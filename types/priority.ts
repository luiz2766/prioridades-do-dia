export type PriorityStatus = "pendente" | "aceito";

export interface Priority {
  id: string;
  customer_code: string;
  customer_name: string;
  reason: string;
  notes: string | null;
  status: PriorityStatus;
  created_at: string; // ISO 8601
  accepted_at: string | null; // ISO 8601
  created_by?: string | null;
  accepted_by?: string | null;
}

export interface CreatePriorityInput {
  customer_code: string;
  customer_name: string;
  reason: string;
  notes?: string | null;
}

export type PriorityFilter = "todos" | "pendente" | "aceito";

export interface PriorityMetrics {
  total: number;
  pendentes: number;
  aceitos: number;
}
