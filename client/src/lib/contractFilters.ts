export function parseContractDate(date: string): Date {
  const [day, month, year] = date.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export function matchesSupplier(supplier: string, query: string): boolean {
  const normalize = (value: string) => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
  const normalizedQuery = normalize(query);
  return !normalizedQuery || normalize(supplier).includes(normalizedQuery);
}

export function isWithinContractRange(date: string, range: { startDate: string; endDate: string } | null): boolean {
  if (!range) return true;
  const start = new Date(`${range.startDate}T00:00:00`);
  const end = new Date(`${range.endDate}T23:59:59`);
  const contractDate = parseContractDate(date);
  return contractDate >= start && contractDate <= end;
}

export function isValidContractDateRange(startDate: string, endDate: string): boolean {
  return Boolean(startDate && endDate && startDate <= endDate);
}
