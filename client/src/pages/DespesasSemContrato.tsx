import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { despesasSemContrato, secs as allSecs } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, AlertTriangle, Zap, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { generateGenericReportPDF } from "@/lib/generateProfessionalPDF";

interface DespesaDisplay {
  id: string;
  sec: string;
  servico: string;
  fornecedor: string;
  objeto: string;
  mensal: number;
  anual: number;
}

const COLORS = ["#7c3aed", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function DespesasSemContrato() {
  const [selectedSEC, setSelectedSEC] = useState<string>("all");

  // Filtrar despesas
  const filteredDespesas = useMemo(() => {
    if (selectedSEC === "all") return despesasSemContrato;
    return despesasSemContrato.filter((d) => d.sec === selectedSEC);
  }, [selectedSEC]);

  // Calcular totais
  const totais = useMemo(() => {
    return filteredDespesas.reduce(
      (acc, d) => ({
        mensal: acc.mensal + d.mensal,
        anual: acc.anual + d.anual,
      }),
      { mensal: 0, anual: 0 }
    );
  }, [filteredDespesas]);

  // Dados para gráfico de despesas por serviço
  const despesasPorServico = useMemo(() => {
    const grouped = filteredDespesas.reduce(
      (acc, d) => {
        const existing = acc.find((x) => x.servico === d.servico);
        if (existing) {
          existing.valor += d.mensal;
        } else {
          acc.push({ servico: d.servico, valor: d.mensal });
        }
        return acc;
      },
      [] as Array<{ servico: string; valor: number }>
    );
    return grouped.sort((a, b) => b.valor - a.valor);
  }, [filteredDespesas]);

  // Dados para gráfico de despesas por SEC
  const despesasPorSEC = useMemo(() => {
    const grouped = filteredDespesas.reduce(
      (acc, d) => {
        const existing = acc.find((x) => x.sec === d.sec);
        if (existing) {
          existing.valor += d.mensal;
        } else {
          acc.push({ sec: d.sec, valor: d.mensal });
        }
        return acc;
      },
      [] as Array<{ sec: string; valor: number }>
    );
    return grouped.sort((a, b) => b.valor - a.valor).slice(0, 10);
  }, [filteredDespesas]);

  const columns: Array<any> = [
    { key: "sec", label: "SEC", sortable: true },
    { key: "servico", label: "Serviço", sortable: true },
    { key: "fornecedor", label: "Fornecedor", sortable: true },
    { key: "objeto", label: "Objeto", sortable: false },
    { key: "mensal", label: "Valor Mensal", sortable: true, format: (v: number) => formatCurrency(v) },
    { key: "anual", label: "Valor Anual", sortable: true, format: (v: number) => formatCurrency(v) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold font-poppins text-gray-900">Despesas sem Contrato</h1>
          <p className="text-gray-600 mt-2">Análise de despesas não controladas por contrato</p>
        </div>

        {/* Filtro */}
        <div className="flex gap-4 items-end">
          <div className="flex-1 max-w-xs">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Filtrar por SEC</label>
            <Select value={selectedSEC} onValueChange={setSelectedSEC}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as SECs</SelectItem>
                {allSecs.map((sec) => (
                  <SelectItem key={sec} value={sec}>
                    {sec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total de Despesas"
            value={filteredDespesas.length.toString()}
            icon={<AlertTriangle className="w-5 h-5" />}
            trend="neutral"
          />
          <MetricCard
            title="Despesa Mensal"
            value={formatCurrency(totais.mensal)}
            icon={<DollarSign className="w-5 h-5" />}
            trend="up"
          />
          <MetricCard
            title="Despesa Anual"
            value={formatCurrency(totais.anual)}
            icon={<Zap className="w-5 h-5" />}
            trend="up"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Despesas por Serviço */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <CardTitle className="text-purple-900">Despesas por Serviço</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={despesasPorServico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="servico" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="valor" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Despesas por SEC */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <CardTitle className="text-purple-900">Top 10 SECs por Despesa</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={despesasPorSEC}
                    dataKey="valor"
                    nameKey="sec"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={40}
                    paddingAngle={2}
                    label={({ sec, valor }) => `${sec}: ${formatCurrency(valor as number)}`}
                    labelLine={false}
                  >
                    {despesasPorSEC.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b flex items-center justify-between">
            <CardTitle className="text-purple-900">Detalhes das Despesas</CardTitle>
            <button
              onClick={() => {
                const metrics = [
                  { label: 'Total de Despesas', value: filteredDespesas.length },
                  { label: 'Despesa Mensal', value: `R$ ${formatCurrency(totais.mensal)}` },
                  { label: 'Despesa Anual', value: `R$ ${formatCurrency(totais.anual)}` },
                ];
                const tableData = filteredDespesas.map(d => [
                  d.sec,
                  d.servico,
                  d.fornecedor.substring(0, 30),
                  formatCurrency(d.mensal),
                  formatCurrency(d.anual),
                ]);
                generateGenericReportPDF(
                  'Relatório de Despesas sem Contrato',
                  metrics,
                  ['SEC', 'Serviço', 'Fornecedor', 'Valor Mensal', 'Valor Anual'],
                  tableData,
                  'Relatorio_Despesas_Sem_Contrato'
                );
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Exportar Relatório
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={filteredDespesas}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
