import { and, desc, eq } from "drizzle-orm";
import * as XLSX from "xlsx";
import { colaboradores, contratos, despesasSemContrato, secs } from "../client/src/lib/data";
import custosPadrao from "../client/src/lib/dadosCustos.json";
import { dataImports, dataSnapshots } from "../drizzle/schema";
import { getDb } from "./db";
import { storagePut } from "./storage";

export type DashboardData = {
  colaboradores: typeof colaboradores;
  contratos: typeof contratos;
  despesasSemContrato: typeof despesasSemContrato;
  secs: string[];
  custos: typeof custosPadrao;
};

export type ChangeCounts = {
  added: number;
  updated: number;
  unchanged: number;
  removed: number;
  samples: { added: string[]; updated: string[]; unchanged: string[]; removed: string[] };
  details: { added: ChangeDetail[]; updated: ChangeDetail[]; unchanged: ChangeDetail[]; removed: ChangeDetail[] };
};
export type ChangeDetail = { label: string; before?: Record<string, string>; after: Record<string, string> };
export type ImportSummary = {
  fileName: string;
  domains: Partial<Record<keyof DashboardData, ChangeCounts>>;
  warnings: string[];
};

const defaultData = (): DashboardData => structuredClone({
  colaboradores,
  contratos,
  despesasSemContrato,
  secs,
  custos: custosPadrao,
});
const OFFICIAL_COSTS_FILE = "CUSTOS COMPILADOS POR ESTADO2.XLSX";

const clean = (value: unknown) => String(value ?? "").trim();
const keyText = (value: unknown) => clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
function requiredNumber(value: unknown, column: string, line: number, sheet: string) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const original = clean(value).replace(/R\$|\s/g, "");
  if (!original) throw new Error(`A coluna “${column}” está vazia na linha ${line} da aba “${sheet}”.`);
  const lastComma = original.lastIndexOf(",");
  const lastDot = original.lastIndexOf(".");
  const normalized = lastComma > lastDot
    ? original.replace(/\./g, "").replace(",", ".")
    : original.replace(/,/g, "");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) throw new Error(`O valor da coluna “${column}” é inválido na linha ${line} da aba “${sheet}”.`);
  return parsed;
}
const cpfDigits = (value: unknown) => clean(value).replace(/\D/g, "").padStart(11, "0");
const formatCpf = (value: unknown) => {
  const digits = cpfDigits(value);
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};
const shortSec = (value: unknown) => clean(value).replace(/^SEC[-\s]*/i, "").toUpperCase();
const fullSec = (value: unknown) => {
  const normalized = shortSec(value);
  return normalized ? `SEC-${normalized}` : "";
};
const excelDate = (value: unknown) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }
  return clean(value);
};
function requiredDate(value: unknown, line: number, sheet: string) {
  const formatted = excelDate(value);
  if (!formatted) throw new Error(`A coluna de vigência está vazia na linha ${line} da aba “${sheet}”.`);
  const match = formatted.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
    if (date.getFullYear() === Number(match[3]) && date.getMonth() === Number(match[2]) - 1 && date.getDate() === Number(match[1])) {
      return `${match[1].padStart(2, "0")}/${match[2].padStart(2, "0")}/${match[3]}`;
    }
  }
  const parsed = new Date(formatted);
  if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  throw new Error(`A data de vigência é inválida na linha ${line} da aba “${sheet}”.`);
}

function rowsFromSheet(workbook: XLSX.WorkBook, name: string) {
  const sheet = workbook.Sheets[name];
  if (!sheet) throw new Error(`Aba “${name}”, linha 1, coluna “Aba”: aba obrigatória não encontrada.`);
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });
}

function collectSheetRows(workbook: XLSX.WorkBook, name: string, errors: string[]) {
  const sheet = workbook.Sheets[name];
  if (!sheet) {
    errors.push(`Aba “${name}”, linha 1, coluna “Aba”: aba obrigatória não encontrada.`);
    return null;
  }
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });
  if (!rows.length) {
    errors.push(`Aba “${name}”, linha 2, coluna “Dados”: não há registros válidos.`);
    return null;
  }
  return rows;
}

