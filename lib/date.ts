/**
 * Utilitários de data e hora com suporte ao fuso horário America/Maceio (UTC-3)
 */

/**
 * Retorna os limites (início e fim) do dia atual no fuso horário America/Maceio (UTC-3)
 * no formato ISO com offset (-03:00) para filtros de banco de dados.
 */
export function getTodayMaceioBounds(): { startOfDay: string; endOfDay: string } {
  // Obter data atual no fuso America/Maceio
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Maceio",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  
  // en-CA produz formato YYYY-MM-DD
  const yyyyMmDd = formatter.format(new Date());

  const startOfDay = `${yyyyMmDd}T00:00:00.000-03:00`;
  const endOfDay = `${yyyyMmDd}T23:59:59.999-03:00`;

  return { startOfDay, endOfDay };
}

/**
 * Formata a data de hoje por extenso em português do Brasil.
 * Exemplo: "Quinta-feira, 29 de outubro de 2026"
 */
export function formatTodayHeader(): string {
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Maceio",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  // Capitalizar a primeira letra do dia da semana
  return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

/**
 * Formata um timestamp ISO para o formato de horário curto "HH:mm"
 */
export function formatTimeShort(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Maceio",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "--:--";
  }
}
