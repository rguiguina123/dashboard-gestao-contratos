import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { buildCandidateData } from "./dataImports";

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

describe("importação de dados", () => {
  it("compara colaboradores pelo CPF e preserva registros ausentes do novo arquivo", () => {
    const baseline = {
      colaboradores: [{ id: "cpf-12345678901", nome: "Pessoa Antiga", cpf: "123.456.789-01", funcao: "Apoio", sec: "DF" }],
      contratos: [], despesasSemContrato: [], secs: ["SEC-DF"], custos: {},
    } as any;
    const buffer = workbookBuffer("SECs - Colaboradores", [
      { NOME: "Pessoa Atualizada", CPF: "12345678901", POSTO: "Analista", SEC: "SEC-DF" },
      { NOME: "Pessoa Nova", CPF: "98765432100", POSTO: "Apoio", SEC: "SEC-GO" },
    ]);

    const { candidate, summary } = buildCandidateData(baseline, buffer, "Dados de Colaboradores.xlsx");

    expect(summary.domains.colaboradores).toMatchObject({ added: 1, updated: 1, unchanged: 0 });
    expect(summary.domains.colaboradores?.samples.updated).toContain("Pessoa Atualizada");
    expect(candidate.colaboradores).toHaveLength(2);
    expect(candidate.colaboradores.find(item => item.cpf === "123.456.789-01")?.funcao).toBe("Analista");
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
    expect(() => buildCandidateData(baseline, buffer, "Custos compilados por estado.xlsx"))
      .toThrow(/custo_area.*custo_servidor/s);
  });

  it("bloqueia uma aba de custos com coluna específica ausente", () => {
    const baseline = { colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} } as any;
    expect(() => buildCandidateData(baseline, costsWorkbookWithInvalidAreaSheet(), "Custos compilados por estado.xlsx"))
      .toThrow(/Custo por Área.*Custo\/Área/s);
  });

  it("bloqueia uma aba obrigatória de custos vazia", () => {
    const baseline = { colaboradores: [], contratos: [], despesasSemContrato: [], secs: [], custos: {} } as any;
    expect(() => buildCandidateData(baseline, costsWorkbookWithEmptyTotalSheet(), "Custos compilados por estado.xlsx"))
      .toThrow(/Custo Total.*não há registros válidos/s);
  });
});
