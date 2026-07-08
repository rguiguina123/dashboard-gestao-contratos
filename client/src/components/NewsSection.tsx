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
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-purple-700" />
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
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
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
                  <ArrowRight className="w-4 h-4 text-purple-700 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
            Ver Todos os Comunicados
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
