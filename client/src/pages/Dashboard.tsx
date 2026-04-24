import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { metricas, contratos, colaboradores } from "@/lib/data";
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
    { month: "Jun", com: 1674292, sem: 620000 },
  ];

  // Top SECs por gasto
  const topSECs = [
    { name: "SEC A", value: 2500000 },
    { name: "SEC B", value: 2100000 },
    { name: "SEC C", value: 1800000 },
    { name: "SEC D", value: 1500000 },
    { name: "SEC E", value: 1200000 },
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
            value={formatCurrency(metricas.mensal_geral)}
            icon={<DollarSign className="w-5 h-5 text-primary" />}
            trend="up"
            trendValue="+12.5% vs mês anterior"
            color="primary"
            delay={0}
          />
          <KPICard
            title="Contratos Ativos"
            value={metricas.contratosControlados}
            icon={<FileText className="w-5 h-5 text-blue-600" />}
            trend="neutral"
            trendValue="Sem alterações"
            color="primary"
            delay={0.1}
          />
          <KPICard
            title="Colaboradores"
            value={metricas.colaboradores}
            icon={<Users className="w-5 h-5 text-emerald-600" />}
            trend="up"
            trendValue="+5 novos"
            color="success"
            delay={0.2}
          />
          <KPICard
            title="SECs Gerenciadas"
            value={metricas.secsComColaboradores}
            icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
            trend="neutral"
            trendValue="Estável"
            color="warning"
            delay={0.3}
          />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendência Mensal */}
          <Card className="card-elevated animate-slide-in-up">
            <CardHeader>
              <CardTitle className="text-lg font-poppins">
                Tendência de Despesas (6 meses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorCom" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="com"
                    stroke="#1e40af"
                    fillOpacity={1}
                    fill="url(#colorCom)"
                    name="Com Contrato"
                  />
                  <Area
                    type="monotone"
                    dataKey="sem"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorSem)"
                    name="Sem Contrato"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top SECs */}
          <Card className="card-elevated animate-slide-in-up">
            <CardHeader>
              <CardTitle className="text-lg font-poppins">
                Top 5 SECs por Despesa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSECs}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar
                    dataKey="value"
                    fill="#1e40af"
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-primary card-elevated animate-slide-in-up">
            <CardHeader>
              <CardTitle className="text-lg font-poppins flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Com Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mensal</p>
                <p className="text-2xl font-bold text-primary font-poppins">
                  {formatCurrency(metricas.mensal_com_contrato)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Anual</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(metricas.anual_com_contrato)}
                </p>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {(
                    (metricas.mensal_com_contrato / metricas.mensal_geral) *
                    100
                  ).toFixed(1)}
                  % do total
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 card-elevated animate-slide-in-up">
            <CardHeader>
              <CardTitle className="text-lg font-poppins flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Sem Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mensal</p>
                <p className="text-2xl font-bold text-amber-600 font-poppins">
                  {formatCurrency(metricas.mensal_sem_contrato)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Anual</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(metricas.anual_sem_contrato)}
                </p>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {(
                    (metricas.mensal_sem_contrato / metricas.mensal_geral) *
                    100
                  ).toFixed(1)}
                  % do total
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 card-elevated animate-slide-in-up">
            <CardHeader>
              <CardTitle className="text-lg font-poppins flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Economia Potencial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Itens sem contrato
                </p>
                <p className="text-2xl font-bold text-emerald-600 font-poppins">
                  {metricas.mensal_sem_contrato > 0 ? "R$ 0" : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Oportunidade de economia
                </p>
                <p className="text-lg font-semibold text-foreground">
                  Analisar contratos
                </p>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Potencial de otimização
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="card-elevated animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-lg font-poppins">
              Estatísticas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary rounded-lg hover-lift">
                <p className="text-sm text-muted-foreground mb-2">
                  Ticket Médio
                </p>
                <p className="text-xl font-bold text-foreground font-poppins">
                  {formatCurrency(
                    metricas.mensal_geral / metricas.contratosControlados
                  )}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg hover-lift">
                <p className="text-sm text-muted-foreground mb-2">
                  Contratos/SEC
                </p>
                <p className="text-xl font-bold text-foreground font-poppins">
                  {(
                    metricas.contratosControlados /
                    metricas.secsComColaboradores
                  ).toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg hover-lift">
                <p className="text-sm text-muted-foreground mb-2">
                  Colaboradores/SEC
                </p>
                <p className="text-xl font-bold text-foreground font-poppins">
                  {(
                    metricas.colaboradores /
                    metricas.secsComColaboradores
                  ).toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg hover-lift">
                <p className="text-sm text-muted-foreground mb-2">
                  Custo/Colaborador
                </p>
                <p className="text-xl font-bold text-foreground font-poppins">
                  {formatCurrency(metricas.mensal_geral / metricas.colaboradores)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
