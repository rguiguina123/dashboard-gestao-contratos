import { useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { colaboradores, metricas } from "@/lib/data";
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
import { Users, Briefcase, Building2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function Colaboradores() {
  // Distribuição por Posto
  const distribuicaoPosto = useMemo(() => {
    const dist: Record<string, number> = {};
    colaboradores.forEach((c) => {
      dist[c.posto] = (dist[c.posto] || 0) + 1;
    });
    return Object.entries(dist)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, []);

  // Distribuição por SEC
  const distribuicaoSEC = useMemo(() => {
    const dist: Record<string, number> = {};
    colaboradores.forEach((c) => {
      dist[c.sec] = (dist[c.sec] || 0) + 1;
    });
    return Object.entries(dist)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, []);

  // Cores para gráficos
  const COLORS = [
    "#1e40af",
    "#2563eb",
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#dbeafe",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground font-poppins mb-2">
            Gestão de Colaboradores
          </h1>
          <p className="text-muted-foreground">
            Visualize a distribuição de colaboradores por posto e localização
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total de Colaboradores"
            value={metricas.colaboradores}
            icon={<Users className="w-6 h-6" />}
            subtitle="Colaboradores ativos"
          />
          <MetricCard
            title="Postos Distintos"
            value={metricas.postosDistintos}
            icon={<Briefcase className="w-6 h-6" />}
            subtitle="Tipos de postos"
          />
          <MetricCard
            title="SECs com Colaboradores"
            value={metricas.secsComColaboradores}
            icon={<Building2 className="w-6 h-6" />}
            subtitle="Secretarias"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição por Posto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-poppins">
                Distribuição por Posto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distribuicaoPosto}>
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
                  />
                  <Bar dataKey="value" fill="#1e40af" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por SEC (Top 10) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-poppins">
                Top 10 SECs por Colaboradores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoSEC.slice(0, 10)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distribuicaoSEC.slice(0, 10).map((_, index) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Colaboradores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins">
              Lista de Colaboradores ({colaboradores.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                {
                  key: "nome",
                  label: "Nome",
                  width: "35%",
                },
                {
                  key: "cpf",
                  label: "CPF",
                  width: "20%",
                },
                {
                  key: "posto",
                  label: "Posto",
                  width: "25%",
                },
                {
                  key: "sec",
                  label: "SEC",
                  width: "20%",
                },
              ]}
              data={colaboradores}
              searchable={true}
              searchFields={["nome", "cpf", "posto", "sec"]}
            />
          </CardContent>
        </Card>

        {/* Tabela de Distribuição por SEC */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-poppins">
              Distribuição por SEC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                {
                  key: "name",
                  label: "SEC",
                  width: "50%",
                },
                {
                  key: "value",
                  label: "Quantidade de Colaboradores",
                  width: "50%",
                  render: (value) => formatNumber(value),
                },
              ]}
              data={distribuicaoSEC}
              searchable={true}
              searchFields={["name"]}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
