import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Cores profissionais e elegantes
const COLORS = {
  headerBg: '#1a365d', // Azul escuro profissional
  headerText: '#ffffff',
  accentPrimary: '#2563eb', // Azul vibrante
  accentSecondary: '#7c3aed', // Roxo
  textPrimary: '#1f2937', // Cinza escuro
  textSecondary: '#6b7280', // Cinza médio
  success: '#059669', // Verde
  warning: '#d97706', // Laranja
  danger: '#dc2626', // Vermelho
  lightBg: '#f3f4f6', // Cinza claro
  border: '#d1d5db', // Cinza para bordas
  white: '#ffffff',
};

interface ContractMetrics {
  total: number;
  mensal: number;
  anual: number;
  ativos: number;
  vencidos: number;
  breve: number;
}

interface EmployeeMetrics {
  total: number;
  funcoes: number;
  secs: number;
  postos: number;
}

export const generateContractsPDFProfessional = async (
  contracts: any[],
  metrics: ContractMetrics
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = (doc as any).internal.pageSize.getWidth();
  const pageHeight = (doc as any).internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // ============ PÁGINA 1: CABEÇALHO + RESUMO ============

  // Cabeçalho profissional com gradiente
  doc.setFillColor(26, 54, 93); // Azul escuro
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Identificação institucional e título
  doc.setTextColor(209, 213, 219);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('TRIBUNAL DE CONTAS DA UNIÃO', margin, 9);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE CONTRATOS', margin, 18);

  // Subtítulo e data
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 213, 219);
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  doc.text(`Relatório gerencial • Gerado em ${dataAtual}`, margin, 28);
  doc.text(`Total de ${metrics.total} contratos analisados`, margin, 34);

  yPosition = 50;

  // ============ MÉTRICAS PRINCIPAIS ============
  doc.setTextColor(COLORS.textPrimary);
  
  // Métrica 1: Total de Contratos
  drawMetricBox(doc, margin, yPosition, 40, 20, 'Total de Contratos', metrics.total.toString(), COLORS.accentPrimary);
  
  // Métrica 2: Despesa Mensal
  drawMetricBox(doc, margin + 50, yPosition, 40, 20, 'Despesa Mensal', `R$ ${formatCurrency(metrics.mensal)}`, COLORS.accentSecondary);
  
  // Métrica 3: Despesa Anual
  drawMetricBox(doc, margin + 100, yPosition, 40, 20, 'Despesa Anual', `R$ ${formatCurrency(metrics.anual)}`, COLORS.accentPrimary);

  yPosition += 30;

  // ============ ALERTAS E STATUS ============
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.textPrimary);
  doc.text('STATUS DOS CONTRATOS', margin, yPosition);
  yPosition += 8;

  // Box de contratos vencidos
  if (metrics.vencidos > 0) {
    drawAlertBox(doc, margin, yPosition, contentWidth, 12, `⚠️ ${metrics.vencidos} contrato(s) VENCIDO(S)`, COLORS.danger);
    yPosition += 16;
  }

  // Box de contratos vencendo
  if (metrics.breve > 0) {
    drawAlertBox(doc, margin, yPosition, contentWidth, 12, `⏰ ${metrics.breve} contrato(s) vencendo em breve (até 30 dias)`, COLORS.warning);
    yPosition += 16;
  }

  // Box de contratos ativos
  drawAlertBox(doc, margin, yPosition, contentWidth, 12, `✓ ${metrics.ativos} contrato(s) ATIVO(S)`, COLORS.success);
  yPosition += 18;

  // ============ TABELA DE CONTRATOS ============
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.textPrimary);
  doc.text('DETALHES DOS CONTRATOS', margin, yPosition);
  yPosition += 8;

  // Preparar dados da tabela
  const tableData = contracts.map(contract => [
    contract.contrato?.substring(0, 15) || 'N/A',
    contract.fornecedor?.substring(0, 20) || 'N/A',
    contract.sec || 'N/A',
    contract.dataVencimento || 'N/A',
    contract.diasParaVencimento > 0 ? `+${contract.diasParaVencimento}d` : `${contract.diasParaVencimento}d`,
    `R$ ${formatCurrency(contract.mensal || 0)}`,
    `R$ ${formatCurrency(contract.anual || 0)}`,
  ]);

  (doc as any).autoTable({
    head: [['Contrato', 'Fornecedor', 'SEC', 'Vencimento', 'Dias', 'Mensal', 'Anual']],
    body: tableData,
    startY: yPosition,
    margin: margin,
    theme: 'grid',
    headStyles: {
      fillColor: [26, 54, 93],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      padding: 4,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [31, 41, 55],
      padding: 3,
    },
    alternateRowStyles: {
      fillColor: [243, 244, 246],
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 35 },
      2: { cellWidth: 15 },
      3: { cellWidth: 18 },
      4: { cellWidth: 12 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
    },
  });

  // ============ PÁGINA 2: RESUMO FINANCEIRO ============
  doc.addPage();
  yPosition = margin;

  // Cabeçalho página 2
  doc.setFillColor(26, 54, 93);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO FINANCEIRO', margin, 18);

  yPosition = 40;

  // Totalizadores
  doc.setTextColor(COLORS.textPrimary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Consolidação Financeira', margin, yPosition);
  yPosition += 10;

  // Cálculos
  const totalMensal = contracts.reduce((sum, c) => sum + (c.mensal || 0), 0);
  const totalAnual = contracts.reduce((sum, c) => sum + (c.anual || 0), 0);
  const mediaPorContrato = contracts.length > 0 ? totalAnual / contracts.length : 0;

  // Tabela de resumo
  const summaryData = [
    ['Despesa Mensal Total', `R$ ${formatCurrency(totalMensal)}`],
    ['Despesa Anual Total', `R$ ${formatCurrency(totalAnual)}`],
    ['Média por Contrato (Anual)', `R$ ${formatCurrency(mediaPorContrato)}`],
    ['Contratos Ativos', metrics.ativos.toString()],
    ['Contratos Vencidos', metrics.vencidos.toString()],
    ['Contratos Vencendo em Breve', metrics.breve.toString()],
  ];

  (doc as any).autoTable({
    body: summaryData,
    startY: yPosition,
    margin: margin,
    theme: 'grid',
    bodyStyles: {
      fontSize: 10,
      textColor: [31, 41, 55],
      padding: 5,
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold', fillColor: [243, 244, 246] },
      1: { cellWidth: 70, fontStyle: 'bold', textColor: [37, 99, 235] },
    },
  });

  // Footer
  const totalPages = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(COLORS.textSecondary);
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  doc.save(`Relatorio_Contratos_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateEmployeesPDFProfessional = async (
  employees: any[],
  metrics: EmployeeMetrics
) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = (doc as any).internal.pageSize.getWidth();
  const pageHeight = (doc as any).internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // ============ CABEÇALHO ============
  doc.setFillColor(26, 54, 93);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(209, 213, 219);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('TRIBUNAL DE CONTAS DA UNIÃO', margin, 9);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE COLABORADORES', margin, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 213, 219);
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  doc.text(`Relatório gerencial • Gerado em ${dataAtual}`, margin, 27);

  yPosition = 45;

  // ============ MÉTRICAS ============
  doc.setTextColor(COLORS.textPrimary);
  
  drawMetricBox(doc, margin, yPosition, 35, 18, 'Total de Colaboradores', metrics.total.toString(), COLORS.accentPrimary);
  drawMetricBox(doc, margin + 40, yPosition, 35, 18, 'Funções', metrics.funcoes.toString(), COLORS.accentSecondary);
  drawMetricBox(doc, margin + 80, yPosition, 35, 18, 'SECs', metrics.secs.toString(), COLORS.accentPrimary);
  drawMetricBox(doc, margin + 120, yPosition, 35, 18, 'Postos', metrics.postos.toString(), COLORS.accentSecondary);

  yPosition += 28;

  // ============ TABELA DE COLABORADORES ============
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.textPrimary);
  doc.text('LISTA DE COLABORADORES', margin, yPosition);
  yPosition += 8;

  const tableData = employees.map(emp => [
    emp.nome?.substring(0, 40) || 'N/A',
    emp.sec || 'N/A',
    emp.funcao?.substring(0, 25) || 'N/A',
    emp.cpf || 'N/A',
  ]);

  (doc as any).autoTable({
    head: [['Nome', 'SEC', 'Função', 'CPF']],
    body: tableData,
    startY: yPosition,
    margin: margin,
    theme: 'grid',
    headStyles: {
      fillColor: [26, 54, 93],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      padding: 4,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [31, 41, 55],
      padding: 3,
    },
    alternateRowStyles: {
      fillColor: [243, 244, 246],
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 20 },
      2: { cellWidth: 60 },
      3: { cellWidth: 40 },
    },
  });

  // Footer
  const totalPages = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(COLORS.textSecondary);
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  doc.save(`Relatorio_Colaboradores_${new Date().toISOString().split('T')[0]}.pdf`);
};

// ============ FUNÇÕES AUXILIARES ============

function drawMetricBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  value: string,
  color: string
) {
  // Fundo
  doc.setFillColor(243, 244, 246);
  doc.rect(x, y, width, height, 'F');

  // Borda colorida no topo
  doc.setDrawColor(parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16));
  doc.setLineWidth(2);
  doc.line(x, y, x + width, y);

  // Label
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(label, x + 3, y + 6);

  // Value
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16));
  doc.text(value, x + 3, y + height - 4);
}

function drawAlertBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  color: string
) {
  // Fundo com cor clara
  const rgb = hexToRgb(color);
  doc.setFillColor(Math.min(rgb.r + 50, 255), Math.min(rgb.g + 50, 255), Math.min(rgb.b + 50, 255));
  doc.rect(x, y, width, height, 'F');

  // Borda
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(1.5);
  doc.rect(x, y, width, height);

  // Texto
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.text(text, x + 4, y + height / 2 + 2);
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}


// ============ FUNÇÃO GENÉRICA PARA RELATÓRIOS ============

export const generateGenericReportPDF = (
  title: string,
  metrics: Array<{ label: string; value: string | number }>,
  tableHeaders: string[],
  tableData: any[][],
  fileName: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
) => {
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = (doc as any).internal.pageSize.getWidth();
  const pageHeight = (doc as any).internal.pageSize.getHeight();
  const margin = 12;
  let yPosition = margin;

  // ============ CABEÇALHO ============
  doc.setFillColor(26, 54, 93);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(209, 213, 219);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('TRIBUNAL DE CONTAS DA UNIÃO', margin, 9);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), margin, 19);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 213, 219);
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  doc.text(`Relatório gerencial • Gerado em ${dataAtual}`, margin, 27);

  yPosition = 45;

  // ============ MÉTRICAS ============
  if (metrics && metrics.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.textPrimary);
    doc.text('MÉTRICAS PRINCIPAIS', margin, yPosition);
    yPosition += 8;

    const metricsData = metrics.map(m => [m.label, String(m.value)]);

    (doc as any).autoTable({
      body: metricsData,
      startY: yPosition,
      margin: margin,
      theme: 'grid',
      bodyStyles: {
        fontSize: 9,
        textColor: [31, 41, 55],
        padding: 4,
      },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: 'bold', fillColor: [243, 244, 246] },
        1: { cellWidth: orientation === 'portrait' ? 70 : 150, fontStyle: 'bold', textColor: [37, 99, 235] },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // ============ TABELA DE DADOS ============
  if (tableData && tableData.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.textPrimary);
    doc.text('DETALHES', margin, yPosition);
    yPosition += 8;

    (doc as any).autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: yPosition,
      margin: margin,
      theme: 'grid',
      headStyles: {
        fillColor: [26, 54, 93],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        padding: 4,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [31, 41, 55],
        padding: 3,
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246],
      },
    });
  }

  // ============ FOOTER ============
  const totalPages = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(COLORS.textSecondary);
    doc.text(
      `TRIBUNAL DE CONTAS DA UNIÃO • Documento gerencial • Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
};
