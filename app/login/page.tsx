"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Layers, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    // Se Supabase não estiver configurado, login mock
    if (!isSupabaseConfigured()) {
      toast.success("Acesso liberado no modo de demonstração (Mock)!");
      router.push("/");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      toast.error("Erro interno ao conectar ao cliente de autenticação.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error("Erro no login Supabase:", error);
      let friendlyMessage = "Erro ao autenticar. Tente novamente.";
      if (error.message.includes("Invalid login credentials")) {
        friendlyMessage = "E-mail ou senha incorretos. Verifique suas credenciais.";
      } else if (error.message.includes("Email not confirmed")) {
        friendlyMessage = "E-mail não confirmado. Verifique sua caixa de entrada.";
      } else if (error.message.includes("Too many requests")) {
        friendlyMessage = "Muitas tentativas consecutivas. Aguarde alguns instantes.";
      }
      setAuthError(friendlyMessage);
      toast.error(friendlyMessage);
      return;
    }

    toast.success("Login efetuado com sucesso!");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f9ff]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 flex flex-col gap-6">
        {/* Identidade */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-sm">
            <Layers className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Prioridades do Dia
          </h1>
          <p className="text-xs text-slate-500">
            Acesse sua conta para visualizar e triar as contas críticas do dia.
          </p>
        </div>

        {/* Alerta de Erro se houver */}
        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {authError}
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {/* E-mail */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-700">
              E-mail corporativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                placeholder="seu.email@empresa.com"
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-white border transition-all outline-none min-h-[44px] ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-slate-700">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-white border transition-all outline-none min-h-[44px] ${
                  errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                }`}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm min-h-[46px] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Rodapé institucional */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Acesso restrito a supervisores e gerentes autorizados</span>
        </div>
      </div>
    </div>
  );
}
