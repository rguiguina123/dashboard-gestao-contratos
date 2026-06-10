import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Cores do design minimalista e elegante
const COLORS = {
  primary: '#1f2937', // Cinza escuro
  secondary: '#6b7280', // Cinza médio
  accent: '#3b82f6', // Azul sutil
  success: '#10b981', // Verde
  warning: '#f59e0b', // Laranja
  danger: '#ef4444', // Vermelho
  background: '#ffffff',
  text: '#111827', // Preto suave
  lightText: '#6b7280', // Cinza médio
  lightBg: '#f9fafb', // Cinza muito claro
  border: '#e5e7eb', // Cinza para bordas
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

  // ============ PÁGINA 1: CABEÇALHO + RESUMO ============

  // Cabeçalho minimalista
  doc.setFillColor(31, 41, 55); // Cinza escuro
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE CONTRATOS', margin, 15);

  // Subtítulo
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 213, 219);
  doc.text('Gestão e Análise de Contratos Vigentes', margin, 25);

  yPosition = 50;

  // Métricas em cards minimalistas
  doc.setTextColor(COLORS.text);
  const metricBoxWidth = (contentWidth - 6) / 2; // 2 colunas
  const metricBoxHeight = 22;
  const metricsData = [
    { label: 'Total de Contratos', value: metrics.total.toString() },
    { label: 'Despesa Mensal', value: `R$ ${(metrics.mensal || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}` },
    { label: 'Despesa Anual', value: `R$ ${(metrics.anual || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}` },
    { label: 'Contratos Ativos', value: metrics.ativos.toString() },
  ];

  metricsData.forEach((metric, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const xPos = margin + col * (metricBoxWidth + 3);
    const yPos = yPosition + row * (metricBoxHeight + 3);

    // Fundo do card - muito sutil
    doc.setFillColor(249, 250, 251); // Cinza muito claro
    doc.rect(xPos, yPos, metricBoxWidth, metricBoxHeight, 'F');

    // Borda sutil
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.rect(xPos, yPos, metricBoxWidth, metricBoxHeight);

    // Label
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(metric.label, xPos + 3, yPos + 6);

    // Valor
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(metric.value, xPos + 3, yPos + 16);
  });

  yPosition += 50;

  // Alertas minimalistas
  if (metrics.vencidos > 0) {
    doc.setFillColor(254, 242, 242); // Vermelho muito claro
    doc.rect(margin, yPosition, contentWidth, 12, 'F');

    doc.setDrawColor(239, 68, 68);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPosition, contentWidth, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68);
    doc.text(`${metrics.vencidos} Contrato(s) Vencido(s) - Ação Imediata Recomendada`, margin + 3, yPosition + 8);

    yPosition += 15;
  }

  if (metrics.breve > 0) {
    doc.setFillColor(254, 252, 232); // Laranja muito claro
    doc.rect(margin, yPosition, contentWidth, 12, 'F');

    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPosition, contentWidth, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(217, 119, 6);
    doc.text(`${metrics.breve} Contrato(s) Vencendo em Breve (até 30 dias)`, margin + 3, yPosition + 8);

    yPosition += 15;
  }

  yPosition += 8;

  // Título da tabela
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.text);
  doc.text('Contratos (Parte 1 de 2)', margin, yPosition);

  yPosition += 7;

  // Tabela - Página 1 (20 contratos)
  const contractsPerPage = 20;
  const page1Contracts = contracts.slice(0, contractsPerPage);

  drawContractsTable(doc, page1Contracts, margin, yPosition, contentWidth, pageHeight - margin - 15);

  // Footer página 1
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
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
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.text);
  doc.text('Contratos (Parte 2 de 2)', margin, yPosition);

  yPosition += 7;

  // Tabela - Página 2 (contratos restantes)
  const page2Contracts = contracts.slice(contractsPerPage);

  drawContractsTable(doc, page2Contracts, margin, yPosition, contentWidth, pageHeight - margin - 40);

  // Totalizadores minimalistas
  yPosition = pageHeight - 32;

  doc.setFillColor(249, 250, 251); // Cinza muito claro
  doc.rect(margin, yPosition, contentWidth, 22, 'F');

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPosition, contentWidth, 22);

  const summaryBoxWidth = (contentWidth - 6) / 3;

  // Total Mensal
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Total Mensal', margin + 2, yPosition + 5);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(`R$ ${(metrics.mensal || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, margin + 2, yPosition + 14);

  // Total Anual
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Total Anual', margin + summaryBoxWidth + 2, yPosition + 5);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(`R$ ${(metrics.anual || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, margin + summaryBoxWidth + 2, yPosition + 14);

  // Contratos Ativos
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Contratos Ativos', margin + summaryBoxWidth * 2 + 2, yPosition + 5);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(metrics.ativos.toString(), margin + summaryBoxWidth * 2 + 2, yPosition + 14);

  // Footer página 2
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(
    `Gerado em ${new Date().toLocaleDateString('pt-BR')} | Página 2 de 2`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  // Download
  doc.save(`Relatorio_Contratos_${new Date().toLocaleDateString('pt-BR')}.pdf`);
};

