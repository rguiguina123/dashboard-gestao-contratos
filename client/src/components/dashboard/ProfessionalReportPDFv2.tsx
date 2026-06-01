import { jsPDF } from "jspdf";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface PDFSection {
  title: string;
  content: string | string[];
  type?: "text" | "list" | "highlight";
}

interface ProfessionalReportPDFv2Props {
  title: string;
  subtitle?: string;
  data: any[];
  columns?: Array<{
    key: string;
    label: string;
    format?: (value: any) => string;
  }>;
  sections?: PDFSection[];
  summary?: {
    label: string;
    value: string | number;
    icon?: string;
  }[];
  fileName?: string;
}

export function ProfessionalReportPDFv2({
  title,
  subtitle,
  data,
  columns,
  sections,
  summary,
  fileName,
}: ProfessionalReportPDFv2Props) {
  const handleExport = () => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Cores do modelo: Gradiente roxo/magenta
      const colorPrimary = [147, 51, 234]; // Purple-600
      const colorSecondary = [236, 72, 153]; // Pink-500
      const colorDark = [30, 30, 30];
      const colorLight = [100, 100, 100];
      const colorBorder = [220, 220, 220];

      // ===== PÁGINA 1: CAPA =====
      // Background gradiente (simulado com retângulos)
      doc.setFillColor(147, 51, 234);
      doc.rect(0, 0, pageWidth, pageHeight / 2, "F");

      doc.setFillColor(236, 72, 153);
      doc.rect(0, pageHeight / 2, pageWidth, pageHeight / 2, "F");

      // Forma geométrica 3D (triângulo)
      doc.setFillColor(200, 100, 200);
      doc.triangle(
        pageWidth * 0.7,
        0,
        pageWidth,
        pageHeight * 0.3,
        pageWidth,
        0
      );

      // Título da capa
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(32);
      doc.setFont("", "bold");
      doc.text(title, margin, pageHeight / 2 - 30);

      // Subtítulo
      if (subtitle) {
        doc.setFontSize(14);
        doc.setFont("", "normal");
        doc.text(subtitle, margin, pageHeight / 2 - 15);
      }

      // Data de geração na capa
      doc.setFontSize(10);
      const dataGeracao = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      doc.text(`Relatório gerado em ${dataGeracao}`, margin, pageHeight - 30);

      // Nova página para conteúdo
      doc.addPage();
      yPosition = margin;

      // ===== RESUMO EXECUTIVO =====
      if (summary && summary.length > 0) {
        doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
        doc.setFontSize(16);
        doc.setFont("", "bold");
        doc.text("RESUMO EXECUTIVO", margin, yPosition);
        yPosition += 12;

        // Grid de métricas com background
        const metricsPerRow = 2;
        const metricWidth = (pageWidth - 2 * margin) / metricsPerRow;
        const metricHeight = 25;

        summary.forEach((metric, idx) => {
          const row = Math.floor(idx / metricsPerRow);
          const col = idx % metricsPerRow;
          const x = margin + col * metricWidth;
          const y = yPosition + row * metricHeight;

          // Box com background gradiente
          doc.setFillColor(240, 230, 255);
          doc.setDrawColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
          doc.setLineWidth(1);
          doc.rect(x, y, metricWidth - 3, metricHeight - 2, "FD");

          // Label
          doc.setFontSize(9);
          doc.setFont("", "normal");
          doc.setTextColor(colorLight[0], colorLight[1], colorLight[2]);
          doc.text(metric.label, x + 3, y + 6);

          // Value
          doc.setFontSize(12);
          doc.setFont("", "bold");
          doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
          doc.text(String(metric.value), x + 3, y + 16);
        });

        yPosition += Math.ceil(summary.length / metricsPerRow) * metricHeight + 10;
      }

      // ===== SEÇÕES TEMÁTICAS =====
      if (sections && sections.length > 0) {
        sections.forEach((section, sectionIdx) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin;
          }

          // Cabeçalho da seção com fundo colorido
          const sectionColor = sectionIdx % 2 === 0 ? colorPrimary : colorSecondary;
          doc.setFillColor(sectionColor[0], sectionColor[1], sectionColor[2]);
          doc.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 10, "F");

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.setFont("", "bold");
          doc.text(section.title, margin, yPosition + 2);

          yPosition += 12;

          // Conteúdo da seção
          doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
          doc.setFontSize(9);
          doc.setFont("", "normal");

          if (section.type === "list" && Array.isArray(section.content)) {
            section.content.forEach((item) => {
              if (yPosition > pageHeight - 15) {
                doc.addPage();
                yPosition = margin;
              }

              doc.text(`• ${item}`, margin + 5, yPosition);
              yPosition += 5;
            });
          } else if (section.type === "highlight") {
            doc.setFillColor(255, 240, 245);
            doc.rect(margin, yPosition - 3, pageWidth - 2 * margin, 20, "F");
            doc.setTextColor(colorSecondary[0], colorSecondary[1], colorSecondary[2]);
            doc.setFont("", "bold");
            doc.text(String(section.content), margin + 3, yPosition + 5);
            yPosition += 22;
          } else {
            const lines = doc.splitTextToSize(String(section.content), pageWidth - 2 * margin - 10);
            lines.forEach((line: string) => {
              if (yPosition > pageHeight - 15) {
                doc.addPage();
                yPosition = margin;
              }
              doc.text(line, margin + 5, yPosition);
              yPosition += 5;
            });
          }

          yPosition += 5;
        });
      }

      // ===== TABELA DE DADOS =====
      if (data && data.length > 0 && columns && columns.length > 0) {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
        doc.setFontSize(12);
        doc.setFont("", "bold");
        doc.text("DETALHAMENTO", margin, yPosition);
        yPosition += 8;

        // Cabeçalho da tabela
        doc.setFillColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
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
        doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
        doc.setFont("", "normal");
        doc.setFontSize(7);

        let rowCount = 0;
        data.forEach((row) => {
          if (yPosition > pageHeight - 15) {
            doc.addPage();
            yPosition = margin;

            // Repetir cabeçalho
            doc.setFillColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
            doc.setTextColor(255, 255, 255);
            doc.setFont("", "bold");
            doc.setFontSize(8);

            xPos = margin;
            columns.forEach((col) => {
              doc.text(col.label, xPos + 1, yPosition);
              xPos += columnWidth;
            });

            yPosition += 6;
            doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
            doc.setFont("", "normal");
            doc.setFontSize(7);
          }

          // Cor de fundo alternada
          if (rowCount % 2 === 0) {
            doc.setFillColor(245, 240, 250);
            doc.rect(margin, yPosition - 3, pageWidth - 2 * margin, 4, "F");
          }

          // Linha divisória
          doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
          doc.setLineWidth(0.1);
          doc.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);

          xPos = margin;
          columns.forEach((col) => {
            const value = row[col.key];
            const formatted = col.format ? col.format(value) : String(value);
            doc.text(formatted.substring(0, 25), xPos + 1, yPosition);
            xPos += columnWidth;
          });

          yPosition += 4;
          rowCount++;
        });
      }

      // ===== FOOTER COM DESIGN =====
      const pageCount = (doc as any).internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Linha decorativa no footer
        doc.setDrawColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
        doc.setLineWidth(1);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

        // Número de página
        doc.setFontSize(8);
        doc.setTextColor(colorLight[0], colorLight[1], colorLight[2]);
        doc.text(
          `Página ${i} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 8,
          { align: "center" }
        );

        // Logo/Branding
        doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
        doc.setFont("", "bold");
        doc.setFontSize(7);
        doc.text("Gestão de Contratos", margin, pageHeight - 8);
      }

      // Save
      const dateStr = new Date().toISOString().split("T")[0] || "export";
      const finalFileName = fileName || `${title.replace(/\s+/g, "_")}_${dateStr}.pdf`;
      doc.save(finalFileName);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar PDF. Tente novamente.");
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white transition-all duration-200 hover:shadow-lg"
    >
      <FileDown className="w-4 h-4" />
      Exportar Relatório
    </Button>
  );
}
