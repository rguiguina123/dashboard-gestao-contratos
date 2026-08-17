import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useDashboardData } from '@/contexts/DashboardDataContext';
import { TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { generateGenericReportPDF } from '@/lib/generateProfessionalPDF';

// Padrão PDF: relatório institucional conciso, com métricas, tabela ordenada e paginação.

const COLORS = ['#003f5f', '#005f83', '#087fa3', '#00a6c7', '#4d88a3', '#8fb8cc', '#2a6e89', '#c2e6f0'];

export default function CustosTotal() {
  const { custos: dadosCustos } = useDashboardData();
  const custoTotal = dadosCustos.custo_total || [];
  
  // Ordenar do maior para o menor
  const sortedData = [...custoTotal].sort((a, b) => (b.Total || 0) - (a.Total || 0));
  
  // Top 10 e Bottom 10
  const top10 = sortedData.slice(0, 10);
  const bottom10 = sortedData.slice(-10).reverse();
  
  // Totalizadores
  const totalGeral = custoTotal.reduce((sum, item) => sum + (item.Total || 0), 0);
  const media = custoTotal.length > 0 ? totalGeral / custoTotal.length : 0;
  const maiorCusto = sortedData[0]?.Total || 0;
  const menorCusto = sortedData[sortedData.length - 1]?.Total || 0;

  // Dados para gráfico de pizza (Top 10)
  const pieData = top10.map(item => ({
    name: item.SEC,
    value: Math.round((item.Total || 0) * 100) / 100
  }));

  // Dados para gráfico de barras
  const chartData = sortedData.map(item => ({
    SEC: item.SEC,
    Total: Math.round((item.Total || 0) * 100) / 100
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Custos Totais por Secretaria</h1>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Custo Total Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalGeral)}</div>
              <p className="text-xs text-slate-500 mt-1">Todas as SECs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Custo Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(media)}</div>
              <p className="text-xs text-slate-500 mt-1">Por secretaria</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                Maior Custo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(maiorCusto)}</div>
              <p className="text-xs text-slate-500 mt-1">{sortedData[0]?.SEC}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#087fa3]" />
                Menor Custo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#087fa3]">{formatCurrency(menorCusto)}</div>
              <p className="text-xs text-slate-500 mt-1">{sortedData[sortedData.length - 1]?.SEC}</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Barras */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Custos Totais - Todas as Secretarias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="SEC" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(Number(value))}
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="Total" fill="#005f83" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pizza - Top 10 */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Distribuição - Top 10 Secretarias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={120}
                    fill="#087fa3"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 e Bottom 10 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 10 - Maior Custo */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Top 10 - Maior Custo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {top10.map((item, index) => {
                  const percentualTotal = (item.Total || 0) / totalGeral * 100;
                  return (
                    <div key={item.SEC} className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-0">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-semibold text-red-600">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.SEC}</p>
                          <p className="text-xs text-slate-500">{percentualTotal.toFixed(1)}% do total</p>
                        </div>
                      </div>
                      <p className="font-semibold text-red-600 text-right">{formatCurrency(item.Total || 0)}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Bottom 10 - Menor Custo */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-[#087fa3]" />
                Top 10 - Menor Custo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bottom10.map((item, index) => {
                  const percentualTotal = (item.Total || 0) / totalGeral * 100;
                  return (
                    <div key={item.SEC} className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-0">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-[#eaf3f7] flex items-center justify-center text-sm font-semibold text-[#087fa3]">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.SEC}</p>
                          <p className="text-xs text-slate-500">{percentualTotal.toFixed(1)}% do total</p>
                        </div>
                      </div>
                      <p className="font-semibold text-[#087fa3] text-right">{formatCurrency(item.Total || 0)}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela Completa */}
        <Card className="mt-8 border-0 shadow-sm overflow-hidden">
          <CardHeader className="flex items-center justify-between border-b border-[#c9dde6] bg-[#eaf3f7]">
            <CardTitle>Tabela Completa - Custos Totais</CardTitle>
            <button
              onClick={() => {
                const metrics = [
                  { label: 'Custo Total Geral', value: `R$ ${formatCurrency(totalGeral)}` },
                  { label: 'Custo Médio', value: `R$ ${formatCurrency(media)}` },
                  { label: 'Maior Custo', value: `R$ ${formatCurrency(maiorCusto)}` },
                  { label: 'Menor Custo', value: `R$ ${formatCurrency(menorCusto)}` },
                ];
                const tableData = sortedData.map((item, index) => {
                  const percentualTotal = totalGeral > 0 ? ((item.Total || 0) / totalGeral) * 100 : 0;
                  const diferenca = (item.Total || 0) - media;
                  const percentualDiferenca = media > 0 ? (diferenca / media) * 100 : 0;
                  return [
                    index + 1,
                    item.SEC,
                    formatCurrency(item.Total || 0),
                    `${percentualTotal.toFixed(2)}%`,
                    `${diferenca > 0 ? '+' : ''}${formatCurrency(diferenca)} (${percentualDiferenca.toFixed(1)}%)`,
                  ];
                });
                generateGenericReportPDF(
                  'Relatório de Custos Totais',
                  metrics,
                  ['Posição', 'SEC', 'Custo Total', '% do Total', 'Diferença da Média'],
                  tableData,
                  'Relatorio_Custos_Totais'
                );
              }}
              className="flex items-center gap-2 border-b-2 border-[#00a6c7] bg-[#003f5f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#005f83]"
            >
              <FileText className="w-4 h-4" />
              Exportar Relatório
            </button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Posição</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">SEC</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Custo Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">% do Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Diferença da Média</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => {
                  const percentualTotal = (item.Total || 0) / totalGeral * 100;
                  const diferenca = (item.Total || 0) - media;
                  const percentualDiferenca = media > 0 ? (diferenca / media * 100) : 0;
                  
                  return (
                    <tr
                      key={item.SEC}
                      className={`border-b border-slate-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      } hover:bg-slate-100 transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.SEC}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(item.Total || 0)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{percentualTotal.toFixed(2)}%</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={diferenca > 0 ? 'text-red-600 font-semibold' : 'text-[#087fa3] font-semibold'}>
                          {diferenca > 0 ? '+' : ''}{formatCurrency(diferenca)} ({percentualDiferenca.toFixed(1)}%)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
