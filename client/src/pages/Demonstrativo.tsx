import { useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { contratos, despesasSemContrato, totalGeral, totaisContratos, totaisDespesasSem } from "@/lib/data";
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
    return [
      {
        categoria: "Com Contrato",
        Mensal: totaisContratos.mensal,
        Anual: totaisContratos.anual,
      },
      {
        categoria: "Sem Contrato",
        Mensal: totaisDespesasSem.mensal,
        Anual: totaisDespesasSem.anual,
      },
    ];
  }, []);

  // Dados consolidados
  const consolidado = useMemo(() => {
    return [
      {
        categoria: "Com Contrato",
        mensal: totaisContratos.mensal,
        anual: totaisContratos.anual,
        percentual: ((totaisContratos.mensal / totalGeral.mensal) * 100).toFixed(1),
      },
      {
        categoria: "Sem Contrato",
        mensal: totaisDespesasSem.mensal,
        anual: totaisDespesasSem.anual,
        percentual: ((totaisDespesasSem.mensal / totalGeral.mensal) * 100).toFixed(1),
      },
    ];
  }, []);

  // Top 5 SECs por gasto mensal
  const top5SECs = useMemo(() => {
    const secMap = new Map<string, number>();
    
    contratos.forEach((c) => {
      secMap.set(c.sec, (secMap.get(c.sec) || 0) + c.valor_mensal);
    });
    
    despesasSemContrato.forEach((d) => {
      secMap.set(d.sec, (secMap.get(d.sec) || 0) + d.valor_mensal);
    });

    return Array.from(secMap.entries())
      .map(([sec, total]) => ({ sec, total_mensal: total }))
      .sort((a, b) => b.total_mensal - a.total_mensal)
      .slice(0, 5);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold font-poppins text-gray-900">Demonstrativo Total</h1>
          <p className="text-gray-600 mt-2">Visão consolidada de todas as despesas</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Despesa Mensal Total"
            value={formatCurrency(totalGeral.mensal)}
            icon={DollarSign as any}
            trend="up"
          />
          <MetricCard
            title="Despesa Anual Total"
            value={formatCurrency(totalGeral.anual)}
            icon={TrendingUp as any}
            trend="up"
          />
          <MetricCard
            title="Contratos Ativos"
            value={contratos.length.toString()}
            icon={AlertCircle as any}
            trend="neutral"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Comparação */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <CardTitle className="text-purple-900">Comparação: Com vs Sem Contrato</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="Mensal" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Anual" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabela Consolidada */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <CardTitle className="text-purple-900">Consolidado</CardTitle>
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
                      <p className="font-semibold text-purple-900">{formatCurrency(item.mensal)}</p>
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
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
            <CardTitle className="text-purple-900">Top 5 SECs por Despesa Mensal</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={top5SECs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="sec" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="total_mensal" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
