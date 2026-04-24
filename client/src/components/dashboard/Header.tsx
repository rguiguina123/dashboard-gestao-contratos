import { Link } from "wouter";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold font-poppins">
                TCU
              </h1>
              <p className="text-sm text-purple-100">
                Tribunal de Contas da União
              </p>
            </div>
            <div className="hidden md:block border-l border-purple-400 pl-4">
              <p className="text-lg font-semibold">{title || "Dashboard de Gestão"}</p>
              {subtitle && (
                <p className="text-sm text-purple-100">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-purple-100">
            <p className="font-semibold">Cuidando do Brasil</p>
            <p>Fiscalizando para Transformar</p>
          </div>
        </div>
      </div>
    </header>
  );
}
