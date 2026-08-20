import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { vi } from "vitest";

const lifecycleState = vi.hoisted(() => ({
  current: null as any,
  pending: null as any,
  history: [] as any[],
}));

vi.mock("./storage", () => ({ storagePut: vi.fn(async () => ({ key: "imports/teste.xlsx" })) }));
vi.mock("./db", () => ({
  getDb: async () => ({
    select: () => ({
      from: () => ({
        where: () => ({
          orderBy: () => ({ limit: async () => lifecycleState.current ? [lifecycleState.current] : [] }),
          limit: async () => lifecycleState.pending ? [lifecycleState.pending] : [],
        }),
        orderBy: () => ({ limit: async () => lifecycleState.history }),
      }),
    }),
    insert: () => ({
      values: async (values: any) => {
        if (values.status === "pending") {
          lifecycleState.pending = { ...values, id: 42, createdAt: new Date(), approvedAt: null };
          lifecycleState.history = [lifecycleState.pending];
          return [{ insertId: 42 }];
        }
        lifecycleState.current = { ...values, id: 101 };
        return [{ insertId: 101 }];
      },
    }),
    transaction: async (callback: (tx: any) => Promise<void>) => callback({
      update: () => ({
        set: (values: any) => ({
          where: async () => {
            if (values.isCurrent === false && lifecycleState.current) lifecycleState.current.isCurrent = false;
            if (values.status === "approved" && lifecycleState.pending) {
              lifecycleState.pending.status = "approved";
              lifecycleState.pending.approvedAt = values.approvedAt;
            }
          },
        }),
      }),
      insert: () => ({
        values: async (values: any) => {
          lifecycleState.current = { ...values, id: 101 };
          return [{ insertId: 101 }];
        },
      }),
    }),
  }),
}));

import { approveImport, buildCandidateData, getCurrentDashboardData, listImportHistory, prepareImport } from "./dataImports";

function workbookBuffer(sheetName: string, rows: Record<string, unknown>[]) {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), sheetName);
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}

function contractsWorkbookBuffer(monthlyValue: unknown) {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([{
    "Termo Contratual": "Contrato 1", Fornecedor: "Fornecedor", Objeto: "Serviço", Sec: "SEC-DF",
    "Valor mensal ": monthlyValue, "Valor Anual": 1200, "Vigência Máxima": "31/12/2027",
  }]), "Despesas Vigência Controlada");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([{
    SEC: "SEC-DF", "Serviço": "Água", "Fornecedor ": "Fornecedor", Objeto: "Serviço", "Valor Mensal": 100, "Valor Anual": 1200,
  }]), "Despesas Vigência NÃO Controlad");
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}

function costsWorkbookWithInvalidAreaSheet() {
  const workbook = XLSX.utils.book_new();
  const add = (name: string, row: Record<string, unknown>) => XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([row]), name);
  add("Visão Geral", { SEC: "SEC-DF", Total: 100, "Custo/Servidor": 10, "Custo/Área": 2 });
  add("Custo por Área e Servidor", { SEC: "SEC-DF", "Área/Servidor": 3, "Custo/Servidor": 10 });
  add("Custo por Área", { SEC: "SEC-DF" });
  add("Custo por Servidor", { SEC: "SEC-DF", "Custo/Servidor": 10 });
  add("Custo Total", { SEC: "SEC-DF", Total: 100 });
  add("Quantidade de Servidores", { SEC: "SEC-DF", "Qtd Servidores": 2 });
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}

function costsWorkbookWithEmptyTotalSheet() {
  const workbook = XLSX.utils.book_new();
  const add = (name: string, row: Record<string, unknown>) => XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([row]), name);
  add("Visão Geral", { SEC: "SEC-DF", Total: 100, "Custo/Servidor": 10, "Custo/Área": 2 });
  add("Custo por Área e Servidor", { SEC: "SEC-DF", "Área/Servidor": 3, "Custo/Servidor": 10 });
  add("Custo por Área", { SEC: "SEC-DF", "Custo/Área": 2 });
  add("Custo por Servidor", { SEC: "SEC-DF", "Custo/Servidor": 10 });
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([]), "Custo Total");
  add("Quantidade de Servidores", { SEC: "SEC-DF", "Qtd Servidores": 2 });
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}

