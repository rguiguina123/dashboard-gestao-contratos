import { jsPDF } from "jspdf";
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
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(16);
      doc.text(title, pageWidth / 2, 20, { align: "center" });
      
      // Data
      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 20, 30);
      
      // Table usando HTML
      const tableHTML = `
        <table border="1" cellpadding="5" style="width: 100%; border-collapse: collapse;">
          <thead style="background-color: #7c3aed; color: white;">
            <tr>
              ${columns.map((col) => `<th>${col.label}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data.map((row) => `
              <tr>
                ${columns.map((col) => {
                  const value = row[col.key];
                  const formatted = col.format ? col.format(value) : String(value);
                  return `<td>${formatted}</td>`;
                }).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
      
      // Usar HTML2PDF se disponível, senão usar método simples
      const element = document.createElement("div");
      element.innerHTML = tableHTML;
      
      // Método simples: adicionar linhas de texto
      let yPosition = 40;
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      
      // Headers
      doc.setFontSize(9);
      doc.setFont("", "bold");
      const columnWidth = (pageWidth - 2 * margin) / columns.length;
      
      columns.forEach((col, idx) => {
        doc.text(col.label, margin + idx * columnWidth, yPosition);
      });
      
      yPosition += 7;
      doc.setFont("", "normal");
      
      // Data
      data.forEach((row) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        
        columns.forEach((col, idx) => {
          const value = row[col.key];
          const formatted = col.format ? col.format(value) : String(value);
          doc.text(formatted, margin + idx * columnWidth, yPosition);
        });
        
        yPosition += 7;
      });
      
      // Totals
      if (totals) {
        yPosition += 5;
        doc.setFont("", "bold");
        
        if (totals.mensal) {
          doc.text(`Total Mensal: ${formatCurrency(totals.mensal)}`, margin, yPosition);
          yPosition += 7;
        }
        
        if (totals.anual) {
          doc.text(`Total Anual: ${formatCurrency(totals.anual)}`, margin, yPosition);
        }
      }
      
      // Save
      const dateStr = new Date().toISOString().split("T")[0] || "export";
      const fileName = `${title.replace(/\s+/g, "_")}_${dateStr}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar PDF. Tente novamente.");
    }
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
