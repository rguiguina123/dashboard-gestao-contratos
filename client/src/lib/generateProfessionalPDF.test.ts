import { describe, expect, it } from 'vitest';
import { buildGenericAnalytics } from './generateProfessionalPDF';

describe('buildGenericAnalytics', () => {
  it('seleciona a principal coluna numérica e preserva o rótulo categórico', () => {
    const analytics = buildGenericAnalytics(
      ['Mês', 'Com Contrato', 'Sem Contrato', 'Total Mensal'],
      [
        ['Jan', 'R$ 1.200.000,00', 'R$ 450.000,00', 'R$ 1.650.000,00'],
        ['Fev', 'R$ 1.350.000,00', 'R$ 480.000,00', 'R$ 1.830.000,00'],
        ['Mai', 'R$ 1.550.000,00', 'R$ 580.000,00', 'R$ 2.130.000,00'],
      ],
    );

    expect(analytics.measureLabel).toBe('Total Mensal');
    expect(analytics.series[0]).toEqual({ label: 'Mai', value: 2_130_000 });
    expect(analytics.insight).toContain('Mai representa o maior valor observado');
  });

  it('identifica o texto de categoria quando a primeira coluna é uma posição numérica', () => {
    const analytics = buildGenericAnalytics(
      ['Posição', 'SEC', 'Custo Total'],
      [
        [1, 'SEC-RJ', 'R$ 950.000,00'],
        [2, 'SEC-SP', 'R$ 780.000,00'],
      ],
    );

    expect(analytics.series[0]).toEqual({ label: 'SEC-RJ', value: 950_000 });
    expect(analytics.averageValueLabel).toBe('R$ 865.000');
  });
});
