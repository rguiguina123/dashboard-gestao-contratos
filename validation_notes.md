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

Na revisão funcional, o filtro de colaboradores por SEC foi aplicado em AL e a tabela passou a exibir os oito registros correspondentes, preservando gráficos e indicadores na página.

A revisão integral confirmou 22 testes automatizados, tipagem e build aprovados, 14 rotas auditadas, 12 relatórios PDF gerados, auditoria de responsividade em celular, tablet e desktop e ausência de erros no console. A central pública de atualização também exibiu o responsável e o histórico da importação de verificação aplicada.

Na atualização analítica dos PDFs, o relatório executivo passou a ter página própria de análise com indicadores, ranking gráfico e leitura gerencial. A validação visual confirmou a identificação correta dos meses no ranking e a legibilidade da composição institucional.

Também foram validados os relatórios de contratos e colaboradores: os alertas de vigência ficaram legíveis sem caracteres especiais incompatíveis, o ranking de fornecedores mostra os cinco maiores valores anuais e a distribuição por função evidencia a composição operacional. Os doze PDFs foram regenerados com sucesso após a revisão.

O relatório executivo recebeu a página “Tendência Mensal”, com linha de evolução de janeiro a junho, escala financeira, pontos mensais, valores inicial e final, variação percentual e leitura temporal. A página foi inspecionada visualmente, e os doze PDFs continuaram a ser gerados com sucesso.

No refinamento tipográfico, a interface passou a usar IBM Plex Sans, com numerais tabulares, espaçamento de leitura mais controlado e pesos mais sóbrios. A home, o dashboard e contratos foram inspecionados visualmente; os alertas de vencimento passaram a mostrar somente cinco itens e um resumo do restante. O console permaneceu sem erros após os ajustes.

A central de Atualizar Dados também foi inspecionada após a troca tipográfica: cabeçalho, formulário de responsável, área de planilha, etapas de comparação e histórico permaneceram legíveis e sem regressões visuais.

As páginas Colaboradores e Demonstrativo Total também foram revisadas após a troca tipográfica. Indicadores, gráficos, filtros e tabelas mantiveram hierarquia legível e a nova fonte trouxe maior sobriedade aos títulos e valores numéricos.

As páginas Demonstrativo Total e Despesas com Contrato foram confirmadas com títulos, valores, filtros, gráficos e tabelas legíveis após a troca tipográfica global, sem sobreposição ou corte de texto no primeiro viewport.

Também foram revisadas Despesas sem Contrato, Custos por Secretaria e Custo por Área. As páginas preservaram a leitura de rankings, gráficos, controles de ordenação e tabelas extensas com a nova tipografia e sem regressões visuais no primeiro viewport.

As análises Custos Totais por Secretaria e Eficiência por Servidor foram revisadas na sequência. Cartões de indicadores, gráficos comparativos, rankings e tabelas preservaram contraste, alinhamento e leitura adequada após a alteração tipográfica.

As páginas finais da auditoria, Custos por Servidor e Quantidade de Servidores, foram revisadas visualmente. Indicadores, gráficos, rankings, tabelas e o acesso à exportação de relatório permaneceram claros, alinhados e sem recorte de texto no primeiro viewport.

Na auditoria de cálculos, a composição mensal do Dashboard foi confrontada com as bases de contratos e despesas sem contrato: R$ 1.456.388,73 e R$ 222.728,46, respectivamente, totalizando R$ 1.679.117,18. A série histórica fictícia foi removida por não haver dados mensais históricos na base vigente; o gráfico agora apresenta somente a composição calculável. O ranking de Despesas com Contrato também foi conferido após a correção: passou a agregar por fornecedor real, e não mais por SEC.

Os gráficos de Custo por Área e Custos por Servidor foram recalculados da visão detalhada de 26 SECs. O custo anual consolidado exibido nas duas páginas é R$ 20.369.908,18; as médias passaram a ser ponderadas pelos denominadores corretos, resultando em R$ 1.018,66/m² e R$ 44.573,10 por servidor. A divergência histórica de SEC-AC foi eliminada: os valores agora refletem o total de R$ 514.068,97 dividido pela área e pela quantidade de servidores correspondentes.

As páginas Eficiência por Servidor e Custos Totais foram revisadas visualmente após o recálculo. Ambas apresentam o mesmo custo anual consolidado de R$ 20.369.908,18 e rankings coerentes com a visão detalhada; o gráfico comparativo de eficiência passou a iniciar pelas SECs de maior custo por servidor, em vez de usar uma seleção não ordenada.

Quantidade de Servidores e Custos por Secretaria também foram conferidas. O total de 457 servidores, a média de 17,6 por SEC, a área consolidada de 19.996,70 m² e o custo anual de R$ 20.369.908,18 permanecem conciliados entre as duas páginas e os rankings exibem as mesmas 26 SECs derivadas da visão detalhada.

A auditoria automatizada de cálculos confirmou as reconciliações de contratos por fornecedor e SEC, despesas sem contrato por serviço e SEC, distribuições de colaboradores por SEC e função, além das 26 SECs de custos. O projeto finalizou com 30 testes automatizados aprovados, TypeScript e build de produção sem erros, 14 rotas e responsividade estática aprovadas, console sem mensagens e 12 relatórios PDF gerados. O único cache histórico divergente de custos foi contornado na interface e passa a ser regenerado a partir da visão detalhada em novas importações.