function requireColumns(rows: Record<string, unknown>[], columns: string[], sheet: string) {
  const headers = new Set(Object.keys(rows[0] ?? {}));
  const missing = columns.filter(column => !headers.has(column));
  if (missing.length) throw new Error(missing.map(column => `Aba “${sheet}”, linha 1, coluna “${column}”: coluna obrigatória não encontrada.`).join("\n"));
}

function collectRequiredColumns(rows: Record<string, unknown>[], columns: string[], sheet: string, errors: string[]) {
  const headers = new Set(Object.keys(rows[0] ?? {}));
  const missing = columns.filter(column => !headers.has(column));
  missing.forEach(column => errors.push(`Aba “${sheet}”, linha 1, coluna “${column}”: coluna obrigatória não encontrada.`));
  return missing.length === 0;
}

function collectValidatedRows<T>(
  rows: Record<string, unknown>[],
  startLine: number,
  mapRow: (row: Record<string, unknown>, line: number) => T,
  errors: string[],
) {
  const parsed: T[] = [];
  rows.forEach((row, index) => {
    try {
      parsed.push(mapRow(row, index + startLine));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `Erro de validação na linha ${index + startLine}.`);
    }
  });
  return parsed;
}

function recordLabel(record: unknown) {
  const value = record as Record<string, unknown>;
  return clean(value.nome || value.contrato || value.SEC || value.sec || value.fornecedor || "Registro");
}

function previewRecord(record: unknown): Record<string, string> {
  const value = record as Record<string, unknown>;
  const fields = ["nome", "contrato", "fornecedor", "objeto", "sec", "funcao", "servico", "mensal", "anual", "dataVencimento", "SEC", "Total", "Custo/Servidor", "Custo/Área", "Qtd Servidores"];
  return fields.reduce<Record<string, string>>((preview, field) => {
    if (value[field] === undefined || value[field] === null || value[field] === "") return preview;
    preview[field] = typeof value[field] === "number" ? Number(value[field]).toLocaleString("pt-BR", { maximumFractionDigits: 2 }) : clean(value[field]);
    return preview;
  }, {});
}

function comparableRecord(record: unknown) {
  const value = record as Record<string, unknown>;
  return JSON.stringify(Object.fromEntries(
    Object.entries(value)
      .filter(([field]) => field !== "id")
      .sort(([left], [right]) => left.localeCompare(right)),
  ));
}

function diffRecords<T>(before: T[], incoming: T[], keyOf: (item: T) => string): ChangeCounts {
  const previous = new Map(before.map(item => [keyOf(item), { item, serialized: comparableRecord(item) }]));
  const nextKeys = new Set(incoming.map(item => keyOf(item)));
  const counts = incoming.reduce<ChangeCounts>((current, item) => {
    const previousValue = previous.get(keyOf(item));
    const label = recordLabel(item);
    if (!previousValue) {
      current.added += 1;
      if (current.samples.added.length < 5) current.samples.added.push(label);
      current.details.added.push({ label, after: previewRecord(item) });
    } else if (previousValue.serialized === comparableRecord(item)) {
      current.unchanged += 1;
      if (current.samples.unchanged.length < 5) current.samples.unchanged.push(label);
      current.details.unchanged.push({ label, after: previewRecord(item) });
    } else {
      current.updated += 1;
      if (current.samples.updated.length < 5) current.samples.updated.push(label);
      current.details.updated.push({ label, before: previewRecord(previousValue.item), after: previewRecord(item) });
    }
    return current;
  }, {
    added: 0,
    updated: 0,
    unchanged: 0,
    removed: 0,
    samples: { added: [], updated: [], unchanged: [], removed: [] },
    details: { added: [], updated: [], unchanged: [], removed: [] },
  });
  previous.forEach(({ item }, key) => {
    if (nextKeys.has(key)) return;
    const label = recordLabel(item);
    counts.removed += 1;
    if (counts.samples.removed.length < 5) counts.samples.removed.push(label);
    counts.details.removed.push({ label, after: previewRecord(item) });
  });
  return counts;
}

function mergeRecords<T>(before: T[], incoming: T[], keyOf: (item: T) => string) {
  const next = new Map(before.map(item => [keyOf(item), item]));
  incoming.forEach(item => next.set(keyOf(item), item));
  return Array.from(next.values());
}

