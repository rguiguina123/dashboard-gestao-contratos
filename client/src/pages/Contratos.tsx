import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { ContractDetailModal } from "@/components/dashboard/ContractDetailModal";
import { ProfessionalReportPDF } from "@/components/dashboard/ProfessionalReportPDF";
import { VencimentoAlerts } from "@/components/dashboard/VencimentoAlerts";
import { contratos, secs as allSecs } from "@/lib/data";
import { generateContractPDF } from "@/lib/generateContractPDF";
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

interface ContratoDisplay {
  id: string;
  contrato: string;
  fornecedor: string;
  objeto: string;
  sec: string;
  mensal: number;
  anual: number;
  dataVencimento: string;
}

export default function Contratos() {
  const [selectedSEC, setSelectedSEC] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<ContratoDisplay | null>(null);

  // Função para converter data DD/MM/YYYY em Date
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  // Função para calcular dias até vencimento usando horário de Brasília
  const calcularDiasParaVencimento = (dataVencimentoStr: string): number => {
    // Criar data de vencimento
    const vencimento = parseDate(dataVencimentoStr);
    vencimento.setHours(0, 0, 0, 0);

    // Obter data atual em Brasília (GMT-3)
    const agora = new Date();
    const utcTime = agora.getTime() + agora.getTimezoneOffset() * 60000;
    const brasiliaTime = new Date(utcTime - 3 * 60 * 60 * 1000);
    brasiliaTime.setHours(0, 0, 0, 0);

    // Calcular diferença em dias
    const diffTime = vencimento.getTime() - brasiliaTime.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Filtrar e ordenar contratos por data de vencimento
  const filteredContratos = useMemo(() => {
    let filtered = selectedSEC === "all" ? contratos : contratos.filter((c) => c.sec === selectedSEC);
    // Ordenar por data de vencimento (mais próximas primeiro)
    return filtered.sort((a, b) => parseDate(a.dataVencimento).getTime() - parseDate(b.dataVencimento).getTime());
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

  // Adicionar coluna de dias para vencimento aos contratos
  const contratosComDias = useMemo(() => {
    const comDias = filteredContratos.map((c) => ({
      ...c,
      diasParaVencimento: calcularDiasParaVencimento(c.dataVencimento),
    }));
    // Ordenar por dias para vencimento (crescente: 1 dia primeiro, depois 2, 3, etc)
    return comDias.sort((a, b) => a.diasParaVencimento - b.diasParaVencimento);
  }, [filteredContratos]);

  const columns: Array<any> = [
    { key: "contrato", label: "Contrato", sortable: true },
    { key: "fornecedor", label: "Fornecedor", sortable: true },
    { key: "objeto", label: "Objeto", sortable: false },
    { key: "sec", label: "SEC", sortable: true },
    { key: "dataVencimento", label: "Vencimento", sortable: true },
    {
      key: "diasParaVencimento",
      label: "Dias para Vencer",
      sortable: true,
      format: (v: number) => {
        if (v < 0) return `Vencido há ${Math.abs(v)} dias`;
        if (v === 0) return "Vence hoje";
        if (v === 1) return "Vence amanhã";
        return `Vence em ${v} dias`;
      },
    },
    { key: "mensal", label: "Valor Mensal", sortable: true, format: (v: number) => formatCurrency(v) },
    { key: "anual", label: "Valor Anual", sortable: true, format: (v: number) => formatCurrency(v) },
  ]

  return (
    <DashboardLayout>
      <ContractDetailModal
        contract={selectedContract}
        onClose={() => setSelectedContract(null)}
      />

      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold font-poppins text-gray-900">Contratos</h1>
          <p className="text-gray-600 mt-2">Gestão e análise de todos os contratos vigentes</p>
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
            icon={<FileText className="w-5 h-5" />}
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
            icon={<Calendar className="w-5 h-5" />}
            trend="up"
          />
        </div>

        {/* Alertas de Vencimento */}
        <VencimentoAlerts contratos={contratosComDias} diasAlerta={30} />

        {/* Tabela */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b flex items-center justify-between">
            <CardTitle className="text-purple-900">Detalhes dos Contratos</CardTitle>
            <ProfessionalReportPDF
              title="Relatório de Contratos"
              subtitle="Análise Detalhada de Contratos Vigentes"
              data={contratosComDias}
              columns={[
                { key: "contrato", label: "Contrato" },
                { key: "fornecedor", label: "Fornecedor" },
                { key: "objeto", label: "Objeto" },
                { key: "sec", label: "SEC" },
                { key: "dataVencimento", label: "Vencimento" },
                { key: "diasParaVencimento", label: "Status", format: (v: number) => v < 0 ? `Vencido há ${Math.abs(v)} dias` : v === 0 ? "Vence hoje" : v === 1 ? "Vence amanhã" : `Vence em ${v} dias` },
                { key: "mensal", label: "Mensal", format: (v: any) => formatCurrency(v) },
                { key: "anual", label: "Anual", format: (v: any) => formatCurrency(v) },
              ]}
              summary={[
                { label: "Total de Contratos", value: filteredContratos.length },
                { label: "Despesa Mensal", value: formatCurrency(totais.mensal) },
                { label: "Despesa Anual", value: formatCurrency(totais.anual) },
              ]}
              details={[
                { label: "Contratos Vencidos", value: contratosComDias.filter((c) => c.diasParaVencimento < 0).length },
                { label: "Contratos Vencendo em Breve", value: contratosComDias.filter((c) => c.diasParaVencimento >= 0 && c.diasParaVencimento <= 30).length },
                { label: "Contratos Ativos", value: contratosComDias.filter((c) => c.diasParaVencimento > 30).length },
              ]}
              totals={totais}
            />
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={contratosComDias}
              onRowClick={(row) => setSelectedContract(row as ContratoDisplay)}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
