import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useDashboardData } from "@/contexts/DashboardDataContext";
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
  const { colaboradores } = useDashboardData();
  const [selectedSEC, setSelectedSEC] = useState<string>("all");

  // Filtrar colaboradores
  const filteredColaboradores = useMemo(() => {
    if (selectedSEC === "all") return colaboradores;
    return colaboradores.filter((c: any) => c.sec === selectedSEC);
  }, [selectedSEC, colaboradores]);

  // Dados de distribuição por posto, calculados a partir da base atual.
  const distribuicaoPosto = useMemo(() => {
    const postos = colaboradores.reduce((acc: Map<string, number>, colaborador: any) => {
      const posto = colaborador.funcao || "Não informado";
      acc.set(posto, (acc.get(posto) || 0) + 1);
      return acc;
    }, new Map<string, number>());

    return Array.from(postos, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [colaboradores]);

  // Dados de distribuição por SEC, consolidados e limitados às principais SECs.
  const distribuicaoSEC = useMemo(() => {
    const porSEC = colaboradores.reduce((acc: Map<string, number>, colaborador: any) => {
      const sec = colaborador.sec || "Não informada";
      acc.set(sec, (acc.get(sec) || 0) + 1);
      return acc;
    }, new Map<string, number>());
    const dadosOrdenados = Array.from(porSEC, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const principais = dadosOrdenados.slice(0, 7);
    const outros = dadosOrdenados.slice(7).reduce((total, item) => total + item.value, 0);

    return outros > 0 ? [...principais, { name: "Outras SECs", value: outros }] : principais;
  }, [colaboradores]);

  // Cores para gráficos
  const COLORS = [
    "#003f5f",
    "#89ad45",
    "#f2c94c",
    "#087fa3",
    "#4d88a3",
    "#8fb8cc",
    "#2a6e89",
    "#c2e6f0",
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
            accent="green"
          />
          <MetricCard
            title="Postos Diferentes"
            value={distribuicaoPosto.length.toString()}
            icon={<Briefcase className="w-5 h-5" />}
            trend="neutral"
            accent="yellow"
          />
          <MetricCard
            title="SECs Gerenciadas"
            value={new Set(colaboradores.map((c: any) => c.sec).filter(Boolean)).size.toString()}
            icon={<Building2 className="w-5 h-5" />}
            trend="neutral"
            accent="blue"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição por Posto */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-[#c9dde6] bg-[#eaf3f7]">
              <CardTitle className="text-[#003f5f]">Distribuição por Posto</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distribuicaoPosto}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#89ad45" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por SEC */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-[#c9dde6] bg-[#eaf3f7]">
              <CardTitle className="text-[#003f5f]">Distribuição por SEC</CardTitle>
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
            <CardHeader className="flex items-center justify-between border-b border-[#c9dde6] bg-[#eaf3f7]">
              <CardTitle className="text-[#003f5f]">
                Lista de Colaboradores ({filteredColaboradores.length})
              </CardTitle>
              <Button
                onClick={() => {
                  const metricas = {
                    total: filteredColaboradores.length,
                    funcoes: new Set(filteredColaboradores.map((c: any) => c.funcao).filter(Boolean)).size,
                    secs: new Set(filteredColaboradores.map((c: any) => c.sec).filter(Boolean)).size,
                    postos: new Set(filteredColaboradores.map((c: any) => c.funcao).filter(Boolean)).size,
                  };
                  generateEmployeesPDFProfessional(filteredColaboradores, metricas);
                }}
                className="flex items-center gap-2 border-b-2 border-[#00a6c7] bg-[#003f5f] text-white hover:bg-[#005f83]"
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
