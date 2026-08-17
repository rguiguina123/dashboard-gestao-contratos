import { Link, useLocation } from "wouter";
import { BarChart3, DollarSign, FileText, Grid2X2, Home, Upload, Users, X } from "lucide-react";
import { useState } from "react";

type NavItem = { label: string; href: string; icon: React.ReactNode };

const primaryItems: NavItem[] = [
  { label: "Início", href: "/", icon: <Home className="h-5 w-5" /> },
  { label: "Visão executiva", href: "/dashboard", icon: <BarChart3 className="h-5 w-5" /> },
  { label: "Contratos", href: "/contratos", icon: <FileText className="h-5 w-5" /> },
  { label: "Colaboradores", href: "/colaboradores", icon: <Users className="h-5 w-5" /> },
  { label: "Custos", href: "/custos-total", icon: <DollarSign className="h-5 w-5" /> },
  { label: "Atualizar dados", href: "/atualizar-dados", icon: <Upload className="h-5 w-5" /> },
];

const analysisItems = [
  { label: "Demonstrativo total", href: "/demonstrativo" },
  { label: "Despesas com contrato", href: "/despesas-com-contrato" },
  { label: "Despesas sem contrato", href: "/despesas-sem-contrato" },
  { label: "Custos por secretaria", href: "/custos-por-secretaria" },
  { label: "Custo por área", href: "/custo-por-area" },
  { label: "Eficiência por servidor", href: "/eficiencia-servidor" },
  { label: "Custo por servidor", href: "/custo-servidor" },
  { label: "Quantidade de servidores", href: "/quantidade-servidores" },
];

export function FloatingNav() {
  const [location] = useLocation();
  const [expanded, setExpanded] = useState(false);
  const controlClass = "group relative grid h-10 w-10 place-items-center border border-transparent transition-colors duration-150 max-sm:h-11 max-sm:flex-1 max-sm:w-auto";

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2" aria-label="Navegação principal">
      <div className="relative flex items-center justify-between gap-1 border border-[#0a526f] bg-[#003f5f] p-1 shadow-[0_14px_32px_rgba(0,63,95,0.24)] sm:flex-col">
        {primaryItems.map(item => {
          const active = location === item.href;
          return <Link key={item.href} href={item.href} title={item.label} className={`${controlClass} ${active ? "bg-[#f2c94c] text-[#003f5f]" : "text-[#c2e6f0] hover:bg-[#55752c] hover:text-white"}`}>{item.icon}<span className="pointer-events-none absolute right-[calc(100%+0.75rem)] hidden whitespace-nowrap border border-[#0a526f] bg-[#003f5f] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg sm:group-hover:block">{item.label}</span></Link>;
        })}
        <button type="button" onClick={() => setExpanded(value => !value)} title="Todas as análises" className={`${controlClass} ${expanded ? "bg-[#89ad45] text-[#003f5f]" : "border-l border-[#0a526f] text-[#c2e6f0] hover:bg-[#55752c] hover:text-white sm:border-l-0 sm:border-t"}`}>
          {expanded ? <X className="h-5 w-5" /> : <Grid2X2 className="h-5 w-5" />}
        </button>
      </div>
      {expanded && <div className="absolute bottom-[calc(100%+0.75rem)] left-0 right-0 w-auto border border-[#c9dde6] bg-white p-3 shadow-[0_16px_38px_rgba(0,63,95,.18)] sm:bottom-auto sm:left-auto sm:right-[calc(100%+0.75rem)] sm:top-1/2 sm:w-64 sm:-translate-y-1/2">
        <p className="border-b border-[#c9dde6] px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#547182]">Análises detalhadas</p>
        <div className="pt-1">{analysisItems.map(item => <Link key={item.href} href={item.href} onClick={() => setExpanded(false)} className={`block border-l-2 px-3 py-2 text-sm transition-colors ${location === item.href ? "border-[#00a6c7] bg-[#eaf3f7] font-semibold text-[#003f5f]" : "border-transparent text-[#365869] hover:border-[#8fd2e6] hover:bg-[#f6f9fa]"}`}>{item.label}</Link>)}</div>
      </div>}
    </nav>
  );
}
