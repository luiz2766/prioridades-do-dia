import { z } from "zod";

/**
 * Esquema de validação para o cadastro de nova prioridade
 */
export const prioritySchema = z.object({
  customer_code: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, { message: "Código do cliente é obrigatório." })
        .max(50, { message: "Código deve ter no máximo 50 caracteres." })
    ),
  customer_name: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(2, { message: "Razão social ou nome fantasia é obrigatório." })
        .max(150, { message: "Nome deve ter no máximo 150 caracteres." })
    ),
  reason: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, { message: "Selecione ou informe o motivo da priorização." })
        .max(100, { message: "Motivo deve ter no máximo 100 caracteres." })
    ),
  custom_reason: z
    .string()
    .optional()
    .transform((val) => (val ? val.trim() : "")),
  notes: z
    .string()
    .optional()
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : null)),
}).refine(
  (data) => {
    if (data.reason === "Outro") {
      return !!data.custom_reason && data.custom_reason.length > 0;
    }
    return true;
  },
  {
    message: "Especifique o motivo personalizado.",
    path: ["custom_reason"],
  }
);

export type PriorityFormData = z.infer<typeof prioritySchema>;

/**
 * Esquema de validação para a tela de login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .transform((val) => val.trim().toLowerCase())
    .pipe(
      z
        .string()
        .min(1, { message: "O e-mail é obrigatório." })
        .email({ message: "Insira um endereço de e-mail válido." })
    ),
  password: z
    .string()
    .min(1, { message: "A senha é obrigatória." })
    .min(6, { message: "A senha deve conter no mínimo 6 caracteres." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
