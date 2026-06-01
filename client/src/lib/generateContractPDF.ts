import { jsPDF } from "jspdf";
import { formatCurrency } from "./utils";

interface ContractData {
  numero: string;
  fornecedor: string;
  objeto: string;
  sec: string;
  dataVencimento: string;
  diasParaVencer: number;
  valorMensal: number;
  valorAnual: number;
  descricao?: string;
}

export function generateContractPDF(contract: ContractData) {
  try {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Cores do modelo
    const colorPrimary = [147, 51, 234]; // Purple
    const colorSecondary = [236, 72, 153]; // Pink
    const colorDark = [30, 30, 30];
    const colorLight = [100, 100, 100];

    // ===== CAPA =====
    // Background gradiente
    doc.setFillColor(147, 51, 234);
    doc.rect(0, 0, pageWidth, pageHeight / 2, "F");

    doc.setFillColor(236, 72, 153);
    doc.rect(0, pageHeight / 2, pageWidth, pageHeight / 2, "F");

    // Forma geométrica
    doc.setFillColor(200, 100, 200);
    doc.triangle(pageWidth * 0.7, 0, pageWidth, pageHeight * 0.3, pageWidth, 0);

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("", "bold");
    doc.text("RELATÓRIO DE CONTRATO", margin, pageHeight / 2 - 40);

    // Número do contrato
    doc.setFontSize(16);
    doc.setFont("", "normal");
    doc.text(contract.numero, margin, pageHeight / 2 - 20);

    // Data
    doc.setFontSize(10);
    const dataGeracao = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    doc.text(`Relatório gerado em ${dataGeracao}`, margin, pageHeight - 30);

    // ===== PÁGINA 2: INFORMAÇÕES PRINCIPAIS =====
    doc.addPage();
    yPosition = margin;

    // Título da página
    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.setFontSize(18);
    doc.setFont("", "bold");
    doc.text("INFORMAÇÕES DO CONTRATO", margin, yPosition);
    yPosition += 15;

    // Seção: Dados Gerais
    doc.setFillColor(240, 230, 255);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, "F");

    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.setFontSize(11);
    doc.setFont("", "bold");
    doc.text("DADOS GERAIS", margin + 3, yPosition + 1);
    yPosition += 12;

    // Campos de informação
    const fields = [
      { label: "Número do Contrato:", value: contract.numero },
      { label: "Fornecedor/Prestador:", value: contract.fornecedor },
      { label: "Objeto do Contrato:", value: contract.objeto },
      { label: "SEC Responsável:", value: contract.sec },
      { label: "Data de Vencimento:", value: contract.dataVencimento },
      {
        label: "Status de Vencimento:",
        value:
          contract.diasParaVencer < 0
            ? `Vencido há ${Math.abs(contract.diasParaVencer)} dias`
            : `Vence em ${contract.diasParaVencer} dias`,
      },
    ];

    doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
    doc.setFontSize(9);
    doc.setFont("", "normal");

    fields.forEach((field, idx) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      // Label
      doc.setFont("", "bold");
      doc.text(`${field.label}`, margin + 3, yPosition);

      // Value
      doc.setFont("", "normal");
      doc.setTextColor(colorLight[0], colorLight[1], colorLight[2]);
      const lines = doc.splitTextToSize(field.value, pageWidth - 2 * margin - 80);
      doc.text(lines, margin + 80, yPosition);

      yPosition += 6;
      doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
    });

    yPosition += 5;

    // Seção: Valores Financeiros
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(255, 240, 245);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, "F");

    doc.setTextColor(colorSecondary[0], colorSecondary[1], colorSecondary[2]);
    doc.setFontSize(11);
    doc.setFont("", "bold");
    doc.text("VALORES FINANCEIROS", margin + 3, yPosition + 1);
    yPosition += 12;

    // Valores em boxes
    const values = [
      { label: "Valor Mensal", value: formatCurrency(contract.valorMensal) },
      { label: "Valor Anual", value: formatCurrency(contract.valorAnual) },
    ];

    doc.setFontSize(9);
    values.forEach((val, idx) => {
      const x = margin + idx * (pageWidth - 2 * margin) / 2;

      doc.setFillColor(236, 72, 153);
      doc.rect(x, yPosition - 3, (pageWidth - 2 * margin) / 2 - 3, 15, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("", "normal");
      doc.setFontSize(8);
      doc.text(val.label, x + 3, yPosition + 1);

      doc.setFont("", "bold");
      doc.setFontSize(10);
      doc.text(val.value, x + 3, yPosition + 9);
    });

    yPosition += 20;

    // Seção: Descrição
    if (contract.descricao && contract.descricao.trim()) {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFillColor(240, 240, 255);
      doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, "F");

      doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
      doc.setFontSize(11);
      doc.setFont("", "bold");
      doc.text("DESCRIÇÃO DETALHADA", margin + 3, yPosition + 1);
      yPosition += 12;

      doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
      doc.setFontSize(9);
      doc.setFont("", "normal");

      const descLines = doc.splitTextToSize(
        contract.descricao,
        pageWidth - 2 * margin - 6
      );
      descLines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin + 3, yPosition);
        yPosition += 5;
      });
    }

    // ===== PÁGINA 3: ANÁLISE E CONCLUSÃO =====
    doc.addPage();
    yPosition = margin;

    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.setFontSize(18);
    doc.setFont("", "bold");
    doc.text("ANÁLISE E CONCLUSÃO", margin, yPosition);
    yPosition += 15;

    // Status do contrato
    const statusColor =
      contract.diasParaVencer < 0
        ? [220, 38, 38]
        : contract.diasParaVencer < 30
          ? [251, 146, 60]
          : [34, 197, 94];

    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 15, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("", "bold");
    doc.setFontSize(12);

    const statusText =
      contract.diasParaVencer < 0
        ? "⚠️ CONTRATO VENCIDO"
        : contract.diasParaVencer < 30
          ? "⏰ VENCIMENTO PRÓXIMO"
          : "✓ CONTRATO ATIVO";

    doc.text(statusText, margin + 3, yPosition + 7);

    yPosition += 20;

    // Observações
    doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
    doc.setFontSize(9);
    doc.setFont("", "normal");

    const observations = [
      `Este contrato ${contract.numero} foi gerado em ${dataGeracao}.`,
      `O contrato está registrado para a SEC ${contract.sec} e fornecedor ${contract.fornecedor}.`,
      `Valor mensal: ${formatCurrency(contract.valorMensal)} | Valor anual: ${formatCurrency(contract.valorAnual)}`,
      `Data de vencimento: ${contract.dataVencimento}`,
      contract.diasParaVencer < 0
        ? `⚠️ ATENÇÃO: Este contrato venceu há ${Math.abs(contract.diasParaVencer)} dias. Recomenda-se ação imediata.`
        : contract.diasParaVencer < 30
          ? `⏰ ATENÇÃO: Este contrato vence em ${contract.diasParaVencer} dias. Recomenda-se análise de renovação.`
          : `✓ Este contrato está ativo e dentro do prazo de vigência.`,
    ];

    observations.forEach((obs) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }

      const lines = doc.splitTextToSize(obs, pageWidth - 2 * margin - 6);
      lines.forEach((line: string) => {
        doc.text(`• ${line}`, margin + 3, yPosition);
        yPosition += 5;
      });

      yPosition += 2;
    });

    // ===== FOOTER =====
    const pageCount = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setDrawColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
      doc.setLineWidth(1);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      doc.setFontSize(8);
      doc.setTextColor(colorLight[0], colorLight[1], colorLight[2]);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );

      doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
      doc.setFont("", "bold");
      doc.setFontSize(7);
      doc.text("Gestão de Contratos", margin, pageHeight - 8);
    }

    // Save
    const fileName = `Contrato_${contract.numero.replace(/\//g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Erro ao exportar PDF do contrato:", error);
    alert("Erro ao exportar PDF. Tente novamente.");
  }
}
