# Revisão de densidade — 17/08/2026

## Problemas identificados

A abertura institucional tinha hero alto demais para a quantidade de conteúdo, enquanto os módulos apareciam pequenos e deixavam área útil sem função. O painel executivo também repetia explicações em títulos, subtítulos e notas de rodapé, concentrando os dados no topo e deixando espaço livre abaixo.

## Ajustes aplicados

| Área | Ajuste |
| --- | --- |
| Home | Hero reduzido, comunicação limitada a título, uma linha de contexto e duas ações; módulos ampliados para ocupar a área útil. |
| Dashboard | Textos auxiliares reduzidos; métricas, composição mensal e síntese anual concentradas na primeira tela. |
| Páginas de dados | Descrições genéricas removidas ou encurtadas; margens globais internas reduzidas. |
| Atualizar dados | Hero, instruções, área de envio e histórico simplificados para priorizar o fluxo de ação. |

## Verificação visual

A home foi recomposta em um plano único: marca e ação no topo, entrada direta no painel à esquerda, quatro módulos no centro e métricas na base. A tela não depende mais de uma sequência de hero, cartões e área vazia; os elementos passam a ocupar a altura disponível sem acrescentar texto explicativo.

## Validação final

| Verificação | Resultado |
| --- | --- |
| Contratos | Filtros foram reorganizados em grade, textos de apoio removidos e tabela/alertas preservados. |
| Responsividade | 12 verificações em celular, tablet e desktop nas rotas Início, Dashboard, Contratos e Atualizar Dados, sem overflow horizontal ou falhas de renderização. |
| Qualidade técnica | 24 testes aprovados, tipagem e build concluídos e 14 rotas auditadas sem falhas. |

### Revisão móvel

A composição da home preserva legibilidade em 390 px, mas a navegação vertical à direita invade a área dos módulos. Em contratos, filtros, métricas e alertas se empilham corretamente, porém a mesma navegação ocupa uma faixa importante da tela. A navegação deve ser reposicionada em celulares para liberar a área útil.

Após o ajuste, a navegação passou a ocupar uma barra inferior em celular. A home preserva título, entrada no painel e módulos sem invasão lateral; contratos mantém filtros e métricas em largura integral. O contêiner interno recebeu espaço inferior reservado para que a barra não oculte o fim do conteúdo durante a rolagem.

O painel executivo foi verificado com métricas empilhadas e navegação inferior sem conflito com o título ou a ação de exportação. A atualização de dados também foi verificada: hero, envio e processo permanecem legíveis, e a área inferior recebe folga de rolagem para a navegação fixa.

Em tablet, a home mantém a composição em plano único com módulos 2×2 e métricas na base, sem perda de escala. O dashboard usa duas colunas para métricas e uma largura ampla para a composição mensal; a navegação permanece lateral e não obstrui os cartões.

Contratos apresenta filtros em três colunas, métricas alinhadas e alertas antes da tabela, sem corte horizontal. A atualização de dados usa hero, envio, processo e histórico em largura integral, mantendo os comandos e as mensagens legíveis.

Em desktop, a home usa a altura disponível como uma única composição, com mapa, acessos e métricas integrados. O dashboard distribui quatro métricas e os dois painéis financeiros em largura ampla, sem depender de textos explicativos ou cartões soltos.

Em contratos, filtros, métricas, alertas e o início da tabela ocupam a largura disponível com leitura progressiva. Na atualização de dados, o envio e o processo dividem a primeira faixa e o histórico ocupa a largura integral abaixo, preservando a ação principal como foco.
