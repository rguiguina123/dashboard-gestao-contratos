# Fontes oficiais do SharePoint

A pasta oficial da integração é `GESTÃO DE CONTRATOS - POWER BI`, no site institucional `DIOP-ESTADOS - GESTÃO DE CONTRATOS` do SharePoint do TCU. O acesso foi confirmado em 11 de agosto de 2026 com uma conta institucional autenticada.

O caminho relativo identificado para a biblioteca é `/sites/DIOPESTADOSGESTAODECONTRATOS/Documentos Compartilhados/GESTÃO DE CONTRATOS - POWER BI`. A página também confirmou que os arquivos são acessíveis à conta institucional e exibiu alterações recentes em `Custos compilados por estado2.xlsx` e `Gestão de Contratos.xlsx`.

As chamadas iniciais à API REST da biblioteca retornaram uma lista vazia apesar de a interface listar os arquivos. A integração deverá, portanto, identificar o drive e os itens por meio do Microsoft Graph após a autorização da aplicação, em vez de depender da listagem REST da página.

| Arquivo identificado | Finalidade esperada no dashboard | Estado inicial |
|---|---|---|
| `Dados de Colaboradores.xlsx` | Colaboradores, CPF, função e lotação | Mapear abas e colunas |
| `Gestão de Contratos.xlsx` | Cadastro, vigência e valores de contratos | Mapear abas e colunas |
| `Siglas das Secretarias.xlsx` | Relação e nomenclatura de secretarias | Mapear abas e colunas |
| `Custos compilados por estado.xlsx` | Custos consolidados | Confirmar se é a versão oficial |
| `Custos compilados por estado2.xlsx` | Possível versão revisada dos custos consolidados | Confirmar se substitui o arquivo anterior |
| `Custos Individuais por estado.xlsx` | Custos individuais | Mapear abas e colunas |

## Metadados para configuração

| Arquivo | Identificador do item | Última modificação identificada | Tamanho |
|---|---|---|---:|
| `Dados de Colaboradores.xlsx` | `2914992e-e90c-4d45-9532-afa6bebaf890` | 2026-08-06 18:09 UTC | 23.529 bytes |
| `Gestão de Contratos.xlsx` | `e320293d-410d-413d-9525-c5a42f53eba5` | 2026-08-10 19:30 UTC | 97.443 bytes |
| `Siglas das Secretarias.xlsx` | `5585f20c-cfe6-497b-b954-cf9c6fbb055d` | 2026-03-31 16:35 UTC | 15.844 bytes |
| `Custos compilados por estado.xlsx` | `1c351f03-1bad-4cc7-b755-7e86bf917e78` | 2026-06-10 19:21 UTC | 93.837 bytes |
| `Custos compilados por estado2.xlsx` | `ab693556-5812-4874-b409-5a0176d3e9c1` | 2026-08-11 16:48 UTC | 355.534 bytes |
| `Custos Individuais por estado.xlsx` | `6821fdde-6a92-44ae-963e-752f06b1bcad` | 2026-08-10 19:14 UTC | 279.355 bytes |

Uma cópia de leitura de `Dados de Colaboradores.xlsx` foi obtida com sucesso para o mapeamento da estrutura. Nenhum arquivo foi alterado no SharePoint.

## Estrutura mapeada

| Fonte | Aba | Linha de cabeçalho | Campos principais identificados |
|---|---|---:|---|
| `Dados de Colaboradores.xlsx` | `SECs - Colaboradores` | 1 | `NOME`, `CPF`, `POSTO`, `SEC` |
| `Gestão de Contratos.xlsx` | `Despesas Vigência Controlada` | 2 | Vigência, fornecedor, objeto, categoria, SEC, valor mensal e anual |
| `Gestão de Contratos.xlsx` | `Despesas Vigência NÃO Controlad` | 2 | Fim da vigência, SEC, serviço, fornecedor, objeto, unidade fiscalizadora, valor mensal e anual |
| `Gestão de Contratos.xlsx` | `Demonstrativo` | 2 | SEC, valores mensais e anuais |
| `Siglas das Secretarias.xlsx` | `Plan1` | 1 | `SEC` |

O download em lote dos três arquivos de custos excedeu o tempo de resposta do navegador. A estrutura dos custos será mapeada em chamadas individuais e somente em modo de leitura.

## Regras de segurança

A integração deve usar apenas leitura nos arquivos e substituir dados no dashboard somente após validação de estrutura, tipos, totais básicos e ausência de erros críticos. Versões rejeitadas devem preservar a última carga válida e registrar o motivo.
