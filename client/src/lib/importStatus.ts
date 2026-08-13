export type ImportStatusPresentation = {
  label: string;
  className: string;
};

export function importStatusPresentation(status: string): ImportStatusPresentation {
  if (status === "approved") {
    return { label: "Aplicada", className: "bg-emerald-100 text-emerald-700" };
  }
  if (status === "rejected") {
    return { label: "Não aplicada", className: "bg-red-100 text-red-700" };
  }
  return { label: "Em processamento", className: "bg-amber-100 text-amber-700" };
}
