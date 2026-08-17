export function parseBrazilianDate(value: string): Date | null {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

export function daysUntilBrazilianDate(value: string, reference = new Date()): number | null {
  const target = parseBrazilianDate(value);
  if (!target) return null;
  const base = new Date(reference);
  base.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - base.getTime()) / 86_400_000);
}
