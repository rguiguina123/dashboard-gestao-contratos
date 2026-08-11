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
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-4">
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 ${
              isActive
                ? "bg-primary text-white shadow-lg shadow-primary/50"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white backdrop-blur-md border border-white/20"
            }`}
          >
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
}
