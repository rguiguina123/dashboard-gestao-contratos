import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const appPath = resolve(root, 'client/src/App.tsx');
const forbiddenColorPattern = /\b(?:purple|violet)-\d+/;

const routes = [
  ['/', 'Home.tsx'],
  ['/dashboard', 'Dashboard.tsx'],
  ['/contratos', 'Contratos.tsx'],
  ['/colaboradores', 'Colaboradores.tsx'],
  ['/demonstrativo', 'Demonstrativo.tsx'],
  ['/despesas-com-contrato', 'DespesasContrato.tsx'],
  ['/despesas-sem-contrato', 'DespesasSemContrato.tsx'],
  ['/custos-por-secretaria', 'CustosPorSecretaria.tsx'],
  ['/custo-por-area', 'CustoPorArea.tsx'],
  ['/custos-total', 'CustosTotal.tsx'],
  ['/eficiencia-servidor', 'EficienciaServidor.tsx'],
  ['/custo-servidor', 'CustoServidor.tsx'],
  ['/quantidade-servidores', 'QuantidadeServidores.tsx'],
  ['/atualizar-dados', 'AtualizarDados.tsx'],
];

const appSource = readFileSync(appPath, 'utf8');
let failures = 0;

for (const [route, pageFile] of routes) {
  const pagePath = resolve(root, 'client/src/pages', pageFile);
  const declared = appSource.includes(`path="${route}"`);
  const exists = existsSync(pagePath);
  const source = exists ? readFileSync(pagePath, 'utf8') : '';
  const legacyColor = forbiddenColorPattern.test(source);

  if (!declared || !exists || legacyColor) {
    failures += 1;
    console.error(`FALHA ${route}: rota=${declared}, arquivo=${exists}, cor_legada=${legacyColor}`);
  } else {
    console.log(`OK ${route}`);
  }
}

const responsiveSources = [
  'client/src/pages/Home.tsx',
  'client/src/components/FloatingNav.tsx',
  'client/src/components/dashboard/DashboardLayout.tsx',
].map((file) => readFileSync(resolve(root, file), 'utf8'));

const hasResponsiveMarkers = responsiveSources.every((source) => /\b(?:sm|md|lg|xl):/.test(source));
if (!hasResponsiveMarkers) {
  failures += 1;
  console.error('FALHA responsividade: marcadores responsivos ausentes em um componente estrutural.');
} else {
  console.log('OK responsividade estática');
}

const sourceRoot = resolve(root, 'client/src');
const globalCss = readFileSync(resolve(sourceRoot, 'index.css'), 'utf8');
if (forbiddenColorPattern.test(globalCss)) {
  failures += 1;
  console.error('FALHA paleta: token roxo/violeta encontrado em index.css.');
} else {
  console.log('OK paleta global');
}

if (failures > 0) process.exit(1);

console.log(`Auditoria concluída: ${routes.length} rotas, paleta e responsividade estática aprovadas.`);
