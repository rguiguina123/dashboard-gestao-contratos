import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { AlertCircle, ArrowUpRight, FileText, Landmark, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { generateGenericReportPDF } from "@/lib/generateProfessionalPDF";

export default function Dashboard() {
  const { contratos, colaboradores, despesasSemContrato, secs, totalMensal, totalMensalComContrato, totalMensalSemContrato, totalAnual, totalAnualComContrato, totalAnualSemContrato } = useDashboardData();
  const shareComContrato = totalMensal ? (totalMensalComContrato / totalMensal) * 100 : 0;
  const shareSemContrato = totalMensal ? (totalMensalSemContrato / totalMensal) * 100 : 0;
  const safeDivision = (value: number, divisor: number) => divisor ? value / divisor : 0;

  const exportReport = () => generateGenericReportPDF(
    "Relatório executivo de gestão de contratos",
    [
      { label: "Despesa mensal", value: formatCurrency(totalMensal) },
      { label: "Despesa anual", value: formatCurrency(totalAnual) },
      { label: "Contratos ativos", value: contratos.length },
      { label: "Colaboradores", value: colaboradores.length },
      { label: "SECs gerenciadas", value: secs.length },
    ],
    ["Referência", "Com contrato", "Sem contrato", "Total"],
    [["Base atual", formatCurrency(totalMensalComContrato), formatCurrency(totalMensalSemContrato), formatCurrency(totalMensal)]],
    "Relatorio_Executivo_Dashboard",
  );

  return <DashboardLayout><div className="space-y-7">
    <header className="flex flex-col justify-between gap-5 border-b border-[#c9dde6] pb-6 lg:flex-row lg:items-end">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#087fa3]">Painel executivo</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#003f5f] sm:text-4xl">Gestão de contratos</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#547182]">Leitura consolidada da base vigente de contratos, despesas e colaboradores.</p></div>
      <button onClick={exportReport} className="inline-flex w-fit items-center gap-2 border-b-2 border-[#00a6c7] bg-[#003f5f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005f83]"><FileText className="h-4 w-4" />Exportar relatório</button>
    </header>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard title="Despesa mensal" value={formatCurrency(totalMensal)} icon={<Landmark className="h-5 w-5" />} subtitle="Base consolidada atual" />
      <MetricCard title="Contratos ativos" value={contratos.length} icon={<FileText className="h-5 w-5" />} subtitle={`${despesasSemContrato.length} despesa(s) sem contrato`} />
      <MetricCard title="Colaboradores" value={colaboradores.length} icon={<Users className="h-5 w-5" />} subtitle={`${secs.length} SECs na base`} />
      <MetricCard title="Despesa anual" value={formatCurrency(totalAnual)} icon={<ArrowUpRight className="h-5 w-5" />} subtitle="Soma dos valores anuais informados" />
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <Card className="border-[#c9dde6] bg-white shadow-[0_2px_12px_rgba(0,63,95,.05)]"><CardHeader className="border-b border-[#e4edf1] pb-4"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#547182]">Composição mensal</p><CardTitle className="mt-1 text-xl text-[#003f5f]">Recursos por modalidade</CardTitle></CardHeader><CardContent className="space-y-7 pt-7">
        <div><div className="mb-2 flex items-center justify-between text-sm"><span className="font-medium text-[#365869]">Despesas com contrato</span><span className="font-semibold text-[#003f5f]">{formatCurrency(totalMensalComContrato)}</span></div><div className="h-2 overflow-hidden bg-[#e4f0f5]"><div className="h-full bg-[#005f83]" style={{ width: `${shareComContrato}%` }} /></div><p className="mt-2 text-xs text-[#547182]">{shareComContrato.toFixed(1)}% da despesa mensal informada.</p></div>
        <div><div className="mb-2 flex items-center justify-between text-sm"><span className="font-medium text-[#365869]">Despesas sem contrato</span><span className="font-semibold text-[#003f5f]">{formatCurrency(totalMensalSemContrato)}</span></div><div className="h-2 overflow-hidden bg-[#e4f0f5]"><div className="h-full bg-[#00a6c7]" style={{ width: `${shareSemContrato}%` }} /></div><p className="mt-2 text-xs text-[#547182]">{shareSemContrato.toFixed(1)}% da despesa mensal informada.</p></div>
      </CardContent></Card>
      <Card className="border-[#003f5f] bg-[#003f5f] text-white shadow-[0_2px_12px_rgba(0,63,95,.16)]"><CardHeader className="border-b border-white/15 pb-4"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#8fd2e6]">Síntese anual</p><CardTitle className="mt-1 text-xl text-white">Leitura consolidada</CardTitle></CardHeader><CardContent className="space-y-5 pt-6"><div><p className="text-xs text-[#c2e6f0]">Com contrato</p><p className="mt-1 text-2xl font-semibold">{formatCurrency(totalAnualComContrato)}</p></div><div><p className="text-xs text-[#c2e6f0]">Sem contrato</p><p className="mt-1 text-2xl font-semibold">{formatCurrency(totalAnualSemContrato)}</p></div><div className="border-t border-white/15 pt-5"><p className="text-xs text-[#c2e6f0]">Total anual</p><p className="mt-1 text-3xl font-semibold text-[#8fd2e6]">{formatCurrency(totalAnual)}</p></div></CardContent></Card>
    </section>

    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
      ["Ticket médio", formatCurrency(safeDivision(totalMensal, contratos.length))],
      ["Contratos por SEC", safeDivision(contratos.length, secs.length).toFixed(1)],
      ["Colaboradores por SEC", safeDivision(colaboradores.length, secs.length).toFixed(1)],
      ["Custo por colaborador", formatCurrency(safeDivision(totalMensal, colaboradores.length))],
    ].map(([label, value]) => <div key={label} className="border-l-2 border-[#00a6c7] px-4 py-2"><p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#547182]">{label}</p><p className="mt-1 text-lg font-semibold text-[#003f5f]">{value}</p></div>)}</section>
    <p className="flex items-center gap-2 text-xs text-[#547182]"><AlertCircle className="h-3.5 w-3.5 text-[#087fa3]" />Indicadores calculados exclusivamente a partir da versão vigente da base.</p>
  </div></DashboardLayout>;
}
