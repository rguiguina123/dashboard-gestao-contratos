import { useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ExportPDF } from "@/components/dashboard/ExportPDF";
import { useDashboardData } from "@/contexts/DashboardDataContext";
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
  const { contratos, despesasSemContrato, totalMensal, totalMensalComContrato, totalMensalSemContrato, totalAnual, totalAnualComContrato, totalAnualSemContrato } = useDashboardData();
  // Dados para gráfico de comparação
  const comparisonData = useMemo(() => {
    return [
      {
        categoria: "Com Contrato",
        Mensal: totalMensalComContrato,
        Anual: totalAnualComContrato,
      },
      {
        categoria: "Sem Contrato",
        Mensal: totalMensalSemContrato,
        Anual: totalAnualSemContrato,
      },
    ];
  }, [totalMensalComContrato, totalAnualComContrato, totalMensalSemContrato, totalAnualSemContrato]);

  // Dados consolidados
  const consolidado = useMemo(() => {
    return [
      {
        categoria: "Com Contrato",
        mensal: totalMensalComContrato,
        anual: totalAnualComContrato,
        percentual: ((totalMensalComContrato / totalMensal) * 100).toFixed(1),
      },
      {
        categoria: "Sem Contrato",
        mensal: totalMensalSemContrato,
        anual: totalAnualSemContrato,
        percentual: ((totalMensalSemContrato / totalMensal) * 100).toFixed(1),
      },
    ];
  }, [totalMensalComContrato, totalAnualComContrato, totalMensalSemContrato, totalAnualSemContrato, totalMensal]);

  // Top 5 SECs por gasto mensal
  const top5SECs = useMemo(() => {
    const secMap = new Map<string, number>();
    
    contratos.forEach((c) => {
      secMap.set(c.sec, (secMap.get(c.sec) || 0) + c.mensal);
    });
    
    despesasSemContrato.forEach((d) => {
      secMap.set(d.sec, (secMap.get(d.sec) || 0) + d.mensal);
    });

    return Array.from(secMap.entries())
      .map(([sec, total]) => ({ sec, total_mensal: total }))
      .sort((a, b) => b.total_mensal - a.total_mensal)
      .slice(0, 5);
  }, [contratos, despesasSemContrato]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold font-poppins text-gray-900">Demonstrativo Total</h1>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Despesa Mensal Total"
            value={formatCurrency(totalMensal)}
            icon={<DollarSign className="w-5 h-5" />}
            trend="up"
          />
          <MetricCard
            title="Despesa Anual Total"
            value={formatCurrency(totalAnual)}
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
          />
          <MetricCard
            title="Contratos Ativos"
            value={contratos.length.toString()}
            icon={<AlertCircle className="w-5 h-5" />}
            trend="neutral"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Comparação */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-[#c9dde6] bg-[#eaf3f7]">
              <CardTitle className="text-[#003f5f]">Comparação: Com vs Sem Contrato</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="Mensal" fill="#005f83" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Anual" fill="#00a6c7" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabela Consolidada */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-[#c9dde6] bg-[#eaf3f7]">
              <CardTitle className="text-[#003f5f]">Consolidado</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {consolidado.map((item) => (
                  <div key={item.categoria} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{item.categoria}</p>
                      <p className="text-sm text-gray-600">{item.percentual}% do total</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#003f5f]">{formatCurrency(item.mensal)}</p>
                      <p className="text-sm text-gray-600">{formatCurrency(item.anual)}/ano</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 5 SECs */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex items-center justify-between border-b border-[#c9dde6] bg-[#eaf3f7]">
            <CardTitle className="text-[#003f5f]">Top 5 SECs por Despesa Mensal</CardTitle>
            <ExportPDF
              title="Demonstrativo"
              data={consolidado}
              columns={[
                { key: "categoria", label: "Categoria" },
                { key: "mensal", label: "Mensal", format: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
                { key: "anual", label: "Anual", format: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
              ]}
              totals={{ mensal: totalMensal, anual: totalAnual }}
            />
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={top5SECs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="sec" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="total_mensal" fill="#005f83" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
