import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useDashboardData } from '@/contexts/DashboardDataContext';
import { Activity, Zap, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { generateGenericReportPDF } from '@/lib/generateProfessionalPDF';

// Padrão PDF: relatório institucional conciso, com métricas, tabela ordenada e paginação.

export default function EficienciaServidor() {
  const { custos: dadosCustos } = useDashboardData();
  const custoAreaServidor = dadosCustos.custo_area_servidor || [];
  
  // Ordenar por custo/servidor
  const sortedByCusto = [...custoAreaServidor].sort((a, b) => (b['Custo/Servidor'] || 0) - (a['Custo/Servidor'] || 0));
  const sortedByArea = [...custoAreaServidor].sort((a, b) => (b['Área/Servidor'] || 0) - (a['Área/Servidor'] || 0));
  
  // Totalizadores
  const custoTotalServidor = custoAreaServidor.reduce((sum, item) => sum + (item['Custo/Servidor'] || 0), 0);
  const areaTotalServidor = custoAreaServidor.reduce((sum, item) => sum + (item['Área/Servidor'] || 0), 0);
  
  const custoMedioServidor = custoAreaServidor.length > 0
    ? custoTotalServidor / custoAreaServidor.length
    : 0;
  
  const areaMedioServidor = custoAreaServidor.length > 0
    ? areaTotalServidor / custoAreaServidor.length
    : 0;

  const maiorCustoServidor = sortedByCusto[0]?.['Custo/Servidor'] || 0;
  const menorCustoServidor = sortedByCusto[sortedByCusto.length - 1]?.['Custo/Servidor'] || 0;
  
  const maiorAreaServidor = sortedByArea[0]?.['Área/Servidor'] || 0;
  const menorAreaServidor = sortedByArea[sortedByArea.length - 1]?.['Área/Servidor'] || 0;

  // Dados para gráfico de dispersão
  const scatterData = custoAreaServidor.map(item => ({
    SEC: item.SEC,
    'Área/Servidor': parseFloat((item['Área/Servidor'] || 0).toFixed(2)),
    'Custo/Servidor': parseFloat((item['Custo/Servidor'] || 0).toFixed(2))
  }));

  // Dados para gráfico de barras
  const barData = custoAreaServidor.map(item => ({
    SEC: item.SEC,
    'Custo/Servidor': Math.round((item['Custo/Servidor'] || 0) * 100) / 100,
    'Área/Servidor': Math.round((item['Área/Servidor'] || 0) * 100) / 100
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Eficiência por Servidor</h1>
          <p className="text-slate-600">Análise de custo e área por servidor em cada secretaria</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(custoTotalServidor)}</div>
              <p className="text-xs text-slate-500 mt-1">Soma de todos os custos/servidor</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Custo Médio/Servidor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(custoMedioServidor)}</div>
              <p className="text-xs text-slate-500 mt-1">Média de todas as SECs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                Área Média/Servidor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{areaMedioServidor.toFixed(2)} m²</div>
              <p className="text-xs text-slate-500 mt-1">Espaço por servidor</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Maior Custo/Servidor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(maiorCustoServidor)}</div>
              <p className="text-xs text-slate-500 mt-1">{sortedByCusto[0]?.SEC}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Menor Custo/Servidor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(menorCustoServidor)}</div>
              <p className="text-xs text-slate-500 mt-1">{sortedByCusto[sortedByCusto.length - 1]?.SEC}</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Dispersão */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Correlação: Área vs Custo por Servidor</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#c9dde6" />
                  <XAxis dataKey="Área/Servidor" name="Área/Servidor (m²)" />
                  <YAxis dataKey="Custo/Servidor" name="Custo/Servidor (R$)" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value: any) => {
                      const numValue = Number(value);
                      return isNaN(numValue) ? value : numValue > 100 ? formatCurrency(numValue) : numValue.toFixed(2);
                    }}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #c9dde6' }}
                  />
                  <Scatter name="SECs" data={scatterData} fill="#087fa3" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Barras */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Comparação: Custo vs Área por Servidor</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barData.slice(0, 15)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#c9dde6" />
                  <XAxis dataKey="SEC" angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value: any) => {
                      const numValue = Number(value);
                      return isNaN(numValue) ? value : numValue > 100 ? formatCurrency(numValue) : numValue.toFixed(2);
                    }}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #c9dde6' }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="Custo/Servidor" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="right" dataKey="Área/Servidor" fill="#89ad45" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 - Maior Custo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Top 10 - Maior Custo por Servidor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedByCusto.slice(0, 10).map((item, index) => (
                  <div key={item.SEC} className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-semibold text-red-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.SEC}</p>
                        <p className="text-xs text-slate-500">{(item['Área/Servidor'] || 0).toFixed(2)} m²/servidor</p>
                      </div>
                    </div>
                    <p className="font-semibold text-red-600 text-right">{formatCurrency(item['Custo/Servidor'] || 0)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top 10 - Maior Área */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Top 10 - Maior Área por Servidor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedByArea.slice(0, 10).map((item, index) => (
                  <div key={item.SEC} className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm font-semibold text-amber-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.SEC}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(item['Custo/Servidor'] || 0)}/servidor</p>
                      </div>
                    </div>
                    <p className="font-semibold text-amber-600 text-right">{(item['Área/Servidor'] || 0).toFixed(2)} m²</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela Completa */}
        <Card className="mt-8 border-0 shadow-sm overflow-hidden">
          <CardHeader className="flex items-center justify-between border-b border-[#c9dde6] bg-[#eaf3f7]">
            <CardTitle>Tabela Completa - Eficiência por Servidor</CardTitle>
            <button
              onClick={() => {
                const metrics = [
                  { label: 'Total Geral de Custo/Servidor', value: `R$ ${formatCurrency(custoTotalServidor)}` },
                  { label: 'Custo Médio/Servidor', value: `R$ ${formatCurrency(custoMedioServidor)}` },
                  { label: 'Área Média/Servidor', value: `${areaMedioServidor.toFixed(2)} m²` },
                  { label: 'Maior Custo/Servidor', value: `R$ ${formatCurrency(maiorCustoServidor)}` },
                  { label: 'Menor Custo/Servidor', value: `R$ ${formatCurrency(menorCustoServidor)}` },
                ];
                const tableData = custoAreaServidor.map(item => {
                  const custo = item['Custo/Servidor'] || 0;
                  const area = item['Área/Servidor'] || 0;
                  const diferencaCusto = custo - custoMedioServidor;
                  const diferencaArea = area - areaMedioServidor;
                  return [
                    item.SEC,
                    `${area.toFixed(2)} m²`,
                    formatCurrency(custo),
                    `${diferencaCusto > 0 ? '+' : ''}${formatCurrency(diferencaCusto)}`,
                    `${diferencaArea > 0 ? '+' : ''}${diferencaArea.toFixed(2)} m²`,
                  ];
                });
                generateGenericReportPDF(
                  'Relatório de Eficiência por Servidor',
                  metrics,
                  ['SEC', 'Área/Servidor', 'Custo/Servidor', 'Diferença de Custo', 'Diferença de Área'],
                  tableData,
                  'Relatorio_Eficiencia_por_Servidor'
                );
              }}
              className="flex items-center gap-2 rounded-lg bg-[#003f5f] px-4 py-2 font-semibold text-white transition-all hover:bg-[#087fa3] hover:shadow-lg"
            >
              <FileText className="w-4 h-4" />
              Exportar Relatório
            </button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">SEC</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Área/Servidor (m²)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Custo/Servidor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Diferença Custo (Média)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Diferença Área (Média)</th>
                </tr>
              </thead>
              <tbody>
                {custoAreaServidor.map((item, index) => {
                  const diferençaCusto = (item['Custo/Servidor'] || 0) - custoMedioServidor;
                  const diferençaArea = (item['Área/Servidor'] || 0) - areaMedioServidor;
                  
                  return (
                    <tr
                      key={item.SEC}
                      className={`border-b border-slate-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      } hover:bg-slate-100 transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.SEC}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{(item['Área/Servidor'] || 0).toFixed(2)} m²</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(item['Custo/Servidor'] || 0)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={diferençaCusto > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                          {diferençaCusto > 0 ? '+' : ''}{formatCurrency(diferençaCusto)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={diferençaArea > 0 ? 'text-amber-600 font-semibold' : 'text-blue-600 font-semibold'}>
                          {diferençaArea > 0 ? '+' : ''}{diferençaArea.toFixed(2)} m²
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
