import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Contratos from "./pages/Contratos";
import Colaboradores from "./pages/Colaboradores";
import Demonstrativo from "./pages/Demonstrativo";
import DespesasContrato from "./pages/DespesasContrato";
import DespesasSemContrato from "./pages/DespesasSemContrato";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/contratos" component={Contratos} />
      <Route path="/colaboradores" component={Colaboradores} />
      <Route path="/demonstrativo" component={Demonstrativo} />
      <Route path="/despesas-com-contrato" component={DespesasContrato} />
      <Route path="/despesas-sem-contrato" component={DespesasSemContrato} />
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
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
