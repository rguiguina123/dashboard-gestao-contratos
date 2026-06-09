import jsPDF from 'jspdf';
import { Contrato } from './data';

export function generateContractPDF(contract: Contrato & { diasParaVencimento: number }) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  let yPos = margin;

  // Header com linha sutil
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos + 8, pageWidth - margin, yPos + 8);

  // Título principal
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(40, 40, 40);
  pdf.text('INFORMAÇÕES DO CONTRATO', margin, yPos + 6);

  yPos += 15;

  // Número do contrato e data
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Contrato: ${contract.contrato}`, margin, yPos);
  pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin - 50, yPos);

  yPos += 10;

  // Seção Dados Gerais
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  pdf.text('DADOS GERAIS', margin, yPos);

  yPos += 8;

  // Background sutil para a seção
  pdf.setFillColor(248, 248, 248);
  pdf.rect(margin, yPos - 2, contentWidth, 60, 'F');

  // Dados em duas colunas
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(80, 80, 80);

  const col1X = margin + 3;
  const col2X = margin + contentWidth / 2;
  let dataY = yPos + 3;

  // Coluna 1
  pdf.text('Número do Contrato:', col1X, dataY);
  pdf.setFont('Helvetica', 'normal');
  pdf.setTextColor(40, 40, 40);
  pdf.text(contract.contrato, col1X, dataY + 5);

  pdf.setFont('Helvetica', 'bold');
  pdf.setTextColor(80, 80, 80);
  pdf.text('Objeto do Contrato:', col1X, dataY + 14);
  pdf.setFont('Helvetica', 'normal');
  pdf.setTextColor(40, 40, 40);
  const objetoLines = pdf.splitTextToSize(contract.objeto, contentWidth / 2 - 6);
  pdf.text(objetoLines, col1X, dataY + 19);

  // Coluna 2
  pdf.setFont('Helvetica', 'bold');
  pdf.setTextColor(80, 80, 80);
  pdf.text('SEC Responsável:', col2X, dataY);
  pdf.setFont('Helvetica', 'normal');
  pdf.setTextColor(40, 40, 40);
  pdf.text(contract.sec, col2X, dataY + 5);

  pdf.setFont('Helvetica', 'bold');
  pdf.setTextColor(80, 80, 80);
  pdf.text('Fornecedor:', col2X, dataY + 14);
  pdf.setFont('Helvetica', 'normal');
  pdf.setTextColor(40, 40, 40);
  const fornecedorLines = pdf.splitTextToSize(contract.fornecedor, contentWidth / 2 - 6);
  pdf.text(fornecedorLines, col2X, dataY + 19);

  yPos += 70;

  // Seção Datas e Status
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  pdf.text('DATAS E STATUS', margin, yPos);

  yPos += 8;

  // Background para datas
  pdf.setFillColor(248, 248, 248);
  pdf.rect(margin, yPos - 2, contentWidth, 30, 'F');

  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(80, 80, 80);

  dataY = yPos + 3;

  pdf.text('Data de Vencimento:', col1X, dataY);
  pdf.setFont('Helvetica', 'normal');
  pdf.setTextColor(40, 40, 40);
  pdf.text(contract.dataVencimento, col1X, dataY + 5);

  pdf.setFont('Helvetica', 'bold');
  pdf.setTextColor(80, 80, 80);
  pdf.text('Status:', col2X, dataY);
  pdf.setFont('Helvetica', 'normal');

  // Status com cor apropriada
  if (contract.diasParaVencimento < 0) {
    pdf.setTextColor(200, 50, 50); // Vermelho para vencido
  } else if (contract.diasParaVencimento <= 30) {
    pdf.setTextColor(220, 140, 0); // Laranja para vencendo
  } else {
    pdf.setTextColor(80, 160, 80); // Verde para ativo
  }

  const statusText = contract.diasParaVencimento < 0
    ? `Vencido há ${Math.abs(contract.diasParaVencimento)} dias`
    : `Vence em ${contract.diasParaVencimento} dias`;

  pdf.text(statusText, col2X, dataY + 5);

  yPos += 40;

  // Seção Valores Financeiros
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  pdf.text('VALORES FINANCEIROS', margin, yPos);

  yPos += 10;

  // Cards de valores lado a lado
  const cardWidth = (contentWidth - 4) / 2;
  const cardHeight = 25;

  // Card Valor Mensal
  pdf.setFillColor(245, 245, 245);
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.rect(margin, yPos, cardWidth, cardHeight, 'FD');

  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Valor Mensal', margin + 3, yPos + 6);

  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(40, 40, 40);
  pdf.text(`R$ ${contract.mensal.toFixed(2).replace('.', ',')}`, margin + 3, yPos + 16);

  // Card Valor Anual
  pdf.setFillColor(245, 245, 245);
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.rect(margin + cardWidth + 2, yPos, cardWidth, cardHeight, 'FD');

  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Valor Anual', margin + cardWidth + 5, yPos + 6);

  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(40, 40, 40);
  pdf.text(`R$ ${contract.anual.toFixed(2).replace('.', ',')}`, margin + cardWidth + 5, yPos + 16);

  yPos += cardHeight + 8;

  // Observações
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  pdf.text('OBSERVAÇÕES', margin, yPos);

  yPos += 6;

  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(80, 80, 80);

  const observations = [
    `• Este contrato está registrado para a SEC ${contract.sec}.`,
    `• Fornecedor: ${contract.fornecedor}`,
    `• Despesa mensal: R$ ${contract.mensal.toFixed(2).replace('.', ',')} | Despesa anual: R$ ${contract.anual.toFixed(2).replace('.', ',')}`
  ];

  const obsLines = pdf.splitTextToSize(observations.join('\n'), contentWidth - 6);
  pdf.text(obsLines, margin + 3, yPos);

  // Footer
  const footerY = pageHeight - 10;
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, margin, footerY);
  pdf.text(`Página 1 de 1`, pageWidth - margin - 20, footerY);

  // Download
  const fileName = `Contrato_${contract.contrato.replace(/\//g, '-')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}
