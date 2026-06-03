import jsPDF from 'jspdf';

// Cores do design do site
const COLORS = {
  primary: '#6b21a8', // Roxo TCU
  secondary: '#ec4899', // Rosa/Magenta
  accent: '#7e22ce', // Roxo para destaque
  success: '#16a34a', // Verde
  warning: '#f97316', // Laranja
  danger: '#dc2626', // Vermelho
  background: '#ffffff',
  text: '#0f172a', // Cinza muito escuro
  lightText: '#64748b', // Cinza médio
  lightBg: '#f8fafc', // Cinza muito claro
  border: '#cbd5e1', // Cinza para bordas
};

const GRADIENT_COLORS = {
  primary: ['#6b21a8', '#ec4899'], // Roxo para Rosa
  light: ['#f3e8ff', '#fce7f3'], // Roxo claro para Rosa claro
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
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // ============ PÁGINA 1: CAPA + RESUMO ============

  // Cabeçalho com gradiente
  doc.setFillColor(107, 33, 168); // Roxo
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE CONTRATOS', pageWidth / 2, 20, { align: 'center' });

  // Subtítulo
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Gestão e Análise de Contratos Vigentes', pageWidth / 2, 35, { align: 'center' });

  yPosition = 65;

  // Métricas em cards
  doc.setTextColor(COLORS.text);
  const metricBoxWidth = (contentWidth - 9) / 4; // 3 gaps de 3mm
  const metricBoxHeight = 28;
  const metricsData = [
    { label: 'Total de Contratos', value: metrics.total.toString(), icon: '📋' },
    { label: 'Despesa Mensal', value: `R$ ${(metrics.mensal || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, icon: '💰' },
    { label: 'Despesa Anual', value: `R$ ${(metrics.anual || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, icon: '📊' },
    { label: 'Contratos Ativos', value: metrics.ativos.toString(), icon: '✅' },
  ];

  metricsData.forEach((metric, index) => {
    const xPos = margin + index * (metricBoxWidth + 3);

    // Fundo do card
    doc.setFillColor(243, 232, 255); // Roxo muito claro
    doc.rect(xPos, yPosition, metricBoxWidth, metricBoxHeight, 'F');

    // Borda esquerda colorida
    doc.setDrawColor(124, 58, 237); // Roxo
    doc.setLineWidth(1.5);
    doc.line(xPos, yPosition, xPos, yPosition + metricBoxHeight);

    // Label
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 102, 102);
    doc.text(metric.label, xPos + 2, yPosition + 7);

    // Valor
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237); // Roxo
    doc.text(metric.value, xPos + 2, yPosition + 18);
  });

  yPosition += metricBoxHeight + 12;

  // Alertas
  if (metrics.vencidos > 0) {
    doc.setFillColor(254, 226, 226); // Vermelho claro
    doc.rect(margin, yPosition, contentWidth, 15, 'F');

    doc.setDrawColor(220, 38, 38); // Vermelho
    doc.setLineWidth(1);
    doc.line(margin, yPosition, margin, yPosition + 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text(`⚠️ ${metrics.vencidos} Contrato(s) Vencido(s)`, margin + 2, yPosition + 6);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(127, 29, 29);
    doc.text('Ação imediata recomendada', margin + 2, yPosition + 11);

    yPosition += 18;
  }

  if (metrics.breve > 0) {
    doc.setFillColor(254, 243, 199); // Amarelo claro
    doc.rect(margin, yPosition, contentWidth, 15, 'F');

    doc.setDrawColor(249, 115, 22); // Laranja
    doc.setLineWidth(1);
    doc.line(margin, yPosition, margin, yPosition + 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(249, 115, 22);
    doc.text(`⏰ ${metrics.breve} Contrato(s) Vencendo em Breve`, margin + 2, yPosition + 6);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(146, 64, 14);
    doc.text('Contratos vencendo em até 30 dias', margin + 2, yPosition + 11);

    yPosition += 18;
  }

  yPosition += 5;

  // Título da tabela
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text('Contratos (Parte 1 de 2)', margin, yPosition);

  yPosition += 8;

  // Tabela - Página 1 (20 contratos)
  const contractsPerPage = 20;
  const page1Contracts = contracts.slice(0, contractsPerPage);

  drawContractsTable(doc, page1Contracts, margin, yPosition, contentWidth, pageHeight - margin - 10);

  // Footer página 1
  doc.setFontSize(8);
  doc.setTextColor(153, 153, 153);
  doc.text(
    `Gerado em ${new Date().toLocaleDateString('pt-BR')} | Página 1 de 2`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  // ============ PÁGINA 2: CONTINUAÇÃO ============
  doc.addPage();
  yPosition = margin;

  // Título da tabela
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text('Contratos (Parte 2 de 2)', margin, yPosition);

  yPosition += 8;

  // Tabela - Página 2 (contratos restantes)
  const page2Contracts = contracts.slice(contractsPerPage);

  drawContractsTable(doc, page2Contracts, margin, yPosition, contentWidth, pageHeight - margin - 40);

  // Totalizadores
  yPosition = pageHeight - 35;

  doc.setFillColor(248, 250, 252); // Cinza muito claro
  doc.rect(margin, yPosition, contentWidth, 25, 'F');

  doc.setDrawColor(203, 213, 225); // Cinza para bordas
  doc.setLineWidth(0.5);
  doc.rect(margin, yPosition, contentWidth, 25);

  const summaryBoxWidth = (contentWidth - 6) / 3;

  // Total Mensal
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 102, 102);
  doc.text('Total Mensal', margin + 2, yPosition + 6);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text(`R$ ${(metrics.mensal || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, margin + 2, yPosition + 16);

  // Total Anual
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 102, 102);
  doc.text('Total Anual', margin + summaryBoxWidth + 2, yPosition + 6);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text(`R$ ${(metrics.anual || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, margin + summaryBoxWidth + 2, yPosition + 16);

  // Contratos Ativos
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 102, 102);
  doc.text('Contratos Ativos', margin + summaryBoxWidth * 2 + 2, yPosition + 6);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 163, 74); // Verde
  doc.text(metrics.ativos.toString(), margin + summaryBoxWidth * 2 + 2, yPosition + 16);

  // Footer página 2
  doc.setFontSize(8);
  doc.setTextColor(153, 153, 153);
  doc.text(
    `Gerado em ${new Date().toLocaleDateString('pt-BR')} | Página 2 de 2`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  // Salvar PDF
  doc.save(`Relatorio_Contratos_${new Date().toISOString().split('T')[0]}.pdf`);
};

function drawContractsTable(
  doc: jsPDF,
  contracts: any[],
  xStart: number,
  yStart: number,
  width: number,
  maxHeight: number
) {
  const pageHeight = (doc as any).internal.pageSize.getHeight();
  const margin = 15;
  const tableHeight = pageHeight - margin - 40;
  const rowHeight = 5;
  const headerHeight = 7;

  let yPosition = yStart;

  // Cabeçalho da tabela
  const columns = ['Contrato', 'Fornecedor', 'SEC', 'Vencimento', 'Status', 'Valor Mensal', 'Valor Anual'];
  const columnWidths = [22, 32, 13, 16, 15, 22, 22];

  // Fundo do cabeçalho com gradiente (simulado com cor sólida)
  doc.setFillColor(124, 58, 237); // Roxo
  doc.rect(xStart, yPosition, width, headerHeight, 'F');

  // Texto do cabeçalho
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);

  let xPos = xStart;
  columns.forEach((col, index) => {
    doc.text(col, xPos + 1, yPosition + 5);
    xPos += columnWidths[index];
  });

  yPosition += headerHeight + 1;

  // Linhas da tabela
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');

  contracts.forEach((contract, rowIndex) => {
    // Alternância de cores
    if (rowIndex % 2 === 0) {
      doc.setFillColor(249, 250, 251); // Cinza muito claro
      doc.rect(xStart, yPosition, width, rowHeight, 'F');
    }

    doc.setTextColor(COLORS.text);

    // Contrato
    xPos = xStart;
    doc.text(contract.contrato?.substring(0, 12) || '', xPos + 1, yPosition + 3.5);
    xPos += columnWidths[0];

    // Fornecedor
    doc.text(contract.fornecedor?.substring(0, 20) || '', xPos + 1, yPosition + 3.5);
    xPos += columnWidths[1];

    // SEC
    doc.text(contract.sec || '', xPos + 1, yPosition + 3.5);
    xPos += columnWidths[2];

    // Vencimento
    doc.text(contract.dataVencimento || '', xPos + 1, yPosition + 3.5);
    xPos += columnWidths[3];

    // Status
    if (contract.diasParaVencimento < 0) {
      doc.setTextColor(220, 38, 38); // Vermelho
      doc.text('Vencido', xPos + 1, yPosition + 3.5);
    } else if (contract.diasParaVencimento <= 30) {
      doc.setTextColor(249, 115, 22); // Laranja
      doc.text(`${contract.diasParaVencimento}d`, xPos + 1, yPosition + 3.5);
    } else {
      doc.setTextColor(22, 163, 74); // Verde
      doc.text('Ativo', xPos + 1, yPosition + 3.5);
    }
    xPos += columnWidths[4];

    // Valor Mensal
    doc.setTextColor(COLORS.text);
    doc.text(
      `R$ ${(contract.mensal || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`,
      xPos + 1,
      yPosition + 3.5
    );
    xPos += columnWidths[5];

    // Valor Anual
    doc.text(
      `R$ ${(contract.anual || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`,
      xPos + 1,
      yPosition + 3.5
    );

    yPosition += rowHeight;

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 50) {
      return;
    }
  });

  // Linha de separação
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(xStart, yPosition + 1, xStart + width, yPosition + 1);
}

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

  // Cabeçalho com gradiente
  doc.setFillColor(107, 33, 168); // Roxo
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE COLABORADORES', pageWidth / 2, 18, { align: 'center' });

  // Subtítulo
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Lista Completa de Colaboradores', pageWidth / 2, 32, { align: 'center' });

  yPosition = 55;

  // Métricas em cards
  doc.setTextColor(COLORS.text);
  const metricBoxWidth = (contentWidth - 9) / 4;
  const metricBoxHeight = 24;
  const metricsData = [
    { label: 'Total de Colaboradores', value: metrics.total.toString(), icon: '👥' },
    { label: 'Funções', value: metrics.funcoes.toString(), icon: '💼' },
    { label: 'SECs', value: metrics.secs.toString(), icon: '🏢' },
    { label: 'Postos', value: metrics.postos.toString(), icon: '📍' },
  ];

  metricsData.forEach((metric, index) => {
    const xPos = margin + index * (metricBoxWidth + 3);

    // Fundo do card
    doc.setFillColor(243, 232, 255); // Roxo muito claro
    doc.rect(xPos, yPosition, metricBoxWidth, metricBoxHeight, 'F');

    // Borda esquerda colorida
    doc.setDrawColor(124, 58, 237); // Roxo
    doc.setLineWidth(1.5);
    doc.line(xPos, yPosition, xPos, yPosition + metricBoxHeight);

    // Label
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 102, 102);
    doc.text(metric.label, xPos + 2, yPosition + 6);

    // Valor
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237); // Roxo
    doc.text(metric.value, xPos + 2, yPosition + 16);
  });

  yPosition += metricBoxHeight + 10;

  // Título da tabela
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text('Colaboradores', margin, yPosition);

  yPosition += 7;

  // Tabela de colaboradores
  drawEmployeesTable(doc, employees, margin, yPosition, contentWidth, pageHeight - margin - 10);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(153, 153, 153);
  doc.text(
    `Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  // Salvar PDF
  doc.save(`Relatorio_Colaboradores_${new Date().toISOString().split('T')[0]}.pdf`);
};

function drawEmployeesTable(
  doc: jsPDF,
  employees: any[],
  xStart: number,
  yStart: number,
  width: number,
  maxHeight: number
) {
  const pageHeight = (doc as any).internal.pageSize.getHeight();
  const rowHeight = 6.5;
  const headerHeight = 8;

  let yPosition = yStart;

  // Cabeçalho da tabela
  const columns = ['Nome', 'SEC', 'Função', 'CPF'];
  const columnWidths = [65, 22, 45, 40];

  // Fundo do cabeçalho
  doc.setFillColor(124, 58, 237); // Roxo
  doc.rect(xStart, yPosition, width, headerHeight, 'F');

  // Texto do cabeçalho
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);

  let xPos = xStart;
  columns.forEach((col, index) => {
    doc.text(col, xPos + 2, yPosition + 5.5);
    xPos += columnWidths[index];
  });

  yPosition += headerHeight + 0.5;

  // Linhas da tabela
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  employees.forEach((employee, rowIndex) => {
    // Alternância de cores
    if (rowIndex % 2 === 0) {
      doc.setFillColor(249, 250, 251); // Cinza muito claro
      doc.rect(xStart, yPosition, width, rowHeight, 'F');
    }

    // Borda inferior
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(xStart, yPosition + rowHeight, xStart + width, yPosition + rowHeight);

    doc.setTextColor(COLORS.text);

    // Nome
    xPos = xStart;
    doc.text(employee.nome?.substring(0, 40) || '', xPos + 2, yPosition + 4);
    xPos += columnWidths[0];

    // SEC
    doc.text(employee.sec || '', xPos + 2, yPosition + 4);
    xPos += columnWidths[1];

    // Função
    doc.text(employee.funcao?.substring(0, 28) || '', xPos + 2, yPosition + 4);
    xPos += columnWidths[2];

    // CPF
    doc.text(employee.cpf || '', xPos + 2, yPosition + 4);

    yPosition += rowHeight;

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 15) {
      doc.addPage();
      yPosition = 12;

      // Repetir cabeçalho em nova página
      doc.setFillColor(124, 58, 237);
      doc.rect(xStart, yPosition, width, headerHeight, 'F');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);

      xPos = xStart;
      columns.forEach((col) => {
        doc.text(col, xPos + 2, yPosition + 5.5);
        xPos += columnWidths[columns.indexOf(col)];
      });

      yPosition += headerHeight + 0.5;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
    }
  });

  // Linha de separação
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(xStart, yPosition + 1, xStart + width, yPosition + 1);
}
