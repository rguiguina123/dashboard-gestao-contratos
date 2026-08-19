import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { generateGenericReportPDF } from "@/lib/generateProfessionalPDF";

// Padrão PDF: relatório institucional conciso, com resumo executivo e série mensal.

export default function Dashboard() {
  const { contratos, colaboradores, despesasSemContrato, secs, totalMensal, totalMensalComContrato, totalMensalSemContrato, totalAnual, totalAnualComContrato, totalAnualSemContrato } = useDashboardData();
  // Dados de tendência mensal
  const monthlyTrend = [
    { month: "Jan", com: 1200000, sem: 450000 },
    { month: "Fev", com: 1350000, sem: 480000 },
    { month: "Mar", com: 1280000, sem: 520000 },
    { month: "Abr", com: 1420000, sem: 510000 },
    { month: "Mai", com: 1550000, sem: 580000 },
    { month: "Jun", com: totalMensalComContrato, sem: totalMensalSemContrato },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-slide-in-up flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground font-poppins mb-2">
              Gestão de Contratos 2026
            </h1>
            <p className="text-muted-foreground">
              Visão geral dos principais indicadores de gestão
            </p>
          </div>
          <button
            onClick={() => {
              const metrics = [
                { label: 'Despesa Mensal Total', value: `R$ ${formatCurrency(totalMensal)}` },
                { label: 'Despesa Anual Total', value: `R$ ${formatCurrency(totalAnual)}` },
                { label: 'Contratos Ativos', value: contratos.length },
                { label: 'Colaboradores', value: colaboradores.length },
                { label: 'SECs Gerenciadas', value: secs.length },
              ];
              const tableData = monthlyTrend.map(item => [
                item.month,
                formatCurrency(item.com),
                formatCurrency(item.sem),
                formatCurrency(item.com + item.sem),
              ]);
              generateGenericReportPDF(
                'Relatório Executivo do Dashboard',
                metrics,
                ['Mês', 'Com Contrato', 'Sem Contrato', 'Total Mensal'],
                tableData,
                'Relatorio_Executivo_Dashboard'
              );
            }}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#003f5f] px-4 py-2 font-semibold text-white transition-all hover:bg-[#005f83] hover:shadow-lg"
          >
            <FileText className="w-4 h-4" />
            Exportar Relatório
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
          <KPICard
            title="Despesa Mensal Total"
            value={formatCurrency(totalMensal)}
            icon={<DollarSign className="w-5 h-5 text-primary" />}
            trend="up"
            trendValue="+12.5% vs mês anterior"
            color="primary"
            delay={0}
          />
          <KPICard
            title="Contratos Ativos"
            value={contratos.length.toString()}
            icon={<FileText className="w-5 h-5 text-blue-600" />}
            trend="neutral"
            trendValue="Sem alterações"
            color="primary"
            delay={0.1}
          />
          <KPICard
            title="Colaboradores"
            value={colaboradores.length.toString()}
            icon={<Users className="w-5 h-5 text-emerald-600" />}
            trend="up"
            trendValue="+5 novos"
            color="success"
            delay={0.2}
          />
          <KPICard
            title="SECs Gerenciadas"
            value={secs.length.toString()}
            icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
            trend="neutral"
            trendValue="Estável"
            color="warning"
            delay={0.3}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Tendência */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-[#c9dde6] bg-[#eaf3f7]">
              <CardTitle className="text-[#003f5f]">Tendência Mensal</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorCom" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#087fa3" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#087fa3" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#89ad45" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#89ad45" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#c9dde6" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="com"
                    stroke="#087fa3"
                    fillOpacity={1}
                    fill="url(#colorCom)"
                    name="Com Contrato"
                  />
                  <Area
                    type="monotone"
                    dataKey="sem"
                    stroke="#89ad45"
                    fillOpacity={1}
                    fill="url(#colorSem)"
                    name="Sem Contrato"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resumo Consolidado */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-[#c9dde6] bg-[#eaf3f7]">
              <CardTitle className="text-[#003f5f]">Resumo Consolidado</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border border-[#cbe59b] bg-[#eef4df] p-4">
                  <div>
                    <p className="text-sm font-medium text-[#55752c]">Com Contrato</p>
                    <p className="text-2xl font-bold text-[#003f5f]">{formatCurrency(totalMensalComContrato)}</p>
                    <p className="mt-1 text-xs text-[#55752c]">{formatCurrency(totalAnualComContrato)}/ano</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-[#89ad45]" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#f6da73] bg-[#fff8db] p-4">
                  <div>
                    <p className="text-sm font-medium text-[#b6873c]">Sem Contrato</p>
                    <p className="text-2xl font-bold text-[#003f5f]">{formatCurrency(totalMensalSemContrato)}</p>
                    <p className="mt-1 text-xs text-[#b6873c]">{formatCurrency(totalAnualSemContrato)}/ano</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-[#b6873c]" />
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Geral</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMensal)}</p>
                    <p className="text-xs text-gray-600 mt-1">{formatCurrency(totalAnual)}/ano</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Indicadores */}
        <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-[#c9dde6] bg-[#eaf3f7]">
              <CardTitle className="text-[#003f5f]">Indicadores de Gestão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary rounded-lg hover-lift">
                <p className="text-sm text-muted-foreground mb-2">
                  Ticket Médio
                </p>
                <p className="text-xl font-bold text-foreground font-poppins">
                  {formatCurrency(totalMensal / contratos.length)}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg hover-lift">
                <p className="text-sm text-muted-foreground mb-2">
                  Contratos/SEC
                </p>
                <p className="text-xl font-bold text-foreground font-poppins">
                  {(contratos.length / secs.length).toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg hover-lift">
                <p className="text-sm text-muted-foreground mb-2">
                  Colaboradores/SEC
                </p>
                <p className="text-xl font-bold text-foreground font-poppins">
                  {(colaboradores.length / secs.length).toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg hover-lift">
                <p className="text-sm text-muted-foreground mb-2">
                  Custo/Colaborador
                </p>
                <p className="text-xl font-bold text-foreground font-poppins">
                  {formatCurrency(totalMensal / colaboradores.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
