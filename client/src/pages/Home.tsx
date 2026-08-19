import { Link } from "wouter";
import { ArrowUpRight, BarChart3, Building2, DollarSign, FileText, Users } from "lucide-react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { formatCurrency } from "@/lib/utils";

const blueprintUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029089241/EfhvJQgUIbupmRzf.jpg";
const logoUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029089241/mFnIBTOhrAWwXLqZ.png";

const accessModules = [
  { label: "Visão executiva", href: "/dashboard", icon: BarChart3, accent: "border-t-[#087fa3] text-[#8fd2e6]" },
  { label: "Contratos", href: "/contratos", icon: FileText, accent: "border-t-[#f2c94c] text-[#f6da73]" },
  { label: "Colaboradores", href: "/colaboradores", icon: Users, accent: "border-t-[#89ad45] text-[#cbe59b]" },
  { label: "Custos", href: "/custos-total", icon: Building2, accent: "border-t-[#087fa3] text-[#8fd2e6]" },
];

const analysisModules = [
  { label: "Demonstrativo", href: "/demonstrativo", icon: BarChart3 },
  { label: "Com contrato", href: "/despesas-com-contrato", icon: DollarSign },
  { label: "Sem contrato", href: "/despesas-sem-contrato", icon: FileText },
  { label: "Por secretaria", href: "/custos-por-secretaria", icon: Building2 },
  { label: "Por área", href: "/custo-por-area", icon: BarChart3 },
  { label: "Por servidor", href: "/custo-servidor", icon: Users },
  { label: "Eficiência", href: "/eficiencia-servidor", icon: DollarSign },
  { label: "Quantidade", href: "/quantidade-servidores", icon: Users },
];

export default function Home() {
  const { colaboradores, contratos, totalMensal } = useDashboardData();
  const totalSecs = new Set(colaboradores.map((item: { sec?: string }) => item.sec).filter(Boolean)).size;

  const metrics = [
    { value: colaboradores.length, label: "colaboradores", accent: "text-[#cbe59b]" },
    { value: contratos.length, label: "contratos", accent: "text-[#f6da73]" },
    { value: totalSecs, label: "SECs", accent: "text-[#8fd2e6]" },
    { value: formatCurrency(totalMensal), label: "por mês", accent: "text-white" },
  ];

  return (
    <main className="min-h-screen bg-[#f4f5f2] text-[#003f5f]">
      <section
        className="relative min-h-[760px] overflow-hidden bg-[#003f5f] lg:min-h-screen"
        style={{ backgroundImage: `url(${blueprintUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#003f5f]/95 via-[#003f5f]/82 to-[#003f5f]/20" />
        <div className="absolute inset-x-0 top-0 h-1 bg-[#f2c94c]" />

        <header className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 lg:px-12">
          <img src={logoUrl} alt="Tribunal de Contas da União" className="h-12 w-12 rounded-md bg-white object-contain p-1.5" />
          <Link href="/atualizar-dados" className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition hover:text-[#f6da73]">
            Atualizar dados <ArrowUpRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="relative z-10 mx-auto grid max-w-[1440px] items-center gap-12 px-6 pb-10 pt-16 lg:grid-cols-[.9fr_1.1fr] lg:px-12 lg:pb-36 lg:pt-24">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-[#cbe59b]">Gestão de contratos</p>
            <h1 className="max-w-lg text-5xl font-semibold leading-[.98] tracking-tight text-white sm:text-6xl lg:text-7xl">Gestão de<br />contratos</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/75">Contratos, colaboradores e custos em uma visão de trabalho direta.</p>
            <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#f2c94c] pb-1 text-sm font-bold text-white transition hover:text-[#f6da73]">
              Abrir painel <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid overflow-hidden border border-white/25 bg-[#003f5f]/45 backdrop-blur-sm sm:grid-cols-2">
            {accessModules.map(({ label, href, icon: Icon, accent }) => (
              <Link key={href} href={href} className={`group min-h-40 border-t-4 border-r border-white/20 p-5 transition hover:bg-white/10 ${accent}`}>
                <div className="flex items-start justify-between"><Icon className="h-5 w-5" /><ArrowUpRight className="h-4 w-4 text-white/55 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
                <span className="mt-12 block text-lg font-semibold text-white">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1440px] border-y border-white/20 bg-[#003f5f]/70 px-6 backdrop-blur-sm sm:grid-cols-4 lg:absolute lg:bottom-8 lg:left-1/2 lg:w-[calc(100%-6rem)] lg:-translate-x-1/2 lg:px-0">
          {metrics.map((metric) => (
            <div key={metric.label} className="border-b border-white/15 px-5 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:px-7">
              <p className={`text-2xl font-semibold tracking-tight ${metric.accent}`}>{metric.value}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-white/65">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#c9dde6] pb-5 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#55752c]">Análises</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Acesse pelo que precisa decidir.</h2></div>
          <p className="max-w-sm text-sm leading-6 text-[#547182]">Indicadores, filtros e relatórios organizados por assunto.</p>
        </div>
        <div className="grid gap-px bg-[#c9dde6] sm:grid-cols-2 lg:grid-cols-4">
          {analysisModules.map(({ label, href, icon: Icon }, index) => (
            <Link key={href} href={href} className="group flex min-h-32 flex-col justify-between bg-[#f4f5f2] p-5 transition hover:bg-white">
              <Icon className={`h-5 w-5 ${index % 3 === 0 ? "text-[#087fa3]" : index % 3 === 1 ? "text-[#55752c]" : "text-[#b6873c]"}`} />
              <div className="flex items-center justify-between gap-3"><span className="font-semibold text-[#003f5f]">{label}</span><ArrowUpRight className="h-4 w-4 text-[#547182] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
