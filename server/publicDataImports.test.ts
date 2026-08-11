import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  prepareImport: vi.fn(async () => ({ importId: 18, summary: { fileName: "Dados de Colaboradores.xlsx", domains: {}, warnings: [] } })),
  approveImport: vi.fn(async () => ({ ok: true })),
  listImportHistory: vi.fn(async () => []),
}));

vi.mock("./dataImports", () => ({
  getCurrentDashboardData: vi.fn(async () => ({ colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} })),
  prepareImport: mocks.prepareImport,
  approveImport: mocks.approveImport,
  listImportHistory: mocks.listImportHistory,
}));

import { appRouter } from "./routers";

function publicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("atualização pública de dados", () => {
  it("aceita uma planilha válida sem sessão e prepara a versão com o usuário de sistema", async () => {
    const caller = appRouter.createCaller(publicContext());

    const result = await caller.dataImports.prepare({
      fileName: "Dados de Colaboradores.xlsx",
      fileBase64: Buffer.from("conteúdo de teste para planilha").toString("base64"),
    });

    expect(result.state).toBe("ready");
    expect(mocks.prepareImport).toHaveBeenCalledWith("Dados de Colaboradores.xlsx", expect.any(Buffer), 0);
    expect(mocks.approveImport).not.toHaveBeenCalled();

    await expect(caller.dataImports.approve({ importId: 18 })).resolves.toEqual({ ok: true });
    expect(mocks.approveImport).toHaveBeenCalledWith(18, 0);
  });

  it("permite consultar o histórico sem sessão", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.dataImports.history()).resolves.toEqual([]);
  });
});
