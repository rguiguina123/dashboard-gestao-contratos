# Direção visual TCU — 17/08/2026

## Intenção

Substituir os sinais de interface genérica por uma presença mais editorial, direta e institucional. A interface deixa de depender de gradientes roxos, botões com aparência promocional, excesso de arredondamentos e cores desconectadas da marca.

> Referência de marca: o [Programa de Identidade Visual do TCU — Manual de Aplicação da Marca, versão 2.0](https://portal.tcu.gov.br/publicacoes-institucionais/cartilha-manual-ou-tutorial/programa-de-identidade-visual-do-tcu-manual-de-aplicacao-da-marca-versao-20) apresenta a família de azuis empregada como base para a composição desta versão.

## Decisões aplicadas

| Aspecto | Decisão |
| --- | --- |
| Paleta | Escala azul do TCU: azul profundo, azul institucional, ciano de sinalização e tons claros de apoio. |
| Página inicial | Mapa do Plano Piloto mantido como elemento autoral, com composição assimétrica, régua azul e texto mais direto. |
| Navegação | Barra lateral passou a usar estrutura discreta em azul profundo e estados em ciano. |
| Módulos | Blocos numerados e lineares, sem cartões promocionais ou sombras excessivas. |
| Gráficos | Barras e pizzas foram harmonizadas em uma escala monocromática de azuis. |

## Verificação visual

| Página | Resultado |
| --- | --- |
| Início | Hierarquia clara, contraste adequado entre texto e mapa, identidade azul TCU perceptível. |
| Dashboard | Métricas, barras de composição e síntese anual apresentam leitura executiva coerente. |
| Custos totais | Barras e gráfico de distribuição utilizam uma escala azul institucional sem cores conflitantes. |
| Contratos | Filtros, métricas, alertas resumidos, botão de exportação e tabela passam a compor uma mesma hierarquia azul institucional. |
| Atualizar dados | Hero, área de envio, etapas de comparação e histórico foram validados com contraste adequado e linguagem visual coerente. |

## Validação técnica final

| Verificação | Resultado |
| --- | --- |
| Testes automatizados | 24 testes aprovados. |
| Tipagem | `pnpm run check` concluído sem erros. |
| Build de produção | Concluído com sucesso. O aviso de tamanho do bundle principal permanece como oportunidade de otimização, sem impedir a compilação. |
| Auditoria de rotas | 14 rotas verificadas, sem falhas de renderização. |
| Varredura de estilos | Gradientes roxos/rosas e acentos violeta foram removidos diretamente das páginas de dados. |

## Evolução tricolor

| Papel | Aplicação |
| --- | --- |
| Azul | Estrutura, superfícies institucionais, títulos e dados principais. |
| Verde | Colaboradores, valores com contrato e ações positivas. |
| Amarelo | Contratos, valores sem contrato, chamadas e estado ativo da navegação. |

Na home, módulos e métricas receberam marcações discretas em verde e amarelo. No painel executivo, os quatro indicadores alternam acentos, as barras mensais distinguem contrato em verde e sem contrato em amarelo, e os valores anuais seguem a mesma leitura.

Na página de colaboradores, o gráfico principal passou a usar o verde institucional e a distribuição em pizza combina azul, verde e amarelo. A regra global que forçava barras azuis foi removida para respeitar a cor de cada série.

Na atualização de dados, estados positivos usam verde institucional, alterações e avisos usam amarelo e falhas permanecem em vermelho semântico. Em custos totais, barras verdes e pizza em azul, verde e amarelo tornam a leitura da distribuição mais viva sem perder a hierarquia de dados.

O demonstrativo foi revisado com barras mensais verdes, anuais amarelas e gráfico consolidado verde. Em despesas com contrato, o gráfico de fornecedores usa verde e a distribuição por SEC combina azul, verde e amarelo; títulos e valores continuam em azul escuro sobre fundo claro para manter contraste.

Em despesas sem contrato, barras amarelas destacam a natureza do grupo e a distribuição por SEC mantém a leitura tricolor. Custos por secretaria preserva azul para valores principais e usa verde e amarelo nos ícones e comandos de ordenação, com tabela de alto contraste para leitura prolongada.

Em custo por área, as barras amarelas mantêm boa leitura sobre o fundo branco, enquanto azul e vermelho continuam reservados a referências e extremos semânticos. A rota `/custo-por-servidor` foi apenas uma tentativa de endereço não registrado; a auditoria oficial das 14 rotas não indicou rota de produto ausente.

Em custo por servidor, barras verdes reforçam a análise principal; vermelho e azul continuam reservados aos extremos acima e abaixo da média. As duas páginas mantêm contraste suficiente entre gráficos, valores e tabelas.

Em eficiência por servidor, o gráfico comparativo separa custo em verde e área em amarelo. Em quantidade de servidores, barras verdes e pizza tricolor mantêm cada categoria distinguível, enquanto os extremos seguem o uso semântico de vermelho e azul.

## Evidência final

| Critério | Evidência |
| --- | --- |
| Varredura de código | Busca nas páginas analíticas não encontrou barras com os preenchimentos azuis legados nem arrays monocromáticos de azul. |
| Eficiência por servidor | Captura revisada: série de custo em verde, série de área em amarelo, eixos e legenda legíveis sobre fundo branco. |
| Quantidade de servidores | Captura revisada: barras verdes, pizza tricolor, rótulos com contraste adequado e navegação azul escuro discreta. |
| Custo por área | Captura revisada: barras amarelas distinguíveis, grades leves e valores extremos com contraste semântico. |
| Custo por servidor | Captura revisada: barras verdes distinguíveis, tabela e cartões de extremos legíveis. |
| Demonstrativo | Captura revisada: séries mensal verde e anual amarela distinguíveis, legenda e valores legíveis. |
| Despesas com contrato | Captura revisada: barras verdes, pizza tricolor e rótulos legíveis sobre fundo claro. |
| Despesas sem contrato | Captura revisada: barras amarelas, pizza tricolor, cabeçalhos e tabela legíveis. |
| Custos por secretaria | Captura revisada: indicadores com acentos distribuídos e tabela de alta legibilidade. |
| Colaboradores | Captura revisada: cartões verde, amarelo e azul; barras verdes e distribuição tricolor legíveis. |
| Custos totais | Captura revisada: barras verdes, pizza tricolor e extremos semânticos legíveis. |

| Validação técnica | 24 testes aprovados, TypeScript e build concluídos; auditoria de 14 rotas e 12 verificações responsivas sem falhas. |

| Varredura literal | Todas as páginas analíticas foram pesquisadas por preenchimentos, hexadecimais e classes de cor; os dois últimos ícones `text-blue-*` foram substituídos por azul institucional. |
| Revisão por captura | Capturas revisadas de demonstrativo, despesas com e sem contrato, custos por secretaria, custo por área, custo por servidor, eficiência e quantidade de servidores. |
