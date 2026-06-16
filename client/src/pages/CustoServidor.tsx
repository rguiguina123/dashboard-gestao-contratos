import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import dadosCustos from '@/lib/dadosCustos.json';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function CustoServidor() {
  const custoServidor = dadosCustos.custo_servidor || [];
  
  // Ordenar do maior para o menor
  const sortedData = [...custoServidor].sort((a, b) => (b['Custo/Servidor'] || 0) - (a['Custo/Servidor'] || 0));
  
  // Top 10 e Bottom 10
  const top10 = sortedData.slice(0, 10);
  const bottom10 = sortedData.slice(-10).reverse();
  
  // Totalizadores
  const media = custoServidor.length > 0
    ? custoServidor.reduce((sum, item) => sum + (item['Custo/Servidor'] || 0), 0) / custoServidor.length
    : 0;
  
  const maiorCusto = sortedData[0]?.['Custo/Servidor'] || 0;
  const menorCusto = sortedData[sortedData.length - 1]?.['Custo/Servidor'] || 0;

  // Dados para gráfico
  const chartData = sortedData.map(item => ({
    SEC: item.SEC,
    'Custo/Servidor': Math.round((item['Custo/Servidor'] || 0) * 100) / 100
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Custos por Servidor</h1>
          <p className="text-slate-600">Análise de custo por servidor domiciliado em cada secretaria</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Custo Médio/Servidor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(media)}</div>
              <p className="text-xs text-slate-500 mt-1">Média de todas as SECs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                Maior Custo/Servidor
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
                <TrendingDown className="w-4 h-4 text-green-600" />
                Menor Custo/Servidor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(menorCusto)}</div>
              <p className="text-xs text-slate-500 mt-1">{sortedData[sortedData.length - 1]?.SEC}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Diferença</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(maiorCusto - menorCusto)}</div>
              <p className="text-xs text-slate-500 mt-1">Entre maior e menor</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Barras */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle>Custo por Servidor - Todas as Secretarias</CardTitle>
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
                <Bar dataKey="Custo/Servidor" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 10 e Bottom 10 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 10 - Maior Custo */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Top 10 - Maior Custo por Servidor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {top10.map((item, index) => {
                  const diferenca = (item['Custo/Servidor'] || 0) - media;
                  const percentual = media > 0 ? (diferenca / media * 100) : 0;
                  
                  return (
                    <div key={item.SEC} className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-0">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-semibold text-red-600">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.SEC}</p>
                          <p className="text-xs text-slate-500">+{percentual.toFixed(1)}% acima da média</p>
                        </div>
                      </div>
                      <p className="font-semibold text-red-600 text-right">{formatCurrency(item['Custo/Servidor'] || 0)}</p>
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
                <TrendingDown className="w-5 h-5 text-green-600" />
                Top 10 - Menor Custo por Servidor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bottom10.map((item, index) => {
                  const diferenca = (item['Custo/Servidor'] || 0) - media;
                  const percentual = media > 0 ? (diferenca / media * 100) : 0;
                  
                  return (
                    <div key={item.SEC} className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-0">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-green-600">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.SEC}</p>
                          <p className="text-xs text-slate-500">{percentual.toFixed(1)}% abaixo da média</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-600 text-right">{formatCurrency(item['Custo/Servidor'] || 0)}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela Completa */}
        <Card className="mt-8 border-0 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>Tabela Completa - Custos por Servidor</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Posição</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">SEC</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Custo/Servidor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Diferença da Média</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">% da Média</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => {
                  const diferenca = (item['Custo/Servidor'] || 0) - media;
                  const percentual = media > 0 ? (diferenca / media * 100) : 0;
                  
                  return (
                    <tr
                      key={item.SEC}
                      className={`border-b border-slate-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      } hover:bg-slate-100 transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.SEC}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(item['Custo/Servidor'] || 0)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={diferenca > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                          {diferenca > 0 ? '+' : ''}{formatCurrency(diferenca)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <span className={percentual > 0 ? 'text-red-600' : 'text-green-600'}>
                          {percentual > 0 ? '+' : ''}{percentual.toFixed(1)}%
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
    </div>
  );
}
