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
 * Formata um timestamp ISO para o formato de data curta "DD/MM/AAAA"
 */
export function formatDateShort(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Maceio",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return "--/--/----";
  }
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

/**
 * Formata um tempo relativo amigável (ex: "Há 12 min", "Há 2 horas", "Agora")
 */
export function formatRelativeTime(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return "Agora";
    if (diffMinutes === 1) return "Há 1 min";
    if (diffMinutes < 60) return `Há ${diffMinutes} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return "Há 1 h";
    return `Há ${diffHours} h`;
  } catch {
    return "";
  }
}
