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
  const controlClass = "group relative grid h-10 w-10 place-items-center rounded-xl border transition-all duration-200";

  return (
    <nav className="fixed right-4 top-1/2 z-50 -translate-y-1/2 sm:right-6" aria-label="Navegação principal">
      <div className="relative flex flex-col gap-1.5 rounded-2xl border border-slate-800 bg-[#172033] p-1.5 shadow-[0_18px_42px_rgba(15,23,42,0.24)]">
        {primaryItems.map(item => {
          const active = location === item.href;
          return <Link key={item.href} href={item.href} title={item.label} className={`${controlClass} ${active ? "border-[#b6cc7a] bg-[#b6cc7a] text-[#172033]" : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white"}`}>{item.icon}<span className="pointer-events-none absolute right-[calc(100%+0.75rem)] hidden whitespace-nowrap rounded-md bg-[#172033] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg group-hover:block">{item.label}</span></Link>;
        })}
        <button type="button" onClick={() => setExpanded(value => !value)} title="Todas as análises" className={`${controlClass} ${expanded ? "border-[#b6cc7a] bg-[#b6cc7a] text-[#172033]" : "border-t border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
          {expanded ? <X className="h-5 w-5" /> : <Grid2X2 className="h-5 w-5" />}
        </button>
      </div>
      {expanded && <div className="absolute right-[calc(100%+0.75rem)] top-1/2 w-64 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
        <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Análises detalhadas</p>
        <div className="space-y-0.5">{analysisItems.map(item => <Link key={item.href} href={item.href} onClick={() => setExpanded(false)} className={`block rounded-lg px-3 py-2 text-sm transition-colors ${location === item.href ? "bg-[#edf1de] font-semibold text-[#355224]" : "text-slate-700 hover:bg-slate-100"}`}>{item.label}</Link>)}</div>
      </div>}
    </nav>
  );
}
