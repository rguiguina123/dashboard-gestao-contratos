import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps { title: string; value: string | number; icon?: ReactNode; subtitle?: string; trend?: "up" | "down" | "neutral"; trendValue?: string; delay?: number; }

export function MetricCard({ title, value, icon, subtitle, trend, trendValue }: MetricCardProps) {
  return <Card className="border-[#c9dde6] bg-white shadow-[0_2px_12px_rgba(0,63,95,.05)] transition-shadow duration-200 hover:shadow-[0_10px_26px_rgba(0,63,95,.10)]"><CardHeader className="pb-2"><div className="flex items-start justify-between gap-3"><CardTitle className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#547182]">{title}</CardTitle>{icon && <div className="grid h-9 w-9 place-items-center border border-[#c9dde6] bg-[#eaf3f7] text-[#005f83]">{icon}</div>}</div></CardHeader><CardContent><div className="text-2xl font-semibold tracking-tight text-[#003f5f] sm:text-3xl">{value}</div>{subtitle && <p className="mt-2 text-xs text-[#547182]">{subtitle}</p>}{trend && trendValue && <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-[#087fa3]" : trend === "down" ? "text-red-700" : "text-[#547182]"}`}>{trend === "up" && <TrendingUp className="h-3.5 w-3.5" />}{trend === "down" && <TrendingDown className="h-3.5 w-3.5" />}{trendValue}</div>}</CardContent></Card>;
}
