import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, X } from "lucide-react";

interface DateRangeFilterProps {
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  onReset?: () => void;
}

export function DateRangeFilter({ onDateRangeChange, onReset }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    if (startDate && endDate) {
      onDateRangeChange?.(startDate, endDate);
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
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
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleApply}
                className="flex-1 bg-purple-700 hover:bg-purple-600"
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
