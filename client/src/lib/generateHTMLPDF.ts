import html2pdf from 'html2pdf.js';

export const generateContractsPDF = (contracts: any[], metrics: any) => {
  // Limitar a 20 contratos por página para caber em 2 páginas
  const contractsPerPage = 20;
  const page1Contracts = contracts.slice(0, contractsPerPage);
  const page2Contracts = contracts.slice(contractsPerPage, contractsPerPage * 2);
  
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
          padding: 25px;
          background: white;
        }
        .page:last-child {
          page-break-after: avoid;
        }
        .header {
          background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
          color: white;
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 5px;
          font-weight: 700;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .metric-box {
          background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
          padding: 12px;
          border-radius: 6px;
          border-left: 3px solid #7c3aed;
          text-align: center;
        }
        .metric-box h3 {
          font-size: 11px;
          color: #666;
          margin-bottom: 5px;
          text-transform: uppercase;
          font-weight: 600;
        }
        .metric-box .value {
          font-size: 18px;
          color: #7c3aed;
          font-weight: 700;
        }
        .alert {
          background: #fee2e2;
          border-left: 3px solid #dc2626;
          padding: 10px;
          margin-bottom: 12px;
          border-radius: 4px;
          font-size: 11px;
        }
        .alert-title {
          color: #dc2626;
          font-weight: 600;
          margin-bottom: 3px;
        }
        .alert-content {
          color: #7f1d1d;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
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
        .section-title {
          font-size: 14px;
          color: #7c3aed;
          margin: 12px 0 8px 0;
          padding-bottom: 5px;
          border-bottom: 2px solid #ec4899;
          font-weight: 700;
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
        .footer {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid #e5e7eb;
          font-size: 9px;
          color: #999;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <!-- Página 1: Capa, Resumo e Primeira Parte da Tabela -->
      <div class="page">
        <div class="header">
          <h1>RELATÓRIO DE CONTRATOS</h1>
          <p>Gestão e Análise de Contratos Vigentes</p>
        </div>

        <div class="metrics">
          <div class="metric-box">
            <h3>Total</h3>
            <div class="value">${metrics.total}</div>
          </div>
          <div class="metric-box">
            <h3>Mensal</h3>
            <div class="value">R$ ${(metrics.mensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</div>
          </div>
          <div class="metric-box">
            <h3>Anual</h3>
            <div class="value">R$ ${(metrics.anual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</div>
          </div>
          <div class="metric-box">
            <h3>Ativos</h3>
            <div class="value">${metrics.ativos}</div>
          </div>
        </div>

        <div class="alert">
          <div class="alert-title">⚠️ Vencidos: ${metrics.vencidos}</div>
          <div class="alert-content">Ação imediata recomendada para contratos vencidos</div>
        </div>

        <div class="alert" style="background: #fef3c7; border-left-color: #f59e0b;">
          <div class="alert-title" style="color: #f59e0b;">⏰ Vencendo: ${metrics.breve}</div>
          <div class="alert-content" style="color: #92400e;">Contratos vencendo em até 30 dias</div>
        </div>

        <h2 class="section-title">Contratos (Parte 1 de 2)</h2>
        
        <table>
          <thead>
            <tr>
              <th>Contrato</th>
              <th>Fornecedor</th>
              <th>SEC</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${page1Contracts.map((c: any) => `
              <tr>
                <td>${c.numero}</td>
                <td>${c.fornecedor?.substring(0, 20)}</td>
                <td>${c.sec}</td>
                <td>${c.dataVencimento}</td>
                <td>
                  ${c.diasParaVencer < 0 ? 
                    `<span class="status-vencido">Vencido</span>` :
                    c.diasParaVencer <= 30 ?
                    `<span class="status-breve">${c.diasParaVencer}d</span>` :
                    `<span class="status-ativo">Ativo</span>`
                  }
                </td>
                <td>R$ ${(c.valorMensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          Gerado em ${new Date().toLocaleDateString('pt-BR')} | Página 1 de 2
        </div>
      </div>

      <!-- Página 2: Continuação da Tabela -->
      <div class="page">
        <h2 class="section-title">Contratos (Parte 2 de 2)</h2>
        
        <table>
          <thead>
            <tr>
              <th>Contrato</th>
              <th>Fornecedor</th>
              <th>SEC</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${page2Contracts.map((c: any) => `
              <tr>
                <td>${c.numero}</td>
                <td>${c.fornecedor?.substring(0, 20)}</td>
                <td>${c.sec}</td>
                <td>${c.dataVencimento}</td>
                <td>
                  ${c.diasParaVencer < 0 ? 
                    `<span class="status-vencido">Vencido</span>` :
                    c.diasParaVencer <= 30 ?
                    `<span class="status-breve">${c.diasParaVencer}d</span>` :
                    `<span class="status-ativo">Ativo</span>`
                  }
                </td>
                <td>R$ ${(c.valorMensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; font-size: 11px;">
            <div>
              <div style="color: #666; margin-bottom: 3px; font-weight: 600;">Total Mensal</div>
              <div style="font-size: 16px; font-weight: 700; color: #7c3aed;">
                R$ ${(metrics.mensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div style="color: #666; margin-bottom: 3px; font-weight: 600;">Total Anual</div>
              <div style="font-size: 16px; font-weight: 700; color: #7c3aed;">
                R$ ${(metrics.anual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div style="color: #666; margin-bottom: 3px; font-weight: 600;">Contratos Ativos</div>
              <div style="font-size: 16px; font-weight: 700; color: #16a34a;">
                ${metrics.ativos}
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          Gerado em ${new Date().toLocaleDateString('pt-BR')} | Página 2 de 2
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
          padding: 25px;
          background: white;
        }
        .header {
          background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
          color: white;
          padding: 25px;
          border-radius: 8px;
          margin-bottom: 18px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 5px;
          font-weight: 700;
        }
        .header p {
          font-size: 13px;
          opacity: 0.9;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }
        .metric-box {
          background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
          padding: 12px;
          border-radius: 6px;
          border-left: 3px solid #7c3aed;
          text-align: center;
        }
        .metric-box h3 {
          font-size: 10px;
          color: #666;
          margin-bottom: 5px;
          text-transform: uppercase;
          font-weight: 600;
        }
        .metric-box .value {
          font-size: 18px;
          color: #7c3aed;
          font-weight: 700;
        }
        .section-title {
          font-size: 14px;
          color: #7c3aed;
          margin: 12px 0 8px 0;
          padding-bottom: 5px;
          border-bottom: 2px solid #ec4899;
          font-weight: 700;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          font-size: 9px;
        }
        th {
          background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
          color: white;
          padding: 7px;
          text-align: left;
          font-weight: 600;
          border: none;
        }
        td {
          padding: 5px 7px;
          border-bottom: 1px solid #e5e7eb;
        }
        tr:nth-child(even) {
          background: #f9fafb;
        }
        .footer {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #e5e7eb;
          font-size: 9px;
          color: #999;
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
                <td>${c.nome?.substring(0, 25)}</td>
                <td>${c.sec}</td>
                <td>${c.funcao?.substring(0, 20)}</td>
                <td>${c.cpf}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p style="margin-top: 5px;">Gestão de Contratos e Colaboradores v1.0</p>
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
