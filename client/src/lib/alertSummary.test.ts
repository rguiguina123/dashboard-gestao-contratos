import { describe, expect, it } from "vitest";
import { summarizeAlertItems } from "./alertSummary";

describe("summarizeAlertItems", () => {
  it("mantém todos os itens quando a lista cabe no limite", () => {
    expect(summarizeAlertItems(["a", "b", "c"])).toEqual({
      visibleItems: ["a", "b", "c"],
      hiddenCount: 0,
    });
  });

  it("mostra os cinco primeiros itens e informa o restante", () => {
    expect(summarizeAlertItems([1, 2, 3, 4, 5, 6, 7])).toEqual({
      visibleItems: [1, 2, 3, 4, 5],
      hiddenCount: 2,
    });
  });

  it("não retorna itens para um limite negativo", () => {
    expect(summarizeAlertItems([1, 2], -1)).toEqual({
      visibleItems: [],
      hiddenCount: 2,
    });
  });
});
