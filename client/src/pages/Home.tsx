import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  BarChart3,
  DollarSign,
  ArrowRight,
  Building2,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";
import { contratos, despesasSemContrato, totalMensal, totalAnual } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const moduleIcons = {
  dashboard: BarChart3,
  contratos: FileText,
  colaboradores: Users,
  demonstrativo: BarChart3,
  despesasComContrato: DollarSign,
  despesasSemContrato: Building2,
  custosPorSecretaria: TrendingUp,
  custoPorArea: Activity,
  custosTotal: DollarSign,
  eficienciaServidor: Zap,
  custoServidor: BarChart3,
  quantidadeServidores: Users,
};

export default function Home() {
  const heroImageUrl =
    "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029089241/zHHepfmHYTYxyROd.jpg";

  const modules = [
    {
      title: "Dashboard Executivo",
      description: "Visão geral dos principais indicadores",
      href: "/dashboard",
      icon: "dashboard",
      color: "text-emerald-600",
      metric: "KPIs em tempo real",
    },
    {
      title: "Contratos",
      description: "Gestão completa de contratos controlados",
      href: "/contratos",
      icon: "contratos",
      color: "text-primary",
      metric: `${contratos.length} contratos`,
    },
    {
      title: "Colaboradores",
      description: "Visualize todos os colaboradores por posto e SEC",
      href: "/colaboradores",
      icon: "colaboradores",
      color: "text-blue-600",
      metric: `112 colaboradores`,
    },
    {
      title: "Demonstrativo Total",
      description: "Visão consolidada de todas as despesas",
      href: "/demonstrativo",
      icon: "demonstrativo",
      color: "text-emerald-600",
      metric: formatCurrency(totalAnual),
    },
    {
      title: "Despesas com Contrato",
      description: "Análise de despesas controladas",
      href: "/despesas-com-contrato",
      icon: "despesasComContrato",
      color: "text-amber-600",
      metric: formatCurrency(contratos.reduce((sum, c) => sum + c.anual, 0)),
    },
    {
      title: "Despesas sem Contrato",
      description: "Análise de despesas não controladas",
      href: "/despesas-sem-contrato",
      icon: "despesasSemContrato",
      color: "text-orange-600",
      metric: formatCurrency(despesasSemContrato.reduce((sum, d) => sum + d.anual, 0)),
    },
    {
      title: "Custos por Secretaria",
      description: "Análise detalhada de custos por secretaria",
      href: "/custos-por-secretaria",
      icon: "custosPorSecretaria",
      color: "text-purple-600",
      metric: "27 SECs",
    },
    {
      title: "Custo por Área",
      description: "Custo por metro quadrado de cada secretaria",
      href: "/custo-por-area",
      icon: "custoPorArea",
      color: "text-cyan-600",
      metric: "R$/m²",
    },
    {
      title: "Custos Totais",
      description: "Ranking de custos totais por secretaria",
      href: "/custos-total",
      icon: "custosTotal",
      color: "text-rose-600",
      metric: "Análise completa",
    },
    {
      title: "Eficiência por Servidor",
      description: "Análise de custo e área por servidor",
      href: "/eficiencia-servidor",
      icon: "eficienciaServidor",
      color: "text-indigo-600",
      metric: "Correlação",
    },
    {
      title: "Custo por Servidor",
      description: "Ranking de custo por servidor domiciliado",
      href: "/custo-servidor",
      icon: "custoServidor",
      color: "text-teal-600",
      metric: "R$/servidor",
    },
    {
      title: "Quantidade de Servidores",
      description: "Distribuição de servidores por secretaria",
      href: "/quantidade-servidores",
      icon: "quantidadeServidores",
      color: "text-lime-600",
      metric: "27 SECs",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen md:h-screen overflow-hidden flex items-center justify-center" style={{
        backgroundImage: 'url(https://files.manuscdn.com/user_upload_by_module/session_file/310419663029089241/EfhvJQgUIbupmRzf.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Circle 1 */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          {/* Floating Circle 2 */}
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Logo Corner */}
        <div className="absolute top-8 left-8 z-20">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029089241/WJWhmX29eSkoE3JJHDcEoo/tcu-logo-icon-LMRiQTBgf8v9M4zNSa3vBo.webp" alt="TCU Logo" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          {/* Main Title - Minimalista (Reduzido) */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white font-poppins mb-12 leading-tight tracking-tight" style={{
            textShadow: '0 10px 30px rgba(0,0,0,0.2)',
            letterSpacing: '-0.03em'
          }}>
            <span className="bg-gradient-to-r from-teal-200 to-blue-200 bg-clip-text text-transparent">TCU</span>
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
                Explorar Dashboard
              </button>
            </Link>
            <Link href="/contratos">
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300">
                Ver Contratos
              </button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary font-poppins">
                112
              </p>
              <p className="text-muted-foreground mt-2">Colaboradores</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary font-poppins">
                {contratos.length}
              </p>
              <p className="text-muted-foreground mt-2">Contratos</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary font-poppins">
                48
              </p>
              <p className="text-muted-foreground mt-2">SECs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary font-poppins">
                {formatCurrency(totalMensal)}
              </p>
              <p className="text-muted-foreground mt-2">Mensal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground font-poppins mb-4">
              Módulos do Dashboard
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acesse os diferentes módulos para gerenciar e analisar dados de
              contratos, colaboradores e despesas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const IconComponent = moduleIcons[module.icon as keyof typeof moduleIcons];
              return (
                <Link key={module.href} href={module.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer border-t-4 border-t-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`${module.color}`}>
                          <IconComponent className="w-8 h-8" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-poppins">
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {module.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm font-semibold text-primary">
                          {module.metric}
                        </span>
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-foreground font-poppins mb-4">
                Dados Consolidados
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Contratos: {contratos.length}
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Despesas sem contrato: {despesasSemContrato.length}
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Despesa mensal total: {formatCurrency(totalMensal)}
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Despesa anual total: {formatCurrency(totalAnual)}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground font-poppins mb-4">
                Recursos Disponíveis
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Filtros interativos por SEC/UF
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Gráficos de análise em tempo real
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Tabelas com busca e ordenação
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Métricas consolidadas por categoria
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground font-poppins mb-6">
            Comece a Explorar os Dados
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Navegue pelos módulos acima para visualizar e analisar os dados de
            contratos, colaboradores e despesas
          </p>
          <Link href="/contratos">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Acessar Contratos
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-8 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            Dashboard de Gestão de Contratos e Colaboradores v1.0
          </p>
          <p className="text-xs text-white/60 mt-2">
            Tribunal de Contas da União - TCU
          </p>
        </div>
      </footer>
    </div>
  );
}
