import html2pdf from 'html2pdf.js';

export const generateContractsPDF = (contracts: any[], metrics: any) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          background: white;
        }
        .page {
          page-break-after: always;
          padding: 40px;
          background: white;
        }
        .header {
          background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
          color: white;
          padding: 60px 40px;
          border-radius: 10px;
          margin-bottom: 40px;
          text-align: center;
        }
        .header h1 {
          font-size: 48px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .header p {
          font-size: 18px;
          opacity: 0.9;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        .metric-box {
          background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
          padding: 25px;
          border-radius: 8px;
          border-left: 4px solid #7c3aed;
        }
        .metric-box h3 {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
          text-transform: uppercase;
          font-weight: 600;
        }
        .metric-box .value {
          font-size: 28px;
          color: #7c3aed;
          font-weight: 700;
        }
        .section-title {
          font-size: 24px;
          color: #7c3aed;
          margin: 30px 0 20px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #ec4899;
          font-weight: 700;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 12px;
        }
        th {
          background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          border: none;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        tr:nth-child(even) {
          background: #f9fafb;
        }
        tr:hover {
          background: #f3e8ff;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        .alert {
          background: #fee2e2;
          border-left: 4px solid #dc2626;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 4px;
          font-size: 13px;
        }
        .alert-title {
          color: #dc2626;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .alert-content {
          color: #7f1d1d;
        }
        .status-vencido {
          color: #dc2626;
          font-weight: 600;
        }
        .status-breve {
          color: #f97316;
          font-weight: 600;
        }
        .status-ativo {
          color: #16a34a;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <!-- Página 1: Capa e Resumo -->
      <div class="page">
        <div class="header">
          <h1>RELATÓRIO DE CONTRATOS</h1>
          <p>Gestão e Análise de Contratos Vigentes</p>
        </div>

        <div class="metrics">
          <div class="metric-box">
            <h3>Total de Contratos</h3>
            <div class="value">${metrics.total}</div>
          </div>
          <div class="metric-box">
            <h3>Despesa Mensal</h3>
            <div class="value">R$ ${(metrics.mensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div class="metric-box">
            <h3>Despesa Anual</h3>
            <div class="value">R$ ${(metrics.anual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div class="alert">
          <div class="alert-title">⚠️ Atenção - Contratos Vencidos</div>
          <div class="alert-content">
            ${metrics.vencidos} contrato(s) vencido(s) - Ação imediata recomendada
          </div>
        </div>

        <div class="alert" style="background: #fef3c7; border-left-color: #f59e0b;">
          <div class="alert-title" style="color: #f59e0b;">⏰ Vencimento Próximo</div>
          <div class="alert-content" style="color: #92400e;">
            ${metrics.breve} contrato(s) vencendo em breve (até 30 dias)
          </div>
        </div>

        <p style="margin-top: 40px; text-align: center; color: #999; font-size: 12px;">
          Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
        </p>
      </div>

      <!-- Página 2: Detalhes dos Contratos -->
      <div class="page">
        <h2 class="section-title">Detalhes dos Contratos</h2>
        
        <table>
          <thead>
            <tr>
              <th>Contrato</th>
              <th>Fornecedor</th>
              <th>Objeto</th>
              <th>SEC</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Valor Mensal</th>
            </tr>
          </thead>
          <tbody>
            ${contracts.map((c: any) => `
              <tr>
                <td>${c.numero}</td>
                <td>${c.fornecedor}</td>
                <td>${c.objeto}</td>
                <td>${c.sec}</td>
                <td>${c.dataVencimento}</td>
                <td>
                  ${c.diasParaVencer < 0 ? 
                    `<span class="status-vencido">Vencido há ${Math.abs(c.diasParaVencer)} dias</span>` :
                    c.diasParaVencer <= 30 ?
                    `<span class="status-breve">Vence em ${c.diasParaVencer} dias</span>` :
                    `<span class="status-ativo">Ativo</span>`
                  }
                </td>
                <td>R$ ${(c.valorMensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <div>
              <div style="color: #666; font-size: 12px; margin-bottom: 5px;">Total Mensal</div>
              <div style="font-size: 18px; font-weight: 700; color: #7c3aed;">
                R$ ${(metrics.mensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div style="color: #666; font-size: 12px; margin-bottom: 5px;">Total Anual</div>
              <div style="font-size: 18px; font-weight: 700; color: #7c3aed;">
                R$ ${(metrics.anual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div style="color: #666; font-size: 12px; margin-bottom: 5px;">Contratos Ativos</div>
              <div style="font-size: 18px; font-weight: 700; color: #16a34a;">
                ${metrics.ativos}
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const opt: any = {
    margin: 0,
    filename: `Relatorio_Contratos_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(opt).from(htmlContent).save();
};

export const generateColaboradoresPDF = (colaboradores: any[], metrics: any) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          background: white;
          font-size: 11px;
        }
        .page {
          padding: 30px;
          background: white;
        }
        .header {
          background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
          color: white;
          padding: 40px;
          border-radius: 10px;
          margin-bottom: 25px;
          text-align: center;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 8px;
          font-weight: 700;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }
        .metric-box {
          background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
          padding: 15px;
          border-radius: 6px;
          border-left: 3px solid #7c3aed;
          text-align: center;
        }
        .metric-box h3 {
          font-size: 11px;
          color: #666;
          margin-bottom: 8px;
          text-transform: uppercase;
          font-weight: 600;
        }
        .metric-box .value {
          font-size: 20px;
          color: #7c3aed;
          font-weight: 700;
        }
        .section-title {
          font-size: 16px;
          color: #7c3aed;
          margin: 20px 0 12px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #ec4899;
          font-weight: 700;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 10px;
        }
        th {
          background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
          color: white;
          padding: 8px;
          text-align: left;
          font-weight: 600;
          border: none;
        }
        td {
          padding: 6px 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        tr:nth-child(even) {
          background: #f9fafb;
        }
        .footer {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
          font-size: 10px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <h1>RELATÓRIO DE COLABORADORES</h1>
          <p>Lista Completa de Colaboradores</p>
        </div>

        <div class="metrics">
          <div class="metric-box">
            <h3>Total</h3>
            <div class="value">${metrics.total}</div>
          </div>
          <div class="metric-box">
            <h3>Funções</h3>
            <div class="value">${metrics.funcoes}</div>
          </div>
          <div class="metric-box">
            <h3>SECs</h3>
            <div class="value">${metrics.secs}</div>
          </div>
          <div class="metric-box">
            <h3>Postos</h3>
            <div class="value">${metrics.postos}</div>
          </div>
        </div>

        <h2 class="section-title">Colaboradores</h2>
        
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>SEC</th>
              <th>Função</th>
              <th>CPF</th>
            </tr>
          </thead>
          <tbody>
            ${colaboradores.map((c: any) => `
              <tr>
                <td>${c.nome}</td>
                <td>${c.sec}</td>
                <td>${c.funcao}</td>
                <td>${c.cpf}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p style="margin-top: 8px; color: #999;">Gestão de Contratos e Colaboradores v1.0</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const opt: any = {
    margin: 0,
    filename: `Relatorio_Colaboradores_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(opt).from(htmlContent).save();
};
