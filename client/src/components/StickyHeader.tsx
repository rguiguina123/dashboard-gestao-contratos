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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-full px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029089241/WJWhmX29eSkoE3JJHDcEoo/ChatGPTImage8dejul.de2026,10_06_22_60c1698f.png"
              alt="TCU"
              className="h-10 w-auto"
            />
            <span className="hidden md:inline text-sm font-semibold text-foreground">
              TCU
            </span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "text-foreground hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
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
        <div className="md:hidden border-t border-border bg-white">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-foreground hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
