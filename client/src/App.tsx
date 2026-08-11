import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FloatingNav } from "@/components/FloatingNav";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Contratos from "./pages/Contratos";
import Colaboradores from "./pages/Colaboradores";
import Demonstrativo from "./pages/Demonstrativo";
import DespesasContrato from "./pages/DespesasContrato";
import DespesasSemContrato from "./pages/DespesasSemContrato";
import CustosPorSecretaria from "./pages/CustosPorSecretaria";
import CustoPorArea from "./pages/CustoPorArea";
import CustosTotal from "./pages/CustosTotal";
import EficienciaServidor from "./pages/EficienciaServidor";
import CustoServidor from "./pages/CustoServidor";
import QuantidadeServidores from "./pages/QuantidadeServidores";
import AtualizarDados from "./pages/AtualizarDados";
import { DashboardDataProvider } from "./contexts/DashboardDataContext";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/contratos" component={Contratos} />
      <Route path="/colaboradores" component={Colaboradores} />
      <Route path="/demonstrativo" component={Demonstrativo} />
      <Route path="/despesas-com-contrato" component={DespesasContrato} />
      <Route path="/despesas-sem-contrato" component={DespesasSemContrato} />
      <Route path="/custos-por-secretaria" component={CustosPorSecretaria} />
      <Route path="/custo-por-area" component={CustoPorArea} />
      <Route path="/custos-total" component={CustosTotal} />
      <Route path="/eficiencia-servidor" component={EficienciaServidor} />
      <Route path="/custo-servidor" component={CustoServidor} />
      <Route path="/quantidade-servidores" component={QuantidadeServidores} />
      <Route path="/atualizar-dados" component={AtualizarDados} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <DashboardDataProvider>
          <TooltipProvider>
            <FloatingNav />
            <div>
              <Toaster />
              <Router />
            </div>
          </TooltipProvider>
        </DashboardDataProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
