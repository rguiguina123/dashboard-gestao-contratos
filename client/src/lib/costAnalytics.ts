export type CostDetailRow = Record<string, unknown>;

export type CostPoint = {
  SEC: string;
  Total: number;
  "Área da Sec (m2)": number;
  "Custo/Área": number;
  "Custo/Servidor": number;
  "Área/Servidor": number;
  "Qtd Servidores": number;
};

const toNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

/**
 * Deriva todos os indicadores de custo a partir da visão detalhada vigente.
 * As coleções auxiliares do arquivo de custos são tratadas somente como cache
 * de importação, nunca como fonte da verdade para gráficos e rankings.
 */
export function buildCostAnalytics(rows: CostDetailRow[]) {
  const points: CostPoint[] = rows
    .map((row) => {
      const SEC = typeof row.SEC === "string" ? row.SEC : "";
      const Total = toNumber(row.Total);
      const area = toNumber(row["Área da Sec (m2)"]);
      const servidores = toNumber(row["Qtd de servidores"]);

      return {
        SEC,
        Total,
        "Área da Sec (m2)": area,
        "Custo/Área": area > 0 ? Total / area : 0,
        "Custo/Servidor": servidores > 0 ? Total / servidores : 0,
        "Área/Servidor": servidores > 0 ? area / servidores : 0,
        "Qtd Servidores": servidores,
      };
    })
    .filter((point) => point.SEC.length > 0);

  return {
    points,
    custoTotal: points.map(({ SEC, Total }) => ({ SEC, Total })),
    custoArea: points.map(({ SEC, "Custo/Área": custoArea }) => ({ SEC, "Custo/Área": custoArea })),
    custoServidor: points.map(({ SEC, "Custo/Servidor": custoServidor }) => ({ SEC, "Custo/Servidor": custoServidor })),
    custoAreaServidor: points.map(({ SEC, "Área/Servidor": areaPorServidor, "Custo/Servidor": custoPorServidor }) => ({
      SEC,
      "Área/Servidor": areaPorServidor,
      "Custo/Servidor": custoPorServidor,
    })),
    servidores: points.map(({ SEC, "Qtd Servidores": quantidade }) => ({ SEC, "Qtd Servidores": quantidade })),
  };
}

export function sumField<T extends Record<string, unknown>>(items: T[], field: string) {
  return items.reduce((sum, item) => sum + toNumber(item[field]), 0);
}

export function groupAndSum<T extends object>(
  items: T[],
  labelField: keyof T & string,
  valueField: keyof T & string,
) {
  const groups = new Map<string, number>();
  items.forEach((item) => {
    const source = item as Record<string, unknown>;
    const label = typeof source[labelField] === "string" && source[labelField]
      ? String(source[labelField])
      : "Não informado";
    groups.set(label, (groups.get(label) || 0) + toNumber(source[valueField]));
  });
  return Array.from(groups, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

export function groupAndCount<T extends object>(items: T[], labelField: keyof T & string) {
  const groups = new Map<string, number>();
  items.forEach((item) => {
    const source = item as Record<string, unknown>;
    const label = typeof source[labelField] === "string" && source[labelField]
      ? String(source[labelField])
      : "Não informado";
    groups.set(label, (groups.get(label) || 0) + 1);
  });
  return Array.from(groups, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}
