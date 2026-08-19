import { existsSync, mkdirSync, readdirSync } from 'node:fs';

const targetList = await fetch('http://127.0.0.1:9222/json/list').then((response) => response.json());
const page = targetList.find((target) => target.type === 'page' && target.url.includes('3000-ir422c4oph32cl5njq8hw-44258327'));
if (!page?.webSocketDebuggerUrl) throw new Error('Página do dashboard não encontrada para a auditoria de PDFs.');

const downloadPath = '/home/ubuntu/Downloads/pdf-audit';
mkdirSync(downloadPath, { recursive: true });
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let sequence = 0;
const callbacks = new Map();
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  const callback = callbacks.get(message.id);
  if (!callback) return;
  callbacks.delete(message.id);
  message.error ? callback.reject(new Error(message.error.message)) : callback.resolve(message.result);
});

function command(method, params = {}) {
  const id = ++sequence;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => callbacks.set(id, { resolve, reject }));
}

await command('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath, eventsEnabled: true });
const origin = 'https://3000-ir422c4oph32cl5njq8hw-44258327.us1.manus.computer';
const routes = [
  '/dashboard', '/contratos', '/colaboradores', '/demonstrativo', '/despesas-com-contrato',
  '/despesas-sem-contrato', '/custos-por-secretaria', '/custo-por-area', '/custos-total',
  '/eficiencia-servidor', '/custo-servidor', '/quantidade-servidores',
];

const failures = [];
for (const route of routes) {
  await command('Page.navigate', { url: `${origin}${route}` });
  await new Promise((resolve) => setTimeout(resolve, 500));
  const before = existsSync(downloadPath) ? readdirSync(downloadPath).length : 0;
  const clicked = await command('Runtime.evaluate', {
    expression: `(() => {
      const button = [...document.querySelectorAll('button')].find((element) => element.textContent?.includes('Exportar Relatório'));
      if (!button) return false;
      button.click();
      return true;
    })()`,
    returnByValue: true,
  });
  await new Promise((resolve) => setTimeout(resolve, 800));
  const after = existsSync(downloadPath) ? readdirSync(downloadPath).length : 0;
  const ok = clicked.result.value === true && after > before;
  console.log(`${route}: ${ok ? 'OK' : 'FALHA'} (${before} -> ${after})`);
  if (!ok) failures.push(route);
}

socket.close();
if (failures.length) throw new Error(`Falha de exportação nas rotas: ${failures.join(', ')}`);
console.log(`Auditoria de PDFs concluída: ${routes.length} relatórios gerados.`);