function costsWorkbookWithConsistentData() {
  const workbook = XLSX.utils.book_new();
  const add = (name: string, row: Record<string, unknown>) => XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([row]), name);
  add("Visão Geral", { SEC: "DF", Total: "1.200,00", "Área da Sec (m2)": "300", "Qtd de servidores": "6" });
  add("Custo por Área e Servidor", { SEC: "DF", "Área/Servidor": 50, "Custo/Servidor": 200, "Custo/Área": 4 });
  add("Custo Total", { SEC: "DF", Total: 1200 });
  add("Quantidade de Servidores", { SEC: "DF", "Qtd Servidores": 6 });
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}

describe("importação de dados", () => {
  it("compara colaboradores pelo CPF e indica os registros que saem da base", () => {
    const baseline = {
      colaboradores: [{ id: "cpf-12345678901", nome: "Pessoa Antiga", cpf: "123.456.789-01", funcao: "Apoio", sec: "DF" }],
      contratos: [], despesasSemContrato: [], secs: ["SEC-DF"], custos: {},
    } as any;
    const buffer = workbookBuffer("SECs - Colaboradores", [
      { NOME: "Pessoa Atualizada", CPF: "12345678901", POSTO: "Analista", SEC: "SEC-DF" },
      { NOME: "Pessoa Nova", CPF: "98765432100", POSTO: "Apoio", SEC: "SEC-GO" },
    ]);

    const { candidate, summary } = buildCandidateData(baseline, buffer, "Dados de Colaboradores.xlsx");

    expect(summary.domains.colaboradores).toMatchObject({ added: 1, updated: 1, unchanged: 0, removed: 0 });
    expect(summary.domains.colaboradores?.samples.updated).toContain("Pessoa Atualizada");
    expect(candidate.colaboradores).toHaveLength(2);
    expect(candidate.colaboradores.find(item => item.cpf === "123.456.789-01")?.funcao).toBe("Analista");
  });

  it("remove da versão candidata o colaborador que não consta no novo arquivo", () => {
    const baseline = {
      colaboradores: [
        { id: "cpf-12345678901", nome: "Pessoa Mantida", cpf: "123.456.789-01", funcao: "Apoio", sec: "DF" },
        { id: "cpf-98765432100", nome: "Pessoa Saindo", cpf: "987.654.321-00", funcao: "Apoio", sec: "GO" },
      ],
      contratos: [], despesasSemContrato: [], secs: ["SEC-DF", "SEC-GO"], custos: {},
    } as any;
    const buffer = workbookBuffer("SECs - Colaboradores", [{ NOME: "Pessoa Mantida", CPF: "12345678901", POSTO: "Apoio", SEC: "SEC-DF" }]);

    const { candidate, summary } = buildCandidateData(baseline, buffer, "Dados de Colaboradores.xlsx");

    expect(summary.domains.colaboradores).toMatchObject({ added: 0, updated: 0, unchanged: 1, removed: 1 });
    expect(summary.domains.colaboradores?.samples.removed).toContain("Pessoa Saindo");
    expect(candidate.colaboradores.map(item => item.nome)).toEqual(["Pessoa Mantida"]);
  });

  it("mantém o registro quando apenas o identificador técnico diverge da planilha", () => {
    const baseline = {
      colaboradores: [{ id: "registro-legado-1", nome: "Pessoa Mantida", cpf: "123.456.789-01", funcao: "Apoio", sec: "DF" }],
      contratos: [], despesasSemContrato: [], secs: ["SEC-DF"], custos: {},
    } as any;
    const buffer = workbookBuffer("SECs - Colaboradores", [{ NOME: "Pessoa Mantida", CPF: "12345678901", POSTO: "Apoio", SEC: "SEC-DF" }]);

    const { summary } = buildCandidateData(baseline, buffer, "Dados de Colaboradores.xlsx");

    expect(summary.domains.colaboradores).toMatchObject({ added: 0, updated: 0, unchanged: 1, removed: 0 });
  });

  it("rejeita planilha de colaboradores sem as colunas obrigatórias", () => {
    const baseline = { colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} } as any;
    const buffer = workbookBuffer("SECs - Colaboradores", [{ NOME: "Pessoa", SEC: "SEC-DF" }]);
    expect(() => buildCandidateData(baseline, buffer, "Dados de Colaboradores.xlsx")).toThrow("CPF");
  });

  it("acumula bloqueios de CPF e campos obrigatórios em linhas diferentes", () => {
    const baseline = { colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} } as any;
    const buffer = workbookBuffer("SECs - Colaboradores", [
      { NOME: "", CPF: "123", POSTO: "", SEC: "SEC-DF" },
      { NOME: "Pessoa", CPF: "12345678901", POSTO: "Apoio", SEC: "" },
    ]);
    expect(() => buildCandidateData(baseline, buffer, "Dados de Colaboradores.xlsx"))
      .toThrow(/linha 2, coluna “NOME”.*linha 3, coluna “SEC”/s);
  });

  it("bloqueia contratos com valor numérico inválido e informa a linha", () => {
    const baseline = { colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} } as any;
    expect(() => buildCandidateData(baseline, contractsWorkbookBuffer("inválido"), "Gestão de Contratos.xlsx"))
      .toThrow("Valor mensal");
  });

  it("informa a coluna SEC ao bloquear secretarias vazias", () => {
    const baseline = { colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} } as any;
    const buffer = workbookBuffer("Plan1", [{ SEC: "" }, { SEC: "SEC-DF" }]);
    expect(() => buildCandidateData(baseline, buffer, "Siglas das Secretarias.xlsx"))
      .toThrow("linha 2, coluna “SEC”");
  });

  it("acumula abas de custos ausentes no mesmo bloqueio", () => {
    const baseline = { colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} } as any;
    const buffer = workbookBuffer("Visão Geral", [{ SEC: "SEC-DF", Total: 10 }]);
    expect(() => buildCandidateData(baseline, buffer, "Custos compilados por estado2.xlsx"))
      .toThrow(/custo_area.*custo_servidor/s);
  });

  it("bloqueia uma aba de custos com coluna específica ausente", () => {
    const baseline = { colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} } as any;
    expect(() => buildCandidateData(baseline, costsWorkbookWithInvalidAreaSheet(), "Custos compilados por estado2.xlsx"))
      .toThrow(/Custo por Área.*Custo\/Área/s);
  });

  it("bloqueia uma aba obrigatória de custos vazia", () => {
    const baseline = { colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} } as any;
    expect(() => buildCandidateData(baseline, costsWorkbookWithEmptyTotalSheet(), "Custos compilados por estado2.xlsx"))
      .toThrow(/Custo Total.*não há registros válidos/s);
  });

  it("recalcula as séries auxiliares de custos a partir da visão geral importada", () => {
    const baseline = { colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} } as any;
    const { candidate } = buildCandidateData(baseline, costsWorkbookWithConsistentData(), "Custos compilados por estado2.xlsx");

    expect(candidate.custos.custo_total).toEqual([{ SEC: "SEC-DF", Total: 1200 }]);
    expect(candidate.custos.custo_area).toEqual([{ SEC: "SEC-DF", "Custo/Área": 4 }]);
    expect(candidate.custos.custo_servidor).toEqual([{ SEC: "SEC-DF", "Custo/Servidor": 200 }]);
    expect(candidate.custos.servidores).toEqual([{ SEC: "SEC-DF", "Qtd Servidores": 6 }]);
  });

  it("preserva a versão aprovada até a confirmação e registra o histórico ao concluir a importação", async () => {
    const baseline = {
      colaboradores: [{ id: "cpf-12345678901", nome: "Pessoa Antiga", cpf: "123.456.789-01", funcao: "Apoio", sec: "DF" }],
      contratos: [], despesasSemContrato: [], secs: ["SEC-DF"], custos: {},
    } as any;
    lifecycleState.current = { id: 1, payload: JSON.stringify(baseline), isCurrent: true };
    lifecycleState.pending = null;
    lifecycleState.history = [];
    const file = workbookBuffer("SECs - Colaboradores", [{ NOME: "Pessoa Atualizada", CPF: "12345678901", POSTO: "Analista", SEC: "SEC-DF" }]);

    const prepared = await prepareImport("Dados de Colaboradores.xlsx", file, 9, "Responsável de Teste");
    expect((await getCurrentDashboardData()).colaboradores[0]?.nome).toBe("Pessoa Antiga");
    expect(prepared.summary.domains.colaboradores?.updated).toBe(1);
    expect(lifecycleState.pending?.status).toBe("pending");

    await approveImport(prepared.importId, 9);
    expect((await getCurrentDashboardData()).colaboradores[0]?.nome).toBe("Pessoa Atualizada");
    expect((await listImportHistory())[0]?.status).toBe("approved");
    expect((await listImportHistory())[0]?.responsibleName).toBe("Responsável de Teste");
  });

  it("rejeita o arquivo de custos que não é a versão oficial", () => {
    const baseline = { colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} } as any;
    expect(() => buildCandidateData(baseline, costsWorkbookWithInvalidAreaSheet(), "Custos compilados por estado.xlsx"))
      .toThrow("Custos compilados por estado2.xlsx");
  });
});
