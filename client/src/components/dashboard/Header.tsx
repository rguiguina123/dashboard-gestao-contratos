import { GlobalSearch } from "./GlobalSearch";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-[#003f5f] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029089241/WJWhmX29eSkoE3JJHDcEoo/tcu-logo_60c1698f.png"
              alt="TCU Logo"
              className="h-16 w-auto"
            />
            <div className="hidden flex-1 border-l border-[#8fd2e6] pl-4 md:block">
              <p className="text-lg font-semibold">{title || "Gestão de Contrato"}</p>
              {subtitle && (
                <p className="text-sm text-[#c2e6f0]">{subtitle}</p>
              )}
            </div>
            <div className="flex-1 flex justify-center px-4">
              <GlobalSearch />
            </div>
          </div>
          <div className="text-right text-sm text-[#c2e6f0]">
            <p className="font-semibold">Cuidando do Brasil</p>
            <p>Fiscalizando para Transformar</p>
          </div>
        </div>
      </div>
    </header>
  );
}
