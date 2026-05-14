import { useState } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ContratoDisplay {
  id: string;
  contrato: string;
  fornecedor: string;
  objeto: string;
  sec: string;
  mensal: number;
  anual: number;
  dataVencimento?: string;
  diasParaVencimento?: number;
}

interface ContractDetailModalProps {
  contract: ContratoDisplay | null;
  onClose: () => void;
}

export function ContractDetailModal({
  contract,
  onClose,
}: ContractDetailModalProps) {
  if (!contract) return null;

  const handleExport = () => {
    const data = `Contrato: ${contract.contrato}
Fornecedor: ${contract.fornecedor}
Objeto: ${contract.objeto}
SEC: ${contract.sec}
Valor Mensal: ${formatCurrency(contract.mensal)}
Valor Anual: ${formatCurrency(contract.anual)}`

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contrato-${contract.contrato}.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-700 to-purple-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-poppins">
              {contract.contrato}
            </h2>
            <p className="text-purple-100 text-sm mt-1">{contract.fornecedor}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-500 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informacoes Principais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">
                SEC
              </label>
              <p className="text-lg text-foreground mt-1">{contract.sec}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">
                Fornecedor
              </label>
              <p className="text-lg text-foreground mt-1">{contract.fornecedor}</p>
            </div>
          </div>

          {/* Objeto */}
          <div>
            <label className="text-sm font-semibold text-muted-foreground">
              Objeto
            </label>
            <p className="text-foreground mt-2 leading-relaxed">
              {contract.objeto}
            </p>
          </div>

          {/* Valores */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-purple-900">
                  Valor Mensal
                </label>
                <p className="text-2xl font-bold text-purple-700 mt-1">
                  {formatCurrency(contract.mensal)}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-purple-900">
                  Valor Anual
                </label>
                <p className="text-2xl font-bold text-purple-700 mt-1">
                  {formatCurrency(contract.anual)}
                </p>
              </div>
            </div>
          </div>

          {/* Número */}
          <div>
            <label className="text-sm font-semibold text-muted-foreground">
              Número do Contrato
            </label>
            <p className="text-lg text-foreground mt-1">{contract.contrato}</p>
          </div>

          {/* Vencimento */}
          {contract.dataVencimento && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border-l-4 border-orange-500">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-orange-900">
                    Data de Vencimento
                  </label>
                  <p className="text-lg font-bold text-orange-700 mt-1">
                    {contract.dataVencimento}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-orange-900">
                    Dias para Vencer
                  </label>
                  <p className={`text-lg font-bold mt-1 ${
                    contract.diasParaVencimento !== undefined && contract.diasParaVencimento < 0
                      ? 'text-red-700'
                      : contract.diasParaVencimento !== undefined && contract.diasParaVencimento <= 30
                      ? 'text-orange-700'
                      : 'text-green-700'
                  }`}>
                    {contract.diasParaVencimento !== undefined
                      ? contract.diasParaVencimento < 0
                        ? `Vencido há ${Math.abs(contract.diasParaVencimento)} dias`
                        : contract.diasParaVencimento === 0
                        ? 'Vence hoje'
                        : contract.diasParaVencimento === 1
                        ? 'Vence amanhã'
                        : `Vence em ${contract.diasParaVencimento} dias`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-secondary p-6 flex gap-3 justify-end border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
}
