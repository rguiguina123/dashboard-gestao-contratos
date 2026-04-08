import { useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { demonstrativoUF, metricas } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function Demonstrativo() {
  // Dados para gráfico de comparação
  const comparisonData = useMemo(() => {
    return demonstrativoUF.map((item) => ({
      uf: item.uf,
      "Com Contrato": item.mensal_com_contrato,
      "Sem Contrato": item.mensal_sem_contrato,
    }));
  }, []);

  // Dados consolidados
  const consolidado = useMemo(() => {
    return [
      {
        categoria: "Com Contrato",
        mensal: metricas.mensal_com_contrato,
        anual: metricas.anual_com_contrato,
        percentual: (
          (metricas.mensal_com_contrato / metricas.mensal_geral) *
          100
        ).toFixed(1),
      },
      {
        categoria: "Sem Contrato",
        mensal: metricas.mensal_sem_contrato,
        anual: metricas.anual_sem_contrato,
        percentual: (
          (metricas.mensal_sem_contrato / metricas.mensal_geral) *
          100
        ).toFixed(1),
      },
    ];
  }, []);

  // Top 5 UFs por gasto mensal
  const top5UFs = useMemo(() => {
    return demonstrativoUF
      .map((item) => ({
        uf: item.uf,
        total_mensal: item.mensal_com_contrato + item.mensal_sem_contrato,
        total_anual: item.anual_com_contrato + item.anual_sem_contrato,
      }))
      .sort((a, b) => b.total_mensal - a.total_mensal)
      .slice(0, 5);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground font-poppins mb-2">
            Demonstrativo Total
          </h1>
          <p className="text-muted-foreground">
            Visão consolidada de todas as despesas com e sem contrato
          </p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            title="Despesa Mensal Total"
            value={formatCurrency(metricas.mensal_geral)}
            icon={<DollarSign className="w-6 h-6" />}
            subtitle="Todos os meses"
          />
          <MetricCard
            title="Despesa Anual Total"
            value={formatCurrency(metricas.anual_geral)}
            icon={<TrendingUp className="w-6 h-6" />}
            subtitle="Projeção anual"
          />
        </div>

        {/* Comparação Com vs Sem Contrato */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cards de Comparação */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg font-poppins">Com Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mensal</p>
                <p className="text-3xl font-bold text-primary font-poppins">
                  {formatCurrency(metricas.mensal_com_contrato)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Anual</p>
                <p className="text-2xl font-bold text-foreground font-poppins">
                  {formatCurrency(metricas.anual_com_contrato)}
                </p>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">Percentual do Total</p>
                <p className="text-xl font-semibold text-primary">
                  {consolidado[0].percentual}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader>
              <CardTitle className="text-lg font-poppins">Sem Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mensal</p>
                <p className="text-3xl font-bold text-accent font-poppins">
                  {formatCurrency(metricas.mensal_sem_contrato)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Anual</p>
                <p className="text-2xl font-bold text-foreground font-poppins">
                  {formatCurrency(metricas.anual_sem_contrato)}
                </p>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">Percentual do Total</p>
                <p className="text-xl font-semibold text-accent">
                  {consolidado[1].percentual}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Comparação por UF */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins">
              Despesas Mensais por UF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="uf" />
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
                <Bar dataKey="Com Contrato" fill="#1e40af" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Sem Contrato" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 5 UFs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins">Top 5 UFs por Despesa</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                {
                  key: "uf",
                  label: "UF",
                  width: "20%",
                },
                {
                  key: "total_mensal",
                  label: "Despesa Mensal",
                  width: "40%",
                  render: (value) => formatCurrency(value),
                },
                {
                  key: "total_anual",
                  label: "Despesa Anual",
                  width: "40%",
                  render: (value) => formatCurrency(value),
                },
              ]}
              data={top5UFs}
            />
          </CardContent>
        </Card>

        {/* Tabela Completa de Demonstrativo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins">
              Demonstrativo Completo por UF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                {
                  key: "uf",
                  label: "UF",
                  width: "10%",
                },
                {
                  key: "mensal_com_contrato",
                  label: "Mensal com Contrato",
                  width: "22.5%",
                  render: (value) => formatCurrency(value),
                },
                {
                  key: "anual_com_contrato",
                  label: "Anual com Contrato",
                  width: "22.5%",
                  render: (value) => formatCurrency(value),
                },
                {
                  key: "mensal_sem_contrato",
                  label: "Mensal sem Contrato",
                  width: "22.5%",
                  render: (value) => formatCurrency(value),
                },
                {
                  key: "anual_sem_contrato",
                  label: "Anual sem Contrato",
                  width: "22.5%",
                  render: (value) => formatCurrency(value),
                },
              ]}
              data={demonstrativoUF}
              searchable={true}
              searchFields={["uf"]}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
