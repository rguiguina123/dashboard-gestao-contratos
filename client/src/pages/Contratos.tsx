import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { ContractDetailModal } from "@/components/dashboard/ContractDetailModal";
import { ProfessionalReportPDF } from "@/components/dashboard/ProfessionalReportPDF";
import { VencimentoAlerts } from "@/components/dashboard/VencimentoAlerts";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { generateContractsPDFProfessional } from "@/lib/generateProfessionalPDF";
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
import { DateRangeFilter } from "@/components/DateRangeFilter";

interface ContratoDisplay {
  id: string;
  contrato: string;
  fornecedor: string;
  objeto: string;
  sec: string;
  mensal: number;
  anual: number;
  dataVencimento: string;
  diasParaVencimento?: number;
}

export default function Contratos() {
  const { contratos, secs: allSecs } = useDashboardData();
  const [selectedSEC, setSelectedSEC] = useState<string>("all");
  const [selectedObjeto, setSelectedObjeto] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<ContratoDisplay | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);

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

  // Extrair objetos únicos dos contratos
  const objetosUnicos = useMemo(() => {
    const objetos = new Set(contratos.map((c) => c.objeto).filter(Boolean));
    return Array.from(objetos).sort();
  }, [contratos]);

  // Filtrar e ordenar contratos por data de vencimento
  const filteredContratos = useMemo(() => {
    let filtered = contratos;
    
    // Filtrar por SEC
    if (selectedSEC !== "all") {
      filtered = filtered.filter((c) => c.sec === selectedSEC);
    }
    
    // Filtrar por Objeto
    if (selectedObjeto !== "all") {
      filtered = filtered.filter((c) => c.objeto === selectedObjeto);
    }

    if (dateRange) {
      const start = new Date(`${dateRange.startDate}T00:00:00`);
      const end = new Date(`${dateRange.endDate}T23:59:59`);
      filtered = filtered.filter((c) => {
        const vencimento = parseDate(c.dataVencimento);
        return vencimento >= start && vencimento <= end;
      });
    }
    
    // Ordenar por data de vencimento (mais próximas primeiro)
    return filtered.sort((a, b) => parseDate(a.dataVencimento).getTime() - parseDate(b.dataVencimento).getTime());
  }, [selectedSEC, selectedObjeto, dateRange, contratos]);

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

      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#003f5f] sm:text-4xl">Contratos</h1>
        </div>

        {/* Filtros */}
        <div className="grid items-end gap-3 md:grid-cols-[260px_1fr_1fr]">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-[.12em] text-[#547182]">Vencimento</label>
            <DateRangeFilter
              onDateRangeChange={(startDate, endDate) => setDateRange({ startDate, endDate })}
              onReset={() => setDateRange(null)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-[.12em] text-[#547182]">SEC</label>
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
          
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-[.12em] text-[#547182]">Objeto</label>
            <Select value={selectedObjeto} onValueChange={setSelectedObjeto}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Objetos</SelectItem>
                {objetosUnicos.map((objeto) => (
                  <SelectItem key={objeto} value={objeto}>
                    {objeto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
        <Card className="border-[#c9dde6] shadow-[0_2px_12px_rgba(0,63,95,.05)]">
          <CardHeader className="flex items-center justify-between border-b border-[#c9dde6] bg-[#eaf3f7] py-4">
            <CardTitle className="text-[#003f5f]">Detalhes dos contratos</CardTitle>
            <button
              onClick={() => {
                const metricas = {
                  total: filteredContratos.length,
                  mensal: totais.mensal,
                  anual: totais.anual,
                  vencidos: contratosComDias.filter((c) => c.diasParaVencimento < 0).length,
                  breve: contratosComDias.filter((c) => c.diasParaVencimento >= 0 && c.diasParaVencimento <= 30).length,
                  ativos: contratosComDias.filter((c) => c.diasParaVencimento > 30).length,
                };
                generateContractsPDFProfessional(contratosComDias, metricas);
              }}
              className="border-b-2 border-[#f2c94c] bg-[#003f5f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#55752c]"
            >
              Exportar Relatório
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={contratosComDias}
              onRowClick={(row) => {
                const contract = row as any;
                setSelectedContract({
                  id: contract.id,
                  contrato: contract.contrato,
                  fornecedor: contract.fornecedor,
                  objeto: contract.objeto,
                  sec: contract.sec,
                  mensal: contract.mensal,
                  anual: contract.anual,
                  dataVencimento: contract.dataVencimento,
                  diasParaVencimento: contract.diasParaVencimento,
                });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
