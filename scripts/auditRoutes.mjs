import fs from "node:fs";

const baseUrl = "https://3000-ir422c4oph32cl5njq8hw-44258327.us1.manus.computer";
const routes = ["/", "/dashboard", "/contratos", "/colaboradores", "/demonstrativo", "/despesas-com-contrato", "/despesas-sem-contrato", "/custos-por-secretaria", "/custo-por-area", "/custos-total", "/eficiencia-servidor", "/custo-servidor", "/quantidade-servidores", "/atualizar-dados"];
const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const target = targets.find(item => item.type === "page" && item.url.includes("manus.computer"));
if (!target?.webSocketDebuggerUrl) throw new Error("Nenhuma página de prévia está aberta.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
const calls = new Map();
let id = 1;
const errors = [];
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
socket.addEventListener("message", event => { const message = JSON.parse(event.data); if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text); if (message.id && calls.has(message.id)) { const call = calls.get(message.id); calls.delete(message.id); message.error ? call.reject(new Error(message.error.message)) : call.resolve(message.result); } });
const cdp = (method, params = {}) => { const requestId = id++; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolve, reject) => calls.set(requestId, { resolve, reject })); };
const evaluate = async expression => (await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
await cdp("Runtime.enable");
const results = [];
for (const route of routes) {
  const errorStart = errors.length;
  await cdp("Page.navigate", { url: `${baseUrl}${route}` });
  await wait(900);
  const state = await evaluate(`({text:document.body.innerText.slice(0,300), rootChildren:document.getElementById('root')?.childElementCount || 0, failure:/algo deu errado|error boundary|página não encontrada/i.test(document.body.innerText)})`);
  results.push({ route, ...state, errors: errors.slice(errorStart) });
}
const failures = results.filter(result => result.rootChildren === 0 || result.failure || result.errors.length);
fs.writeFileSync("/home/ubuntu/dashboard-gestao-contratos/route_audit_results.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify({ routes: results.length, failures: failures.map(({route, failure, errors}) => ({route, failure, errors})) }, null, 2));
socket.close();
