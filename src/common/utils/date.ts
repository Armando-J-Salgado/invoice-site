import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(dateString?: string | null, formatStr: string = 'dd MMM yyyy, hh:mm a'): string {
  if (!dateString) return '—';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(date)) return '—';
    return format(date, formatStr, { locale: es });
  } catch {
    return '—';
  }
}

export function formatShortDate(dateString?: string | null): string {
  return formatDate(dateString, 'dd/MM/yyyy');
}

export function formatRelativeTime(dateString?: string | null): string {
  return formatDate(dateString, 'dd MMM - hh:mm a');
}
