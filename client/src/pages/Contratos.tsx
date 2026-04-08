import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { contratos, metricas } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function Contratos() {
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground font-poppins mb-2">
            Gestão de Contratos
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os contratos controlados
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total de Contratos"
            value={metricas.contratosControlados}
            icon={<FileText className="w-6 h-6" />}
            subtitle="Contratos ativos"
          />
          <MetricCard
            title="Valor Mensal"
            value={formatCurrency(totais.mensal)}
            icon={<DollarSign className="w-6 h-6" />}
            subtitle="Despesa mensal total"
          />
          <MetricCard
            title="Valor Anual"
            value={formatCurrency(totais.anual)}
            icon={<Calendar className="w-6 h-6" />}
            subtitle="Despesa anual total"
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
                  label: "Número do Contrato",
                  width: "20%",
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
                  label: "Valor Mensal",
                  width: "10%",
                  render: (value) => formatCurrency(value),
                },
                {
                  key: "valorAnual",
                  label: "Valor Anual",
                  width: "10%",
                  render: (value) => formatCurrency(value),
                },
              ]}
              data={filteredContratos}
              searchable={true}
              searchFields={["fornecedor", "objeto", "numero"]}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
