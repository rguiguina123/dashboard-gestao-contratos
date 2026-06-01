import { jsPDF } from "jspdf";

interface ColaboradorData {
  nome: string;
  sec: string;
  funcao: string;
  cpf: string;
}

export function generateColaboradoresPDF(colaboradores: ColaboradorData[]) {
  try {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Cores do modelo
    const colorPrimary = [147, 51, 234]; // Purple
    const colorSecondary = [236, 72, 153]; // Pink
    const colorDark = [30, 30, 30];
    const colorLight = [100, 100, 100];
    const colorBorder = [220, 220, 220];

    // ===== CAPA =====
    // Background gradiente
    doc.setFillColor(147, 51, 234);
    doc.rect(0, 0, pageWidth, pageHeight / 2, "F");

    doc.setFillColor(236, 72, 153);
    doc.rect(0, pageHeight / 2, pageWidth, pageHeight / 2, "F");

    // Forma geométrica
    doc.setFillColor(200, 100, 200);
    doc.triangle(pageWidth * 0.7, 0, pageWidth, pageHeight * 0.3, pageWidth, 0);

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("", "bold");
    doc.text("RELATÓRIO DE COLABORADORES", margin, pageHeight / 2 - 40);

    // Subtítulo
    doc.setFontSize(14);
    doc.setFont("", "normal");
    doc.text("Lista Completa de Colaboradores", margin, pageHeight / 2 - 20);

    // Total de colaboradores
    doc.setFontSize(12);
    doc.text(`Total: ${colaboradores.length} colaboradores`, margin, pageHeight / 2);

    // Data
    doc.setFontSize(10);
    const dataGeracao = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    doc.text(`Relatório gerado em ${dataGeracao}`, margin, pageHeight - 30);

    // ===== PÁGINA 2: RESUMO =====
    doc.addPage();
    yPosition = margin;

    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.setFontSize(18);
    doc.setFont("", "bold");
    doc.text("RESUMO EXECUTIVO", margin, yPosition);
    yPosition += 15;

    // Estatísticas
    const secCount = new Set(colaboradores.map((c) => c.sec)).size;
    const funcaoCount = new Set(colaboradores.map((c) => c.funcao)).size;

    const stats = [
      { label: "Total de Colaboradores", value: colaboradores.length.toString() },
      { label: "SECs Representadas", value: secCount.toString() },
      { label: "Funções Diferentes", value: funcaoCount.toString() },
    ];

    doc.setFontSize(9);
    stats.forEach((stat, idx) => {
      const x = margin + idx * (pageWidth - 2 * margin) / 3;

      doc.setFillColor(240, 230, 255);
      doc.setDrawColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
      doc.setLineWidth(1);
      doc.rect(x, yPosition - 3, (pageWidth - 2 * margin) / 3 - 2, 20, "FD");

      doc.setTextColor(colorLight[0], colorLight[1], colorLight[2]);
      doc.setFont("", "normal");
      doc.setFontSize(8);
      doc.text(stat.label, x + 2, yPosition + 2);

      doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
      doc.setFont("", "bold");
      doc.setFontSize(12);
      doc.text(stat.value, x + 2, yPosition + 12);
    });

    yPosition += 30;

    // ===== DISTRIBUIÇÃO POR FUNÇÃO =====
    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.setFontSize(12);
    doc.setFont("", "bold");
    doc.text("DISTRIBUIÇÃO POR FUNÇÃO", margin, yPosition);
    yPosition += 8;

    const funcaoMap = new Map<string, number>();
    colaboradores.forEach((c) => {
      funcaoMap.set(c.funcao, (funcaoMap.get(c.funcao) || 0) + 1);
    });

    doc.setFontSize(9);
    doc.setFont("", "normal");
    doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);

    Array.from(funcaoMap.entries()).forEach(([funcao, count]) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      const percentage = ((count / colaboradores.length) * 100).toFixed(1);
      doc.text(`• ${funcao}: ${count} (${percentage}%)`, margin + 3, yPosition);
      yPosition += 5;
    });

    // ===== PÁGINA 3+: TABELA COMPLETA =====
    doc.addPage();
    yPosition = margin;

    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.setFontSize(14);
    doc.setFont("", "bold");
    doc.text("LISTA COMPLETA DE COLABORADORES", margin, yPosition);
    yPosition += 10;

    // Cabeçalho da tabela
    doc.setFillColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("", "bold");

    const colWidths = {
      nome: 50,
      sec: 25,
      funcao: 50,
      cpf: 40,
    };

    const totalWidth = colWidths.nome + colWidths.sec + colWidths.funcao + colWidths.cpf;
    const scale = (pageWidth - 2 * margin) / totalWidth;

    const headers = [
      { label: "Nome", width: colWidths.nome * scale },
      { label: "SEC", width: colWidths.sec * scale },
      { label: "Função", width: colWidths.funcao * scale },
      { label: "CPF", width: colWidths.cpf * scale },
    ];

    let xPos = margin;
    headers.forEach((header) => {
      doc.text(header.label, xPos + 1, yPosition);
      xPos += header.width;
    });

    yPosition += 6;

    // Dados da tabela
    doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
    doc.setFont("", "normal");
    doc.setFontSize(7);

    colaboradores.forEach((colab, idx) => {
      if (yPosition > pageHeight - 15) {
        doc.addPage();
        yPosition = margin;

        // Repetir cabeçalho
        doc.setFillColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
        doc.setTextColor(255, 255, 255);
        doc.setFont("", "bold");
        doc.setFontSize(8);

        xPos = margin;
        headers.forEach((header) => {
          doc.text(header.label, xPos + 1, yPosition);
          xPos += header.width;
        });

        yPosition += 6;
        doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
        doc.setFont("", "normal");
        doc.setFontSize(7);
      }

      // Cor de fundo alternada
      if (idx % 2 === 0) {
        doc.setFillColor(245, 240, 250);
        doc.rect(margin, yPosition - 3, pageWidth - 2 * margin, 4, "F");
      }

      // Linha divisória
      doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
      doc.setLineWidth(0.1);
      doc.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);

      xPos = margin;
      const data = [
        colab.nome.substring(0, 30),
        colab.sec,
        colab.funcao.substring(0, 25),
        colab.cpf,
      ];

      data.forEach((value, colIdx) => {
        doc.text(value, xPos + 1, yPosition);
        xPos += headers[colIdx].width;
      });

      yPosition += 4;
    });

    // ===== FOOTER =====
    const pageCount = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setDrawColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
      doc.setLineWidth(1);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      doc.setFontSize(8);
      doc.setTextColor(colorLight[0], colorLight[1], colorLight[2]);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );

      doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
      doc.setFont("", "bold");
      doc.setFontSize(7);
      doc.text("Gestão de Contratos", margin, pageHeight - 8);
    }

    // Save
    const fileName = `Colaboradores_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Erro ao exportar PDF de colaboradores:", error);
    alert("Erro ao exportar PDF. Tente novamente.");
  }
}
