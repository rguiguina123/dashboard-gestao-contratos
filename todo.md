# Revisão de exportações PDF
- [x] Padronizar páginas de custos restantes
- [x] Validar compilação TypeScript
- [x] Testar exportações PDF no navegador
- [ ] Salvar checkpoint final

# Automação de dados por planilha
- [ ] Confirmar onde a planilha Excel ficará armazenada e quem a atualizará
- [ ] Escolher o modo de sincronização automática e a frequência esperada
- [ ] Configurar a integração segura da fonte de dados
- [ ] Validar atualização, consistência e recuperação em caso de erro

# Implementação da sincronização automática
- [ ] Definir a fonte oficial da planilha e o evento que dispara a atualização
- [ ] Confirmar a alternativa de automação e as permissões de acesso necessárias
- [ ] Implementar importação, validação e registro de alterações
- [ ] Testar a atualização automática sem afetar dados válidos

# Fontes SharePoint identificadas
- [x] Mapear abas e colunas de Dados de Colaboradores.xlsx
- [x] Mapear abas e colunas de Gestão de Contratos.xlsx
- [x] Mapear abas e colunas de Siglas das Secretarias.xlsx
- [ ] Confirmar qual dos dois arquivos de custos compilados é a versão oficial
- [ ] Configurar notificações de alteração para a pasta de dados
- [ ] Implementar leitura, validação e histórico para cada arquivo aprovado
- [x] Preparar backend e base de dados para a sincronização segura

# Área de atualização de dados
- [x] Criar página administrativa Atualizar Dados no dashboard
- [x] Aceitar os arquivos Excel oficiais de colaboradores, contratos, secretarias e custos
- [x] Validar abas, colunas obrigatórias e tipos antes de aplicar a atualização
- [x] Exibir prévia dos registros identificados e bloqueios encontrados
- [x] Salvar versões aprovadas e histórico de importações no banco de dados
- [x] Atualizar o dashboard somente após a confirmação de uma importação válida
- [x] Comparar registros recebidos com a base atual usando chaves estáveis por tipo de dado
- [x] Exibir separadamente inclusões, alterações e registros preservados antes da confirmação
- [x] Manter a última versão aprovada caso uma atualização seja cancelada ou contenha erros
- [x] Bloquear importações com números ou datas inválidos, informando coluna e linha com falha
- [x] Exibir uma prévia detalhada dos registros incluídos, alterados e preservados antes da confirmação
- [x] Apresentar bloqueios e erros de validação no painel, além das mensagens de alerta
- [x] Exibir registros completos incluídos, alterados e preservados com os principais campos na prévia
- [x] Mostrar bloqueios de validação por linha e coluna em um painel persistente de erros
- [x] Acumular todos os bloqueios de validação por aba, linha, coluna e motivo antes de rejeitar a importação
- [x] Padronizar validações de CPF e campos obrigatórios com a indicação explícita da coluna afetada
- [x] Acumular validações detalhadas de estrutura, secretarias e custos antes de rejeitar a importação
- [x] Acumular todas as abas, colunas e estruturas ausentes em uma única resposta de validação
- [x] Validar todas as abas esperadas de custos e cobrir múltiplas falhas estruturais com testes
- [x] Acumular também os erros estruturais de colaboradores e secretarias antes da rejeição
- [x] Validar as colunas específicas de cada aba de custos e cobrir abas vazias e schemas inválidos com testes
- [x] Cobrir em teste o bloqueio detalhado de uma aba de custos vazia

# Revisão completa do dashboard
- [x] Executar diagnóstico de compilação, tipagem e console
- [x] Revisar todas as rotas, filtros, tabelas e navegação
- [x] Corrigir inconsistências de dados e funcionalidades encontradas
- [x] Corrigir indicadores e gráficos desatualizados de colaboradores
- [x] Corrigir CPF com formatação inconsistente na base de colaboradores
- [x] Sincronizar os indicadores de colaboradores da página inicial
- [x] Corrigir totais anuais divergentes no Dashboard e Demonstrativo
- [x] Tornar funcional o filtro de período para vencimentos de contratos
- [x] Corrigir indicadores que usavam o total antigo de 48 secretarias
- [x] Validar novamente o projeto antes de retomar a automação
