import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Moldura mínima para as páginas analíticas.
 * A navegação global é mantida exclusivamente em FloatingNav, evitando barras
 * laterais e cabeçalhos duplicados dentro do painel.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-10 lg:pb-10 lg:pr-28">
      {children}
    </main>
  );
}
