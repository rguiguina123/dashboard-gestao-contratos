import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar, ArrowRight } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Novo Relatório de Contratos 2026",
    description: "Publicado o relatório consolidado de contratos do primeiro semestre de 2026 com análise detalhada de despesas.",
    date: "08 de Julho de 2026",
    category: "Relatório",
  },
  {
    id: 2,
    title: "Atualização do Sistema de Gestão",
    description: "Sistema atualizado com novas funcionalidades de filtros avançados e exportação de dados em múltiplos formatos.",
    date: "05 de Julho de 2026",
    category: "Sistema",
  },
  {
    id: 3,
    title: "Reunião de Auditoria Programada",
    description: "Reunião de auditoria dos contratos e colaboradores está programada para 15 de julho de 2026.",
    date: "01 de Julho de 2026",
    category: "Evento",
  },
];

export function NewsSection() {
  return (
    <section className="bg-gradient-to-br from-[#eaf3f7] to-[#f4f5f2] py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-6 w-6 text-[#003f5f]" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Notícias e Comunicados
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Mantenha-se atualizado com as últimas informações do TCU
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-white"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block rounded-full bg-[#c2e6f0] px-3 py-1 text-xs font-semibold text-[#003f5f]">
                    {item.category}
                  </span>
                </div>
                <CardTitle className="text-lg text-foreground line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#003f5f] transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#003f5f] px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#087fa3] hover:shadow-lg">
            Ver Todos os Comunicados
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
