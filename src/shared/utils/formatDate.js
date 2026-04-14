import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';


export function timeAgo(dateString) {
  if (!dateString) return '';
  return formatDistanceToNow(parseDate(dateString), {
    addSuffix: true,
    locale: ptBR,
  });
}


export function smartDate(dateString) {
  if (!dateString) return '';
  const date = parseDate(dateString);

  if (isToday(date)) {
    return Hoje às ${format(date, 'HH:mm')};
  }

  if (isYesterday(date)) {
    return Ontem às ${format(date, 'HH:mm')};
  }

  return format(date, "d 'de' MMM. 'de' yyyy", { locale: ptBR });
}

export function fullDate(dateString) {
  if (!dateString) return '';
  return format(parseDate(dateString), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}


function parseDate(dateString) {
  if (!dateString) return new Date(NaN);
  // if already has timezone indicator (Z or +HH:MM / -HH:MM), parse directly
  if (/[Zz]|[+-]\d{2}:?\d{2}$/.test(dateString)) return new Date(dateString);

  // normalize space separator to 'T' for Date parsing
  let s = dateString.replace(' ', 'T');

  // if still no timezone, assume UTC by appending 'Z'
  if (!/[Zz]|[+-]\d{2}:?\d{2}$/.test(s)) s = ${s}Z;

  return new Date(s);
}