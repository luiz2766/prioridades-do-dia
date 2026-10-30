"use client";

import React, { useEffect, useState } from "react";
import { formatTodayHeader } from "@/lib/date";
import {
  Calendar,
  LogOut,
  User as UserIcon,
  Layers,
  CheckSquare,
  BarChart3,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface HeaderProps {
  activeTab?: "operacao" | "dashboard";
  onTabChange?: (tab: "operacao" | "dashboard") => void;
  pendingCount?: number;
}

export function Header({
  activeTab = "operacao",
  onTabChange,
  pendingCount = 0,
}: HeaderProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [todayText, setTodayText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setTodayText(formatTodayHeader());

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        supabase.auth.getUser().then(({ data }) => {
          if (data?.user?.email) {
            setUserEmail(data.user.email);
          }
        });
      }
    } else {
      setUserEmail("supervisor@empresa.com (Mock)");
    }
  }, []);

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
        toast.info("Você saiu da sessão.");
        router.push("/login");
        router.refresh();
        return;
      }
    }
    toast.info("Sessão mock encerrada.");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Identidade Visual */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold text-slate-950 leading-tight">
              Prioridades do Dia
            </span>
            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline-block">
              Central de Decisão de Vendas & Operação
            </span>
          </div>
        </div>

        {/* Abas Centrais de Navegação: Operação vs Dashboard */}
        {onTabChange && (
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => onTabChange("operacao")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[34px] cursor-pointer ${
                activeTab === "operacao"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Operação</span>
              {pendingCount > 0 && (
                <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onTabChange("dashboard")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[34px] cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </nav>
        )}

        {/* Data e Dados do Usuário */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Badge de Data de Hoje */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-100/80 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200/60 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono text-[11px]">{todayText || "Carregando data..."}</span>
          </div>

          {/* Badge de Departamento */}
          <div className="hidden sm:inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Supervisão</span>
          </div>

          {/* Usuário e Botão Sair */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <span className="hidden lg:inline-block max-w-[170px] truncate" title={userEmail || ""}>
                {userEmail || "Carregando..."}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors min-h-[38px] cursor-pointer"
              title="Encerrar sessão"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
