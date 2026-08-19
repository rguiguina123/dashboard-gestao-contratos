import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { contratos, colaboradores } from "@/lib/data";

interface SearchResult {
  type: "contrato" | "colaborador";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const contractResults = contratos
      .filter(
        (c) =>
          c.sec.toLowerCase().includes(q) ||
          c.contrato.toLowerCase().includes(q) ||
          c.fornecedor.toLowerCase().includes(q) ||
          c.objeto.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((c, idx) => ({
        type: "contrato" as const,
        id: `c-${idx}`,
        title: `${c.contrato} (${c.sec})`,
        subtitle: `${c.fornecedor} - Mensal: R$ ${c.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        href: "/contratos",
      }));

    const colaboradorResults = colaboradores
      .filter(
        (col: any) =>
          col.nome.toLowerCase().includes(q) ||
          col.sec.toLowerCase().includes(q) ||
          col.funcao.toLowerCase().includes(q) ||
          col.cpf.includes(q)
      )
      .slice(0, 2)
      .map((col: any, idx: number) => ({
        type: "colaborador" as const,
        id: `col-${idx}`,
        title: `${col.nome}`,
        subtitle: `${col.funcao} - SEC: ${col.sec}`,
        href: "/colaboradores",
      }));

    setResults([...contractResults, ...colaboradorResults]);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative">
      {/* Search Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg bg-[#c2e6f0] px-3 py-2 transition-colors hover:bg-[#8fd2e6]"
      >
        <Search className="h-4 w-4 text-[#003f5f]" />
        <span className="hidden text-sm text-[#003f5f] sm:inline">
          Buscar...
        </span>
        <kbd className="ml-auto hidden rounded border border-[#8fd2e6] bg-white px-2 py-1 text-xs md:inline-block">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
          <div className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl animate-slide-in-down">
            {/* Search Input */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Buscar contratos, colaboradores, SECs..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 text-lg"
                />
                <button
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-2">
                  {results.map((result) => (
                    <a
                      key={`${result.type}-${result.id}`}
                      href={result.href}
                      onClick={() => setOpen(false)}
                      className="block cursor-pointer rounded-lg p-3 transition-all duration-200 hover:scale-x-105 hover:bg-[#eaf3f7] hover:shadow-md"
                    >
                      <div className="font-medium text-foreground">
                        {result.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.subtitle}
                      </div>
                    </a>
                  ))}
                </div>
              ) : query ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhum resultado encontrado para "{query}"
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  Digite para buscar...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
