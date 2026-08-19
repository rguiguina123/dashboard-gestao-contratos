import { Link, useLocation } from "wouter";
import {
  FileText,
  Users,
  BarChart3,
  DollarSign,
  Home,
  Upload,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <Home className="w-6 h-6" />,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    label: "Contratos",
    href: "/contratos",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    label: "Colaboradores",
    href: "/colaboradores",
    icon: <Users className="w-6 h-6" />,
  },
  {
    label: "Custos",
    href: "/custos-total",
    icon: <DollarSign className="w-6 h-6" />,
  },
  {
    label: "Atualizar dados",
    href: "/atualizar-dados",
    icon: <Upload className="w-6 h-6" />,
  },
];

export function FloatingNav() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 flex-row gap-1.5 rounded-2xl border border-white/20 bg-[#003f5f]/92 p-1.5 shadow-xl backdrop-blur-md sm:bottom-auto sm:left-auto sm:right-5 sm:top-1/2 sm:flex-col sm:gap-2 sm:-translate-y-1/2 sm:translate-x-0 sm:p-2">
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 sm:h-11 sm:w-11 ${
              isActive
                ? "bg-[#f2c94c] text-[#003f5f] shadow-lg shadow-black/20"
                : "text-white/80 hover:bg-white/10 hover:text-[#cbe59b]"
            }`}
          >
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
}
