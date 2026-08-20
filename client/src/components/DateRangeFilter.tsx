import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, X } from "lucide-react";
import { isValidContractDateRange } from "@/lib/contractFilters";

interface DateRangeFilterProps {
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  onReset?: () => void;
}

export function DateRangeFilter({ onDateRangeChange, onReset }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [rangeError, setRangeError] = useState("");

  const handleApply = () => {
    if (!isValidContractDateRange(startDate, endDate)) {
      setRangeError("A data final deve ser igual ou posterior à data inicial.");
      return;
    }
    setRangeError("");
    onDateRangeChange?.(startDate, endDate);
    setIsOpen(false);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setRangeError("");
    onReset?.();
  };

  const getDateRangeLabel = () => {
    if (!startDate || !endDate) return "Selecionar Período";
    return `${new Date(startDate).toLocaleDateString("pt-BR")} - ${new Date(endDate).toLocaleDateString("pt-BR")}`;
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        <span>{getDateRangeLabel()}</span>
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 p-4 w-80 shadow-lg z-50 border-0">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setRangeError(""); }}
                className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#087fa3]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setRangeError(""); }}
                className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#087fa3]"
              />
            </div>

            {rangeError && <p role="alert" className="text-xs font-medium text-red-700">{rangeError}</p>}

            <div className="flex gap-2">
              <Button
                onClick={handleApply}
                className="flex-1 bg-[#003f5f] hover:bg-[#087fa3]"
                disabled={!startDate || !endDate}
              >
                Aplicar
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