function parseWorkbook(buffer: Buffer, fileName: string): Partial<DashboardData> {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const name = keyText(fileName);

  if (name.includes("COLABORADOR")) {
    const errors: string[] = [];
    const rows = collectSheetRows(workbook, "SECs - Colaboradores", errors);
    const ready = rows ? collectRequiredColumns(rows, ["NOME", "CPF", "POSTO", "SEC"], "SECs - Colaboradores", errors) : false;
    if (!rows || !ready || errors.length) throw new Error(errors.join("\n"));
    const parsed = collectValidatedRows(rows, 2, (row, line) => {
      const nome = clean(row.NOME);
      const cpf = cpfDigits(row.CPF);
      const funcao = clean(row.POSTO);
      const sec = shortSec(row.SEC);
      if (!nome) throw new Error(`Aba “SECs - Colaboradores”, linha ${line}, coluna “NOME”: preenchimento obrigatório.`);
      if (cpf.length !== 11 || !/^\d{11}$/.test(cpf)) throw new Error(`Aba “SECs - Colaboradores”, linha ${line}, coluna “CPF”: CPF inválido.`);
      if (!funcao) throw new Error(`Aba “SECs - Colaboradores”, linha ${line}, coluna “POSTO”: preenchimento obrigatório.`);
      if (!sec) throw new Error(`Aba “SECs - Colaboradores”, linha ${line}, coluna “SEC”: preenchimento obrigatório.`);
      return { id: `cpf-${cpf}`, nome, cpf: formatCpf(cpf), funcao, sec };
    }, errors);
    if (errors.length) throw new Error(errors.join("\n"));
    return { colaboradores: parsed as DashboardData["colaboradores"] };
  }

  if (name.includes("GESTAO DE CONTRATO") || name.includes("GESTÃO DE CONTRATO")) {
    const errors: string[] = [];
    const controlled = collectSheetRows(workbook, "Despesas Vigência Controlada", errors);
    const uncontrolled = collectSheetRows(workbook, "Despesas Vigência NÃO Controlad", errors);
    const controlledReady = controlled ? collectRequiredColumns(controlled, ["Termo Contratual", "Fornecedor", "Objeto", "Sec", "Valor mensal ", "Valor Anual"], "Despesas Vigência Controlada", errors) : false;
    const uncontrolledReady = uncontrolled ? collectRequiredColumns(uncontrolled, ["SEC", "Serviço", "Fornecedor ", "Objeto", "Valor Mensal", "Valor Anual"], "Despesas Vigência NÃO Controlad", errors) : false;
    if (!controlled || !uncontrolled || errors.length || !controlledReady || !uncontrolledReady) throw new Error(errors.join("\n"));
    const parsedContracts = collectValidatedRows(controlled, 3, (row, line) => {
      const contrato = clean(row["Termo Contratual"]); const fornecedor = clean(row.Fornecedor); const objeto = clean(row.Objeto); const sec = fullSec(row.Sec);
      if (!contrato) throw new Error(`Aba “Despesas Vigência Controlada”, linha ${line}, coluna “Termo Contratual”: preenchimento obrigatório.`);
      if (!fornecedor) throw new Error(`Aba “Despesas Vigência Controlada”, linha ${line}, coluna “Fornecedor”: preenchimento obrigatório.`);
      if (!sec) throw new Error(`Aba “Despesas Vigência Controlada”, linha ${line}, coluna “Sec”: preenchimento obrigatório.`);
      return { id: `contrato-${keyText(contrato)}-${sec}`, contrato, fornecedor, objeto, sec, mensal: requiredNumber(row["Valor mensal "], "Valor mensal", line, "Despesas Vigência Controlada"), anual: requiredNumber(row["Valor Anual"], "Valor Anual", line, "Despesas Vigência Controlada"), dataVencimento: requiredDate(row["Vigência Máxima"] || row.Vigência, line, "Despesas Vigência Controlada") };
    }, errors);
    const parsedExpenses = collectValidatedRows(uncontrolled, 3, (row, line) => {
      const sec = shortSec(row.SEC); const servico = clean(row["Serviço"]); const fornecedor = clean(row["Fornecedor "]); const objeto = clean(row.Objeto);
      if (!sec) throw new Error(`Aba “Despesas Vigência NÃO Controlad”, linha ${line}, coluna “SEC”: preenchimento obrigatório.`);
      if (!servico) throw new Error(`Aba “Despesas Vigência NÃO Controlad”, linha ${line}, coluna “Serviço”: preenchimento obrigatório.`);
      if (!fornecedor) throw new Error(`Aba “Despesas Vigência NÃO Controlad”, linha ${line}, coluna “Fornecedor”: preenchimento obrigatório.`);
      return { id: `despesa-${keyText(fornecedor)}-${sec}-${keyText(servico)}-${line}`, sec, servico, fornecedor, objeto, mensal: requiredNumber(row["Valor Mensal"], "Valor Mensal", line, "Despesas Vigência NÃO Controlad"), anual: requiredNumber(row["Valor Anual"], "Valor Anual", line, "Despesas Vigência NÃO Controlad") };
    }, errors);
    if (errors.length) throw new Error(errors.join("\n"));
    return {
      contratos: parsedContracts as DashboardData["contratos"],
      despesasSemContrato: parsedExpenses as DashboardData["despesasSemContrato"],
    };
  }

  if (name.includes("SIGLAS") || name.includes("SECRETARIA")) {
    const errors: string[] = [];
    const rows = collectSheetRows(workbook, "Plan1", errors);
    const ready = rows ? collectRequiredColumns(rows, ["SEC"], "Plan1", errors) : false;
    if (!rows || !ready || errors.length) throw new Error(errors.join("\n"));
    const parsed = collectValidatedRows(rows, 2, (row, line) => {
      const sec = fullSec(row.SEC);
      if (!sec) throw new Error(`Aba “Plan1”, linha ${line}, coluna “SEC”: preenchimento obrigatório.`);
      return sec;
    }, errors);
    if (errors.length) throw new Error(errors.join("\n"));
    if (!parsed.length) throw new Error("Aba “Plan1”, linha 2, coluna “SEC”: não há registros válidos para importar.");
    return { secs: Array.from(new Set(parsed)).sort() };
  }

  if (name.includes("CUSTOS")) {
    if (name !== OFFICIAL_COSTS_FILE) {
      throw new Error("Para atualizar custos, envie exclusivamente o arquivo oficial “Custos compilados por estado2.xlsx”.");
    }
    const mapping: Array<[keyof typeof custosPadrao, RegExp, string[]]> = [
      ["visao_geral", /VISAO\s*GERAL/, ["SEC", "Total", "Custo/Servidor", "Custo/Área"]],
      ["custo_area_servidor", /AREA.*SERVIDOR|SERVIDOR.*AREA/, ["SEC", "Área/Servidor", "Custo/Servidor"]],
      ["custo_area", /CUSTO.*AREA/, ["SEC", "Custo/Área"]],
      ["custo_servidor", /CUSTO.*SERVIDOR/, ["SEC", "Custo/Servidor"]],
      ["custo_total", /CUSTO.*TOTAL|TOTAIS/, ["SEC", "Total"]],
      ["servidores", /QUANTIDADE.*SERVIDOR|SERVIDORES/, ["SEC", "Qtd Servidores"]],
    ];
    const updatedCosts = structuredClone(custosPadrao) as typeof custosPadrao;
    let identified = 0;
    const errors: string[] = [];
    for (const [target, pattern, columns] of mapping) {
      const sheetName = workbook.SheetNames.find(candidate => pattern.test(keyText(candidate)));
      if (!sheetName) {
        errors.push(`Aba de custos “${String(target)}”, linha 1, coluna “Aba”: aba obrigatória não encontrada.`);
        continue;
      }
      const parsed = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], { defval: "", raw: false });
      if (!parsed.length) { errors.push(`Aba “${sheetName}”, linha 2, coluna “Dados”: não há registros válidos.`); continue; }
      if (!collectRequiredColumns(parsed, columns, sheetName, errors)) continue;
      const invalidRows = parsed.map((row, index) => ({ row, line: index + 2 })).filter(({ row }) => !clean(row.SEC));
      invalidRows.forEach(({ line }) => errors.push(`Aba “${sheetName}”, linha ${line}, coluna “SEC”: preenchimento obrigatório.`));
      if (invalidRows.length) continue;
      (updatedCosts as Record<string, unknown>)[target] = parsed;
      identified += 1;
    }
    if (errors.length) throw new Error(errors.join("\n"));
    if (!identified || !updatedCosts.visao_geral.length) throw new Error("Aba “Visão Geral”, linha 2, coluna “Dados”: não há registros válidos para importar.");
    return { custos: updatedCosts as DashboardData["custos"] };
  }

  throw new Error("Não foi possível identificar o tipo de planilha. Envie um dos arquivos oficiais de colaboradores, contratos, secretarias ou custos.");
}

