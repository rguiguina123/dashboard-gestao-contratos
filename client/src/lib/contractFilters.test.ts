import { describe, expect, it } from "vitest";
import { isValidContractDateRange, isWithinContractRange, matchesSupplier } from "./contractFilters";

describe("filtros avançados de contratos", () => {
  it("encontra fornecedor por parte do nome sem diferenciar maiúsculas e acentos", () => {
    expect(matchesSupplier("Empresa Ágil de Serviços", "agil")).toBe(true);
    expect(matchesSupplier("Empresa Ágil de Serviços", "segurança")).toBe(false);
    expect(matchesSupplier("Empresa Ágil de Serviços", "")).toBe(true);
  });

  it("mantém somente contratos com vigência dentro do intervalo informado", () => {
    const range = { startDate: "2026-01-01", endDate: "2026-12-31" };
    expect(isWithinContractRange("01/01/2026", range)).toBe(true);
    expect(isWithinContractRange("31/12/2026", range)).toBe(true);
    expect(isWithinContractRange("31/12/2025", range)).toBe(false);
    expect(isWithinContractRange("01/01/2027", range)).toBe(false);
  });

  it("bloqueia intervalo cuja data final é anterior à inicial", () => {
    expect(isValidContractDateRange("2026-06-01", "2026-06-30")).toBe(true);
    expect(isValidContractDateRange("2026-06-30", "2026-06-01")).toBe(false);
    expect(isValidContractDateRange("", "2026-06-30")).toBe(false);
  });
});
