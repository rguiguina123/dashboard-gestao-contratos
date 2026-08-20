import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Paleta institucional TCU
const COLORS = {
  headerBg: '#003f5f',
  headerText: '#ffffff',
  accentPrimary: '#087fa3',
  accentSecondary: '#89ad45',
  textPrimary: '#003047',
  textSecondary: '#547182',
  success: '#55752c',
  warning: '#b6873c',
  danger: '#b42318',
  lightBg: '#f4f5f2',
  border: '#c9dde6',
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

type ChartDatum = { label: string; value: number };
type MonthlyTrend = { labels: string[]; values: number[]; measureLabel: string; variation: number };

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
    drawAlertBox(doc, margin, yPosition, contentWidth, 12, `ATENÇÃO: ${metrics.vencidos} contrato(s) VENCIDO(S)`, COLORS.danger);
    yPosition += 16;
  }

  // Box de contratos vencendo
  if (metrics.breve > 0) {
    drawAlertBox(doc, margin, yPosition, contentWidth, 12, `PRAZO: ${metrics.breve} contrato(s) vencendo em breve (até 30 dias)`, COLORS.warning);
    yPosition += 16;
  }

  // Box de contratos ativos
  drawAlertBox(doc, margin, yPosition, contentWidth, 12, `SITUAÇÃO: ${metrics.ativos} contrato(s) ATIVO(S)`, COLORS.success);
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

  autoTable(doc, {
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
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [31, 41, 55],
      cellPadding: 3,
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

  autoTable(doc, {
    body: summaryData,
    startY: yPosition,
    margin: margin,
    theme: 'grid',
    bodyStyles: {
      fontSize: 10,
      textColor: [31, 41, 55],
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold', fillColor: [243, 244, 246] },
      1: { cellWidth: 70, fontStyle: 'bold', textColor: [37, 99, 235] },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 12;
  const fornecedores = buildDistribution(contracts, 'fornecedor', 'anual').slice(0, 5);
  if (fornecedores.length > 0 && yPosition < pageHeight - 78) {
    drawSectionTitle(doc, margin, yPosition, 'CONCENTRAÇÃO POR FORNECEDOR');
    yPosition += 7;
    drawHorizontalBarChart(doc, margin, yPosition, contentWidth, 58, fornecedores, 'Despesa anual', COLORS.accentPrimary);
  }

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

  const funcoes = buildDistribution(employees, 'funcao').slice(0, 5);
  if (funcoes.length > 0) {
    drawSectionTitle(doc, margin, yPosition, 'DISTRIBUIÇÃO POR FUNÇÃO');
    yPosition += 7;
    drawHorizontalBarChart(doc, margin, yPosition, 120, 52, funcoes, 'Colaboradores', COLORS.accentSecondary);
    const principalFuncao = funcoes[0];
    drawInsightNote(doc, 145, yPosition, contentWidth - 145, 52, 'DESTAQUE OPERACIONAL', principalFuncao ? `${principalFuncao.label}: ${principalFuncao.value} colaboradores` : 'Sem dados para análise');
    yPosition += 62;
  }

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

  autoTable(doc, {
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
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [31, 41, 55],
      cellPadding: 3,
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

function drawSectionTitle(doc: jsPDF, x: number, y: number, title: string) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 63, 95);
  doc.text(title, x, y);
  doc.setDrawColor(137, 173, 69);
  doc.setLineWidth(0.8);
  doc.line(x, y + 2.5, x + 38, y + 2.5);
}

function drawReportHeader(doc: jsPDF, pageWidth: number, margin: number, title: string, subtitle: string) {
  doc.setFillColor(0, 63, 95);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(title, margin, 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(194, 230, 240);
  doc.setFontSize(8);
  doc.text(subtitle, margin, 27);
}

function drawHorizontalBarChart(doc: jsPDF, x: number, y: number, width: number, height: number, series: ChartDatum[], measure: string, color: string) {
  const max = Math.max(...series.map((item) => item.value), 1);
  const rowHeight = height / Math.max(series.length, 1);
  const labelWidth = Math.min(width * 0.34, 58);
  const valueWidth = 27;
  const barWidth = width - labelWidth - valueWidth - 8;
  const rgb = hexToRgb(color);

  series.forEach((item, index) => {
    const rowY = y + index * rowHeight;
    const barY = rowY + 4;
    const label = item.label.length > 27 ? `${item.label.slice(0, 26)}…` : item.label;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(48, 71, 85);
    doc.text(label, x, barY + 3.2);
    doc.setFillColor(226, 237, 240);
    doc.roundedRect(x + labelWidth, barY, barWidth, 5, 1.5, 1.5, 'F');
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.roundedRect(x + labelWidth, barY, Math.max(2, barWidth * item.value / max), 5, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 63, 95);
    doc.text(formatChartValue(item.value, measure), x + labelWidth + barWidth + 4, barY + 3.2);
  });
}

function drawMonthlyTrendChart(doc: jsPDF, x: number, y: number, width: number, height: number, trend: MonthlyTrend) {
  const left = x + 20;
  const top = y + 7;
  const chartWidth = width - 26;
  const chartHeight = height - 24;
  const max = Math.max(...trend.values, 1);
  const min = Math.min(...trend.values, 0);
  const range = Math.max(max - min, max * 0.12, 1);

  doc.setFillColor(244, 245, 242);
  doc.roundedRect(x, y, width, height, 2, 2, 'F');
  [0, 0.5, 1].forEach((step) => {
    const lineY = top + chartHeight * step;
    doc.setDrawColor(201, 221, 230);
    doc.setLineWidth(0.3);
    doc.line(left, lineY, left + chartWidth, lineY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(84, 113, 130);
    doc.text(formatChartValue(max - range * step, trend.measureLabel), x + 1, lineY + 2);
  });

  const points = trend.values.map((value, index) => ({
    x: left + (trend.values.length === 1 ? chartWidth / 2 : chartWidth * index / (trend.values.length - 1)),
    y: top + ((max - value) / range) * chartHeight,
  }));
  doc.setDrawColor(8, 127, 163);
  doc.setLineWidth(1.4);
  points.slice(1).forEach((point, index) => doc.line(points[index].x, points[index].y, point.x, point.y));
  points.forEach((point, index) => {
    doc.setFillColor(137, 173, 69);
    doc.circle(point.x, point.y, 1.9, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(0, 63, 95);
    doc.text(trend.labels[index], point.x, y + height - 5, { align: 'center' });
  });
}

function drawInsightNote(doc: jsPDF, x: number, y: number, width: number, height: number, label: string, text: string) {
  doc.setFillColor(244, 245, 242);
  doc.setDrawColor(201, 221, 230);
  doc.roundedRect(x, y, width, height, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(8, 127, 163);
  doc.setFontSize(7.5);
  doc.text(label, x + 4, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 48, 71);
  doc.setFontSize(8.5);
  doc.text(doc.splitTextToSize(text, width - 8).slice(0, 3), x + 4, y + 14);
}

function buildDistribution(rows: any[], labelKey: string, valueKey?: string): ChartDatum[] {
  const totals = new Map<string, number>();
  rows.forEach((row) => {
    const label = String(row?.[labelKey] || 'Não informado');
    const value = valueKey ? Number(row?.[valueKey] || 0) : 1;
    totals.set(label, (totals.get(label) || 0) + (Number.isFinite(value) ? value : 0));
  });
  return Array.from(totals.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value);
}

function formatChartValue(value: number, measure: string): string {
  const formatted = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
  if (/R\$|custo|valor|despesa|mensal|anual|total/i.test(measure)) return `R$ ${formatted}`;
  if (/%/.test(measure)) return `${formatted}%`;
  return formatted;
}

function parsePdfNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const raw = String(value ?? '').replace(/R\$|\s|%/g, '').trim();
  if (!raw) return null;
  const normalized = raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw.replace(/,/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildGenericAnalytics(headers: string[], rows: any[][]) {
  const candidates = headers
    .map((header, index) => ({ header, index, values: rows.map((row) => parsePdfNumber(row[index])).filter((value): value is number => value !== null) }))
    .filter((candidate) => candidate.values.length >= Math.max(1, Math.ceil(rows.length * 0.6)))
    .sort((left, right) => right.values.reduce((sum, value) => sum + Math.abs(value), 0) - left.values.reduce((sum, value) => sum + Math.abs(value), 0));
  const selected = candidates[0] || { header: 'Valor', index: 1, values: [] as number[] };
  const series = rows
    .map((row) => ({ label: getCategoryLabel(row, selected.index), value: parsePdfNumber(row[selected.index]) ?? 0 }))
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value)
    .slice(0, 5);
  const total = selected.values.reduce((sum, value) => sum + value, 0);
  const average = selected.values.length ? total / selected.values.length : 0;
  const top = series[0];
  return {
    series,
    measureLabel: selected.header,
    maxValueLabel: top ? formatChartValue(top.value, selected.header) : '—',
    averageValueLabel: formatChartValue(average, selected.header),
    insight: top ? `${top.label} representa o maior valor observado em ${selected.header}, com ${formatChartValue(top.value, selected.header)}.` : 'Não há valores numéricos suficientes para compor o gráfico de resumo.',
  };
}

export function buildMonthlyTrend(headers: string[], rows: any[][]): MonthlyTrend | null {
  if (!/m[eê]s/i.test(headers[0] || '') || rows.length < 2) return null;
  const numericColumns = headers
    .map((header, index) => ({ header, index, values: rows.map((row) => parsePdfNumber(row[index])).filter((value): value is number => value !== null) }))
    .filter((candidate) => candidate.values.length === rows.length)
    .sort((left, right) => right.values.reduce((sum, value) => sum + Math.abs(value), 0) - left.values.reduce((sum, value) => sum + Math.abs(value), 0));
  const selected = numericColumns[0];
  if (!selected) return null;
  const values = rows.map((row) => parsePdfNumber(row[selected.index]) ?? 0);
  const first = values[0] || 0;
  const last = values[values.length - 1] || 0;
  return {
    labels: rows.map((row) => String(row[0] ?? '—')),
    values,
    measureLabel: selected.header,
    variation: first === 0 ? 0 : ((last - first) / first) * 100,
  };
}

function getCategoryLabel(row: any[], metricIndex: number): string {
  const category = row.find((value, index) => index !== metricIndex && parsePdfNumber(value) === null);
  return String(category ?? row[0] ?? 'Registro');
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

    const metricsData = metrics.map(m => [m.label, String(m.value).replace(/^(R\$\s*){2}/, 'R$ ')]);

    autoTable(doc, {
      body: metricsData,
      startY: yPosition,
      margin: margin,
      theme: 'grid',
      bodyStyles: {
        fontSize: 9,
        textColor: [31, 41, 55],
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: 'bold', fillColor: [243, 244, 246] },
        1: { cellWidth: orientation === 'portrait' ? 70 : 150, fontStyle: 'bold', textColor: [37, 99, 235] },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // ============ TENDÊNCIA MENSAL ==========
  const monthlyTrend = buildMonthlyTrend(tableHeaders, tableData);
  if (monthlyTrend) {
    doc.addPage();
    drawReportHeader(doc, pageWidth, margin, 'TENDÊNCIA MENSAL', `Evolução de ${monthlyTrend.measureLabel.toLowerCase()} no período exportado`);
    yPosition = 45;
    const firstValue = monthlyTrend.values[0];
    const lastValue = monthlyTrend.values[monthlyTrend.values.length - 1];
    drawMetricBox(doc, margin, yPosition, 52, 20, `Início (${monthlyTrend.labels[0]})`, formatChartValue(firstValue, monthlyTrend.measureLabel), COLORS.accentPrimary);
    drawMetricBox(doc, margin + 58, yPosition, 52, 20, `Final (${monthlyTrend.labels[monthlyTrend.labels.length - 1]})`, formatChartValue(lastValue, monthlyTrend.measureLabel), COLORS.accentSecondary);
    drawMetricBox(doc, margin + 116, yPosition, 52, 20, 'Variação no período', `${monthlyTrend.variation >= 0 ? '+' : ''}${monthlyTrend.variation.toFixed(1)}%`, monthlyTrend.variation >= 0 ? COLORS.accentSecondary : COLORS.danger);
    yPosition += 32;
    drawSectionTitle(doc, margin, yPosition, `EVOLUÇÃO DE ${monthlyTrend.measureLabel.toUpperCase()}`);
    yPosition += 7;
    drawMonthlyTrendChart(doc, margin, yPosition, pageWidth - 2 * margin, 86, monthlyTrend);
    yPosition += 96;
    const direction = monthlyTrend.variation >= 0 ? 'crescimento' : 'redução';
    drawInsightNote(doc, margin, yPosition, pageWidth - 2 * margin, 29, 'LEITURA TEMPORAL', `O período encerra em ${monthlyTrend.labels[monthlyTrend.labels.length - 1]} com ${formatChartValue(lastValue, monthlyTrend.measureLabel)}, representando ${direction} de ${Math.abs(monthlyTrend.variation).toFixed(1)}% frente ao início da série.`);
  }

  // ============ ANÁLISE EXECUTIVA ==========
  const analytics = buildGenericAnalytics(tableHeaders, tableData);
  if (analytics.series.length > 0) {
    doc.addPage();
    drawReportHeader(doc, pageWidth, margin, 'ANÁLISE EXECUTIVA', 'Síntese estatística dos dados exportados');
    yPosition = 45;
    drawMetricBox(doc, margin, yPosition, 52, 20, 'Registros analisados', String(tableData.length), COLORS.accentPrimary);
    drawMetricBox(doc, margin + 58, yPosition, 52, 20, `Maior ${analytics.measureLabel}`, analytics.maxValueLabel, COLORS.accentSecondary);
    drawMetricBox(doc, margin + 116, yPosition, 52, 20, `Média ${analytics.measureLabel}`, analytics.averageValueLabel, COLORS.warning);
    yPosition += 31;
    drawSectionTitle(doc, margin, yPosition, `TOP 5 POR ${analytics.measureLabel.toUpperCase()}`);
    yPosition += 7;
    drawHorizontalBarChart(doc, margin, yPosition, pageWidth - 2 * margin, 72, analytics.series, analytics.measureLabel, COLORS.accentPrimary);
    yPosition += 82;
    drawInsightNote(doc, margin, yPosition, pageWidth - 2 * margin, 29, 'LEITURA GERENCIAL', analytics.insight);
  }

  // ============ TABELA DE DADOS ==========
  if (tableData && tableData.length > 0) {
    doc.addPage();
    drawReportHeader(doc, pageWidth, margin, 'DETALHAMENTO DOS DADOS', `Base exportada: ${tableData.length} registro(s)`);
    yPosition = 45;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.textPrimary);
    doc.text('DETALHES', margin, yPosition);
    yPosition += 8;

    autoTable(doc, {
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
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [31, 41, 55],
        cellPadding: 3,
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
