import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Retorna tempo relativo: "há 5 minutos", "há 2 horas"
 */
export function timeAgo(dateString) {
  if (!dateString) return '';
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: ptBR,
  });
}

/**
 * Retorna formato inteligente:
 * - Hoje: "Hoje às 14:30"
 * - Ontem: "Ontem às 09:15"
 * - Outro dia: "12 de mar. de 2026"
 */
export function smartDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Hoje às ${format(date, 'HH:mm')}`;
  }

  if (isYesterday(date)) {
    return `Ontem às ${format(date, 'HH:mm')}`;
  }

  return format(date, "d 'de' MMM. 'de' yyyy", { locale: ptBR });
}

/**
 * Retorna data completa: "12 de março de 2026"
 */
export function fullDate(dateString) {
  if (!dateString) return '';
  return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}