function drawContractsTable(
  doc: jsPDF,
  contracts: any[],
  margin: number,
  startY: number,
  contentWidth: number,
  maxHeight: number
) {
  const pageWidth = (doc as any).internal.pageSize.getWidth();
  const pageHeight = (doc as any).internal.pageSize.getHeight();

  const columns = [
    { header: 'Contrato', width: 22 },
    { header: 'Fornecedor', width: 42 },
    { header: 'SEC', width: 10 },
    { header: 'Vencimento', width: 16 },
    { header: 'V. Mensal', width: 18 },
    { header: 'V. Anual', width: 18 },
  ];

  let yPosition = startY;
  const rowHeight = 6;
  const headerHeight = 7;

  // Cabeçalho da tabela
  doc.setFillColor(249, 250, 251); // Cinza muito claro
  doc.rect(margin, yPosition, contentWidth, headerHeight, 'F');

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPosition, contentWidth, headerHeight);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);

  let xPos = margin + 1;
  columns.forEach((col) => {
    doc.text(col.header, xPos, yPosition + 5);
    xPos += col.width;
  });

  yPosition += headerHeight;

  // Linhas da tabela
  contracts.forEach((contract, index) => {
    // Verificar se precisa de nova página
    if (yPosition + rowHeight > pageHeight - 15) {
      return;
    }

    // Cor alternada das linhas
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(249, 250, 251);
    }

    doc.rect(margin, yPosition, contentWidth, rowHeight, 'F');

    // Borda
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPosition, contentWidth, rowHeight);

    // Texto
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);

    xPos = margin + 1;

    // Contrato (abreviado)
    const contrato = (contract.contrato || '').substring(0, 16);
    doc.text(contrato, xPos + 1, yPosition + 4);
    xPos += columns[0].width;

    // Fornecedor (abreviado)
    const fornecedor = (contract.fornecedor || '').substring(0, 30);
    doc.text(fornecedor, xPos + 1, yPosition + 4);
    xPos += columns[1].width;

    // SEC (sem espaços)
    const sec = (contract.sec || '').replace('SEC-', '');
    doc.text(sec, xPos + 1, yPosition + 4);
    xPos += columns[2].width;

    // Vencimento (formato curto)
    const vencData = contract.dataVencimento ? contract.dataVencimento.substring(0, 5) : '';
    doc.text(vencData, xPos + 1, yPosition + 4);
    xPos += columns[3].width;

    // Valor Mensal (formato compacto)
    const valorMensal = contract.mensal ? `${(contract.mensal / 1000).toFixed(0)}k` : '-';
    doc.text(valorMensal, xPos + 1, yPosition + 4, { align: 'right' });
    xPos += columns[4].width;

    // Valor Anual (formato compacto)
    const valorAnual = contract.anual ? `${(contract.anual / 1000).toFixed(0)}k` : '-';
    doc.text(valorAnual, xPos + 1, yPosition + 4, { align: 'right' });

    yPosition += rowHeight;
  });
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
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Cabeçalho minimalista
  doc.setFillColor(31, 41, 55); // Cinza escuro
  doc.rect(0, 0, pageWidth, 30, 'F');

  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE COLABORADORES', margin, 12);

  // Subtítulo
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 213, 219);
  doc.text('Gestão de Colaboradores e Distribuição por SEC', margin, 22);

  yPosition = 40;

  // Métricas em cards minimalistas
  doc.setTextColor(COLORS.text);
  const metricBoxWidth = (contentWidth - 9) / 4;
  const metricBoxHeight = 18;
  const metricsData = [
    { label: 'Total de Colaboradores', value: metrics.total.toString() },
    { label: 'Funções Diferentes', value: metrics.funcoes.toString() },
    { label: 'SECs Atendidas', value: metrics.secs.toString() },
    { label: 'Postos', value: metrics.postos.toString() },
  ];

  metricsData.forEach((metric, index) => {
    const xPos = margin + index * (metricBoxWidth + 3);

    // Fundo do card
    doc.setFillColor(249, 250, 251);
    doc.rect(xPos, yPosition, metricBoxWidth, metricBoxHeight, 'F');

    // Borda
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.rect(xPos, yPosition, metricBoxWidth, metricBoxHeight);

    // Label
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(metric.label, xPos + 2, yPosition + 5);

    // Valor
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(metric.value, xPos + 2, yPosition + 14);
  });

  yPosition += 25;

  // Tabela de colaboradores
  const columns = [
    { header: 'Nome', width: 65 },
    { header: 'SEC', width: 22 },
    { header: 'Função', width: 45 },
    { header: 'CPF', width: 40 },
  ];

  const rowHeight = 6.5;
  const headerHeight = 7;

  // Cabeçalho da tabela
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, yPosition, contentWidth, headerHeight, 'F');

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPosition, contentWidth, headerHeight);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);

  let xPos = margin + 1;
  columns.forEach((col) => {
    doc.text(col.header, xPos, yPosition + 5);
    xPos += col.width;
  });

  yPosition += headerHeight;

  // Linhas da tabela
  employees.forEach((employee, index) => {
    // Verificar se precisa de nova página
    if (yPosition + rowHeight > pageHeight - 10) {
      doc.addPage();
      yPosition = margin;
    }

    // Cor alternada
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(249, 250, 251);
    }

    doc.rect(margin, yPosition, contentWidth, rowHeight, 'F');

    // Borda
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPosition, contentWidth, rowHeight);

    // Texto
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);

    xPos = margin + 1;

    // Nome
    doc.text(employee.nome || '', xPos, yPosition + 4);
    xPos += columns[0].width;

    // SEC
    doc.text(employee.sec || '', xPos, yPosition + 4);
    xPos += columns[1].width;

    // Função
    const funcao = (employee.funcao || '').substring(0, 30);
    doc.text(funcao, xPos, yPosition + 4);
    xPos += columns[2].width;

    // CPF
    doc.text(employee.cpf || '', xPos, yPosition + 4);

    yPosition += rowHeight;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(
    `Gerado em ${new Date().toLocaleDateString('pt-BR')}`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  // Download
  doc.save(`Relatorio_Colaboradores_${new Date().toLocaleDateString('pt-BR')}.pdf`);
};
