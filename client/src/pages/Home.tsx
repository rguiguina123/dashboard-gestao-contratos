import { Link } from "wouter";
import { ArrowUpRight, BarChart3, FileText, Landmark, Upload, Users } from "lucide-react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { formatCurrency } from "@/lib/utils";

const backgroundUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029089241/EfhvJQgUIbupmRzf.jpg";
const logoUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029089241/WJWhmX29eSkoE3JJHDcEoo/tcu-logo_60c1698f.png";

export default function Home() {
  const { colaboradores, contratos, secs, totalMensal } = useDashboardData();
  const modules = [
    { number: "01", title: "Visão executiva", text: "Leitura consolidada de contratos, despesas e pessoas.", href: "/dashboard", icon: BarChart3 },
    { number: "02", title: "Contratos", text: "Vigências, fornecedores, valores e alertas de vencimento.", href: "/contratos", icon: FileText },
    { number: "03", title: "Colaboradores", text: "Distribuição por SEC, posto e identificação da base.", href: "/colaboradores", icon: Users },
    { number: "04", title: "Custos", text: "Recortes por secretaria, área e composição de despesa.", href: "/custos-total", icon: Landmark },
  ];

  const metrics = [
    [colaboradores.length, "colaboradores"],
    [contratos.length, "contratos ativos"],
    [secs.length, "SECs na base"],
    [formatCurrency(totalMensal), "despesa mensal"],
  ];

  return (
    <div className="min-h-dvh bg-[#f6f9fa] text-[#102f40]">
      <section
        className="relative isolate overflow-hidden bg-[#003f5f]"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,47,72,.97) 0%, rgba(0,63,95,.91) 45%, rgba(0,63,95,.30) 100%), url(${backgroundUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-y-0 left-[7%] hidden w-px bg-white/20 lg:block" />
        <div className="absolute bottom-0 left-0 h-1 w-[42%] bg-[#00a6c7]" />
        <div className="mx-auto flex min-h-[680px] max-w-[1500px] flex-col justify-between px-6 py-7 pr-24 sm:px-10 sm:pr-28 lg:px-16 lg:py-10 lg:pr-32">
          <header className="flex items-start justify-between gap-6 border-b border-white/20 pb-5">
            <div className="flex items-center gap-4">
              <img src={logoUrl} alt="Tribunal de Contas da União" className="h-11 w-auto bg-white p-1.5 shadow-sm" />
              <div className="border-l border-white/35 pl-4 text-[10px] font-semibold uppercase tracking-[.17em] text-[#c2e6f0]">
                Tribunal de Contas da União
                <span className="mt-1 block text-white">Gestão de contratos</span>
              </div>
            </div>
            <p className="hidden max-w-xs text-right text-xs leading-5 text-[#d9edf3] sm:block">
              Acompanhamento institucional com dados claros para decisões de gestão.
            </p>
          </header>

          <div className="max-w-3xl py-16 sm:py-20">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.21em] text-[#8fd2e6]">
              <span className="h-px w-8 bg-[#00a6c7]" /> Informação para decisão
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-.035em] text-white sm:text-6xl">
              Gestão pública com leitura clara, base confiável e ação responsável.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#d9edf3] sm:text-lg">
              Contratos, colaboradores e custos em uma visão de trabalho direta — feita para acompanhar o que importa, sem ruído.
            </p>
            <div className="mt-9 flex flex-wrap gap-5">
              <Link href="/dashboard" className="group inline-flex items-center gap-3 border-b-2 border-[#00a6c7] pb-2 text-sm font-bold text-white transition-colors hover:border-white hover:text-[#8fd2e6]">
                Abrir visão executiva <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="/atualizar-dados" className="inline-flex items-center gap-2 text-sm font-semibold text-[#d9edf3] transition-colors hover:text-white">
                <Upload className="h-4 w-4" /> Atualizar dados
              </Link>
            </div>
          </div>

          <p className="max-w-sm border-l-2 border-[#00a6c7] pl-4 text-xs leading-5 text-[#c2e6f0]">
            Painel interno de acompanhamento. As informações exibidas refletem a última base de dados validada.
          </p>
        </div>
      </section>

      <section className="border-b border-[#c9dde6] bg-white">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 px-6 pr-24 sm:grid-cols-4 sm:px-10 sm:pr-28 lg:px-16 lg:pr-32">
          {metrics.map(([value, label], index) => (
            <div key={label} className={`border-[#c9dde6] px-4 py-7 ${index > 0 ? "border-l" : ""} ${index > 1 ? "border-t sm:border-t-0" : ""}`}>
              <p className="text-2xl font-semibold tracking-tight text-[#003f5f]">{value}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#547182]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-[1500px] px-6 py-16 pr-24 sm:px-10 sm:pr-28 lg:px-16 lg:pr-32">
        <div className="grid gap-8 border-b border-[#c9dde6] pb-8 lg:grid-cols-[220px_1fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.17em] text-[#087fa3]">Áreas de trabalho</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.03em] text-[#102f40]">Acesse pelo que precisa decidir.</h2>
          </div>
          <p className="max-w-xl self-end text-sm leading-6 text-[#547182]">
            Cada módulo organiza o acompanhamento a partir de uma pergunta de gestão. Não é uma vitrine de indicadores: é uma base de trabalho para a equipe.
          </p>
        </div>

        <div className="mt-1 grid border-l border-t border-[#c9dde6] md:grid-cols-2">
          {modules.map(module => {
            const Icon = module.icon;
            return (
              <Link key={module.href} href={module.href} className="group relative min-h-[260px] border-b border-r border-[#c9dde6] bg-[#f6f9fa] p-7 transition-colors hover:bg-[#eaf3f7] sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-semibold tracking-[.12em] text-[#087fa3]">{module.number}</span>
                  <Icon className="h-5 w-5 text-[#4d88a3] transition-colors group-hover:text-[#003f5f]" />
                </div>
                <div className="absolute bottom-8 left-7 right-7 sm:left-8 sm:right-8">
                  <h3 className="text-2xl font-semibold tracking-[-.025em] text-[#003f5f]">{module.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-[#547182]">{module.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#005f83]">Acessar módulo <ArrowUpRight className="h-3.5 w-3.5" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