export function buildCandidateData(baseline: DashboardData, buffer: Buffer, fileName: string) {
  const patch = parseWorkbook(buffer, fileName);
  const summary: ImportSummary = { fileName, domains: {}, warnings: [] };
  const candidate: DashboardData = structuredClone(baseline);

  if (patch.colaboradores) {
    summary.domains.colaboradores = diffRecords(baseline.colaboradores, patch.colaboradores, row => row.cpf.replace(/\D/g, ""));
    candidate.colaboradores = patch.colaboradores;
  }
  if (patch.contratos) {
    summary.domains.contratos = diffRecords(baseline.contratos, patch.contratos, row => row.id);
    candidate.contratos = patch.contratos;
  }
  if (patch.despesasSemContrato) {
    summary.domains.despesasSemContrato = diffRecords(baseline.despesasSemContrato, patch.despesasSemContrato, row => row.id);
    candidate.despesasSemContrato = patch.despesasSemContrato;
  }
  if (patch.secs) {
    summary.domains.secs = diffRecords(baseline.secs, patch.secs, row => row);
    candidate.secs = patch.secs;
  }
  if (patch.custos) {
    summary.domains.custos = {
      added: 0,
      updated: 1,
      unchanged: 0,
      removed: 0,
      samples: { added: [], updated: ["Planilha de custos consolidada"], unchanged: [], removed: [] },
      details: { added: [], updated: [{ label: "Planilha de custos consolidada", after: { "Dados identificados": "Custos por secretaria, área, total, eficiência e quantidade de servidores" } }], unchanged: [], removed: [] },
    };
    candidate.custos = patch.custos;
  }
  return { candidate, summary };
}

