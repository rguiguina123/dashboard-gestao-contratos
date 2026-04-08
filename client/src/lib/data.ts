// Dados consolidados do briefing - Gestão de Contratos e Colaboradores

export interface Colaborador {
  nome: string;
  cpf: string;
  posto: string;
  sec: string;
}

export interface Contrato {
  id: string;
  numero: string;
  vigencia: string;
  tempo: string;
  fornecedor: string;
  objeto: string;
  sec: string;
  valorMensal: number;
  valorAnual: number;
}

export interface DespesaSemContrato {
  id: string;
  sec: string;
  servico: string;
  fornecedor: string;
  objeto: string;
  unidadeFiscalizadora: string;
  valorMensal: number;
  valorAnual: number;
}

export interface DemonstrativoUF {
  uf: string;
  mensal_com_contrato: number;
  anual_com_contrato: number;
  mensal_sem_contrato: number;
  anual_sem_contrato: number;
}

// Métricas Consolidadas
export const metricas = {
  colaboradores: 112,
  secsComColaboradores: 26,
  postosDistintos: 6,
  contratosControlados: 85,
  itensComContrato: 85,
  itensSemContrato: 30,
  mensal_com_contrato: 1456388.73,
  mensal_sem_contrato: 217903.46,
  mensal_geral: 1674292.18,
  anual_com_contrato: 17821864.72,
  anual_sem_contrato: 2614841.49,
  anual_geral: 20436706.21,
  paginasConfirmadas: 5,
};

