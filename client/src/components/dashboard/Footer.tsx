export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-bold font-poppins mb-3">TCU</h3>
            <p className="text-sm text-slate-300">
              Tribunal de Contas da União - Órgão de controle externo do Brasil, responsável pela fiscalização contábil, financeira, orçamentária, operacional e patrimonial da União.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-bold font-poppins mb-3">Links Úteis</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Portal TCU
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Legislação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Transparência
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Informações */}
          <div>
            <h3 className="text-lg font-bold font-poppins mb-3">Informações</h3>
            <div className="text-sm text-slate-300 space-y-2">
              <p>
                <strong>Versão:</strong> 1.0.0
              </p>
              <p>
                <strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}
              </p>
              <p>
                <strong>Conformidade:</strong> LGPD e Lei de Transparência
              </p>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-slate-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>
              © {currentYear} Tribunal de Contas da União. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Acessibilidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
