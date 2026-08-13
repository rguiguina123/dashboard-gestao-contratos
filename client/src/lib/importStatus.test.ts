import { describe, expect, it } from "vitest";
import { importStatusPresentation } from "./importStatus";

describe("importStatusPresentation", () => {
  it("identifica uma versão aplicada", () => {
    expect(importStatusPresentation("approved")).toMatchObject({ label: "Aplicada", className: expect.stringContaining("emerald") });
  });

  it("identifica uma versão rejeitada sem sugerir confirmação manual", () => {
    expect(importStatusPresentation("rejected")).toMatchObject({ label: "Não aplicada", className: expect.stringContaining("red") });
  });

  it("informa que uma versão nova ainda está em processamento", () => {
    expect(importStatusPresentation("pending")).toMatchObject({ label: "Em processamento", className: expect.stringContaining("amber") });
  });
});
