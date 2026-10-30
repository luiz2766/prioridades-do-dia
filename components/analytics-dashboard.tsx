"use client";

import React, { useMemo } from "react";
import { Priority } from "@/types/priority";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Handshake,
  MessageSquare,
  Tag,
  ArrowRight,
  ShieldAlert,
  Download,
  Calendar,
} from "lucide-react";
import { formatTimeShort, formatDateShort, formatRelativeTime } from "@/lib/date";
import { ReasonBadge } from "./reason-badge";
import { StatusBadge } from "./status-badge";

interface AnalyticsDashboardProps {
  priorities: Priority[];
  onGoToOperation: () => void;
  onFilterByStatus?: (status: "pendente" | "aceito") => void;
}

export function AnalyticsDashboard({
  priorities,
  onGoToOperation,
  onFilterByStatus,
}: AnalyticsDashboardProps) {
  // 1. Cálculos Gerais
  const total = priorities.length;
  const aceitos = priorities.filter((p) => p.status === "aceito");
  const pendentes = priorities.filter((p) => p.status === "pendente");

  const taxaAceite = total > 0 ? Math.round((aceitos.length / total) * 100) : 0;

  // 2. Tempo Médio até o Aceite (MTTA)
  const tempoMedioMinutos = useMemo(() => {
    const aceitosComTempo = aceitos.filter((p) => p.accepted_at && p.created_at);
    if (aceitosComTempo.length === 0) return null;

    const somaMinutos = aceitosComTempo.reduce((acc, curr) => {
      const diffMs =
        new Date(curr.accepted_at!).getTime() - new Date(curr.created_at).getTime();
      return acc + Math.max(0, diffMs / 60000);
    }, 0);

    return Math.round(somaMinutos / aceitosComTempo.length);
  }, [aceitos]);

  // 3. Distribuição por Motivo
  const distribuicaoMotivos = useMemo(() => {
    const map = new Map<
      string,
      { motivo: string; total: number; aceitos: number; pendentes: number }
    >();

    for (const p of priorities) {
      const reason = p.reason;
      if (!map.has(reason)) {
        map.set(reason, { motivo: reason, total: 0, aceitos: 0, pendentes: 0 });
      }
      const entry = map.get(reason)!;
      entry.total++;
      if (p.status === "aceito") entry.aceitos++;
      else entry.pendentes++;
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [priorities]);

  // 4. Exportar CSV
  const handleExportCSV = () => {
    if (priorities.length === 0) return;

    const headers = [
      "Código",
      "Cliente",
      "Motivo",
      "Observação",
      "Status",
      "Data Criação",
      "Horário Criação",
      "Horário Aceite",
    ];

    const rows = priorities.map((p) => [
      p.customer_code,
      `"${p.customer_name.replace(/"/g, '""')}"`,
      `"${p.reason.replace(/"/g, '""')}"`,
      `"${(p.notes || "").replace(/"/g, '""')}"`,
      p.status,
      formatDateShort(p.created_at),
      formatTimeShort(p.created_at),
      p.accepted_at ? formatTimeShort(p.accepted_at) : "-",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `prioridades-do-dia-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getReasonIcon = (motivo: string) => {
    const norm = motivo.toLowerCase();
    if (norm.includes("urgente")) return <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />;
    if (norm.includes("negociação") || norm.includes("negociacao"))
      return <Handshake className="w-4 h-4 text-blue-500" />;
    if (norm.includes("inadimplência") || norm.includes("inadimplencia"))
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (norm.includes("reclamação") || norm.includes("reclamacao"))
      return <MessageSquare className="w-4 h-4 text-orange-500" />;
    return <Tag className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Top Bar da Dashboard */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Painel Analítico • Visão Executiva do Turno
          </div>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Indicadores & Performance Operacional
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Métricas de eficiência, cumprimento de SLA e gargalos de atendimento da equipe de vendas.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={total === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={onGoToOperation}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Ir para Operação</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid de 4 KPIs Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Taxa de Aceite (SLA) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Taxa de Aceite (SLA)
              </span>
              <div className="font-mono text-3xl font-bold text-slate-900 mt-1">
                {taxaAceite}%
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {aceitos.length} de {total} aceitos
            </span>
            <span className="text-slate-400">Meta: &gt; 80%</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100">
            <div
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${Math.min(100, taxaAceite)}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Tempo Médio de Resposta (MTTA) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Tempo Médio de Aceite
              </span>
              <div className="font-mono text-3xl font-bold text-slate-900 mt-1 flex items-baseline gap-1">
                <span>{tempoMedioMinutos !== null ? tempoMedioMinutos : "--"}</span>
                <span className="text-sm font-normal text-slate-500">min</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              {tempoMedioMinutos !== null
                ? tempoMedioMinutos <= 30
                  ? "✓ Dentro da meta operacional"
                  : "⚠ Acima do tempo desejado"
                : "Aguardando primeiros aceites"}
            </span>
            <span className="text-slate-400">Meta: &lt; 30 min</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100">
            <div
              className={`h-full transition-all duration-700 ${
                tempoMedioMinutos && tempoMedioMinutos <= 30
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }`}
              style={{
                width: `${
                  tempoMedioMinutos !== null
                    ? Math.min(100, (tempoMedioMinutos / 30) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* KPI 3: Total Registradas Hoje */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Volumetria do Dia
              </span>
              <div className="font-mono text-3xl font-bold text-slate-900 mt-1">
                {total}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              {aceitos.length} concluídas • {pendentes.length} na fila
            </span>
            <span className="text-slate-400">Turno ativo</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100">
            <div className="h-full bg-slate-900 w-full" />
          </div>
        </div>

        {/* KPI 4: Fila de Atenção (Pendentes) */}
        <div
          onClick={() => onFilterByStatus?.("pendente")}
          className="bg-white rounded-2xl border border-amber-200/90 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-amber-400 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                Aguardando Aceite
              </span>
              <div className="font-mono text-3xl font-bold text-amber-700 mt-1">
                {pendentes.length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
            <span className="text-amber-800 font-semibold">
              {pendentes.length > 0 ? "Requer triagem da supervisão" : "Fila zerada"}
            </span>
            <span className="text-amber-700 flex items-center gap-0.5">
              Filtrar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-amber-100">
            <div
              className="h-full bg-amber-500 transition-all duration-700"
              style={{
                width: `${total > 0 ? (pendentes.length / total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Seção Central Dividida: Motivos (6 colunas) + Fila Pendente Crítica (6 colunas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Distribuição por Motivos (7 colunas) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Distribuição por Motivo de Prioridade
              </h3>
              <p className="text-xs text-slate-500">
                Proporção das solicitações cadastradas e índice de resolução por tipo.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">
              {distribuicaoMotivos.length} tipos
            </span>
          </div>

          {distribuicaoMotivos.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Nenhuma prioridade cadastrada para gerar o gráfico de motivos.
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              {distribuicaoMotivos.map((item) => {
                const perc = total > 0 ? Math.round((item.total / total) * 100) : 0;
                const percResolvido =
                  item.total > 0 ? Math.round((item.aceitos / item.total) * 100) : 0;

                return (
                  <div key={item.motivo} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        {getReasonIcon(item.motivo)}
                        <span>{item.motivo}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono text-[11px]">
                          {item.total} {item.total === 1 ? "caso" : "casos"} ({perc}%)
                        </span>
                        <span
                          className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            percResolvido === 100
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {percResolvido}% aceito
                        </span>
                      </div>
                    </div>
                    {/* Barra de Progresso */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${(item.aceitos / total) * 100}%`,
                        }}
                        title={`Aceitos: ${item.aceitos}`}
                      />
                      <div
                        className="h-full bg-amber-400"
                        style={{
                          width: `${(item.pendentes / total) * 100}%`,
                        }}
                        title={`Pendentes: ${item.pendentes}`}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-end gap-4 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  <span>Aceito</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                  <span>Pendente</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fila de Atenção Imediata (5 colunas) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Fila de Atenção Imediata
              </h3>
              <p className="text-xs text-slate-500">
                Clientes que ainda aguardam aceite do supervisor.
              </p>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {pendentes.length}
            </span>
          </div>

          {pendentes.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <span className="text-xs font-medium text-slate-700">
                Todos os clientes do dia foram aceitos!
              </span>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Excelente trabalho. A fila operacional está totalmente em dia.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
              {pendentes.slice(0, 6).map((item) => (
                <div key={item.id} className="py-3 flex flex-col gap-1.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {item.customer_code}
                    </span>
                    <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </div>
                  <div className="font-heading text-sm font-semibold text-slate-900 leading-tight">
                    {item.customer_name}
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <ReasonBadge reason={item.reason} />
                    <span className="font-mono text-[11px] text-slate-400">
                      {formatTimeShort(item.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pendentes.length > 0 && (
            <button
              type="button"
              onClick={onGoToOperation}
              className="w-full mt-2 py-2.5 px-3 bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Abrir lista completa para despacho</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
