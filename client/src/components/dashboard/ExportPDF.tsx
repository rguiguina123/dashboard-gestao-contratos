import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { generateGenericReportPDF } from "@/lib/generateProfessionalPDF";

// Padrão PDF: botão único e relatório institucional com métricas, tabela e paginação.

interface ExportPDFProps {
  title: string;
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    format?: (value: any) => string;
  }>;
  totals?: {
    mensal?: number;
    anual?: number;
  };
}

export function ExportPDF({ title, data, columns, totals }: ExportPDFProps) {
  const handleExport = () => {
    const metrics = [
      ...(totals?.mensal !== undefined
        ? [{ label: "Despesa Mensal Total", value: `R$ ${formatCurrency(totals.mensal)}` }]
        : []),
      ...(totals?.anual !== undefined
        ? [{ label: "Despesa Anual Total", value: `R$ ${formatCurrency(totals.anual)}` }]
        : []),
      { label: "Registros no relatório", value: data.length },
    ];

    const tableData = data.map((row) =>
      columns.map((column) => {
        const value = row[column.key];
        return column.format ? column.format(value) : String(value ?? "—");
      })
    );

    generateGenericReportPDF(
      title,
      metrics,
      columns.map((column) => column.label),
      tableData,
      `Relatorio_${title.replace(/[^a-zA-Z0-9À-ÿ]+/g, "_")}`
    );
  };

  return (
    <Button
      onClick={handleExport}
      className="flex items-center gap-2 bg-[#003f5f] text-white transition-all duration-200 hover:bg-[#087fa3] hover:shadow-lg"
    >
      <FileDown className="w-4 h-4" />
      Exportar Relatório
    </Button>
  );
}

// Mantém o formatador disponível no módulo para relatórios que fornecem totais monetários.
void formatCurrency;
