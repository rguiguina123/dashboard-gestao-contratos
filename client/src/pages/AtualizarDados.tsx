import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { importStatusPresentation } from "@/lib/importStatus";
import { toast } from "sonner";
import { CheckCircle2, Database, FileSpreadsheet, History, RefreshCcw, ShieldCheck, UploadCloud, XCircle } from "lucide-react";

type ChangeDetail = { label: string; before?: Record<string, string>; after: Record<string, string> };
type ChangeCounts = { added: number; updated: number; unchanged: number; removed: number; samples: { added: string[]; updated: string[]; unchanged: string[]; removed: string[] }; details: { added: ChangeDetail[]; updated: ChangeDetail[]; unchanged: ChangeDetail[]; removed: ChangeDetail[] } };
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

function Summary({ summary, applied }: { summary: ImportSummary; applied: boolean }) {
  const entries = Object.entries(summary.domains);
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#cbe59b] bg-[#eef4df] p-4 text-[#355224]">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#55752c]" />
          <div>
            <p className="font-semibold">{applied ? "Atualização aplicada com sucesso" : "Comparativo pronto"}</p>
            <p className="mt-1 text-sm text-[#55752c]">{applied ? "Confira abaixo tudo o que entrou, mudou, permaneceu ou saiu da base." : "Confira abaixo tudo o que entrará, mudará, permanecerá ou sairá. A atualização será aplicada automaticamente em instantes."}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map(([domain, counts]) => (
          <div key={domain} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">{labels[domain] ?? domain}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-xl bg-[#eef4df] px-2 py-2 text-[#55752c]"><strong className="block text-lg">{counts.added}</strong>novos</div>
              <div className="rounded-xl bg-[#fff8df] px-2 py-2 text-[#9a7514]"><strong className="block text-lg">{counts.updated}</strong>alterados</div>
              <div className="rounded-xl bg-slate-100 px-2 py-2 text-slate-600"><strong className="block text-lg">{counts.unchanged}</strong>mantidos</div>
              <div className="rounded-xl bg-rose-50 px-2 py-2 text-rose-700"><strong className="block text-lg">{counts.removed}</strong>saindo</div>
            </div>
            <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-600">
              {counts.samples.added.length > 0 && <p><strong className="text-[#55752c]">Incluídos:</strong> {counts.samples.added.join(", ")}</p>}
              {counts.samples.updated.length > 0 && <p><strong className="text-[#9a7514]">Alterados:</strong> {counts.samples.updated.join(", ")}</p>}
              {counts.samples.unchanged.length > 0 && <p><strong className="text-slate-700">Mantidos:</strong> {counts.samples.unchanged.join(", ")}</p>}
              {counts.samples.removed.length > 0 && <p><strong className="text-rose-700">Saindo:</strong> {counts.samples.removed.join(", ")}</p>}
            </div>
            <div className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              {(["added", "updated", "unchanged", "removed"] as const).flatMap(status => counts.details[status].map(detail => ({ status, detail }))).map(({ status, detail }, index) => (
                <div key={`${detail.label}-${index}`} className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <p className="font-semibold text-slate-800">{status === "added" ? "Incluído" : status === "updated" ? "Alterado" : status === "removed" ? "Saindo" : "Mantido"}: {detail.label}</p>
                  {detail.before && <p className="mt-1 text-slate-500">Antes: {Object.entries(detail.before).map(([field, value]) => `${field}: ${value}`).join(" · ")}</p>}
                  <p className="mt-1 text-slate-700">{detail.before ? "Depois" : "Dados"}: {Object.entries(detail.after).map(([field, value]) => `${field}: ${value}`).join(" · ")}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {summary.warnings.length > 0 && (
        <div className="rounded-xl border border-[#f2c94c] bg-[#fff8df] p-4 text-sm text-[#6d5410]">
          {summary.warnings.map(warning => <p key={warning}>{warning}</p>)}
        </div>
      )}
    </div>
  );
}

export default function AtualizarDados() {
  const [file, setFile] = useState<File | null>(null);
  const [prepared, setPrepared] = useState<{ importId: number; summary: ImportSummary } | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [wasApplied, setWasApplied] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const utils = trpc.useUtils();
  const history = trpc.dataImports.history.useQuery();
  const approve = trpc.dataImports.approve.useMutation({
    onSuccess: async () => {
      setIsApplying(false);
      setWasApplied(true);
      setFile(null);
      toast.success("Dados atualizados com sucesso no dashboard.");
      await Promise.all([utils.dataImports.current.invalidate(), utils.dataImports.history.invalidate()]);
    },
    onError: error => {
      setIsApplying(false);
      toast.error(error.message || "Não foi possível aplicar a atualização.");
    },
  });
  const prepare = trpc.dataImports.prepare.useMutation({
    onSuccess: async result => {
      if (result.state === "invalid") {
        setPrepared(null);
        setValidationErrors(result.errors);
        toast.error("A planilha contém bloqueios que precisam ser corrigidos.");
        return;
      }
      setValidationErrors([]);
      setPrepared({ importId: result.importId, summary: result.summary as ImportSummary });
      setWasApplied(false);
      setIsApplying(false);
    },
    onError: error => toast.error(error.message || "Não foi possível validar esta planilha."),
  });

  useEffect(() => {
    if (!prepared || wasApplied || isApplying) return;
    const timer = window.setTimeout(() => {
      setIsApplying(true);
      approve.mutate({ importId: prepared.importId });
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [approve, isApplying, prepared, wasApplied]);

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
      <div className="mx-auto max-w-none space-y-5 pb-6">
        <section className="relative overflow-hidden border-b-4 border-[#f2c94c] bg-[#003f5f] px-6 py-6 text-white shadow-[0_12px_26px_rgba(0,63,95,.16)] sm:px-8">
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#8fd2e6]"><Database className="h-4 w-4" /> Dados</div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Atualizar base</h1>
              <p className="mt-2 text-sm text-slate-300">Envie uma planilha Excel.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-200 backdrop-blur">
              <p className="font-semibold text-white">Arquivo inválido não altera a base.</p>
            </div>
          </div>
        </section>

        <>
          <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-[#003f5f]"><UploadCloud className="h-5 w-5 text-[#087fa3]" /> Enviar planilha</CardTitle><CardDescription>Excel oficial · até 5 MB</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <label className="group flex min-h-40 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#8fb8cc] bg-[#f6f9fa] px-5 text-center transition hover:border-[#087fa3] hover:bg-[#eaf3f7]">
                  <FileSpreadsheet className="h-10 w-10 text-[#087fa3] transition group-hover:scale-110" />
                  <span className="mt-4 text-sm font-semibold text-slate-800">{file ? file.name : "Clique para escolher uma planilha .xlsx"}</span>
                  <span className="mt-1 text-xs text-slate-500">.xlsx · até 5 MB</span>
                  <input className="sr-only" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={event => { setFile(event.target.files?.[0] ?? null); setPrepared(null); setValidationErrors([]); setWasApplied(false); }} />
                </label>
                <Button className="w-full gap-2 bg-[#005f83] hover:bg-[#003f5f]" disabled={!file || prepare.isPending} onClick={handlePrepare}>
                  {prepare.isPending ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />} {prepare.isPending ? "Validando e atualizando..." : "Validar e atualizar"}
                </Button>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm"><CardHeader className="pb-3"><CardTitle className="text-slate-900">Processo</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-slate-600">
              <div className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#eef4df] font-bold text-[#55752c]">1</span><p>Valida a planilha.</p></div>
              <div className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#fff8df] font-bold text-[#9a7514]">2</span><p>Mostra as diferenças.</p></div>
              <div className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#005f83] font-bold text-white">3</span><p>Aplica e registra.</p></div>
            </CardContent></Card>
          </div>

          {validationErrors.length > 0 && <Card className="border-red-200 bg-red-50"><CardHeader><CardTitle className="flex items-center gap-2 text-red-900"><XCircle className="h-5 w-5" /> Bloqueios de validação</CardTitle><CardDescription className="text-red-800">Corrija os itens abaixo na planilha antes de tentar novamente.</CardDescription></CardHeader><CardContent><ul className="space-y-2 text-sm text-red-900">{validationErrors.map(error => <li key={error} className="rounded-lg border border-red-200 bg-white/70 p-3">{error}</li>)}</ul></CardContent></Card>}

          {prepared && <Card className="border-[#8fb8cc] shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-[#003f5f]"><CheckCircle2 className="h-5 w-5 text-[#087fa3]" /> {wasApplied ? "Atualização aplicada" : "Comparativo da atualização"}</CardTitle><CardDescription>{wasApplied ? `Arquivo: ${prepared.summary.fileName}. Confira abaixo o resumo da alteração realizada.` : "A atualização será aplicada automaticamente após a exibição deste comparativo."}</CardDescription></CardHeader><CardContent className="space-y-6"><Summary summary={prepared.summary} applied={wasApplied} />{isApplying && <div className="flex items-center gap-2 rounded-xl bg-[#eaf3f7] px-4 py-3 text-sm font-medium text-[#003f5f]"><RefreshCcw className="h-4 w-4 animate-spin" /> Aplicando a atualização...</div>}<div className="flex justify-end"><Button variant="outline" disabled={isApplying} onClick={() => setPrepared(null)}>Fechar resumo</Button></div></CardContent></Card>}

          <Card className="border-slate-200 shadow-sm"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-slate-900"><History className="h-5 w-5 text-slate-500" /> Histórico</CardTitle></CardHeader><CardContent>
            {history.isLoading ? <p className="text-sm text-slate-500">Carregando histórico...</p> : (history.data?.length ?? 0) === 0 ? <p className="text-sm text-slate-500">Ainda não há importações registradas.</p> : <div className="space-y-3">{history.data?.map(item => {
              const status = importStatusPresentation(item.status);
              return <div key={item.id} className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-slate-800">{item.fileName}</p><p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString("pt-BR")}</p></div><span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span></div>;
            })}</div>}
          </CardContent></Card>
        </>
      </div>
    </DashboardLayout>
  );
}
