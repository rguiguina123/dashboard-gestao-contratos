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
import { FileText, DollarSign, Calendar, Search, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { isWithinContractRange, matchesSupplier, parseContractDate } from "@/lib/contractFilters";

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
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedContract, setSelectedContract] = useState<ContratoDisplay | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [dateFilterKey, setDateFilterKey] = useState(0);

  // Função para calcular dias até vencimento usando horário de Brasília
  const calcularDiasParaVencimento = (dataVencimentoStr: string): number => {
    // Criar data de vencimento
    const vencimento = parseContractDate(dataVencimentoStr);
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

  const fornecedoresUnicos = useMemo(() => {
    const fornecedores = new Set(contratos.map((c) => c.fornecedor).filter(Boolean));
    return Array.from(fornecedores).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [contratos]);

  const hasActiveFilters = selectedSEC !== "all" || selectedObjeto !== "all" || Boolean(supplierSearch.trim()) || Boolean(dateRange);

  const clearFilters = () => {
    setSelectedSEC("all");
    setSelectedObjeto("all");
    setSupplierSearch("");
    setDateRange(null);
    setDateFilterKey((current) => current + 1);
  };

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

    filtered = filtered.filter((c) => matchesSupplier(c.fornecedor, supplierSearch));
    filtered = filtered.filter((c) => isWithinContractRange(c.dataVencimento, dateRange));
    
    // Ordenar por data de vencimento (mais próximas primeiro)
    return filtered.sort((a, b) => parseContractDate(a.dataVencimento).getTime() - parseContractDate(b.dataVencimento).getTime());
  }, [selectedSEC, selectedObjeto, supplierSearch, dateRange, contratos]);

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

        {/* Filtros */}
        <div className="rounded-2xl border border-[#c9dde6] bg-[#eaf3f7]/70 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#003f5f]">Filtros avançados</p>
              <p className="text-xs text-slate-600">Combine fornecedor, período de vigência, SEC e objeto.</p>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#087fa3]/25 bg-white px-3 py-2 text-xs font-semibold text-[#003f5f] transition-colors hover:bg-[#c2e6f0]"
              >
                <X className="h-3.5 w-3.5" />
                Limpar filtros
              </button>
            )}
          </div>
          <div className="flex gap-4 items-end flex-wrap">
          <div className="min-w-64">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Período de vigência</label>
            <DateRangeFilter
              key={dateFilterKey}
              onDateRangeChange={(startDate, endDate) => setDateRange({ startDate, endDate })}
              onReset={() => setDateRange(null)}
            />
          </div>
          <div className="min-w-[17rem] flex-1">
            <label htmlFor="supplier-search" className="mb-2 block text-sm font-medium text-gray-700">Buscar fornecedor</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#087fa3]" />
              <input
                id="supplier-search"
                list="contract-suppliers"
                value={supplierSearch}
                onChange={(event) => setSupplierSearch(event.target.value)}
                placeholder="Digite o nome do fornecedor"
                className="h-10 w-full rounded-md border border-[#c9dde6] bg-white py-2 pl-9 pr-9 text-sm text-[#003f5f] outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-[#087fa3]"
              />
              {supplierSearch && (
                <button
                  type="button"
                  aria-label="Limpar busca de fornecedor"
                  onClick={() => setSupplierSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-[#c2e6f0] hover:text-[#003f5f]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <datalist id="contract-suppliers">
                {fornecedoresUnicos.map((fornecedor) => <option key={fornecedor} value={fornecedor} />)}
              </datalist>
            </div>
          </div>
          <div className="flex-1 min-w-xs">
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
          
          <div className="flex-1 min-w-xs">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Filtrar por Objeto</label>
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
          <CardHeader className="flex items-center justify-between border-b border-[#c9dde6] bg-[#eaf3f7]">
            <CardTitle className="text-[#003f5f]">Detalhes dos Contratos</CardTitle>
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
              className="rounded-lg bg-[#003f5f] px-4 py-2 font-semibold text-white transition-all hover:bg-[#087fa3] hover:shadow-lg"
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
