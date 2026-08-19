# Revisão de exportações PDF
- [x] Padronizar páginas de custos restantes
- [x] Validar compilação TypeScript
- [x] Testar exportações PDF no navegador
- [x] Salvar checkpoint final

# Automação de dados por planilha
- [x] Confirmar onde a planilha Excel ficará armazenada e quem a atualizará
- [x] Escolher o modo de sincronização automática e a frequência esperada — substituído por atualização sob demanda no dashboard
- [x] Configurar a integração segura da fonte de dados — substituído por envio autenticado de arquivos Excel
- [x] Validar atualização, consistência e recuperação em caso de erro

# Implementação da sincronização automática
- [x] Definir a fonte oficial da planilha e o evento que dispara a atualização — substituído por envio manual com confirmação
- [x] Confirmar a alternativa de automação e as permissões de acesso necessárias
- [x] Implementar importação, validação e registro de alterações
- [x] Testar a atualização automática sem afetar dados válidos — adaptado para atualização manual confirmada

# Fontes SharePoint identificadas
- [x] Mapear abas e colunas de Dados de Colaboradores.xlsx
- [x] Mapear abas e colunas de Gestão de Contratos.xlsx
- [x] Mapear abas e colunas de Siglas das Secretarias.xlsx
- [x] Confirmar qual dos dois arquivos de custos compilados é a versão oficial — Custos compilados por estado2.xlsx
- [x] Exigir o arquivo oficial Custos compilados por estado2.xlsx nas atualizações de custos
- [x] Testar o ciclo completo de importação, confirmação, histórico e preservação da última versão aprovada
- [x] Validar na interface autenticada a prévia, confirmação, histórico e cancelamento sem alteração dos dados vigentes — substituído pelo fluxo direto validado em testes

# Atualização direta para usuários do dashboard
- [x] Permitir que usuários autenticados enviem planilhas validadas
- [x] Aplicar automaticamente uma importação válida sem etapa de confirmação
- [x] Manter o histórico e a última versão aprovada quando uma validação falhar
- [x] Ajustar a interface para o fluxo direto de atualização
- [x] Requisito de validação em interface autenticada descontinuado pelo usuário em favor de atualização pública sem login
- [x] Requisito de bloqueio em interface autenticada descontinuado pelo usuário em favor de atualização pública sem login

# Atualização pública com comparativo
- [x] Remover a exigência de login da área de atualização de dados
- [x] Mostrar registros incluídos, alterados e removidos antes de aplicar automaticamente a nova versão
- [x] Aplicar as remoções previstas na planilha aprovada e preservar histórico para recuperação
- [x] Testar atualização pública, comparativo e bloqueios de validação
- [x] Cobrir com teste o acesso público ao procedimento de atualização sem sessão
- [x] Registrar o requisito autenticado como substituído pelo fluxo público definido pelo usuário
- [x] Evitar alterações falsas quando o identificador técnico do registro muda, mas os dados permanecem iguais
- [x] Garantir a aplicação automática após o período de leitura do comparativo em importações consecutivas
- [x] Executar teste real com duas importações válidas consecutivas e verificar os dois registros no histórico
- [x] Configurar notificações de alteração para a pasta de dados — substituído por envio sob demanda no painel
- [x] Implementar leitura, validação e histórico para cada arquivo aprovado
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

# Revisão integral pós-atualização pública
- [x] Executar diagnóstico completo de tipagem, build, testes e logs
- [x] Revisar todas as rotas, navegação e carregamento no navegador
- [x] Validar o fluxo público de atualização de planilhas e o histórico
- [x] Corrigir quaisquer erros de interface, dados ou comportamento encontrados — nenhum novo erro reproduzível encontrado
- [x] Revalidar o dashboard completo antes do checkpoint da revisão

# Validação específica da atualização de dados
- [x] Revisar o processamento de planilhas e as regras de comparação
- [x] Testar na interface uma planilha válida, o comparativo e a atualização automática
- [x] Testar na interface uma planilha inválida e confirmar a preservação da versão vigente
- [x] Corrigir o registro histórico antigo que ainda exibe “Aguardando confirmação”
- [x] Cobrir os rótulos de status do histórico com teste automatizado

# Paleta tricolor, autoria e validação integral
- [x] Mapear usos atuais de cor e o fluxo de importação que receberá a identificação do responsável
- [x] Aplicar amarelo, azul e verde do TCU à home, navegação e componentes compartilhados
- [x] Exigir o nome do responsável no envio de planilhas e registrar essa informação no histórico
- [x] Harmonizar gráficos, páginas de dados, controles e estados com a paleta definida
- [x] Testar rotas, filtros, ordenação, importação, histórico, relatórios PDF e responsividade
- [x] Executar testes automatizados, tipagem, build e auditorias após as alterações

# Paleta tricolor e validação integral
- [x] Mapear os usos atuais de cor e a composição de referência para a nova home
- [x] Aplicar amarelo, azul e verde do TCU na home, navegação e componentes compartilhados
- [x] Harmonizar gráficos, páginas de dados, controles e estados com a paleta tricolor
- [x] Testar todas as rotas, filtros, ordenação, atualização de dados, histórico e PDFs
- [x] Executar testes automatizados, tipagem, build e auditoria responsiva após as alterações
- [x] Remover todos os resíduos roxos/violetas dos estilos compartilhados e confirmar a consistência final da paleta TCU
- [x] Executar um teste real de atualização com nome do responsável, comparativo, aplicação automática e histórico registrado
- [x] Revalidar a ordenação, os filtros e as exportações em PDF nas páginas analíticas após a limpeza final da paleta
- [x] Validar as rotas principais em larguras mobile, tablet e desktop com uma auditoria responsiva de interface
