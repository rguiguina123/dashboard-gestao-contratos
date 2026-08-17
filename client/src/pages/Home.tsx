import { Link } from "wouter";
import { ArrowUpRight, BarChart3, FileText, Landmark, Upload, Users } from "lucide-react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { formatCurrency } from "@/lib/utils";

const backgroundUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029089241/EfhvJQgUIbupmRzf.jpg";
const logoUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029089241/WJWhmX29eSkoE3JJHDcEoo/tcu-logo_60c1698f.png";

export default function Home() {
  const { colaboradores, contratos, secs, totalMensal } = useDashboardData();
  const modules = [
    { title: "Visão executiva", href: "/dashboard", icon: BarChart3 },
    { title: "Contratos", href: "/contratos", icon: FileText },
    { title: "Colaboradores", href: "/colaboradores", icon: Users },
    { title: "Custos", href: "/custos-total", icon: Landmark },
  ];
  const metrics = [[colaboradores.length, "colaboradores"], [contratos.length, "contratos"], [secs.length, "SECs"], [formatCurrency(totalMensal), "por mês"]];

  return (
    <div
      className="min-h-dvh bg-[#003f5f] text-white"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(0,47,72,.95) 0%, rgba(0,63,95,.84) 52%, rgba(0,63,95,.42) 100%), url(${backgroundUrl})`, backgroundPosition: "center", backgroundSize: "cover" }}
    >
      <div className="mx-auto grid min-h-dvh max-w-[1680px] grid-rows-[auto_1fr_auto] px-6 py-6 pb-20 pr-6 sm:px-10 sm:py-6 sm:pb-6 sm:pr-28 lg:px-14 lg:pr-32">
        <header className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-3"><img src={logoUrl} alt="Tribunal de Contas da União" className="h-9 w-auto bg-white p-1" /><span className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#d9edf3]">Gestão de contratos</span></div>
          <Link href="/atualizar-dados" className="hidden items-center gap-2 text-sm font-semibold text-[#d9edf3] hover:text-white sm:inline-flex"><Upload className="h-4 w-4" /> Atualizar dados</Link>
        </header>

        <main className="grid items-center gap-10 py-9 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <section className="max-w-xl">
            <h1 className="text-4xl font-semibold leading-none tracking-[-.045em] text-white sm:text-6xl">Gestão de contratos</h1>
            <p className="mt-4 text-base text-[#d9edf3] sm:text-lg">Contratos, colaboradores e custos.</p>
            <Link href="/dashboard" className="group mt-8 inline-flex items-center gap-2 border-b-2 border-[#00a6c7] pb-2 text-sm font-bold text-white hover:border-white">Abrir painel <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          </section>

          <nav className="grid border-l border-t border-white/20 sm:grid-cols-2" aria-label="Módulos do dashboard">
            {modules.map(module => { const Icon = module.icon; return <Link key={module.href} href={module.href} className="group flex min-h-[145px] flex-col justify-between border-b border-r border-white/20 bg-[#003f5f]/45 p-5 backdrop-blur-[2px] transition-colors hover:bg-[#005f83]/80"><div className="flex items-start justify-between"><Icon className="h-5 w-5 text-[#8fd2e6]" /><ArrowUpRight className="h-4 w-4 text-[#8fd2e6]/60 group-hover:text-white" /></div><h2 className="text-xl font-semibold text-white">{module.title}</h2></Link>; })}
          </nav>
        </main>

        <section className="grid grid-cols-2 border-l border-t border-white/20 sm:grid-cols-4">
          {metrics.map(([value, label]) => <div key={label} className="border-b border-r border-white/20 bg-[#003f5f]/55 px-4 py-4 backdrop-blur-[2px]"><p className="text-xl font-semibold tracking-tight text-white">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#c2e6f0]">{label}</p></div>)}
        </section>
      </div>
    </div>
  );
}
