import fs from "node:fs";

const baseUrl = "https://3000-ir422c4oph32cl5njq8hw-44258327.us1.manus.computer";
const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const target = targets.find(item => item.type === "page" && item.url.includes("manus.computer"));
if (!target?.webSocketDebuggerUrl) throw new Error("Não há uma página do dashboard aberta.");
const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map(); let id = 1;
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
socket.addEventListener("message", event => { const message = JSON.parse(event.data); if (!message.id || !pending.has(message.id)) return; const call = pending.get(message.id); pending.delete(message.id); message.error ? call.reject(new Error(message.error.message)) : call.resolve(message.result); });
const cdp = (method, params = {}) => { const requestId = id++; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolve, reject) => pending.set(requestId, { resolve, reject })); };
const evaluate = async expression => (await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const original = fs.existsSync("/home/ubuntu/Downloads") ? fs.readdirSync("/home/ubuntu/Downloads").filter(name => name.endsWith(".pdf")).length : 0;
const outcomes = [];
for (const route of ["/dashboard", "/contratos"]) {
  await cdp("Page.navigate", { url: `${baseUrl}${route}` }); await wait(800);
  const clicked = await evaluate(`(() => { const button = [...document.querySelectorAll('button')].find(item => /exportar relatório/i.test(item.textContent)); if (!button) return false; button.click(); return true; })()`);
  if (!clicked) throw new Error(`Botão de exportação não encontrado em ${route}.`);
  await wait(1100);
  outcomes.push({ route, clicked: true });
}
const downloaded = fs.readdirSync("/home/ubuntu/Downloads").filter(name => name.endsWith(".pdf")).length;
if (downloaded < original + 2) throw new Error("As duas exportações não geraram arquivos PDF no navegador.");
console.log(JSON.stringify({ exports: outcomes, generated: downloaded - original }, null, 2));
socket.close();
