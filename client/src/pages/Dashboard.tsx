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

  return <DashboardLayout><div className="space-y-5">
    <header className="flex flex-col justify-between gap-4 border-b border-[#c9dde6] pb-4 lg:flex-row lg:items-end">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#087fa3]">Resumo</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#003f5f] sm:text-4xl">Gestão de contratos</h1></div>
      <button onClick={exportReport} className="inline-flex w-fit items-center gap-2 border-b-2 border-[#00a6c7] bg-[#003f5f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005f83]"><FileText className="h-4 w-4" />Exportar relatório</button>
    </header>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard title="Mensal" value={formatCurrency(totalMensal)} icon={<Landmark className="h-5 w-5" />} accent="blue" />
      <MetricCard title="Contratos" value={contratos.length} icon={<FileText className="h-5 w-5" />} subtitle={`${despesasSemContrato.length} sem contrato`} accent="yellow" />
      <MetricCard title="Colaboradores" value={colaboradores.length} icon={<Users className="h-5 w-5" />} subtitle={`${secs.length} SECs`} accent="green" />
      <MetricCard title="Anual" value={formatCurrency(totalAnual)} icon={<ArrowUpRight className="h-5 w-5" />} accent="blue" />
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <Card className="flex min-h-[400px] flex-col border-[#c9dde6] bg-white shadow-[0_2px_12px_rgba(0,63,95,.05)]"><CardHeader className="border-b border-[#e4edf1] pb-3"><CardTitle className="text-lg text-[#003f5f]">Mensal</CardTitle></CardHeader><CardContent className="flex flex-1 flex-col space-y-5 pt-5">
        <div><div className="mb-2 flex items-center justify-between text-sm"><span className="font-medium text-[#365869]">Com contrato</span><span className="font-semibold text-[#55752c]">{formatCurrency(totalMensalComContrato)} · {shareComContrato.toFixed(1)}%</span></div><div className="h-2 overflow-hidden bg-[#e4f0f5]"><div className="h-full bg-[#89ad45]" style={{ width: `${shareComContrato}%` }} /></div></div>
        <div><div className="mb-2 flex items-center justify-between text-sm"><span className="font-medium text-[#365869]">Sem contrato</span><span className="font-semibold text-[#9a7514]">{formatCurrency(totalMensalSemContrato)} · {shareSemContrato.toFixed(1)}%</span></div><div className="h-2 overflow-hidden bg-[#e4f0f5]"><div className="h-full bg-[#f2c94c]" style={{ width: `${shareSemContrato}%` }} /></div></div>
        <div className="mt-auto grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[#e4edf1] pt-5">{[
          ["Ticket médio", formatCurrency(safeDivision(totalMensal, contratos.length))],
          ["Contratos por SEC", safeDivision(contratos.length, secs.length).toFixed(1)],
          ["Colaboradores por SEC", safeDivision(colaboradores.length, secs.length).toFixed(1)],
          ["Custo por colaborador", formatCurrency(safeDivision(totalMensal, colaboradores.length))],
        ].map(([label, value]) => <div key={label}><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#547182]">{label}</p><p className="mt-1 text-base font-semibold text-[#003f5f]">{value}</p></div>)}</div>
      </CardContent></Card>
      <Card className="flex min-h-[400px] flex-col border-[#003f5f] bg-[#003f5f] text-white shadow-[0_2px_12px_rgba(0,63,95,.16)]"><CardHeader className="border-b border-white/15 pb-3"><CardTitle className="text-lg text-white">Anual</CardTitle></CardHeader><CardContent className="flex flex-1 flex-col space-y-5 pt-5"><div><p className="text-xs text-[#c2e6f0]">Com contrato</p><p className="mt-1 text-2xl font-semibold text-[#cbe59b]">{formatCurrency(totalAnualComContrato)}</p></div><div><p className="text-xs text-[#c2e6f0]">Sem contrato</p><p className="mt-1 text-2xl font-semibold text-[#f6da73]">{formatCurrency(totalAnualSemContrato)}</p></div><div className="mt-auto border-t border-white/15 pt-5"><p className="text-xs text-[#c2e6f0]">Total</p><p className="mt-1 text-3xl font-semibold text-[#8fd2e6]">{formatCurrency(totalAnual)}</p></div></CardContent></Card>
    </section>

  </div></DashboardLayout>;
}