// Base de Colaboradores
export const colaboradores: Colaborador[] = [
  { nome: "ADRIELLY AKIKO DA SILVA SHIBUYA", cpf: "702.809.112-03", posto: "Apoio Administrativo", sec: "AM" },
  { nome: "ADRILENE LUCIENE MARTINS", cpf: "038.893.876-59", posto: "Apoio Administrativo", sec: "MG" },
  { nome: "AFRANIO FERREIRA DE ARROXELAS", cpf: "-", posto: "Limpeza/Copeiragem", sec: "AL" },
  { nome: "ALAIDE FEITOSA SILVA", cpf: "070.577.201-22", posto: "Apoio Administrativo", sec: "TO" },
  { nome: "ALCIONE GLADY DUTRA DOS ANJOS", cpf: "528.768.022-87", posto: "Apoio Administrativo", sec: "RO" },
  { nome: "ALESSANDRA DA COSTA PEREIRA", cpf: "093.948.644-07", posto: "Apoio Administrativo", sec: "PE" },
  { nome: "ALEX MOREIRA TEIXEIRA", cpf: "-", posto: "Vigilante Diurno 12 x 36h", sec: "PA" },
  { nome: "ALEXANDRA DA SILVA LIMA", cpf: "133.801.014-00", posto: "Apoio Administrativo", sec: "AL" },
  { nome: "ALEXANDRE SERGIO SOARES", cpf: "-", posto: "Limpeza/Copeiragem", sec: "PE" },
  { nome: "ALEXANDRO DA SILVA SANTOS", cpf: "-", posto: "Vigilante Diurno 12 x 36h", sec: "AL" },
  { nome: "ALEXSANDRO DA SILVA NOGUEIRA", cpf: "-", posto: "Vigilante Noturno 12 x 36h", sec: "AL" },
  { nome: "ANDRE ABRAHAO CORDEIRO", cpf: "-", posto: "Segurança Pessoal Privada", sec: "RJ" },
  { nome: "ANDRESSON GEORGE DE CASTRO LIMA", cpf: "-", posto: "Vigilante Noturno 12 x 36h", sec: "PA" },
  { nome: "ANGELO MARIA MONTEIRO DA COSTA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "PA" },
  { nome: "ANNA VIRGINIA DE SOUSA AMORIM", cpf: "830.365.983-91", posto: "Apoio Administrativo", sec: "PI" },
  { nome: "ANTONIO ALVES FERREIRA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "AM" },
  { nome: "BARBARA PAIVA BARBOSA", cpf: "013.940.044-35", posto: "Apoio Administrativo", sec: "PE" },
  { nome: "BERNARDO DA CRUZ FERREIRA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "PI" },
  { nome: "BRUNO RAURIAN DA SILVA MORAES", cpf: "874.732.592-53", posto: "Apoio Administrativo", sec: "AP" },
  { nome: "CAMILA DOS SANTOS LOPES", cpf: "123.096.837-79", posto: "Apoio Administrativo", sec: "RJ" },
  { nome: "CAMILA NEVES GOMES", cpf: "705.291.491-33", posto: "Apoio Administrativo", sec: "GO" },
  { nome: "CAMILA OLIVEIRA MOREIRA", cpf: "121.354.126-35", posto: "Apoio Administrativo", sec: "MG" },
  { nome: "CAMILA PRATES RODRIGUES", cpf: "035.180.910-42", posto: "Apoio Administrativo", sec: "RS" },
  { nome: "CARLOS EMANUEL LIMA DA SILVA", cpf: "882.420.133-49", posto: "Apoio Administrativo", sec: "CE" },
  { nome: "CARLYENN VALESKA LEITE RODRIGUES", cpf: "858.982.952-91", posto: "Apoio Administrativo", sec: "AP" },
  { nome: "CLAUDIA CRISTINA RAMOS DO NASCIMENTO", cpf: "792.598.395-72", posto: "Apoio Administrativo", sec: "SE" },
  { nome: "CLAUDIO MOREIRA FERREIRA", cpf: "025.752.547-52", posto: "Apoio Administrativo", sec: "RJ" },
  { nome: "DANIEL BEZERRA DA SILVA", cpf: "-", posto: "Vigilante Noturno 12 x 36h", sec: "AL" },
  { nome: "DANILO MATIAS COELHO", cpf: "-", posto: "Limpeza/Copeiragem", sec: "BA" },
  { nome: "DAYANA DOS SANTOS SOUZA", cpf: "132.010.327-86", posto: "Apoio Administrativo", sec: "RJ" },
  { nome: "DIEGO MARTINS DA SILVA", cpf: "-", posto: "Segurança Pessoal Privada", sec: "SP" },
  { nome: "DIONELI PANDOLFO RODRIGUES", cpf: "-", posto: "Limpeza/Copeiragem", sec: "RS" },
  { nome: "DOUGLAS MELLO FERREIRA", cpf: "-", posto: "Segurança Pessoal Privada", sec: "RJ" },
  { nome: "ELIENI DA SILVA JORGE", cpf: "073.118.407-67", posto: "Apoio Administrativo", sec: "ES" },
  { nome: "ELIVANIA NAZARE DOS ANJOS", cpf: "-", posto: "Limpeza/Copeiragem", sec: "GO" },
  { nome: "ELIZABETE ALAIDE SIQUEIRA DE QUEIROZ", cpf: "-", posto: "Recepção", sec: "SP" },
  { nome: "ELIZANDRA DA SILVA LOPES DOS SANTOS", cpf: "-", posto: "Limpeza/Copeiragem", sec: "SC" },
  { nome: "EMILIANA DO NASCIMENTO MOREIRA", cpf: "013.107.574-88", posto: "Apoio Administrativo", sec: "PB" },
  { nome: "ERICA LIBORIO SAMPAIO", cpf: "015.843.472-28", posto: "Apoio Administrativo", sec: "RR" },
  { nome: "ERIKA FERNANDES DE ARAUJO", cpf: "926.579.232-91", posto: "Apoio Administrativo", sec: "AC" },
  { nome: "ESTEFANI MARIA COSTA DA SILVA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "PA" },
  { nome: "EVANILDO SANTOS DE AZEVEDO", cpf: "-", posto: "Segurança Pessoal Privada", sec: "RJ" },
  { nome: "EVENY DOS SANTOS ARAUJO", cpf: "010.090.712-11", posto: "Apoio Administrativo", sec: "AM" },
  { nome: "FABIO JORGE SILVESTRE BOTTONI", cpf: "118.159.257-79", posto: "Apoio Administrativo", sec: "RJ" },
  { nome: "FABIO JOSE BATISTA PERES", cpf: "-", posto: "Vigilante Noturno 12 x 36h", sec: "PA" },
  { nome: "FLAVIA MANOELE SATIRO FRANCO", cpf: "993.602.252-15", posto: "Apoio Administrativo", sec: "RR" },
  { nome: "FRANCILENE PINHEIRO DUTRA PEREIRA", cpf: "016.425.943-00", posto: "Apoio Administrativo", sec: "MA" },
  { nome: "FRANCINALVA LAMEU DOS SANTOS", cpf: "-", posto: "Limpeza/Copeiragem", sec: "PB" },
  { nome: "FRANCISCA DAS CHAGAS DOS SANTOS", cpf: "-", posto: "Limpeza/Copeiragem", sec: "GO" },
  { nome: "GEANIO COLETA BRAGA", cpf: "-", posto: "Segurança Pessoal Privada", sec: "SP" },
  { nome: "GRAZIELLE APARECIDA BENTO DA SILVA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "MG" },
  { nome: "HELIO DA SILVA JUNIOR", cpf: "122.530.157-25", posto: "Apoio Administrativo", sec: "RJ" },
  { nome: "IVANETE GALVAO MELO", cpf: "-", posto: "Limpeza/Copeiragem", sec: "BA" },
  { nome: "JAILDA DA SILVA SANTOS", cpf: "-", posto: "Limpeza/Copeiragem", sec: "PB" },
  { nome: "JHENNIFER DE OLIVEIRA DIAS", cpf: "012.288.490-64", posto: "Apoio Administrativo", sec: "SC" },
  { nome: "JOELMA DO SOCORRO RODRIGUES DO NASCIMENTO", cpf: "837.376.932-34", posto: "Apoio Administrativo", sec: "PA" },
  { nome: "JOHANNA OLIVEIRA DE LIMA", cpf: "704.915.964-64", posto: "Apoio Administrativo", sec: "RN" },
  { nome: "JOUSE MOTA DOS SANTOS", cpf: "-", posto: "Limpeza/Copeiragem", sec: "BA" },
  { nome: "JOYCE ALVES", cpf: "421.363.998-37", posto: "Apoio Administrativo", sec: "SP" },
  { nome: "KETLIN RIBEIRO DO PRADO", cpf: "110.788.229-05", posto: "Apoio Administrativo", sec: "PR" },
  { nome: "LEONIZIA MARIA NASCIMENTO", cpf: "410.438.123-34", posto: "Apoio Administrativo", sec: "CE" },
  { nome: "LETICIA SILVA SOUSA", cpf: "001.204.322-26", posto: "Apoio Administrativo", sec: "RO" },
  { nome: "LILIA TEREZA DE OLIVEIRA CARDOSO", cpf: "-", posto: "Limpeza/Copeiragem", sec: "GO" },
  { nome: "LILIANE DIAS BRITO", cpf: "-", posto: "Limpeza/Copeiragem", sec: "ES" },
  { nome: "LUANDA NATHALIA DE OLIVEIRA QUEIROZ", cpf: "032.667.271-00", posto: "Apoio Administrativo", sec: "GO" },
  { nome: "LUIZ HENRIQUE PEREIRA DA SILVA", cpf: "045.791.901-90", posto: "Apoio Administrativo", sec: "TO" },
  { nome: "MARCIA PACHECO FRAGA", cpf: "636.182.220-68", posto: "Apoio Administrativo", sec: "RS" },
  { nome: "MARCO ANTONIO DE JESUS DA COSTA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "AP" },
  { nome: "MARIA AUXILIADORA DA SILVA E SILVA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "AC" },
  { nome: "MARIA DA CONCEICAO LOPES", cpf: "-", posto: "Limpeza/Copeiragem", sec: "PI" },
  { nome: "MARIA DOMINGAS LISBOA SILVA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "MA" },
  { nome: "MARIA ETERNA CESARIO DE OLIVEIRA BRAZ", cpf: "-", posto: "Limpeza/Copeiragem", sec: "GO" },
  { nome: "MARIA JOSE SOARES CAETANO", cpf: "-", posto: "Limpeza/Copeiragem", sec: "MT" },
  { nome: "MARIA LUCENILDA RODRIGUES XAVIER", cpf: "-", posto: "Limpeza/Copeiragem", sec: "AM" },
  { nome: "MARIA NADIA ROCHA DA SILVA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "RN" },
  { nome: "MARIA SALETE FRANCA GOMES SILVA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "RN" },
  { nome: "MARJORIE PEREIRA MARQUES", cpf: "011.357.182-88", posto: "Apoio Administrativo", sec: "PA" },
  { nome: "MATHEUS RONIELSON SANTOS LIMA", cpf: "-", posto: "Vigilante Diurno 12 x 36h", sec: "AL" },
  { nome: "MICHELLE COLOMBO RODRIGUES", cpf: "756.056.781-91", posto: "Apoio Administrativo", sec: "MS" },
  { nome: "MIGUEL NUNES DE SOUZA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "MS" },
  { nome: "MONIQUE SIQUEIRA BARROS SANTOS", cpf: "-", posto: "Recepção", sec: "SP" },
  { nome: "MYRLAH ELISNETE SILVA ALVES", cpf: "084.148.035-47", posto: "Apoio Administrativo", sec: "SE" },
  { nome: "NARA CAROLINE SATURNINO SILVA", cpf: "086.972.694-31", posto: "Apoio Administrativo", sec: "AL" },
  { nome: "NATHANAEL WILLAMS E SILVA BATISTA", cpf: "026.301.213-13", posto: "Apoio Administrativo", sec: "PI" },
  { nome: "NICELI BENITES PAVON", cpf: "074.295.781-01", posto: "Apoio Administrativo", sec: "MT" },
  { nome: "NILBERTON TAVARES PAIVA", cpf: "-", posto: "Segurança Pessoal Privada", sec: "RJ" },
  { nome: "NOEMI MARCIA DA SILVA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "MT" },
  { nome: "OBERDAN ALVES DOS SANTOS", cpf: "-", posto: "Limpeza/Copeiragem", sec: "SE" },
  { nome: "PATRICIA ROSANE MAIA TELES", cpf: "788.476.215-34", posto: "Apoio Administrativo", sec: "BA" },
  { nome: "PRISCILA AQUILA SANTIAGO CARDOSO", cpf: "055.629.863-29", posto: "Apoio Administrativo", sec: "SC" },
  { nome: "RAFAEL RODRIGUES FELTRIM", cpf: "-", posto: "Segurança Pessoal Privada", sec: "SP" },
  { nome: "RENATA BRIOLANJA ARAUJO XAVIER", cpf: "069.746.244-76", posto: "Apoio Administrativo", sec: "RN" },
  { nome: "RITA DE CASSIA BULHOES DA SILVA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "AL" },
  { nome: "RIZONEIDE MARIA DOS SANTOS", cpf: "059.480.594-56", posto: "Apoio Administrativo", sec: "PB" },
  { nome: "ROSANGELA AMARAL DE ASSIS", cpf: "-", posto: "Limpeza/Copeiragem", sec: "PA" },
  { nome: "ROZINEIDE SANTOS BARROS", cpf: "-", posto: "Limpeza/Copeiragem", sec: "SE" },
  { nome: "RUDSON VIEIRA LEMOS", cpf: "024.162.172-08", posto: "Apoio Administrativo", sec: "AC" },
  { nome: "SANDRA REGINA PINTO", cpf: "066.755.638-90", posto: "Apoio Administrativo", sec: "SP" },
  { nome: "SANDY WENDELY LOURENCO DA CUNHA", cpf: "103.355.359-09", posto: "Apoio Administrativo", sec: "PR" },
  { nome: "SARA PAULA DOS SANTOS", cpf: "102.732.327-89", posto: "Apoio Administrativo", sec: "ES" },
  { nome: "SILVANETE SOUSA SILVA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "SP" },
  { nome: "SIMARA CRISTINA DE MOURA SANTOS", cpf: "019.195.341-56", posto: "Apoio Administrativo", sec: "MS" },
  { nome: "SIMONE TEIXEIRA DO NASCIMENTO MOISES", cpf: "-", posto: "Limpeza/Copeiragem", sec: "ES" },
  { nome: "TANIA LUCIA VIEIRA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "MG" },
  { nome: "TATIANE ALMEIDA CAMACHO", cpf: "012.704.631-36", posto: "Apoio Administrativo", sec: "MT" },
  { nome: "TATIELE SILVA ARAUJO", cpf: "-", posto: "Limpeza/Copeiragem", sec: "SP" },
  { nome: "THAIS FAGUNDES BORGES DA SILVA", cpf: "140.685.877-36", posto: "Apoio Administrativo", sec: "RJ" },
  { nome: "THIAGO FERNANDES FACUNDE", cpf: "070.135.283-31", posto: "Apoio Administrativo", sec: "MA" },
  { nome: "UIARA CEZAR GOULARTE DE SOUZA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "RS" },
  { nome: "VALDEDILSON SILVA DOS SANTOS", cpf: "-", posto: "Vigilante Diurno 12 x 36h", sec: "PA" },
  { nome: "VALDIRENE AMORIM DE ALMEIDA", cpf: "-", posto: "Limpeza/Copeiragem", sec: "AP" },
  { nome: "WANDESON DOS SANTOS CIDADE", cpf: "861.151.135-20", posto: "Apoio Administrativo", sec: "BA" },
];

// Demonstrativo por UF
export const demonstrativoUF: DemonstrativoUF[] = [
  { uf: "AC", mensal_com_contrato: 33624.83, anual_com_contrato: 403497.96, mensal_sem_contrato: 0, anual_sem_contrato: 0 },
  { uf: "AL", mensal_com_contrato: 58078.47, anual_com_contrato: 696941.64, mensal_sem_contrato: 2000, anual_sem_contrato: 24000 },
  { uf: "AP", mensal_com_contrato: 29712.84, anual_com_contrato: 356554.08, mensal_sem_contrato: 0, anual_sem_contrato: 0 },
  { uf: "AM", mensal_com_contrato: 48851.30, anual_com_contrato: 586215.60, mensal_sem_contrato: 8500, anual_sem_contrato: 102000 },
  { uf: "BA", mensal_com_contrato: 34782.95, anual_com_contrato: 417395.40, mensal_sem_contrato: 11000, anual_sem_contrato: 132000 },
  { uf: "CE", mensal_com_contrato: 40213.84, anual_com_contrato: 482566.08, mensal_sem_contrato: 0, anual_sem_contrato: 0 },
  { uf: "ES", mensal_com_contrato: 49173.06, anual_com_contrato: 590076.72, mensal_sem_contrato: 2400, anual_sem_contrato: 28800 },
  { uf: "GO", mensal_com_contrato: 41209.59, anual_com_contrato: 494515.08, mensal_sem_contrato: 0, anual_sem_contrato: 0 },
  { uf: "MA", mensal_com_contrato: 43109.35, anual_com_contrato: 517312.20, mensal_sem_contrato: 3108.84, anual_sem_contrato: 37306.08 },
  { uf: "MT", mensal_com_contrato: 24001.67, anual_com_contrato: 288020.04, mensal_sem_contrato: 14232.60, anual_sem_contrato: 170791.20 },
  { uf: "MS", mensal_com_contrato: 21851.02, anual_com_contrato: 262212.24, mensal_sem_contrato: 800, anual_sem_contrato: 9600 },
  { uf: "MG", mensal_com_contrato: 33979.40, anual_com_contrato: 407752.80, mensal_sem_contrato: 12100, anual_sem_contrato: 145200 },
  { uf: "PA", mensal_com_contrato: 84825.48, anual_com_contrato: 1017905.72, mensal_sem_contrato: 400, anual_sem_contrato: 4800 },
  { uf: "PB", mensal_com_contrato: 125343.25, anual_com_contrato: 1504119.00, mensal_sem_contrato: 8224.75, anual_sem_contrato: 98697.00 },
  { uf: "PR", mensal_com_contrato: 27253.00, anual_com_contrato: 327036.00, mensal_sem_contrato: 2700, anual_sem_contrato: 32400 },
  { uf: "PE", mensal_com_contrato: 33594.37, anual_com_contrato: 403132.44, mensal_sem_contrato: 16782.91, anual_sem_contrato: 201394.92 },
  { uf: "PI", mensal_com_contrato: 29678.15, anual_com_contrato: 356137.80, mensal_sem_contrato: 11002.40, anual_sem_contrato: 132028.80 },
  { uf: "RJ", mensal_com_contrato: 324976.88, anual_com_contrato: 3899722.56, mensal_sem_contrato: 1851.54, anual_sem_contrato: 22218.48 },
  { uf: "RN", mensal_com_contrato: 43708.41, anual_com_contrato: 524500.92, mensal_sem_contrato: 3400, anual_sem_contrato: 40800 },
  { uf: "RS", mensal_com_contrato: 31535.59, anual_com_contrato: 378427.08, mensal_sem_contrato: 34417.29, anual_sem_contrato: 413007.45 },
  { uf: "RO", mensal_com_contrato: 48629.38, anual_com_contrato: 583552.56, mensal_sem_contrato: 8150, anual_sem_contrato: 97800 },
  { uf: "RR", mensal_com_contrato: 56087.19, anual_com_contrato: 996046.28, mensal_sem_contrato: 650, anual_sem_contrato: 7800 },
  { uf: "SC", mensal_com_contrato: 31409.34, anual_com_contrato: 376912.08, mensal_sem_contrato: 0, anual_sem_contrato: 0 },
  { uf: "SP", mensal_com_contrato: 90518.69, anual_com_contrato: 1086224.28, mensal_sem_contrato: 47533.13, anual_sem_contrato: 570397.56 },
  { uf: "SE", mensal_com_contrato: 24928.53, anual_com_contrato: 321342.36, mensal_sem_contrato: 14600, anual_sem_contrato: 175200 },
  { uf: "TO", mensal_com_contrato: 45312.15, anual_com_contrato: 543745.80, mensal_sem_contrato: 14050, anual_sem_contrato: 168600 },
];

// Base de Contratos (amostra dos principais)
export const contratos: Contrato[] = [
  { id: "1", numero: "CONTRATO nº 1/2021", vigencia: "01/02/2026", tempo: "10 Meses", fornecedor: "PREVELAR SOLUCOES EM ENGENHARIA LTDA", objeto: "Manutenção de Elevadores", sec: "SEC-AL", valorMensal: 1232.35, valorAnual: 14788.20 },
  { id: "2", numero: "CONTRATO nº 1/2020", vigencia: "18/03/2026", tempo: "12 Meses", fornecedor: "AMERICA EMPREENDIMENTOS LTDA", objeto: "Locação de imóvel com adaptação no regime built to suit, para abrigar a sede da Sec-RN.", sec: "SEC-RN", valorMensal: 21333.91, valorAnual: 256006.92 },
  { id: "3", numero: "CONTRATO nº 2/2025", vigencia: "03/03/2026", tempo: "11 Meses", fornecedor: "FREITAS RODRIGUES CONSTRUÇÃO COMÉRCIO E SERVIÇO LTDA", objeto: "Substituição do sistema de climatização de ar", sec: "SEC-RR", valorMensal: 0, valorAnual: 323000 },
  { id: "4", numero: "CONTRATO nº 1/2025", vigencia: "975 Anos e 5 Meses", tempo: "Contínuo", fornecedor: "EDP ESPIRITO SANTO DISTRIBUICAO DE ENERGIA S.A", objeto: "Distribuição de energia elétrica ao CONSUMIDOR", sec: "SEC-ES", valorMensal: 2197.58, valorAnual: 26370.96 },
  { id: "5", numero: "CONTRATO nº 1/2020", vigencia: "975 Anos e 3 Meses", tempo: "Contínuo", fornecedor: "Equatorial Piauí Distribuidora de Energia S.A", objeto: "Distribuidora de Energia Elétrica", sec: "SEC-PI", valorMensal: 3768.37, valorAnual: 45220.44 },
  { id: "6", numero: "CONTRATO nº 1/2025", vigencia: "01/05/2026", tempo: "1 Meses", fornecedor: "BIOLIMP LIMPEZA E CONSERVACAO LTDA", objeto: "Limpeza/Copeiragem/Recepção/Apoio Administrativo", sec: "SEC-SP", valorMensal: 47602.62, valorAnual: 571231.44 },
  { id: "7", numero: "CONTRATO nº 2/2020", vigencia: "03/03/2027", tempo: "11 Meses", fornecedor: "BELA CIDADE SPE - LTDA", objeto: "Locação de Imóvel", sec: "SEC-ES", valorMensal: 22352.76, valorAnual: 268233.12 },
  { id: "8", numero: "CONTRATO nº 1/2021", vigencia: "26/06/2027", tempo: "1 Anos e 3 Meses", fornecedor: "BACELAR INVESTIMENTOS LTDA", objeto: "Locação de Imóvel", sec: "SEC-PE", valorMensal: 9500, valorAnual: 114000 },
  { id: "9", numero: "CONTRATO nº 1/2026", vigencia: "11/05/2026", tempo: "1 Meses", fornecedor: "INFINITY SERVICOS E GESTAO EMPRESARIAL LTDA", objeto: "Apoio Administrativo", sec: "SEC-CE", valorMensal: 18202.57, valorAnual: 218430.84 },
  { id: "10", numero: "CONTRATO nº 25/2023", vigencia: "08/11/2027", tempo: "1 Anos e 9 Meses", fornecedor: "RIBAL LOCADORA DE VEICULOS LTDA", objeto: "Locação de Veículo", sec: "SEC-RJ", valorMensal: 32280.60, valorAnual: 387367.20 },
];

// Base de Despesas sem Contrato (amostra)
export const despesasSemContrato: DespesaSemContrato[] = [
  { id: "1", sec: "AM", servico: "Energia/Condominio/Água", fornecedor: "Edificio The Office", objeto: "Pagamento de Taxa de Condomínio (salas e vagas de garagem rotativas)", unidadeFiscalizadora: "SEC-AM", valorMensal: 8500, valorAnual: 102000 },
  { id: "2", sec: "MS", servico: "Água", fornecedor: "Águas Guariroba S.A.", objeto: "Abastecimento de água potável e captação de esgoto para a SEC-MS", unidadeFiscalizadora: "SEC-MS", valorMensal: 800, valorAnual: 9600 },
  { id: "3", sec: "AL", servico: "Água", fornecedor: "BRK AMBIENTAL - REGIÃO METROPOLITANA DE MACEIÓ S.A", objeto: "Serviço de abastecimento de água potável e captação de esgoto prestados à SEC-AL", unidadeFiscalizadora: "SEC-AL", valorMensal: 2000, valorAnual: 24000 },
  { id: "4", sec: "TO", servico: "Condomínio", fornecedor: "Carlos Tamotsu Koike", objeto: "Despesas condominiais do imóvel sede da Representação do TCU no Estado de Tocantins - SEC-TO", unidadeFiscalizadora: "SEC-TO", valorMensal: 2800, valorAnual: 33600 },
  { id: "5", sec: "TO", servico: "Energia", fornecedor: "Cia. de EN.Elétrica do Estado do TO", objeto: "SERVIÇO DE FORNECIMENTO DE ENERGIA ELÉTRICA À SEC-TO", unidadeFiscalizadora: "SEC-TO", valorMensal: 8750, valorAnual: 105000 },
  { id: "6", sec: "RO", servico: "Água", fornecedor: "Companhia de Aguas e Esgotos de Rondonia Caerd", objeto: "Abastecimento de água potável e captação de esgoto, para a SEC-RO", unidadeFiscalizadora: "SEC-RO", valorMensal: 1000, valorAnual: 12000 },
  { id: "7", sec: "RR", servico: "Água", fornecedor: "Companhia de Aguas e Esgotos de Roraima Caer", objeto: "Serviços de Águas e Esgotos prestados à SEC-RR", unidadeFiscalizadora: "SEC-RR", valorMensal: 650, valorAnual: 7800 },
  { id: "8", sec: "PR", servico: "Locação", fornecedor: "Diamond Parking Ltda", objeto: "Locação mensal de vagas de garagem para a SEC-PR", unidadeFiscalizadora: "SEC-PR", valorMensal: 2700, valorAnual: 32400 },
  { id: "9", sec: "PA", servico: "Água", fornecedor: "Companhia de Saneamento do Pará", objeto: "Abastecimento de água potável e captação de esgoto para a Representação do TCU no Estado do Pará - SEC-PA", unidadeFiscalizadora: "SEC-PA", valorMensal: 400, valorAnual: 4800 },
  { id: "10", sec: "SP", servico: "Condomínio/Energia", fornecedor: "Condomínio Cetenco Plaza Torre Norte", objeto: "Despesas com Condomínio e fundo de obras, com inclusão de rateio de energia e manutenção de ar condicionado", unidadeFiscalizadora: "SEC-SP", valorMensal: 46000, valorAnual: 552000 },
];
