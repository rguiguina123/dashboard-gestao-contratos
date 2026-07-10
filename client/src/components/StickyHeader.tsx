import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  BarChart3,
  DollarSign,
  Home,
  TrendingUp,
  Zap,
  Server,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <Home className="w-4 h-4" />,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    label: "Contratos",
    href: "/contratos",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    label: "Colaboradores",
    href: "/colaboradores",
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: "Custos",
    href: "/custos-total",
    icon: <DollarSign className="w-4 h-4" />,
  },
];

export function StickyHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 shadow-lg backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310419663029089241/WJWhmX29eSkoE3JJHDcEoo/brasilia-blueprint_60c1698f.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'overlay',
      }}
    >
      
      <div className="relative max-w-full px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Logo - Vazio, apenas para espaçamento */}
        <div className="w-10"></div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10"
              }`}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white hover:bg-white/10"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="relative md:hidden border-t border-white/20 bg-black/60">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
