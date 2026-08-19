const debugTargets = await fetch('http://127.0.0.1:9222/json/list').then((response) => response.json());
const page = debugTargets.find((target) => target.type === 'page' && target.url.includes('3000-ir422c4oph32cl5njq8hw-44258327'));

if (!page?.webSocketDebuggerUrl) {
  throw new Error('Não foi encontrada uma página do dashboard para a auditoria responsiva.');
}

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let requestId = 0;
const pending = new Map();
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  const resolver = pending.get(message.id);
  if (resolver) {
    pending.delete(message.id);
    resolver(message);
  }
});

function command(method, params = {}) {
  const id = ++requestId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(id, (message) => {
      if (message.error) reject(new Error(`${method}: ${message.error.message}`));
      else resolve(message.result);
    });
  });
}

const views = [
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: false },
  { name: 'desktop', width: 1440, height: 900, mobile: false },
];
const routes = ['/', '/dashboard', '/contratos', '/atualizar-dados'];
const origin = 'https://3000-ir422c4oph32cl5njq8hw-44258327.us1.manus.computer';
const failures = [];

for (const view of views) {
  await command('Emulation.setDeviceMetricsOverride', {
    width: view.width,
    height: view.height,
    deviceScaleFactor: 1,
    mobile: view.mobile,
  });

  for (const route of routes) {
    await command('Page.navigate', { url: `${origin}${route}` });
    await new Promise((resolve) => setTimeout(resolve, 650));
    const evaluation = await command('Runtime.evaluate', {
      expression: `JSON.stringify({
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        pageHeight: document.documentElement.scrollHeight,
        hasRoot: Boolean(document.getElementById('root'))
      })`,
      returnByValue: true,
    });
    const metrics = JSON.parse(evaluation.result.value);
    const fits = metrics.scrollWidth <= metrics.viewportWidth + 1;
    console.log(`${view.name} ${route}: ${fits && metrics.hasRoot ? 'OK' : 'FALHA'} (${metrics.scrollWidth}/${metrics.viewportWidth})`);
    if (!fits || !metrics.hasRoot) failures.push({ view: view.name, route, metrics });
  }
}

await command('Emulation.clearDeviceMetricsOverride');
socket.close();

if (failures.length > 0) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}

console.log('Auditoria responsiva concluída sem overflow horizontal nas rotas principais.');
