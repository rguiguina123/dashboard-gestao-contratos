# Validação da reformulação institucional — 17/08/2026

| Área | Evidência | Resultado |
| --- | --- | --- |
| Rotas públicas | Auditoria automatizada das 14 rotas | Todas renderizaram sem falhas. |
| Tipagem, testes e build | `pnpm run check`, `pnpm test` e `pnpm run build` | Tipagem e build concluídos; 21 testes aprovados. |
| Filtros de contratos | Cruzamento de SEC-AC, objeto Apoio Administrativo e período 01/07/2026–31/07/2026 | Tabela, métricas e alertas passaram de 74 para o único registro compatível. |
| Alertas de vencimento | Lista de 23 vencidos observada na interface | Ajustada para exibir cinco itens e o restante como resumo. |
| Exportações em PDF | Execução nas rotas executiva e de contratos | Dois PDFs gerados: relatório executivo e relatório de contratos. |
| Atualizar Dados | Roteiro ponta a ponta `import_flow_check.mjs` | Comparação, aplicação automática, histórico e bloqueio de arquivo inválido aprovados. |
| Bloqueio e histórico na interface | Consulta após o roteiro de importação | Arquivo inválido exibiu bloqueio; última versão válida apareceu como Aplicada no histórico. |
| Navegação flutuante | Abertura do menu de análises detalhadas | Itens de demonstrativos e custos foram exibidos corretamente. |
| Ordenação de contratos | Clique no cabeçalho Vencimento | Registros foram reordenados pela data de vencimento. |
| Alertas resumidos | Revisão visual em Contratos | 23 vencidos foram condensados em cinco linhas e um indicativo de mais 18 registros. |
