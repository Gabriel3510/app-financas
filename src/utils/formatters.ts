import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return dateStr;
  }
};

export const formatMonth = (monthStr: string): string => {
  try {
    return format(parseISO(`${monthStr}-01`), 'MMM/yyyy', { locale: ptBR });
  } catch {
    return monthStr;
  }
};

export const getCurrentMonth = (): string => format(new Date(), 'yyyy-MM');
