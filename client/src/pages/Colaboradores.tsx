import { useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { secs } from "@/lib/data";
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
  // Dados simulados de colaboradores por posto
  const distribuicaoPosto = useMemo(() => {
    return [
      { name: "Analista", value: 35 },
      { name: "Auditor", value: 28 },
      { name: "Especialista", value: 22 },
      { name: "Gestor", value: 15 },
      { name: "Coordenador", value: 12 },
    ];
  }, []);

  // Dados simulados de colaboradores por SEC
  const distribuicaoSEC = useMemo(() => {
    return [
      { name: "SEC-SP", value: 18 },
      { name: "SEC-RJ", value: 15 },
      { name: "SEC-MG", value: 12 },
      { name: "SEC-BA", value: 10 },
      { name: "SEC-RS", value: 9 },
      { name: "SEC-PE", value: 8 },
      { name: "SEC-PR", value: 7 },
      { name: "Outros", value: 16 },
    ];
  }, []);

  // Cores para gráficos
  const COLORS = [
    "#7c3aed",
    "#3b82f6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#8b5cf6",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold font-poppins text-gray-900">Colaboradores</h1>
          <p className="text-gray-600 mt-2">Distribuição de colaboradores por posto e SEC</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total de Colaboradores"
            value="112"
            icon={<Users className="w-5 h-5" />}
            trend="up"
          />
          <MetricCard
            title="Postos Diferentes"
            value="5"
            icon={<Briefcase className="w-5 h-5" />}
            trend="neutral"
          />
          <MetricCard
            title="SECs Gerenciadas"
            value="48"
            icon={<Building2 className="w-5 h-5" />}
            trend="neutral"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição por Posto */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <CardTitle className="text-purple-900">Distribuição por Posto</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distribuicaoPosto}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por SEC */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <CardTitle className="text-purple-900">Distribuição por SEC</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoSEC}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {distribuicaoSEC.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Resumo */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
            <CardTitle className="text-purple-900">Resumo por Posto</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {distribuicaoPosto.map((item) => (
                <div key={item.name} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[distribuicaoPosto.indexOf(item) % COLORS.length] }}
                    ></div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <span className="text-lg font-bold text-purple-900">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
