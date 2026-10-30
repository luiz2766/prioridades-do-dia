"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2, Building2, Hash, FileText, CheckCircle } from "lucide-react";
import { prioritySchema, PriorityFormData } from "@/lib/validations";
import { CreatePriorityInput } from "@/types/priority";

interface PriorityFormProps {
  onSubmitPriority: (data: CreatePriorityInput) => Promise<unknown>;
}

const COMMON_REASONS = [
  "Pedido urgente",
  "Negociação em andamento",
  "Inadimplência",
  "Reclamação",
  "Exclusivo",
  "Outro",
];

export function PriorityForm({ onSubmitPriority }: PriorityFormProps) {
  const codeInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<PriorityFormData>({
    resolver: zodResolver(prioritySchema),
    defaultValues: {
      customer_code: "",
      customer_name: "",
      reason: "Pedido urgente",
      custom_reason: "",
      notes: "",
    },
  });

  const selectedReason = watch("reason");

  const onSubmit = async (data: PriorityFormData) => {
    const finalReason =
      data.reason === "Outro" && data.custom_reason
        ? data.custom_reason.trim()
        : data.reason.trim();

    await onSubmitPriority({
      customer_code: data.customer_code.trim(),
      customer_name: data.customer_name.trim(),
      reason: finalReason,
      notes: data.notes ? data.notes.trim() : null,
    });

    // Limpar formulário mantendo o valor padrão do motivo
    reset({
      customer_code: "",
      customer_name: "",
      reason: "Pedido urgente",
      custom_reason: "",
      notes: "",
    });

    // Devolver foco ao primeiro campo
    setTimeout(() => {
      setFocus("customer_code");
      codeInputRef.current?.focus();
    }, 50);
  };

  const { ref: codeRegisterRef, ...codeRegisterRest } = register("customer_code");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col gap-5 sticky top-24">
      {/* Header do Formulário */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <PlusCircle className="w-4 h-4" />
          </div>
          <h2 className="font-heading text-lg font-semibold text-slate-900 tracking-tight">
            Nova Prioridade
          </h2>
        </div>
        <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
          Entrada Rápida
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {/* Campo: Código do Cliente */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="customer_code"
            className="text-xs font-semibold text-slate-700 flex items-center justify-between"
          >
            <span>
              Código do Cliente <span className="text-red-500">*</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400 uppercase">Ex: CLI-1048</span>
          </label>
          <div className="relative">
            <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="customer_code"
              type="text"
              placeholder="Digite o código (ex: CLI-1048)"
              disabled={isSubmitting}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-white border font-mono transition-all outline-none min-h-[44px] ${
                errors.customer_code
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              }`}
              {...codeRegisterRest}
              ref={(e) => {
                codeRegisterRef(e);
                codeInputRef.current = e;
              }}
            />
          </div>
          {errors.customer_code && (
            <p className="text-xs text-red-600 font-medium">{errors.customer_code.message}</p>
          )}
        </div>

        {/* Campo: Razão Social ou Nome Fantasia */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="customer_name" className="text-xs font-semibold text-slate-700">
            Razão Social / Nome Fantasia <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="customer_name"
              type="text"
              placeholder="Nome da empresa ou cliente"
              disabled={isSubmitting}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-white border transition-all outline-none min-h-[44px] ${
                errors.customer_name
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              }`}
              {...register("customer_name")}
            />
          </div>
          {errors.customer_name && (
            <p className="text-xs text-red-600 font-medium">{errors.customer_name.message}</p>
          )}
        </div>

        {/* Campo: Motivo da Priorização */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>
              Motivo da Prioridade <span className="text-red-500">*</span>
            </span>
            <span className="text-[11px] text-slate-400">Classificação</span>
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {COMMON_REASONS.map((reasonOpt) => (
              <label
                key={reasonOpt}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all min-h-[40px] ${
                  selectedReason === reasonOpt
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  value={reasonOpt}
                  disabled={isSubmitting}
                  className="sr-only"
                  {...register("reason")}
                />
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedReason === reasonOpt
                      ? "border-white bg-white/20"
                      : "border-slate-400 bg-white"
                  }`}
                >
                  {selectedReason === reasonOpt && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span>{reasonOpt}</span>
              </label>
            ))}
          </div>

          {/* Campo extra quando "Outro" estiver selecionado */}
          {selectedReason === "Outro" && (
            <div className="flex flex-col gap-1 pt-1 animate-fadeIn">
              <input
                type="text"
                placeholder="Especifique o motivo detalhado..."
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none min-h-[40px]"
                {...register("custom_reason")}
              />
              {errors.custom_reason && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.custom_reason.message}
                </p>
              )}
            </div>
          )}
          {errors.reason && (
            <p className="text-xs text-red-600 font-medium">{errors.reason.message}</p>
          )}
        </div>

        {/* Campo: Observação (Opcional) */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="notes"
            className="text-xs font-semibold text-slate-700 flex items-center justify-between"
          >
            <span>Observação</span>
            <span className="text-[11px] font-normal text-slate-400">(opcional)</span>
          </label>
          <div className="relative">
            <textarea
              id="notes"
              rows={3}
              placeholder="Instruções para o despacho, detalhes da entrega, etc."
              disabled={isSubmitting}
              className="w-full p-3 rounded-lg text-xs bg-white border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none resize-none transition-all placeholder:text-slate-400"
              {...register("notes")}
            />
          </div>
          {errors.notes && (
            <p className="text-xs text-red-600 font-medium">{errors.notes.message}</p>
          )}
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm min-h-[48px] active:scale-[0.99] cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando prioridade...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Adicionar prioridade</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
