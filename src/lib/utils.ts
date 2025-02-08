import { parse, format } from 'date-fns';

export function convertDate(dateStr: string): Date {
  try {
    const parsedDate = parse(dateStr, 'dd/MM/yy', new Date());
    return parsedDate;
  } catch (error) {
    console.error('Erro ao converter data:', dateStr, error);
    return new Date();
  }
} 