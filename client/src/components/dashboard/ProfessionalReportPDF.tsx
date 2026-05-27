import { jsPDF } from "jspdf";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ReportColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
  width?: number;
}

interface ProfessionalReportProps {
  title: string;
  subtitle?: string;
  data: any[];
  columns: ReportColumn[];
  totals?: {
    mensal?: number;
    anual?: number;
    [key: string]: any;
  };
  summary?: {
    label: string;
    value: string | number;
  }[];
  details?: {
    label: string;
    value: string | number;
  }[];
}

export function ProfessionalReportPDF({
  title,
  subtitle,
  data,
  columns,
  totals,
  summary,
  details,
}: ProfessionalReportProps) {
  const handleExport = () => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Cores corporativas
      const primaryColor = [124, 58, 237]; // Purple
      const accentColor = [168, 85, 247]; // Light Purple
      const textDark = [30, 30, 30];
      const textLight = [100, 100, 100];
      const borderColor = [200, 200, 200];

      // ===== CABEÇALHO =====
      // Background do header
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 45, "F");

      // Título
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("", "bold");
      doc.text(title, margin, 18);

      // Subtítulo
      if (subtitle) {
        doc.setFontSize(11);
        doc.setFont("", "normal");
        doc.text(subtitle, margin, 28);
      }

      // Data de geração
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
      const dataGeracao = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      doc.text(`Relatório gerado em: ${dataGeracao}`, pageWidth - margin, 18, {
        align: "right",
      });

      yPosition = 55;

      // ===== RESUMO EXECUTIVO =====
      if (summary && summary.length > 0) {
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.setFontSize(13);
        doc.setFont("", "bold");
        doc.text("RESUMO EXECUTIVO", margin, yPosition);
        yPosition += 8;

        // Grid de métricas
        const metricsPerRow = 3;
        const metricWidth = (pageWidth - 2 * margin) / metricsPerRow;
        const metricHeight = 18;

        summary.forEach((metric, idx) => {
          const row = Math.floor(idx / metricsPerRow);
          const col = idx % metricsPerRow;
          const x = margin + col * metricWidth;
          const y = yPosition + row * metricHeight;

          // Box background
          doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
          doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.setLineWidth(0.5);
          doc.rect(x, y, metricWidth - 2, metricHeight - 2, "FD");

          // Label
          doc.setFontSize(8);
          doc.setFont("", "normal");
          doc.setTextColor(textLight[0], textLight[1], textLight[2]);
          doc.text(metric.label, x + 2, y + 4);

          // Value
          doc.setFontSize(10);
          doc.setFont("", "bold");
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.text(String(metric.value), x + 2, y + 12);
        });

        yPosition += Math.ceil(summary.length / metricsPerRow) * metricHeight + 8;
      }

      // ===== DETALHES ADICIONAIS =====
      if (details && details.length > 0) {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.setFontSize(11);
        doc.setFont("", "bold");
        doc.text("INFORMAÇÕES DETALHADAS", margin, yPosition);
        yPosition += 7;

        doc.setFontSize(9);
        doc.setFont("", "normal");
        details.forEach((detail) => {
          if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = margin;
          }

          doc.setTextColor(textLight[0], textLight[1], textLight[2]);
          doc.text(`${detail.label}:`, margin, yPosition);

          doc.setTextColor(textDark[0], textDark[1], textDark[2]);
          doc.setFont("", "bold");
          doc.text(String(detail.value), margin + 55, yPosition);

          yPosition += 6;
          doc.setFont("", "normal");
        });

        yPosition += 5;
      }

      // ===== TABELA DE DADOS =====
      if (data && data.length > 0) {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.setFontSize(11);
        doc.setFont("", "bold");
        doc.text("DETALHAMENTO", margin, yPosition);
        yPosition += 7;

        // Cabeçalho da tabela
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("", "bold");

        const columnWidth = (pageWidth - 2 * margin) / columns.length;
        let xPos = margin;

        columns.forEach((col) => {
          doc.text(col.label, xPos + 1, yPosition);
          xPos += columnWidth;
        });

        yPosition += 6;

        // Dados da tabela
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.setFont("", "normal");
        doc.setFontSize(7);

        let rowCount = 0;
        data.forEach((row) => {
          if (yPosition > pageHeight - 15) {
            // Nova página
            doc.addPage();
            yPosition = margin;

            // Repetir cabeçalho
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setTextColor(255, 255, 255);
            doc.setFont("", "bold");
            doc.setFontSize(8);

            xPos = margin;
            columns.forEach((col) => {
              doc.text(col.label, xPos + 1, yPosition);
              xPos += columnWidth;
            });

            yPosition += 6;
            doc.setTextColor(textDark[0], textDark[1], textDark[2]);
            doc.setFont("", "normal");
            doc.setFontSize(7);
          }

          // Cor de fundo alternada
          if (rowCount % 2 === 0) {
            doc.setFillColor(245, 245, 250);
            doc.rect(margin, yPosition - 4, pageWidth - 2 * margin, 5, "F");
          }

          // Desenhar linha
          doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
          doc.setLineWidth(0.1);
          doc.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);

          xPos = margin;
          columns.forEach((col) => {
            const value = row[col.key];
            const formatted = col.format ? col.format(value) : String(value);
            doc.text(formatted.substring(0, 20), xPos + 1, yPosition);
            xPos += columnWidth;
          });

          yPosition += 5;
          rowCount++;
        });
      }

      // ===== TOTALIZADORES =====
      if (totals && Object.keys(totals).length > 0) {
        if (yPosition > pageHeight - 25) {
          doc.addPage();
          yPosition = margin;
        }

        yPosition += 3;
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.setFontSize(11);
        doc.setFont("", "bold");
        doc.text("TOTALIZADORES", margin, yPosition);
        yPosition += 7;

        doc.setFontSize(9);
        doc.setFont("", "normal");

        Object.entries(totals).forEach(([key, value]) => {
          if (yPosition > pageHeight - 15) {
            doc.addPage();
            yPosition = margin;
          }

          doc.setTextColor(textLight[0], textLight[1], textLight[2]);
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
          doc.text(`${label}:`, margin, yPosition);

          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.setFont("", "bold");
          const formattedValue =
            typeof value === "number" && (key.includes("mensal") || key.includes("anual"))
              ? formatCurrency(value)
              : String(value);
          doc.text(formattedValue, margin + 75, yPosition);

          yPosition += 6;
          doc.setFont("", "normal");
        });
      }

      // ===== FOOTER =====
      const pageCount = (doc as any).internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        doc.setFontSize(7);
        doc.setTextColor(textLight[0], textLight[1], textLight[2]);
        doc.text(
          `Página ${i} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 7,
          { align: "center" }
        );

        doc.text("Gestão de Contratos - Relatório Profissional", margin, pageHeight - 7);
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
      Exportar Relatório
    </Button>
  );
}
