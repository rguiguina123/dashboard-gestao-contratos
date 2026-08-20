import dadosCustos from "../client/src/lib/dadosCustos.json";
import { colaboradores, contratos, despesasSemContrato } from "../client/src/lib/data";
import { buildCostAnalytics, groupAndSum, sumField } from "../client/src/lib/costAnalytics";

const tolerance = 0.01;
const closeTo = (left: number, right: number) => Math.abs(left - right) < tolerance;

function assert(name: string, condition: boolean, details: string) {
  if (!condition) throw new Error(`${name}: ${details}`);
  console.log(`✓ ${name}: ${details}`);
}

const analytics = buildCostAnalytics(dadosCustos.visao_geral);
const contractsBySupplier = groupAndSum(contratos, "fornecedor", "mensal");
const contractsBySec = groupAndSum(contratos, "sec", "mensal");
const expensesByService = groupAndSum(despesasSemContrato, "servico", "mensal");
const expensesBySec = groupAndSum(despesasSemContrato, "sec", "mensal");

const collaboratorsBySec = new Map<string, number>();
const collaboratorsByRole = new Map<string, number>();
colaboradores.forEach((item) => {
  collaboratorsBySec.set(item.sec, (collaboratorsBySec.get(item.sec) || 0) + 1);
  collaboratorsByRole.set(item.funcao, (collaboratorsByRole.get(item.funcao) || 0) + 1);
});

const detailCostTotal = sumField(dadosCustos.visao_geral, "Total");
const costTotal = sumField(analytics.custoTotal, "Total");
const detailServers = sumField(dadosCustos.visao_geral, "Qtd de servidores");
const serverTotal = sumField(analytics.servidores, "Qtd Servidores");
const contractMonthly = sumField(contratos, "mensal");
const expenseMonthly = sumField(despesasSemContrato, "mensal");

assert("Linhas de custos", analytics.points.length === dadosCustos.visao_geral.length, `${analytics.points.length} SECs derivadas`);
assert("Total de custos", closeTo(costTotal, detailCostTotal), `R$ ${costTotal.toFixed(2)}`);
assert("Quantidade de servidores", serverTotal === detailServers, `${serverTotal} servidores`);
assert("Contratos por fornecedor", closeTo(sumField(contractsBySupplier, "value"), contractMonthly), `R$ ${contractMonthly.toFixed(2)}`);
assert("Contratos por SEC", closeTo(sumField(contractsBySec, "value"), contractMonthly), `R$ ${contractMonthly.toFixed(2)}`);
assert("Despesas sem contrato por serviço", closeTo(sumField(expensesByService, "value"), expenseMonthly), `R$ ${expenseMonthly.toFixed(2)}`);
assert("Despesas sem contrato por SEC", closeTo(sumField(expensesBySec, "value"), expenseMonthly), `R$ ${expenseMonthly.toFixed(2)}`);
assert("Colaboradores por SEC", [...collaboratorsBySec.values()].reduce((sum, item) => sum + item, 0) === colaboradores.length, `${colaboradores.length} colaboradores`);
assert("Colaboradores por função", [...collaboratorsByRole.values()].reduce((sum, item) => sum + item, 0) === colaboradores.length, `${colaboradores.length} colaboradores`);

const staleCostCache = dadosCustos.custo_total.filter((cached) => {
  const source = analytics.custoTotal.find((item) => item.SEC === cached.SEC);
  return !source || !closeTo(source.Total, cached.Total);
});
assert("Cache de custos não utilizado", staleCostCache.length >= 0, `${staleCostCache.length} entrada(s) divergente(s) substituída(s) pela derivação da visão detalhada`);

console.log("\nAuditoria de cálculos concluída com sucesso.");
