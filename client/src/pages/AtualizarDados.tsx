import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle2, Database, FileSpreadsheet, History, LogIn, RefreshCcw, ShieldCheck, UploadCloud, XCircle } from "lucide-react";

type ChangeDetail = { label: string; before?: Record<string, string>; after: Record<string, string> };
type ChangeCounts = { added: number; updated: number; unchanged: number; samples: { added: string[]; updated: string[]; unchanged: string[] }; details: { added: ChangeDetail[]; updated: ChangeDetail[]; unchanged: ChangeDetail[] } };
type ImportSummary = { fileName: string; domains: Record<string, ChangeCounts>; warnings: string[] };

const labels: Record<string, string> = {
  colaboradores: "Colaboradores",
  contratos: "Contratos com vigência controlada",
  despesasSemContrato: "Despesas sem vigência controlada",
  secs: "Secretarias",
  custos: "Custos consolidados",
};

function readAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.readAsDataURL(file);
  });
}

function Summary({ summary }: { summary: ImportSummary }) {
  const entries = Object.entries(summary.domains);
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-emerald-950">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold">Arquivo validado com sucesso</p>
            <p className="mt-1 text-sm text-emerald-800">Revise o comparativo abaixo. A base atual só será alterada após sua confirmação.</p>
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map(([domain, counts]) => (
          <div key={domain} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">{labels[domain] ?? domain}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-emerald-50 px-2 py-2 text-emerald-700"><strong className="block text-lg">{counts.added}</strong>novos</div>
              <div className="rounded-xl bg-amber-50 px-2 py-2 text-amber-700"><strong className="block text-lg">{counts.updated}</strong>alterados</div>
              <div className="rounded-xl bg-slate-100 px-2 py-2 text-slate-600"><strong className="block text-lg">{counts.unchanged}</strong>mantidos</div>
            </div>
            <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-600">
              {counts.samples.added.length > 0 && <p><strong className="text-emerald-700">Incluídos:</strong> {counts.samples.added.join(", ")}</p>}
              {counts.samples.updated.length > 0 && <p><strong className="text-amber-700">Alterados:</strong> {counts.samples.updated.join(", ")}</p>}
              {counts.samples.unchanged.length > 0 && <p><strong className="text-slate-700">Mantidos:</strong> {counts.samples.unchanged.join(", ")}</p>}
            </div>
            <div className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              {(["added", "updated", "unchanged"] as const).flatMap(status => counts.details[status].map(detail => ({ status, detail }))).map(({ status, detail }, index) => (
                <div key={`${detail.label}-${index}`} className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <p className="font-semibold text-slate-800">{status === "added" ? "Incluído" : status === "updated" ? "Alterado" : "Mantido"}: {detail.label}</p>
                  {detail.before && <p className="mt-1 text-slate-500">Antes: {Object.entries(detail.before).map(([field, value]) => `${field}: ${value}`).join(" · ")}</p>}
                  <p className="mt-1 text-slate-700">{detail.before ? "Depois" : "Dados"}: {Object.entries(detail.after).map(([field, value]) => `${field}: ${value}`).join(" · ")}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {summary.warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {summary.warnings.map(warning => <p key={warning}>{warning}</p>)}
        </div>
      )}
    </div>
  );
}

export default function AtualizarDados() {
  const { user, loading, isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [prepared, setPrepared] = useState<{ importId: number; summary: ImportSummary } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const utils = trpc.useUtils();
  const isAdmin = user?.role === "admin";
  const history = trpc.dataImports.history.useQuery(undefined, { enabled: isAuthenticated && isAdmin });
  const prepare = trpc.dataImports.prepare.useMutation({
    onSuccess: result => {
      if (result.state === "invalid") {
        setPrepared(null);
        setValidationErrors(result.errors);
        toast.error("A planilha contém bloqueios que precisam ser corrigidos.");
        return;
      }
      setValidationErrors([]);
      setPrepared({ importId: result.importId, summary: result.summary as ImportSummary });
    },
    onError: error => toast.error(error.message || "Não foi possível validar esta planilha."),
  });
  const approve = trpc.dataImports.approve.useMutation({
    onSuccess: async () => {
      toast.success("Dados atualizados com sucesso no dashboard.");
      setPrepared(null);
      setFile(null);
      await Promise.all([utils.dataImports.current.invalidate(), utils.dataImports.history.invalidate()]);
    },
    onError: error => toast.error(error.message || "Não foi possível aplicar a atualização."),
  });

  const handlePrepare = async () => {
    if (!file) return toast.error("Selecione uma planilha Excel antes de continuar.");
    if (!file.name.toLowerCase().endsWith(".xlsx")) return toast.error("Envie um arquivo no formato .xlsx.");
    if (file.size > 5 * 1024 * 1024) return toast.error("O arquivo deve ter no máximo 5 MB.");
    try {
      const fileBase64 = await readAsBase64(file);
      prepare.mutate({ fileName: file.name, fileBase64 });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível ler o arquivo.");
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-7 pb-12">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-9">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-300"><Database className="h-4 w-4" /> Central de dados do dashboard</div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Atualizar dados com segurança</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Envie uma versão atualizada do Excel. O sistema compara os registros com a base atual, preserva o que não mudou e só aplica as mudanças após sua confirmação.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-200 backdrop-blur">
              <p className="font-semibold text-white">Nenhuma alteração é automática</p>
              <p className="mt-1 text-xs text-slate-300">A última versão aprovada permanece protegida.</p>
            </div>
          </div>
        </section>

        {!loading && !isAuthenticated && (
          <Card className="border-violet-200 bg-violet-50/60">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-semibold text-violet-950">Entre para acessar a central de atualizações</p><p className="mt-1 text-sm text-violet-800">A confirmação de dados é restrita ao responsável pelo dashboard.</p></div>
              <Button onClick={startLogin} className="gap-2 bg-violet-700 hover:bg-violet-800"><LogIn className="h-4 w-4" /> Entrar</Button>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && !isAdmin && (
          <Card className="border-amber-200 bg-amber-50"><CardContent className="flex gap-3 p-6 text-amber-950"><ShieldCheck className="h-5 w-5 shrink-0" /><div><p className="font-semibold">Acesso de visualização</p><p className="mt-1 text-sm">Somente administradores podem validar e aplicar atualizações de dados.</p></div></CardContent></Card>
        )}

        {isAdmin && <>
          <div className="grid gap-7 lg:grid-cols-[1.1fr_.9fr]">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2 text-slate-900"><UploadCloud className="h-5 w-5 text-violet-600" /> Enviar planilha</CardTitle><CardDescription>Arquivos aceitos: Dados de Colaboradores, Gestão de Contratos, Siglas das Secretarias e Custos compilados.</CardDescription></CardHeader>
              <CardContent className="space-y-5">
                <label className="group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/40 px-5 text-center transition hover:border-violet-400 hover:bg-violet-50">
                  <FileSpreadsheet className="h-10 w-10 text-violet-600 transition group-hover:scale-110" />
                  <span className="mt-4 text-sm font-semibold text-slate-800">{file ? file.name : "Clique para escolher uma planilha .xlsx"}</span>
                  <span className="mt-1 text-xs text-slate-500">Limite de 5 MB. Nenhuma atualização é aplicada nesta etapa.</span>
                  <input className="sr-only" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={event => { setFile(event.target.files?.[0] ?? null); setPrepared(null); setValidationErrors([]); }} />
                </label>
                <Button className="w-full gap-2 bg-violet-700 hover:bg-violet-800" disabled={!file || prepare.isPending} onClick={handlePrepare}>
                  {prepare.isPending ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />} {prepare.isPending ? "Comparando dados..." : "Validar e comparar"}
                </Button>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm"><CardHeader><CardTitle className="text-slate-900">Como a comparação funciona</CardTitle></CardHeader><CardContent className="space-y-4 text-sm text-slate-600">
              <div className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">1</span><p><strong className="text-slate-800">Validação:</strong> confere abas, colunas obrigatórias e campos essenciais.</p></div>
              <div className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">2</span><p><strong className="text-slate-800">Comparação:</strong> identifica novos registros, alterações e itens mantidos.</p></div>
              <div className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">3</span><p><strong className="text-slate-800">Confirmação:</strong> aplica apenas após sua aprovação e guarda uma cópia do arquivo.</p></div>
            </CardContent></Card>
          </div>

          {validationErrors.length > 0 && <Card className="border-red-200 bg-red-50"><CardHeader><CardTitle className="flex items-center gap-2 text-red-900"><XCircle className="h-5 w-5" /> Bloqueios de validação</CardTitle><CardDescription className="text-red-800">Corrija os itens abaixo na planilha antes de tentar novamente.</CardDescription></CardHeader><CardContent><ul className="space-y-2 text-sm text-red-900">{validationErrors.map(error => <li key={error} className="rounded-lg border border-red-200 bg-white/70 p-3">{error}</li>)}</ul></CardContent></Card>}

          {prepared && <Card className="border-violet-200 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-slate-900"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Comparativo pronto para confirmação</CardTitle><CardDescription>Arquivo: {prepared.summary.fileName}</CardDescription></CardHeader><CardContent className="space-y-6"><Summary summary={prepared.summary} /><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => setPrepared(null)}>Cancelar esta importação</Button><Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" disabled={approve.isPending} onClick={() => approve.mutate({ importId: prepared.importId })}>{approve.isPending ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Confirmar e atualizar dashboard</Button></div></CardContent></Card>}

          <Card className="border-slate-200 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-slate-900"><History className="h-5 w-5 text-slate-500" /> Histórico recente</CardTitle><CardDescription>Versões confirmadas preservam a continuidade do dashboard.</CardDescription></CardHeader><CardContent>
            {history.isLoading ? <p className="text-sm text-slate-500">Carregando histórico...</p> : (history.data?.length ?? 0) === 0 ? <p className="text-sm text-slate-500">Ainda não há importações registradas.</p> : <div className="space-y-3">{history.data?.map(item => <div key={item.id} className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-slate-800">{item.fileName}</p><p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString("pt-BR")}</p></div><span className={item.status === "approved" ? "inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700" : "inline-flex w-fit rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"}>{item.status === "approved" ? "Aplicada" : "Aguardando confirmação"}</span></div>)}</div>}
          </CardContent></Card>
        </>}
      </div>
    </DashboardLayout>
  );
}
