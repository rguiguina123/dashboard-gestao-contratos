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

  return (
    <div className="space-y-4">
      {contratosVencidos.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{contratosVencidos.length} contrato(s) vencido(s)!</strong>
            <div className="mt-2 space-y-1">
              {contratosVencidos.map((c) => (
                <div key={c.id} className="text-sm">
                  • {c.contrato} ({c.sec})
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {contratosProximos.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <Clock className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>{contratosProximos.length} contrato(s) vencendo em breve!</strong>
            <div className="mt-2 space-y-1">
              {contratosProximos.map((c) => (
                <div key={c.id} className="text-sm flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {c.contrato} ({c.sec}) - Vence em{" "}
                  {Math.ceil(
                    (new Date(c.dataVencimento!).getTime() - hoje.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  dias
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
