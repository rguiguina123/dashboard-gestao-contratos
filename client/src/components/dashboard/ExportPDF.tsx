import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

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
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, 20, { align: "center" });
    
    // Data
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 20, 30);
    
    // Table
    const tableData = data.map((row) =>
      columns.map((col) => {
        const value = row[col.key];
        return col.format ? col.format(value) : String(value);
      })
    );
    
    const tableHeaders = columns.map((col) => col.label);
    
    (doc as any).autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 40,
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 9,
        cellPadding: 5,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [124, 58, 237],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    
    // Totals
    if (totals) {
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      doc.setFont("", "bold");
      
      if (totals.mensal) {
        doc.text(
          `Total Mensal: ${formatCurrency(totals.mensal)}`,
          20,
          finalY
        );
      }
      
      if (totals.anual) {
        doc.text(
          `Total Anual: ${formatCurrency(totals.anual)}`,
          20,
          finalY + 8
        );
      }
    }
    
    // Save
    const dateStr = new Date().toISOString().split("T")[0] || "export";
    const fileName = `${title.replace(/\s+/g, "_")}_${dateStr}.pdf`;
    doc.save(fileName);
  };
  
  return (
    <Button
      onClick={handleExport}
      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 hover:shadow-lg"
    >
      <FileDown className="w-4 h-4" />
      Exportar PDF
    </Button>
  );
}
