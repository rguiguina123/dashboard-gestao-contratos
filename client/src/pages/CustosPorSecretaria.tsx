import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Users, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import dadosCustos from '@/lib/dadosCustos.json';

export default function CustosPorSecretaria() {
  const [sortBy, setSortBy] = useState<'sec' | 'total' | 'custo_servidor'>('total');
  
  const visaoGeral = dadosCustos.visao_geral || [];
  
  // Ordenar dados
  const sortedData = [...visaoGeral].sort((a, b) => {
    switch (sortBy) {
      case 'total':
        return (b.Total || 0) - (a.Total || 0);
      case 'custo_servidor':
        return (b['Custo/Servidor'] || 0) - (a['Custo/Servidor'] || 0);
      case 'sec':
      default:
        return (a.SEC || '').localeCompare(b.SEC || '');
    }
  });

  // Calcular totalizadores
  const totalGeral = visaoGeral.reduce((sum, item) => sum + (item.Total || 0), 0);
  const totalServidores = visaoGeral.reduce((sum, item) => sum + (item['Qtd de servidores'] || 0), 0);
  const custoMedioServidor = totalServidores > 0 ? totalGeral / totalServidores : 0;
  const areaTotal = visaoGeral.reduce((sum, item) => sum + (item['Área da Sec (m2)'] || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Custos por Secretaria</h1>
          <p className="text-slate-600">Análise detalhada de custos de todas as secretarias dos estados</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Custo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalGeral)}</div>
              <p className="text-xs text-slate-500 mt-1">Todas as secretarias</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Total de Servidores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalServidores}</div>
              <p className="text-xs text-slate-500 mt-1">Domiciliados</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                Custo Médio/Servidor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(custoMedioServidor)}</div>
              <p className="text-xs text-slate-500 mt-1">Por servidor</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                Área Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{areaTotal.toFixed(2)} m²</div>
              <p className="text-xs text-slate-500 mt-1">Espaço ocupado</p>
            </CardContent>
          </Card>
        </div>

        {/* Controles de Ordenação */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={sortBy === 'sec' ? 'default' : 'outline'}
            onClick={() => setSortBy('sec')}
            size="sm"
          >
            Ordenar por SEC
          </Button>
          <Button
            variant={sortBy === 'total' ? 'default' : 'outline'}
            onClick={() => setSortBy('total')}
            size="sm"
          >
            Ordenar por Custo Total
          </Button>
          <Button
            variant={sortBy === 'custo_servidor' ? 'default' : 'outline'}
            onClick={() => setSortBy('custo_servidor')}
            size="sm"
          >
            Ordenar por Custo/Servidor
          </Button>
        </div>

        {/* Tabela */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">SEC</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Energia Elétrica</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Água e Esgoto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Locação Imóvel</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Vigilância</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Apoio Adm</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Área (m²)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Servidores</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Custo/Servidor</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr
                    key={item.SEC}
                    className={`border-b border-slate-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    } hover:bg-slate-100 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.SEC}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(item['Energia Elétrica'] || 0)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(item['Água e Esgoto'] || 0)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(item['Locação Imóvel'] || 0)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(item['Vigilância'] || 0)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatCurrency(item['Apoio Adm + Copeiragem + Limpeza + Recepção (Mão de obra e materiais)'] || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{formatCurrency(item.Total || 0)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{(item['Área da Sec (m2)'] || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">{item['Qtd de servidores']}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">{formatCurrency(item['Custo/Servidor'] || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Resumo */}
        <Card className="mt-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Resumo Executivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Informações Gerais</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>Total de Secretarias: <span className="font-semibold text-slate-900">{visaoGeral.length}</span></li>
                  <li>Custo Total Anual: <span className="font-semibold text-slate-900">{formatCurrency(totalGeral)}</span></li>
                  <li>Custo Médio por Secretaria: <span className="font-semibold text-slate-900">{formatCurrency(totalGeral / visaoGeral.length)}</span></li>
                  <li>Custo Médio por Servidor: <span className="font-semibold text-slate-900">{formatCurrency(custoMedioServidor)}</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Dados Espaciais</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>Área Total: <span className="font-semibold text-slate-900">{areaTotal.toFixed(2)} m²</span></li>
                  <li>Área Média por Secretaria: <span className="font-semibold text-slate-900">{(areaTotal / visaoGeral.length).toFixed(2)} m²</span></li>
                  <li>Custo por m²: <span className="font-semibold text-slate-900">{formatCurrency(totalGeral / areaTotal)}</span></li>
                  <li>Servidores por Secretaria: <span className="font-semibold text-slate-900">{(totalServidores / visaoGeral.length).toFixed(1)}</span></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
