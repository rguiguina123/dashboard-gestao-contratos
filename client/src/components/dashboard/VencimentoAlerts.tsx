import { AlertCircle, Calendar, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { summarizeAlertItems } from "@/lib/alertSummary";
import { daysUntilBrazilianDate, parseBrazilianDate } from "@/lib/contractDates";

interface Contrato {
  id: string;
  contrato: string;
  sec: string;
  dataVencimento?: string;
  mensal: number;
}

interface VencimentoAlertsProps {
  contratos: Contrato[];
  diasAlerta?: number;
}

export function VencimentoAlerts({ contratos, diasAlerta = 30 }: VencimentoAlertsProps) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataLimite = new Date(hoje);
  dataLimite.setDate(dataLimite.getDate() + diasAlerta);

  const contratosVencidos = contratos.filter(contrato => {
    const data = contrato.dataVencimento ? parseBrazilianDate(contrato.dataVencimento) : null;
    return data ? data < hoje : false;
  });
  const contratosProximos = contratos.filter(contrato => {
    const data = contrato.dataVencimento ? parseBrazilianDate(contrato.dataVencimento) : null;
    return data ? data >= hoje && data <= dataLimite : false;
  });
  const vencidosResumo = summarizeAlertItems(contratosVencidos);
  const proximosResumo = summarizeAlertItems(contratosProximos);

  if (!contratosVencidos.length && !contratosProximos.length) return null;

  return <div className="space-y-3">
    {contratosVencidos.length > 0 && <Alert className="border-red-200 bg-red-50/80"><AlertCircle className="h-4 w-4 text-red-700" /><AlertDescription className="text-red-900"><strong>{contratosVencidos.length} contrato(s) vencido(s)</strong><div className="mt-2 space-y-1">{vencidosResumo.visibleItems.map(contrato => <div key={contrato.id} className="text-sm">{contrato.contrato} <span className="text-red-700">· {contrato.sec}</span></div>)}{vencidosResumo.hiddenCount > 0 && <p className="pt-1 text-xs font-medium text-red-700">+ {vencidosResumo.hiddenCount} contrato(s) na tabela abaixo.</p>}</div></AlertDescription></Alert>}
    {contratosProximos.length > 0 && <Alert className="border-amber-200 bg-amber-50/80"><Clock className="h-4 w-4 text-amber-700" /><AlertDescription className="text-amber-900"><strong>{contratosProximos.length} contrato(s) vencendo nos próximos {diasAlerta} dias</strong><div className="mt-2 space-y-1">{proximosResumo.visibleItems.map(contrato => <div key={contrato.id} className="flex items-center gap-2 text-sm"><Calendar className="h-3.5 w-3.5" />{contrato.contrato} <span className="text-amber-700">· {contrato.sec} · {daysUntilBrazilianDate(contrato.dataVencimento!, hoje)} dias</span></div>)}{proximosResumo.hiddenCount > 0 && <p className="pt-1 text-xs font-medium text-amber-700">+ {proximosResumo.hiddenCount} contrato(s) na tabela abaixo.</p>}</div></AlertDescription></Alert>}
  </div>;
}
