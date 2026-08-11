import { trpc } from "@/lib/trpc";
import { createContext, useContext, type ReactNode } from "react";
import { colaboradores, contratos, despesasSemContrato, secs } from "@/lib/data";
import dadosCustos from "@/lib/dadosCustos.json";

type DashboardData = {
  colaboradores: typeof colaboradores;
  contratos: typeof contratos;
  despesasSemContrato: typeof despesasSemContrato;
  secs: string[];
  custos: typeof dadosCustos;
};

type DashboardDataValue = DashboardData & {
  totalMensalComContrato: number;
  totalAnualComContrato: number;
  totalMensalSemContrato: number;
  totalAnualSemContrato: number;
  totalMensal: number;
  totalAnual: number;
  isRefreshing: boolean;
};

const fallback: DashboardData = { colaboradores, contratos, despesasSemContrato, secs, custos: dadosCustos };
const DashboardDataContext = createContext<DashboardDataValue | null>(null);

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const { data, isFetching } = trpc.dataImports.current.useQuery(undefined, { staleTime: 30_000 });
  const active = (data ?? fallback) as DashboardData;
  const totalMensalComContrato = active.contratos.reduce((sum, item) => sum + item.mensal, 0);
  const totalAnualComContrato = active.contratos.reduce((sum, item) => sum + item.anual, 0);
  const totalMensalSemContrato = active.despesasSemContrato.reduce((sum, item) => sum + item.mensal, 0);
  const totalAnualSemContrato = active.despesasSemContrato.reduce((sum, item) => sum + item.anual, 0);
  const value: DashboardDataValue = {
    ...active,
    totalMensalComContrato,
    totalAnualComContrato,
    totalMensalSemContrato,
    totalAnualSemContrato,
    totalMensal: totalMensalComContrato + totalMensalSemContrato,
    totalAnual: totalAnualComContrato + totalAnualSemContrato,
    isRefreshing: isFetching,
  };
  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) throw new Error("useDashboardData deve ser usado dentro de DashboardDataProvider");
  return context;
}
