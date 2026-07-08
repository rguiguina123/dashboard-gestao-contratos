import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import { DateRangeFilter } from "../DateRangeFilter";
import {
  FileText,
  Users,
  BarChart3,
  DollarSign,
  Menu,
  X,
  Home,
  TrendingUp,
  Zap,
  Server,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Relatório",
    href: "/dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Contratos",
    href: "/contratos",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Colaboradores",
    href: "/colaboradores",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Demonstrativo Total",
    href: "/demonstrativo",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Despesas com Contrato",
    href: "/despesas-com-contrato",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    label: "Despesas sem Contrato",
    href: "/despesas-sem-contrato",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    label: "Custos por Secretaria",
    href: "/custos-por-secretaria",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Custo por Área",
    href: "/custo-por-area",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: "Custos Totais",
    href: "/custos-total",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    label: "Eficiência por Servidor",
    href: "/eficiencia-servidor",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    label: "Custo por Servidor",
    href: "/custo-servidor",
    icon: <Server className="w-5 h-5" />,
  },
  {
    label: "Quantidade de Servidores",
    href: "/quantidade-servidores",
    icon: <Server className="w-5 h-5" />,
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="h-20 border-b border-border flex items-center justify-between px-4 bg-gradient-to-r from-purple-800 to-purple-700">
          {sidebarOpen && (
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029089241/WJWhmX29eSkoE3JJHDcEoo/tcu-logo_60c1698f.png"
              alt="TCU"
              className="h-12 w-auto"
            />
          )}
          {!sidebarOpen && (
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029089241/WJWhmX29eSkoE3JJHDcEoo/tcu-logo_60c1698f.png"
              alt="TCU"
              className="h-10 w-auto"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-md"
                    : "text-foreground hover:bg-purple-50"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="border-t border-border p-4 text-xs text-muted-foreground">
            <p className="font-semibold mb-2">Gestão de Contrato v1.0</p>
            <p>Gestão de Contratos e Colaboradores</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6 flex justify-end">
            <DateRangeFilter />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
