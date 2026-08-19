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
