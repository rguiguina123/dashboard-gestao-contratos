# Verificação visual — paleta tricolor

- **Home:** a composição editorial carrega a planta de Brasília em fundo azul; os módulos de acesso, métricas e navegação flutuante renderizaram com contraste adequado. Os quatro indicadores mostraram 116 colaboradores, 74 contratos, 26 SECs e R$ 1.679.117,18 por mês.
- **Dashboard executivo:** renderizou sem a antiga barra lateral. Os cartões, gráfico de tendência, resumo consolidado e botão de relatório exibiram azul, verde e amarelo de forma consistente; a navegação permaneceu disponível no lado direito.

A página de **Atualizar dados** exibiu o novo campo obrigatório “Seu nome”, mostrou que o nome será registrado e apresentou o histórico com a identificação dos registros legados como “Não informado”. A página de **Contratos** carregou 74 registros, filtros de período, SEC e objeto, alertas de vencimento e o botão de exportação sem falhas de console. A página de **Colaboradores** carregou 116 registros, 26 SECs, gráficos com a paleta azul, verde e amarela, filtro por SEC e exportação sem erros aparentes.

O **Demonstrativo** mostrou o comparativo mensal e anual em azul e verde, com o ranking em amarelo, preservando o botão de relatório. A tela de **Despesas com Contrato** apresentou seus cartões, filtro por SEC, gráfico de fornecedores, distribuição por secretaria e a tabela de 74 contratos sem problemas de renderização.

Em **Despesas sem Contrato**, os 30 registros, o filtro, os gráficos em amarelo, azul e verde e a exportação foram apresentados corretamente. Em **Custos por Secretaria**, as 26 SECs, os botões de ordenação, os indicadores e a tabela detalhada renderizaram sem falhas visíveis.

As páginas de **Custo por Área** e **Custos Totais** apresentaram rankings, gráficos, tabelas completas e botões de exportação corretamente. O gráfico de custos totais e a distribuição de secretarias foram exibidos na nova escala azul, verde e amarela.

Os relatórios de **Eficiência por Servidor** e **Custo por Servidor** renderizaram indicadores, comparativos, rankings e tabelas para as 26 SECs sem erro visível. As rotas preservaram a navegação flutuante e os botões de exportação.

Em **Quantidade de Servidores**, o total de 457, o gráfico de barras, a distribuição por SEC, os rankings e a tabela completa foram carregados corretamente. O acionamento do botão de exportação foi realizado durante a auditoria; o histórico do navegador manteve os relatórios anteriores disponíveis para conferência.

As quatorze rotas públicas foram abertas durante esta rodada de validação. Não houve telas vazias, páginas não encontradas ou falhas visuais nas rotas auditadas; a navegação flutuante permaneceu presente em todas elas.

Após a limpeza final dos componentes compartilhados, o filtro de **Contratos** foi exercitado com a SEC-AC: a listagem reduziu-se para quatro contratos e os indicadores recalcularam para R$ 33.333,39 por mês e R$ 400.562,53 ao ano.

A **home** manteve a composição editorial azul com a planta de Brasília, módulos de acesso, indicadores e navegação lateral. A tela **Atualizar dados** conservou o campo obrigatório “Seu nome”, a explicação do registro no histórico e os estados azul, verde e amarelo sem os acentos violetas anteriores.

Na página de **Custos por Secretaria**, a ação “Ordenar por SEC” reorganizou corretamente a tabela de SEC-AC até SEC-TO, confirmando a ordenação alfabética após a revisão visual.

O fluxo público de **Atualizar dados** foi testado com uma planilha de colaboradores reconstruída a partir da base vigente: após informar “Validação Técnica Manus”, o comparativo registrou 116 registros mantidos, sem inclusões, alterações ou saídas, aplicou automaticamente a versão e exibiu o responsável no resumo. Como a planilha foi idêntica à base atual, o teste não modificou o conteúdo do dashboard.

Após a aplicação, a primeira entrada de **Histórico recente** exibiu o arquivo de teste com o estado “Aplicada” e “Responsável: Validação Técnica Manus”, comprovando a persistência da autoria.

A persistência também foi confirmada diretamente na base: a importação de teste ficou com status aprovado e horário de aprovação registrado, associada ao responsável informado.

Os doze relatórios analíticos foram acionados e gerados por auditoria automatizada de exportação: Dashboard, Contratos, Colaboradores, Demonstrativo, despesas, custos, eficiência e quantidade de servidores.

Os filtros avançados de contratos foram verificados com a busca “infinity”: a tabela retornou dois contratos desse fornecedor e recalculou corretamente os três indicadores financeiros.

Ao combinar o fornecedor “infinity” com a vigência de 01/06/2026 a 30/06/2026, a tabela retornou somente o contrato de SEC-PB com vencimento em 30/06/2026, mantendo os indicadores sincronizados.

A ação “Limpar filtros” restaurou corretamente os 74 contratos e os totais originais. A auditoria final confirmou todas as 14 rotas, além de ausência de overflow horizontal em celular, tablet e desktop nas rotas principais.

O período inválido de 30/06/2026 a 01/06/2026 foi bloqueado, exibiu a mensagem “A data final deve ser igual ou posterior à data inicial” e preservou os 74 contratos já mostrados na tabela.
