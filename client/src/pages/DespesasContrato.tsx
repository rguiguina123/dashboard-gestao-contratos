import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { contratos, secs as allSecs, totalAnualComContrato } from "@/lib/data";
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
import { DollarSign, TrendingUp, Award } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ContratoDisplay {
  id: string;
  contrato: string;
  fornecedor: string;
  objeto: string;
  sec: string;
  mensal: number;
  anual: number;
}

const COLORS = ["#7c3aed", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function DespesasContrato() {
  const [selectedSEC, setSelectedSEC] = useState<string>("all");

  // Filtrar contratos
  const filteredContratos = useMemo(() => {
    if (selectedSEC === "all") return contratos;
    return contratos.filter((c) => c.sec === selectedSEC);
  }, [selectedSEC]);

  // Calcular totais
  const totais = useMemo(() => {
    return filteredContratos.reduce(
      (acc, c) => ({
        mensal: acc.mensal + c.mensal,
        anual: acc.anual + c.anual,
      }),
      { mensal: 0, anual: 0 }
    );
  }, [filteredContratos]);

  // Dados para gráfico de despesas por SEC
  const despesasPorFornecedor = useMemo(() => {
    const grouped = filteredContratos.reduce(
      (acc, c) => {
        const existing = acc.find((x) => x.fornecedor === c.sec);
        if (existing) {
          existing.valor += c.mensal;
        } else {
          acc.push({ fornecedor: c.sec, valor: c.mensal });
        }
        return acc;
      },
      [] as Array<{ fornecedor: string; valor: number }>
    );
    return grouped.sort((a, b) => b.valor - a.valor).slice(0, 10);
  }, [filteredContratos]);

  // Dados para gráfico de despesas por SEC
  const despesasPorSEC = useMemo(() => {
    const grouped = filteredContratos.reduce(
      (acc, c) => {
        const existing = acc.find((x) => x.sec === c.sec);
        if (existing) {
          existing.valor += c.mensal;
        } else {
          acc.push({ sec: c.sec, valor: c.mensal });
        }
        return acc;
      },
      [] as Array<{ sec: string; valor: number }>
    );
    return grouped.sort((a, b) => b.valor - a.valor).slice(0, 10);
  }, [filteredContratos]);

  const columns: Array<any> = [
    { key: "contrato", label: "Contrato", sortable: true },
    { key: "fornecedor", label: "Fornecedor", sortable: true },
    { key: "objeto", label: "Objeto", sortable: false },
    { key: "sec", label: "SEC", sortable: true },
    { key: "mensal", label: "Valor Mensal", sortable: true, format: (v: number) => formatCurrency(v) },
    { key: "anual", label: "Valor Anual", sortable: true, format: (v: number) => formatCurrency(v) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold font-poppins text-gray-900">Despesas com Contrato</h1>
          <p className="text-gray-600 mt-2">Análise de despesas controladas por contrato</p>
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
            title="Total de Contratos"
            value={filteredContratos.length.toString()}
            icon={<Award className="w-5 h-5" />}
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
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Despesas por Fornecedor */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <CardTitle className="text-purple-900">Top 10 Fornecedores</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={despesasPorFornecedor}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="fornecedor" angle={-45} textAnchor="end" height={100} />
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
                    outerRadius={100}
                    label
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
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
            <CardTitle className="text-purple-900">Detalhes dos Contratos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={filteredContratos}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
