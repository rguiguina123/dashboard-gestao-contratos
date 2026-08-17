import { describe, expect, it } from "vitest";
import { daysUntilBrazilianDate, parseBrazilianDate } from "./contractDates";

describe("contractDates", () => {
  it("interpreta datas brasileiras sem depender do locale do navegador", () => {
    expect(parseBrazilianDate("31/12/2026")?.toISOString()).toContain("2026-12-31");
  });

  it("rejeita datas brasileiras impossíveis", () => {
    expect(parseBrazilianDate("31/02/2026")).toBeNull();
  });

  it("calcula os dias até um vencimento", () => {
    expect(daysUntilBrazilianDate("05/01/2026", new Date(2026, 0, 1))).toBe(4);
  });
});
