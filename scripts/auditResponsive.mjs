import fs from "node:fs";

const baseUrl = "https://3000-ir422c4oph32cl5njq8hw-44258327.us1.manus.computer";
const routes = ["/", "/dashboard", "/contratos", "/atualizar-dados"];
const viewports = [
  { name: "mobile", width: 390, height: 844, mobile: true },
  { name: "tablet", width: 768, height: 1024, mobile: true },
  { name: "desktop", width: 1440, height: 900, mobile: false },
];

const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const target = targets.find(item => item.type === "page" && item.url.includes("manus.computer"));
if (!target?.webSocketDebuggerUrl) throw new Error("Nenhuma página de prévia está aberta.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
const calls = new Map();
const errors = [];
let id = 1;
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
socket.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
  if (message.id && calls.has(message.id)) {
    const call = calls.get(message.id);
    calls.delete(message.id);
    message.error ? call.reject(new Error(message.error.message)) : call.resolve(message.result);
  }
});
const cdp = (method, params = {}) => { const requestId = id++; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolve, reject) => calls.set(requestId, { resolve, reject })); };
const evaluate = async expression => (await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

await cdp("Runtime.enable");
const results = [];
for (const viewport of viewports) {
  await cdp("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile });
  for (const route of routes) {
    const errorStart = errors.length;
    await cdp("Page.navigate", { url: `${baseUrl}${route}` });
    await wait(900);
    const state = await evaluate(`({rootChildren:document.getElementById('root')?.childElementCount || 0, overflow:document.documentElement.scrollWidth > window.innerWidth + 1, failure:/algo deu errado|error boundary|página não encontrada/i.test(document.body.innerText)})`);
    results.push({ viewport: viewport.name, route, ...state, errors: errors.slice(errorStart) });
  }
}
await cdp("Emulation.clearDeviceMetricsOverride");
const failures = results.filter(item => item.rootChildren === 0 || item.overflow || item.failure || item.errors.length);
fs.writeFileSync("/home/ubuntu/dashboard-gestao-contratos/responsive_audit_results.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify({ checks: results.length, failures }, null, 2));
socket.close();
