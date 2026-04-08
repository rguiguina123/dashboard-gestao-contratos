import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { contratos, metricas } from "@/lib/data";
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

export default function DespesasContrato() {
  const [selectedSEC, setSelectedSEC] = useState<string>("all");

  // Extrair SECs únicos
  const secs = useMemo(
    () => ["all", ...Array.from(new Set(contratos.map((c) => c.sec)))],
    []
  );

  // Filtrar contratos
  const filteredContratos = useMemo(() => {
    if (selectedSEC === "all") return contratos;
    return contratos.filter((c) => c.sec === selectedSEC);
  }, [selectedSEC]);

  // Calcular totais
  const totais = useMemo(() => {
    return filteredContratos.reduce(
      (acc, c) => ({
        mensal: acc.mensal + c.valorMensal,
        anual: acc.anual + c.valorAnual,
      }),
      { mensal: 0, anual: 0 }
    );
  }, [filteredContratos]);

  // Top 5 fornecedores
  const top5Fornecedores = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredContratos.forEach((c) => {
      grouped[c.fornecedor] = (grouped[c.fornecedor] || 0) + c.valorAnual;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredContratos]);

  // Distribuição por SEC
  const distribuicaoSEC = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredContratos.forEach((c) => {
      grouped[c.sec] = (grouped[c.sec] || 0) + c.valorAnual;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredContratos]);

  // Maior e menor contrato
  const maiorContrato = useMemo(() => {
    return filteredContratos.reduce((prev, current) =>
      prev.valorAnual > current.valorAnual ? prev : current
    );
  }, [filteredContratos]);

  const menorContrato = useMemo(() => {
    return filteredContratos.reduce((prev, current) =>
      prev.valorAnual < current.valorAnual ? prev : current
    );
  }, [filteredContratos]);

  const COLORS = [
    "#1e40af",
    "#2563eb",
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground font-poppins mb-2">
            Despesas com Contrato
          </h1>
          <p className="text-muted-foreground">
            Análise detalhada de despesas controladas por contrato
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total de Contratos"
            value={filteredContratos.length}
            icon={<Award className="w-6 h-6" />}
            subtitle="Contratos ativos"
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
            icon={<TrendingUp className="w-6 h-6" />}
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
                  <Bar dataKey="value" fill="#1e40af" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por SEC */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-poppins">
                Distribuição por SEC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoSEC.slice(0, 5)}
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
                    {distribuicaoSEC.slice(0, 5).map((_, index) => (
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
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="text-lg font-poppins">
                Maior Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Fornecedor</p>
                <p className="text-lg font-semibold text-foreground">
                  {maiorContrato.fornecedor}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objeto</p>
                <p className="text-sm text-foreground">{maiorContrato.objeto}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Anual</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(maiorContrato.valorAnual)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-accent">
            <CardHeader>
              <CardTitle className="text-lg font-poppins">
                Menor Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Fornecedor</p>
                <p className="text-lg font-semibold text-foreground">
                  {menorContrato.fornecedor}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objeto</p>
                <p className="text-sm text-foreground">{menorContrato.objeto}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Anual</p>
                <p className="text-2xl font-bold text-accent">
                  {formatCurrency(menorContrato.valorAnual)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Contratos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins">
              Contratos ({filteredContratos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                {
                  key: "numero",
                  label: "Número",
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
                  key: "sec",
                  label: "SEC",
                  width: "10%",
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
              data={filteredContratos}
              searchable={true}
              searchFields={["fornecedor", "objeto"]}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
