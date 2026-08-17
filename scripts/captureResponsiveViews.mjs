import fs from "node:fs";

const baseUrl = "https://3000-ir422c4oph32cl5njq8hw-44258327.us1.manus.computer";
const priorityRoutes = ["/", "/dashboard", "/contratos", "/atualizar-dados"];
const views = [
  { name: "mobile", width: 390, height: 844, mobile: true, routes: priorityRoutes },
  { name: "tablet", width: 768, height: 1024, mobile: true, routes: priorityRoutes },
  { name: "desktop", width: 1440, height: 900, mobile: false, routes: priorityRoutes },
];
const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const target = targets.find(item => item.type === "page" && item.url.includes("manus.computer"));
if (!target?.webSocketDebuggerUrl) throw new Error("Nenhuma página de prévia está aberta.");
const socket = new WebSocket(target.webSocketDebuggerUrl);
const calls = new Map();
let id = 1;
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
socket.addEventListener("message", event => { const message = JSON.parse(event.data); if (message.id && calls.has(message.id)) { const call = calls.get(message.id); calls.delete(message.id); message.error ? call.reject(new Error(message.error.message)) : call.resolve(message.result); } });
const cdp = (method, params = {}) => { const requestId = id++; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolve, reject) => calls.set(requestId, { resolve, reject })); };
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const outputDir = "/home/ubuntu/dashboard-gestao-contratos/docs/responsive-screenshots";
fs.mkdirSync(outputDir, { recursive: true });
for (const view of views) {
  await cdp("Emulation.setDeviceMetricsOverride", { width: view.width, height: view.height, deviceScaleFactor: 1, mobile: view.mobile });
  for (const route of view.routes) {
    await cdp("Page.navigate", { url: `${baseUrl}${route}` });
    await wait(900);
    const shot = await cdp("Page.captureScreenshot", { format: "png" });
    const label = route === "/" ? "home" : route.slice(1);
    fs.writeFileSync(`${outputDir}/${label}-${view.name}.png`, Buffer.from(shot.data, "base64"));
  }
}
await cdp("Emulation.clearDeviceMetricsOverride");
socket.close();
console.log(outputDir);
