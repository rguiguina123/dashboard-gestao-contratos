import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { colaboradores, secs } from "@/lib/data";
import { generateEmployeesPDFProfessional } from "@/lib/generateProfessionalPDF";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/DataTable";
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
import { Users, Briefcase, Building2, FileDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Colaboradores() {
  const [selectedSEC, setSelectedSEC] = useState<string>("all");

  // Filtrar colaboradores
  const filteredColaboradores = useMemo(() => {
    if (selectedSEC === "all") return colaboradores;
    return colaboradores.filter((c: any) => c.sec === selectedSEC);
  }, [selectedSEC]);

  // Dados de distribuição por posto
  const distribuicaoPosto = useMemo(() => {
    return [
      { name: "Apoio Administrativo", value: 56 },
      { name: "Limpeza/Copeiragem", value: 39 },
      { name: "Segurança Pessoal Privada", value: 7 },
      { name: "Vigilante Diurno 12 x 36h", value: 4 },
      { name: "Vigilante Noturno 12 x 36h", value: 4 },
      { name: "Recepção", value: 2 },
    ];
  }, []);

  // Dados de distribuição por SEC
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

  // Colunas da tabela
  const columns: Array<any> = [
    { key: "nome", label: "Nome", sortable: true },
    { key: "sec", label: "SEC", sortable: true },
    { key: "funcao", label: "Função", sortable: true },
    { key: "cpf", label: "CPF", sortable: true },
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
            value={colaboradores.length.toString()}
            icon={<Users className="w-5 h-5" />}
            trend="up"
          />
          <MetricCard
            title="Postos Diferentes"
            value="6"
            icon={<Briefcase className="w-5 h-5" />}
            trend="neutral"
          />
          <MetricCard
            title="SECs Gerenciadas"
            value={new Set(colaboradores.map((c: any) => c.cpf)).size.toString()}
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

        {/* Filtro e Tabela de Colaboradores */}
        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Filtrar por SEC</label>
              <Select value={selectedSEC} onValueChange={setSelectedSEC}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os SECs</SelectItem>
                  {Array.from(new Set(colaboradores.map((c: any) => c.sec).filter((s: any) => s)))
                    .sort()
                    .map((sec: any) => (
                      <SelectItem key={sec} value={sec}>
                        {sec}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b flex items-center justify-between">
              <CardTitle className="text-purple-900">
                Lista de Colaboradores ({filteredColaboradores.length})
              </CardTitle>
              <Button
                onClick={() => {
                  const metricas = {
                    total: colaboradores.length,
                    funcoes: 6,
                    secs: new Set(colaboradores.map((c: any) => c.sec)).size,
                    postos: 6,
                  };
                  generateEmployeesPDFProfessional(colaboradores, metricas);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
              >
                <FileDown className="w-4 h-4" />
                Exportar Relatório
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={filteredColaboradores}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
