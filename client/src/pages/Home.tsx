import { Link } from "wouter";
import { ArrowRight, BarChart3, FileText, Landmark, Upload, Users } from "lucide-react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { formatCurrency } from "@/lib/utils";

const backgroundUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029089241/EfhvJQgUIbupmRzf.jpg";
const logoUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029089241/WJWhmX29eSkoE3JJHDcEoo/tcu-logo_60c1698f.png";

export default function Home() {
  const { colaboradores, contratos, secs, totalMensal } = useDashboardData();
  const modules = [
    { title: "Visão executiva", text: "Indicadores consolidados e composição das despesas.", href: "/dashboard", icon: BarChart3 },
    { title: "Contratos", text: "Acompanhamento de vigências, fornecedores e valores.", href: "/contratos", icon: FileText },
    { title: "Colaboradores", text: "Distribuição por SEC, posto e identificação.", href: "/colaboradores", icon: Users },
    { title: "Custos", text: "Análises por secretaria, área e servidor.", href: "/custos-total", icon: Landmark },
  ];
  return <div className="min-h-dvh bg-[#f4f5f2] text-[#172033]">
    <section className="relative isolate min-h-[680px] overflow-hidden bg-[#172033]" style={{ backgroundImage: `linear-gradient(90deg, rgba(14,23,40,.92) 0%, rgba(14,23,40,.76) 45%, rgba(14,23,40,.25) 100%), url(${backgroundUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="mx-auto flex min-h-[680px] max-w-[1500px] flex-col justify-between px-6 py-8 pr-24 sm:px-10 sm:pr-28 lg:px-16 lg:py-12 lg:pr-32">
        <div className="flex items-center justify-between"><img src={logoUrl} alt="Tribunal de Contas da União" className="h-12 w-auto rounded-md bg-white/95 p-1.5 shadow-sm" /><span className="border border-white/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-slate-200">Gestão de contratos</span></div>
        <div className="max-w-3xl pb-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#dbe8bb]">Informação para decisão</p><h1 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl">Gestão pública com leitura clara, base confiável e ação responsável.</h1><p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">Uma visão integrada dos contratos, colaboradores e custos para apoiar o acompanhamento institucional.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-[#dbe8bb] px-5 py-3 text-sm font-bold text-[#172033] transition-colors hover:bg-white">Abrir visão executiva <ArrowRight className="h-4 w-4" /></Link><Link href="/atualizar-dados" className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"><Upload className="h-4 w-4" />Atualizar dados</Link></div></div>
      </div>
    </section>
    <section className="border-b border-slate-200 bg-white"><div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-y-6 px-6 py-8 pr-24 sm:grid-cols-4 sm:px-10 sm:pr-28 lg:px-16 lg:pr-32">{[[colaboradores.length,"colaboradores"],[contratos.length,"contratos ativos"],[secs.length,"SECs na base"],[formatCurrency(totalMensal),"despesa mensal"]].map(([value,label]) => <div key={label} className="border-l border-slate-200 px-4 first:border-l-0"><p className="text-2xl font-semibold tracking-tight text-[#172033]">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-slate-500">{label}</p></div>)}</div></section>
    <main className="mx-auto max-w-[1500px] px-6 py-16 pr-24 sm:px-10 sm:pr-28 lg:px-16 lg:pr-32"><div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#587047]">Ambientes de trabalho</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Acesse pelo que precisa decidir.</h2></div><p className="max-w-md text-sm leading-6 text-slate-600">Cada módulo mantém indicadores, filtros e relatórios organizados em torno de uma pergunta de gestão.</p></div><div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2">{modules.map(module => { const Icon = module.icon; return <Link key={module.href} href={module.href} className="group bg-[#f9faf8] p-7 transition-colors hover:bg-white"><div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-lg bg-[#eaf0da] text-[#355224]"><Icon className="h-5 w-5" /></div><ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#355224]" /></div><h3 className="mt-10 text-xl font-semibold">{module.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{module.text}</p></Link>; })}</div></main>
  </div>;
}
