import { describe, expect, it } from "vitest";
import dadosCustos from "./dadosCustos.json";
import { colaboradores, contratos, despesasSemContrato } from "./data";
import { buildCostAnalytics, groupAndCount, groupAndSum, sumField } from "./costAnalytics";

describe("auditoria de cálculos analíticos", () => {
  const analytics = buildCostAnalytics(dadosCustos.visao_geral);

  it("deriva os custos, áreas e servidores a partir da visão detalhada", () => {
    expect(analytics.points).toHaveLength(dadosCustos.visao_geral.length);
    expect(sumField(analytics.custoTotal, "Total")).toBeCloseTo(
      sumField(dadosCustos.visao_geral, "Total"),
      2,
    );
    expect(sumField(analytics.servidores, "Qtd Servidores")).toBe(
      sumField(dadosCustos.visao_geral, "Qtd de servidores"),
    );

    const acre = analytics.points.find((point) => point.SEC === "SEC-AC");
    expect(acre?.["Custo/Servidor"]).toBeCloseTo(514068.97 / 4, 2);
    expect(acre?.["Custo/Área"]).toBeCloseTo(514068.97 / 254.84, 2);
  });

  it("mantém os agrupamentos de despesas reconciliados aos totais de origem", () => {
    const contratosPorFornecedor = groupAndSum(contratos, "fornecedor", "mensal");
    const despesasPorServico = groupAndSum(despesasSemContrato, "servico", "mensal");

    expect(sumField(contratosPorFornecedor, "value")).toBeCloseTo(sumField(contratos, "mensal"), 2);
    expect(sumField(despesasPorServico, "value")).toBeCloseTo(sumField(despesasSemContrato, "mensal"), 2);
  });

  it("reconcilia as distribuições de colaboradores com o total da base", () => {
    const porSEC = groupAndCount(colaboradores, "sec");
    const porFuncao = groupAndCount(colaboradores, "funcao");

    expect(sumField(porSEC, "value")).toBe(colaboradores.length);
    expect(sumField(porFuncao, "value")).toBe(colaboradores.length);
  });
});
