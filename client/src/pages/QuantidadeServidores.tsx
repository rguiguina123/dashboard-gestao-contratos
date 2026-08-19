import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDashboardData } from '@/contexts/DashboardDataContext';
import { Users, TrendingUp, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { generateGenericReportPDF } from '@/lib/generateProfessionalPDF';

// Padrão PDF: relatório institucional conciso, com métricas, tabela ordenada e paginação.

const COLORS = ['#003f5f', '#005f83', '#087fa3', '#00a6c7', '#4d88a3', '#8fb8cc', '#2a6e89', '#c2e6f0'];

export default function QuantidadeServidores() {
  const { custos: dadosCustos } = useDashboardData();
  const servidores = dadosCustos.servidores || [];
  
  // Ordenar do maior para o menor
  const sortedData = [...servidores].sort((a, b) => (b['Qtd Servidores'] || 0) - (a['Qtd Servidores'] || 0));
  
  // Top 10 e Bottom 10
  const top10 = sortedData.slice(0, 10);
  const bottom10 = sortedData.slice(-10).reverse();
  
  // Totalizadores
  const totalServidores = servidores.reduce((sum, item) => sum + (item['Qtd Servidores'] || 0), 0);
  const mediaServidores = servidores.length > 0 ? totalServidores / servidores.length : 0;
  const maiorQtd = sortedData[0]?.['Qtd Servidores'] || 0;
  const menorQtd = sortedData[sortedData.length - 1]?.['Qtd Servidores'] || 0;

  // Dados para gráfico de pizza (Top 10)
  const pieData = top10.map(item => ({
    name: item.SEC,
    value: item['Qtd Servidores'] || 0
  }));

  // Dados para gráfico de barras
  const chartData = sortedData.map(item => ({
    SEC: item.SEC,
    'Qtd Servidores': item['Qtd Servidores'] || 0
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Quantidade de Servidores</h1>
          <p className="text-slate-600">Distribuição de servidores domiciliados por secretaria</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Total de Servidores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalServidores}</div>
              <p className="text-xs text-slate-500 mt-1">Domiciliados em todas as SECs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Média por Secretaria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{mediaServidores.toFixed(1)}</div>
              <p className="text-xs text-slate-500 mt-1">Servidores por SEC</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                Maior Quantidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{maiorQtd}</div>
              <p className="text-xs text-slate-500 mt-1">{sortedData[0]?.SEC}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Menor Quantidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#087fa3]">{menorQtd}</div>
              <p className="text-xs text-slate-500 mt-1">{sortedData[sortedData.length - 1]?.SEC}</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Barras */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Quantidade de Servidores - Todas as Secretarias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="SEC" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="Qtd Servidores" fill="#005f83" radius={[2, 2, 0, 0]} />
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 e Bottom 10 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 10 - Maior Quantidade */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Top 10 - Maior Quantidade de Servidores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {top10.map((item, index) => {
                  const percentualTotal = (item['Qtd Servidores'] || 0) / totalServidores * 100;
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
                      <p className="font-semibold text-red-600 text-right">{item['Qtd Servidores']}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Bottom 10 - Menor Quantidade */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#087fa3]" />
                Top 10 - Menor Quantidade de Servidores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bottom10.map((item, index) => {
                  const percentualTotal = (item['Qtd Servidores'] || 0) / totalServidores * 100;
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
                      <p className="font-semibold text-[#087fa3] text-right">{item['Qtd Servidores']}</p>
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
            <CardTitle>Tabela Completa - Quantidade de Servidores</CardTitle>
            <button
              onClick={() => {
                const metrics = [
                  { label: 'Total de Servidores', value: totalServidores },
                  { label: 'Média por Secretaria', value: mediaServidores.toFixed(1) },
                  { label: 'Maior Quantidade', value: maiorQtd },
                  { label: 'Menor Quantidade', value: menorQtd },
                ];
                const tableData = sortedData.map((item, index) => {
                  const quantidade = item['Qtd Servidores'] || 0;
                  const percentualTotal = totalServidores > 0 ? (quantidade / totalServidores) * 100 : 0;
                  const diferenca = quantidade - mediaServidores;
                  return [
                    index + 1,
                    item.SEC,
                    quantidade,
                    `${percentualTotal.toFixed(2)}%`,
                    `${diferenca > 0 ? '+' : ''}${diferenca.toFixed(1)}`,
                  ];
                });
                generateGenericReportPDF(
                  'Relatório de Quantidade de Servidores',
                  metrics,
                  ['Posição', 'SEC', 'Qtd. Servidores', '% do Total', 'Diferença da Média'],
                  tableData,
                  'Relatorio_Quantidade_de_Servidores'
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Qtd Servidores</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">% do Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Diferença da Média</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => {
                  const percentualTotal = (item['Qtd Servidores'] || 0) / totalServidores * 100;
                  const diferenca = (item['Qtd Servidores'] || 0) - mediaServidores;
                  
                  return (
                    <tr
                      key={item.SEC}
                      className={`border-b border-slate-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      } hover:bg-slate-100 transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.SEC}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item['Qtd Servidores']}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{percentualTotal.toFixed(2)}%</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={diferenca > 0 ? 'text-red-600 font-semibold' : 'text-[#087fa3] font-semibold'}>
                          {diferenca > 0 ? '+' : ''}{diferenca.toFixed(1)}
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