export async function getCurrentDashboardData(): Promise<DashboardData> {
  const db = await getDb();
  if (!db) return defaultData();
  const current = await db.select().from(dataSnapshots).where(eq(dataSnapshots.isCurrent, true)).orderBy(desc(dataSnapshots.id)).limit(1);
  if (!current[0]) return defaultData();
  try { return JSON.parse(current[0].payload) as DashboardData; } catch { return defaultData(); }
}

export async function prepareImport(fileName: string, buffer: Buffer, userId: number) {
  const baseline = await getCurrentDashboardData();
  const { candidate, summary } = buildCandidateData(baseline, buffer, fileName);
  const rawFile = await storagePut(`imports/${userId}/${Date.now()}-${fileName}`, buffer, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível para registrar a importação.");
  const created = await db.insert(dataImports).values({
    fileName,
    fileKey: rawFile.key,
    status: "pending",
    payload: JSON.stringify(candidate),
    summary: JSON.stringify(summary),
    createdBy: userId,
  });
  return { importId: Number(created[0].insertId), summary };
}

export async function approveImport(importId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível para aplicar a importação.");
  const record = (await db.select().from(dataImports).where(and(eq(dataImports.id, importId), eq(dataImports.createdBy, userId), eq(dataImports.status, "pending"))).limit(1))[0];
  if (!record) throw new Error("A importação não foi encontrada, já foi aplicada ou não pertence ao usuário atual.");
  await db.transaction(async tx => {
    await tx.update(dataSnapshots).set({ isCurrent: false }).where(eq(dataSnapshots.isCurrent, true));
    await tx.insert(dataSnapshots).values({ payload: record.payload, isCurrent: true });
    await tx.update(dataImports).set({ status: "approved", approvedAt: new Date() }).where(eq(dataImports.id, importId));
  });
  return { ok: true };
}

export async function listImportHistory() {
  const db = await getDb();
  if (!db) return [];
  const records = await db.select({ id: dataImports.id, fileName: dataImports.fileName, status: dataImports.status, summary: dataImports.summary, createdAt: dataImports.createdAt, approvedAt: dataImports.approvedAt }).from(dataImports).orderBy(desc(dataImports.id)).limit(10);
  return records.map(record => ({ ...record, summary: JSON.parse(record.summary) as ImportSummary }));
}
