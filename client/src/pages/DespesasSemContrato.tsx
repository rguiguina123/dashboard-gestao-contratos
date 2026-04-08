import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { despesasSemContrato, metricas } from "@/lib/data";
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
import { DollarSign, AlertTriangle, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function DespesasSemContrato() {
  const [selectedSEC, setSelectedSEC] = useState<string>("all");

  // Extrair SECs únicos
  const secs = useMemo(
    () => ["all", ...Array.from(new Set(despesasSemContrato.map((d) => d.sec)))],
    []
  );

  // Filtrar despesas
  const filteredDespesas = useMemo(() => {
    if (selectedSEC === "all") return despesasSemContrato;
    return despesasSemContrato.filter((d) => d.sec === selectedSEC);
  }, [selectedSEC]);

  // Calcular totais
  const totais = useMemo(() => {
    return filteredDespesas.reduce(
      (acc, d) => ({
        mensal: acc.mensal + d.valorMensal,
        anual: acc.anual + d.valorAnual,
      }),
      { mensal: 0, anual: 0 }
    );
  }, [filteredDespesas]);

  // Top 5 fornecedores
  const top5Fornecedores = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredDespesas.forEach((d) => {
      grouped[d.fornecedor] = (grouped[d.fornecedor] || 0) + d.valorAnual;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredDespesas]);

  // Distribuição por Serviço
  const distribuicaoServico = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredDespesas.forEach((d) => {
      grouped[d.servico] = (grouped[d.servico] || 0) + d.valorAnual;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredDespesas]);

  // Maior e menor despesa
  const maiorDespesa = useMemo(() => {
    return filteredDespesas.reduce((prev, current) =>
      prev.valorAnual > current.valorAnual ? prev : current
    );
  }, [filteredDespesas]);

  const menorDespesa = useMemo(() => {
    return filteredDespesas.reduce((prev, current) =>
      prev.valorAnual < current.valorAnual ? prev : current
    );
  }, [filteredDespesas]);

  const COLORS = [
    "#f59e0b",
    "#fbbf24",
    "#fcd34d",
    "#fde68a",
    "#fef3c7",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground font-poppins mb-2">
            Despesas sem Contrato
          </h1>
          <p className="text-muted-foreground">
            Análise de despesas não controladas por contrato formal
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total de Itens"
            value={filteredDespesas.length}
            icon={<AlertTriangle className="w-6 h-6" />}
            subtitle="Itens sem contrato"
          />
          <MetricCard
            title="Valor Mensal"
            value={formatCurrency(totais.mensal)}
            icon={<DollarSign className="w-6 h-6" />}
            subtitle="Despesa mensal"
          />
          <MetricCard
            title="Valor Anual"
            value={formatCurrency(totais.anual)}
            icon={<Zap className="w-6 h-6" />}
            subtitle="Despesa anual"
          />
        </div>

        {/* Filtro */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Secretaria (SEC)
                </label>
                <Select value={selectedSEC} onValueChange={setSelectedSEC}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as SECs</SelectItem>
                    {secs
                      .filter((s) => s !== "all")
                      .sort()
                      .map((sec) => (
                        <SelectItem key={sec} value={sec}>
                          {sec}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Fornecedores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-poppins">
                Top 5 Fornecedores (Anual)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={top5Fornecedores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-poppins">
                Distribuição por Tipo de Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoServico.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name}: ${formatCurrency(value)}`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distribuicaoServico.slice(0, 5).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Cards de Destaque */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-t-4 border-t-accent">
            <CardHeader>
              <CardTitle className="text-lg font-poppins">
                Maior Despesa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Fornecedor</p>
                <p className="text-lg font-semibold text-foreground">
                  {maiorDespesa.fornecedor}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Serviço</p>
                <p className="text-sm text-foreground">{maiorDespesa.servico}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Anual</p>
                <p className="text-2xl font-bold text-accent">
                  {formatCurrency(maiorDespesa.valorAnual)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-muted">
            <CardHeader>
              <CardTitle className="text-lg font-poppins">
                Menor Despesa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Fornecedor</p>
                <p className="text-lg font-semibold text-foreground">
                  {menorDespesa.fornecedor}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Serviço</p>
                <p className="text-sm text-foreground">{menorDespesa.servico}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Anual</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {formatCurrency(menorDespesa.valorAnual)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Despesas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins">
              Despesas ({filteredDespesas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                {
                  key: "sec",
                  label: "SEC",
                  width: "10%",
                },
                {
                  key: "servico",
                  label: "Serviço",
                  width: "15%",
                },
                {
                  key: "fornecedor",
                  label: "Fornecedor",
                  width: "25%",
                },
                {
                  key: "objeto",
                  label: "Objeto",
                  width: "25%",
                },
                {
                  key: "valorMensal",
                  label: "Mensal",
                  width: "12.5%",
                  render: (value) => formatCurrency(value),
                },
                {
                  key: "valorAnual",
                  label: "Anual",
                  width: "12.5%",
                  render: (value) => formatCurrency(value),
                },
              ]}
              data={filteredDespesas}
              searchable={true}
              searchFields={["fornecedor", "servico", "objeto"]}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
