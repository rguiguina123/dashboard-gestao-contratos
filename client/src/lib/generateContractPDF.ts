import jsPDF from "jspdf";
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
    const pageWidth = (doc as any).internal.pageSize.getWidth();
    const pageHeight = (doc as any).internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Cores do design
    const COLORS = {
      primary: [107, 33, 168], // Roxo
      secondary: [236, 72, 153], // Rosa/Magenta
      accent: [124, 58, 237], // Roxo para destaque
      success: [22, 163, 74], // Verde
      warning: [249, 115, 22], // Laranja
      danger: [220, 38, 38], // Vermelho
      text: [15, 23, 42], // Cinza muito escuro
      lightText: [100, 116, 139], // Cinza médio
      border: [203, 213, 225], // Cinza para bordas
    };

    // ===== CABEÇALHO COM GRADIENTE =====
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.rect(0, 0, pageWidth, 45, "F");

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMAÇÕES DO CONTRATO", margin, 18);

    // Subtítulo
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(contract.numero, margin, 28);

    // Data de geração
    doc.setFontSize(8);
    const dataGeracao = new Date().toLocaleDateString("pt-BR");
    doc.text(`Gerado em ${dataGeracao}`, pageWidth - margin - 40, 28);

    yPosition = 55;

    // ===== SEÇÃO 1: DADOS GERAIS =====
    doc.setFillColor(243, 232, 255); // Roxo muito claro
    doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, 8, "F");

    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("DADOS GERAIS", margin + 2, yPosition + 2);

    yPosition += 12;

    // Grid 2x2 para dados gerais
    const gridWidth = (pageWidth - 2 * margin) / 2 - 2;

    // Número do Contrato
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
    doc.text("Número do Contrato:", margin, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFontSize(9);
    doc.text(contract.numero, margin + 50, yPosition);

    // SEC
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
    doc.text("SEC Responsável:", margin + gridWidth + 4, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFontSize(9);
    doc.text(contract.sec, margin + gridWidth + 54, yPosition);

    yPosition += 8;

    // Fornecedor
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
    doc.text("Fornecedor/Prestador:", margin, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFontSize(9);
    const fornecedorLines = doc.splitTextToSize(contract.fornecedor, 60);
    doc.text(fornecedorLines, margin + 50, yPosition);

    // Data de Vencimento
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
    doc.text("Data de Vencimento:", margin + gridWidth + 4, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFontSize(9);
    doc.text(contract.dataVencimento, margin + gridWidth + 54, yPosition);

    yPosition += 10;

    // Objeto
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
    doc.text("Objeto do Contrato:", margin, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFontSize(8);
    const objetoLines = doc.splitTextToSize(contract.objeto, pageWidth - 2 * margin - 50);
    doc.text(objetoLines, margin + 50, yPosition);

    yPosition += 12;

    // ===== SEÇÃO 2: VALORES FINANCEIROS =====
    doc.setFillColor(255, 240, 245); // Rosa muito claro
    doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, 8, "F");

    doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("VALORES FINANCEIROS", margin + 2, yPosition + 2);

    yPosition += 12;

    // Cards de valores lado a lado
    const cardWidth = (pageWidth - 2 * margin - 4) / 2;
    const cardHeight = 18;

    // Card Valor Mensal
    doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
    doc.rect(margin, yPosition, cardWidth, cardHeight, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Valor Mensal", margin + 2, yPosition + 5);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(contract.valorMensal), margin + 2, yPosition + 13);

    // Card Valor Anual
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.rect(margin + cardWidth + 4, yPosition, cardWidth, cardHeight, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Valor Anual", margin + cardWidth + 6, yPosition + 5);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(contract.valorAnual), margin + cardWidth + 6, yPosition + 13);

    yPosition += 24;

    // ===== SEÇÃO 3: STATUS =====
    const statusColor =
      contract.diasParaVencer < 0
        ? COLORS.danger
        : contract.diasParaVencer <= 30
          ? COLORS.warning
          : COLORS.success;

    const statusText =
      contract.diasParaVencer < 0
        ? `Vencido há ${Math.abs(contract.diasParaVencer)} dias`
        : contract.diasParaVencer === 0
          ? "Vence hoje"
          : contract.diasParaVencer === 1
            ? "Vence amanhã"
            : `Vence em ${contract.diasParaVencer} dias`;

    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(statusText, margin + 2, yPosition + 7);

    yPosition += 16;

    // ===== SEÇÃO 4: OBSERVAÇÕES =====
    doc.setFillColor(248, 250, 252); // Cinza muito claro
    doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, 8, "F");

    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVAÇÕES", margin + 2, yPosition + 2);

    yPosition += 10;

    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    const observations = [
      `Este contrato está registrado para a SEC ${contract.sec}.`,
      `Fornecedor: ${contract.fornecedor}`,
      `Despesa mensal: ${formatCurrency(contract.valorMensal)} | Despesa anual: ${formatCurrency(contract.valorAnual)}`,
    ];

    observations.forEach((obs) => {
      const lines = doc.splitTextToSize(obs, pageWidth - 2 * margin - 4);
      lines.forEach((line: string) => {
        doc.text(`• ${line}`, margin + 2, yPosition);
        yPosition += 4;
      });
    });

    // ===== FOOTER =====
    doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFontSize(7);
    doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
    doc.setFont("helvetica", "normal");
    doc.text("Gestão de Contratos v1.0", margin, pageHeight - 6);

    doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
    doc.text(
      `Página 1 de 1 | ${dataGeracao}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );

    // Save
    const fileName = `Contrato_${contract.numero.replace(/\//g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Erro ao exportar PDF do contrato:", error);
    alert("Erro ao exportar PDF. Tente novamente.");
  }
}
