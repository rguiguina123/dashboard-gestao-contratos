import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { contratos } from "@/lib/data";

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
          c.sec.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((c, idx) => ({
        type: "contrato" as const,
        id: `c-${idx}`,
        title: `SEC ${c.sec}`,
        subtitle: `Mensal: R$ ${c.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        href: "/contratos",
      }));

    setResults([...contractResults]);
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
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors"
      >
        <Search className="w-4 h-4 text-purple-700" />
        <span className="text-sm text-purple-700 hidden sm:inline">
          Buscar...
        </span>
        <kbd className="hidden md:inline-block ml-auto text-xs px-2 py-1 bg-white rounded border border-purple-200">
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
                      className="block p-3 rounded-lg hover:bg-secondary transition-colors"
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
