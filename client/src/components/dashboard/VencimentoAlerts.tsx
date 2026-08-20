import { AlertCircle, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const limiteVisivel = 5;
  const hoje = new Date();
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() + diasAlerta);

  const contratosVencidos = contratos.filter((c) => {
    if (!c.dataVencimento) return false;
    const dataVenc = new Date(c.dataVencimento);
    return dataVenc < hoje;
  });

  const contratosProximos = contratos.filter((c) => {
    if (!c.dataVencimento) return false;
    const dataVenc = new Date(c.dataVencimento);
    return dataVenc >= hoje && dataVenc <= dataLimite;
  });

  if (contratosVencidos.length === 0 && contratosProximos.length === 0) {
    return null;
  }

  const vencidosVisiveis = contratosVencidos.slice(0, limiteVisivel);
  const proximosVisiveis = contratosProximos.slice(0, limiteVisivel);

  return (
    <div className="space-y-4">
      {contratosVencidos.length > 0 && (
        <Alert className="border-red-200 bg-red-50/85">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong className="text-sm font-semibold tracking-[-0.01em]">{contratosVencidos.length} contratos vencidos</strong>
            <div className="mt-2 grid gap-1.5 md:grid-cols-2">
              {vencidosVisiveis.map((c) => (
                <div key={c.id} className="text-xs font-medium leading-5">
                  {c.contrato} <span className="text-red-600/80">· {c.sec}</span>
                </div>
              ))}
            </div>
            {contratosVencidos.length > limiteVisivel && (
              <p className="mt-2 text-xs font-medium text-red-700/80">+ {contratosVencidos.length - limiteVisivel} outros contratos vencidos</p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {contratosProximos.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50/85">
          <Clock className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong className="text-sm font-semibold tracking-[-0.01em]">{contratosProximos.length} contratos vencendo em até {diasAlerta} dias</strong>
            <div className="mt-2 grid gap-1.5 md:grid-cols-2">
              {proximosVisiveis.map((c) => (
                <div key={c.id} className="flex items-center gap-1.5 text-xs font-medium leading-5">
                  <Calendar className="w-3 h-3" />
                  <span>{c.contrato} <span className="text-amber-700/75">· {c.sec}</span> · vence em{" "}
                  {Math.ceil(
                    (new Date(c.dataVencimento!).getTime() - hoje.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )} dias</span>
                </div>
              ))}
            </div>
            {contratosProximos.length > limiteVisivel && (
              <p className="mt-2 text-xs font-medium text-amber-700/80">+ {contratosProximos.length - limiteVisivel} outros contratos no período</p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
