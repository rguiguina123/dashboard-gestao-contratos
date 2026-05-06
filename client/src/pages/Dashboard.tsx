import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contratos, despesasSemContrato, totalMensal, totalMensalComContrato, totalMensalSemContrato } from "@/lib/data";
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

export default function Dashboard() {
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
        <div className="animate-slide-in-up">
          <h1 className="text-4xl font-bold text-foreground font-poppins mb-2">
            Gestão de Contratos 2026
          </h1>
          <p className="text-muted-foreground">
            Visão geral dos principais indicadores de gestão
          </p>
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
            value="112"
            icon={<Users className="w-5 h-5 text-emerald-600" />}
            trend="up"
            trendValue="+5 novos"
            color="success"
            delay={0.2}
          />
          <KPICard
            title="SECs Gerenciadas"
            value="48"
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
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <CardTitle className="text-purple-900">Tendência Mensal</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorCom" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="com"
                    stroke="#7c3aed"
                    fillOpacity={1}
                    fill="url(#colorCom)"
                    name="Com Contrato"
                  />
                  <Area
                    type="monotone"
                    dataKey="sem"
                    stroke="#3b82f6"
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
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <CardTitle className="text-purple-900">Resumo Consolidado</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Com Contrato</p>
                    <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalMensalComContrato)}</p>
                    <p className="text-xs text-purple-600 mt-1">{formatCurrency(totalMensalComContrato * 12)}/ano</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Sem Contrato</p>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalMensalSemContrato)}</p>
                    <p className="text-xs text-blue-600 mt-1">{formatCurrency(totalMensalSemContrato * 12)}/ano</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Geral</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMensal)}</p>
                    <p className="text-xs text-gray-600 mt-1">{formatCurrency(totalMensal * 12)}/ano</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Indicadores */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
            <CardTitle className="text-purple-900">Indicadores de Gestão</CardTitle>
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
                  {(contratos.length / 48).toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg hover-lift">
                <p className="text-sm text-muted-foreground mb-2">
                  Colaboradores/SEC
                </p>
                <p className="text-xl font-bold text-foreground font-poppins">
                  {(112 / 48).toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg hover-lift">
                <p className="text-sm text-muted-foreground mb-2">
                  Custo/Colaborador
                </p>
                <p className="text-xl font-bold text-foreground font-poppins">
                  {formatCurrency(totalMensal / 112)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
