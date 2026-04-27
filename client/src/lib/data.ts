export interface Contrato {
  numero: string;
  fornecedor: string;
  objeto: string;
  sec: string;
  valor_mensal: number;
  valor_anual: number;
}

export interface DespesaSemContrato {
  sec: string;
  servico: string;
  fornecedor: string;
  objeto: string;
  valor_mensal: number;
  valor_anual: number;
}

export const contratos: Contrato[] = [
  {
    "numero": "CONTRATO nº 1/2021 SEC-AL",
    "fornecedor": "PREVELAR SOLUCOES EM ENGENHARIA LTDA",
    "objeto": "Manutenção de Elevadores",
    "sec": "SEC-AL",
    "valor_mensal": 1232.35,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2020 SEC-RN",
    "fornecedor": "AMERICA EMPREENDIMENTOS LTDA",
    "objeto": "Locação de imóvel com adaptação no regime built to suit, para abrigar a sede da Sec-RN.",
    "sec": "SEC-RN",
    "valor_mensal": 21333.91,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2025 SEC-RR",
    "fornecedor": "FREITAS RODRIGUES CONSTRUÇÃO COMÉRCIO E SERVIÇO LTDA",
    "objeto": "Substituição do sistema de climatização de ar",
    "sec": "SEC-RR",
    "valor_mensal": 0,
    "valor_anual": 323000.0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-ES",
    "fornecedor": "EDP ESPIRITO SANTO DISTRIBUICAO DE ENERGIA S.A",
    "objeto": "Distribuição de energia elétrica ao CONSUMIDOR",
    "sec": "SEC-ES",
    "valor_mensal": 2197.58,
    "valor_anual": 26370.96
  },
  {
    "numero": "CONTRATO nº 1/2020 SEC-PI",
    "fornecedor": "Equatorial Piauí Distribuidora de Energia S.A",
    "objeto": "Distribuidora de Energia Elétrica",
    "sec": "SEC-PI",
    "valor_mensal": 3768.37,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-SP",
    "fornecedor": "BIOLIMP LIMPEZA E CONSERVACAO LTDA",
    "objeto": "Limpeza/Copeiragem/Recepção/Apoio Administrativo",
    "sec": "SEC-SP",
    "valor_mensal": 47602.62,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2020 SEC-ES",
    "fornecedor": "BELA CIDADE SPE -  LTDA",
    "objeto": "Locação de Imóvel",
    "sec": "SEC-ES",
    "valor_mensal": 22352.76,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2021 SEC-PE",
    "fornecedor": "BACELAR INVESTIMENTOS LTDA",
    "objeto": "Locação de Imóvel",
    "sec": "SEC-PE",
    "valor_mensal": 9500.0,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2026 SEC-CE",
    "fornecedor": "INFINITY SERVICOS E GESTAO EMPRESARIAL LTDA",
    "objeto": "Apoio Administrativo",
    "sec": "SEC-CE",
    "valor_mensal": 18202.57,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 25/2023 SEC-RJ",
    "fornecedor": "RIBAL LOCADORA DE VEICULOS LTDA",
    "objeto": "Locação de Veículo",
    "sec": "SEC-RJ",
    "valor_mensal": 32280.6,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 42/2022 SEC-RJ",
    "fornecedor": "Quality aluguel de veículos S/A",
    "objeto": "Locação de Veículo",
    "sec": "SEC-RJ",
    "valor_mensal": 130675.22,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 42/2022 SEC-RJ",
    "fornecedor": "Quality aluguel de veículos S/A",
    "objeto": "Locação de Veículo",
    "sec": "SEC-SP",
    "valor_mensal": 3670.76,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-RN",
    "fornecedor": "TERCEIRIZA SERVIÇOS DE MANUTENÇÃO E LIMPEZA LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-RN",
    "valor_mensal": 19729.17,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2026 SEC-AP",
    "fornecedor": "PHOENIX SERVICOS DE HIGIENIZACAO E LIMPEZA LTDA",
    "objeto": "Apoio Administrativo",
    "sec": "SEC-AP",
    "valor_mensal": 14870.61,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO 49/2025 - SEGEDAM",
    "fornecedor": "GENTE SEGURADORA S.A.",
    "objeto": "Seguro Predial para as Secretarias nos Estados",
    "sec": "Diop-Estados",
    "valor_mensal": 5774.62,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 25/2023 SEC-RJ",
    "fornecedor": "RIBAL LOCADORA DE VEÍCULOS LTDA",
    "objeto": "Locação de veículos",
    "sec": "SEC-SP",
    "valor_mensal": 32280.6,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-MS",
    "fornecedor": "SERVPLAN - SERVIÇOS DE LIMPEZA AMBIENTAL LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-MS",
    "valor_mensal": 21851.02,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-RR",
    "fornecedor": "EMBRASG – EMPRESA BRASILEIRA DE SERVIÇOS GERAIS LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-RR",
    "valor_mensal": 28688.67,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-MT",
    "fornecedor": "ALPHA CLEAN BRASIL SERVICOS ESPECIALIZADOS LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-MT",
    "valor_mensal": 24001.67,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-AM",
    "fornecedor": "OFFICE SERVICE TERCEIRIZACAO DE MAO DE OBRA LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-AM",
    "valor_mensal": 24333.53,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2022 SEC-MA",
    "fornecedor": "JEOVA BARBOSA ENGENHARIA LTDA",
    "objeto": "Locação de Imóvel",
    "sec": "SEC-MA",
    "valor_mensal": 22008.35,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO 49/2022 - SEC-RJ",
    "fornecedor": "AIR TIME RJ AR CONDICIONADO LTDA",
    "objeto": "Manutenção de Sistema de climatização",
    "sec": "SEC-RJ",
    "valor_mensal": 16453.1,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-PE",
    "fornecedor": "FUNCIONAL TERCEIRIZACAO E PROMOCAO DE EVENTOS LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-PE",
    "valor_mensal": 24094.37,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-RO",
    "fornecedor": "A G C Prestação de Serviços LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-RO",
    "valor_mensal": 17369.02,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2024 SEC-PB",
    "fornecedor": "INFINITY SERVICOS E GESTAO EMPRESARIAL LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-PB",
    "valor_mensal": 24349.24,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2023 SEC-TO",
    "fornecedor": "CARLOS TAMOTSU KOIKE",
    "objeto": "Locação de Imóvel",
    "sec": "SEC-TO",
    "valor_mensal": 14588.46,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2025 SEC-AL",
    "fornecedor": "NOVO CONCEITO LOCACAO DE MAO DE OBRA LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio administrativo",
    "sec": "SEC-AL",
    "valor_mensal": 26217.34,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-PI",
    "fornecedor": "FALLCON SERVICE LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-PI",
    "valor_mensal": 25909.78,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO n° 2/2018 SEC-PB",
    "fornecedor": "FCS HOLDING LTDA",
    "objeto": "Locação de Imóvel",
    "sec": "SEC-PB",
    "valor_mensal": 31831.77,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-PB",
    "fornecedor": "COMBATE SEGUNRAÇA DE VALORES LTDA",
    "objeto": "Segurança pessoal",
    "sec": "SEC-PB",
    "valor_mensal": 69162.24,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2024 SEC-AC",
    "fornecedor": "CONSTROI BAHIA LOCACAO DE ESTRUTURAS E SERVICOS DA CONSTRUCAO LTDA",
    "objeto": "Apoio Administrativo",
    "sec": "SEC-AC",
    "valor_mensal": 14366.09,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO n° 3/2024 SEC-PA",
    "fornecedor": "ELESUL ELEVADORES LTDA",
    "objeto": "Substituição de Elevador Hidráulico",
    "sec": "SEC-PA",
    "valor_mensal": 0,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2024 SEC-PA",
    "fornecedor": "LIMP CAR LOCAÇÃO E SERVIÇOS LTDA",
    "objeto": "Apoio Administrativo",
    "sec": "SEC-PA",
    "valor_mensal": 15506.76,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2025 SEC-RN",
    "fornecedor": "COMPANHIA ENERGETICA DO RIO GRANDE DO NORTE COSERN",
    "objeto": "Energia Elétrica",
    "sec": "SEC-RN",
    "valor_mensal": 2645.33,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2025 SEC-RS",
    "fornecedor": "LG ADMINISTRADORA DE SERVIÇOS LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-RS",
    "valor_mensal": 24749.99,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2021 SEC-RO",
    "fornecedor": "MULTITEC ELEVADORES LTDA",
    "objeto": "Manutenção de Elevadores",
    "sec": "SEC-RO",
    "valor_mensal": 1500.0,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2024 SEC-PR",
    "fornecedor": "CONSTROI BAHIA LOCACAO DE ESTRUTURAS E SERVICOS DA CONSTRUCAO LTDA",
    "objeto": "Apoio Administrativo",
    "sec": "SEC-PR",
    "valor_mensal": 13499.94,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-GO",
    "fornecedor": "FALLCON SERVICE LTDA",
    "objeto": "Prestação de serviços contínuos de limpeza/copeiragem e apoio administrativo",
    "sec": "SEC-GO",
    "valor_mensal": 36494.59,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2024 SEC-RJ",
    "fornecedor": "VIGFAT VIGILANCIA PATRIMONIAL LTDA",
    "objeto": "Segurança pessoal",
    "sec": "SEC-RJ",
    "valor_mensal": 58662.74,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2025 SEC-SP",
    "fornecedor": "TORQUATO FREIRE SEGURANCA E VIGILANCIA PRIVADA LTDA",
    "objeto": "Segurança pessoal",
    "sec": "SEC-SP",
    "valor_mensal": 42916.07,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-BA",
    "fornecedor": "J & L MANUTENÇÕES E SERVICOS LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-BA",
    "valor_mensal": 28282.95,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-RJ",
    "fornecedor": "ORBENK ADMINISTRACAO E SERVICOS LTDA",
    "objeto": "Apoio Administrativo",
    "sec": "SEC-RJ",
    "valor_mensal": 50953.86,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-AL",
    "fornecedor": "ALFORGE SEGURANCA PATRIMONIAL LTDA",
    "objeto": "Vigilância Armada",
    "sec": "SEC-AL",
    "valor_mensal": 23332.64,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2025 SEC-SE",
    "fornecedor": "FALLCON SERVICE LTDA",
    "objeto": "Limpeza/Copeiragem e apoio administrativo",
    "sec": "SEC-SE",
    "valor_mensal": 24928.53,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2023 SEC-MG",
    "fornecedor": "SAARA OBRAS E SERVICOS LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-MG",
    "valor_mensal": 28725.44,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2025 SEC-GO",
    "fornecedor": "EMPRESA BRASILEIRA DE ELEVADORES LTDA",
    "objeto": "Manutenção preventiva e corretiva de elevadores",
    "sec": "SEC-GO",
    "valor_mensal": 4715.0,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2022 SEC-CE",
    "fornecedor": "MINISTERIO DA GESTÃO E INOVAÇÃO NOS SERVIÇOS PÚBLICOS NO CEARÁ",
    "objeto": "Utilização compartilhada de imóvel",
    "sec": "SEC-CE",
    "valor_mensal": 20491.27,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2026 SEC-PA",
    "fornecedor": "FALLCON SERVICE LTDA",
    "objeto": "Limpeza/Copeiragem",
    "sec": "SEC-PA",
    "valor_mensal": 13947.13,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2024 SEC-MA",
    "fornecedor": "OFFICE SERVICE TERCEIRIZACAO DE MAO DE OBRA LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-MA",
    "valor_mensal": 21101.0,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2024 SEC-TO",
    "fornecedor": "FENIX ASSESSORIA & GESTAO EMPRESARIAL LTDA",
    "objeto": "Apoio Administrativo",
    "sec": "SEC-TO",
    "valor_mensal": 14689.15,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-SC",
    "fornecedor": "BIOLIMP LIMPEZA E CONSERVAÇÃO LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-SC",
    "valor_mensal": 21836.88,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2024 SEC-ES",
    "fornecedor": "ADSERVICON - ADMINISTRACAO , SERVICOS & CONTABILIDADE LTDA",
    "objeto": "Limpeza/Copeiragem/Apoio Administrativo",
    "sec": "SEC-ES",
    "valor_mensal": 24622.72,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2024 SEC-PA",
    "fornecedor": "BELEM RIO SEGURANCA LTDA",
    "objeto": "Vigilância Armada",
    "sec": "SEC-PA",
    "valor_mensal": 26187.29,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2023 SEC-AC",
    "fornecedor": "EMBRASG - EMPRESA BRASILEIRA DE SERVICOS GERAIS LTDA",
    "objeto": "Limpeza/Copeiragem",
    "sec": "SEC-AC",
    "valor_mensal": 5081.65,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2020 SEC-AM",
    "fornecedor": "EB THE OFFICE INCORPORACOES LTDA",
    "objeto": "Locação de Imóvel",
    "sec": "SEC-AM",
    "valor_mensal": 24517.77,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2023 SEC-AP",
    "fornecedor": "EMBRASG - EMPRESA BRASILEIRA DE SERVICOS GERAIS LTDA",
    "objeto": "Limpeza/Copeiragem",
    "sec": "SEC-AP",
    "valor_mensal": 9438.71,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2025 SEC-CE",
    "fornecedor": "PLUS GESTAO DE ESTACIONAMENTO DE VEICULOS LTDA",
    "objeto": "Garagem",
    "sec": "SEC-CE",
    "valor_mensal": 1520.0,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº  4/2024 - SEC-PA",
    "fornecedor": "EQUATORIAL PARÁ DISTRIBUIDORA DE ENERGIA S.A",
    "objeto": "Fornecimento de Energia Elétrica",
    "sec": "SEC-PA",
    "valor_mensal": 6017.63,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO 1/2025- SEC-MG",
    "fornecedor": "CEMIG DISTRIBUIÇÃO S.A",
    "objeto": "Fornecimento de Energia Elétrica",
    "sec": "SEC-MG",
    "valor_mensal": 5253.96,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2023 SEC-BA",
    "fornecedor": "COMPANHIA DE ELETRICIDADE DO ESTADO DA BAHIA COELBA",
    "objeto": "Energia Elétrica",
    "sec": "SEC-BA",
    "valor_mensal": 0,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2022 SEC-RR",
    "fornecedor": "RORAIMA ENERGIA S.A",
    "objeto": "Energia Elétrica",
    "sec": "SEC-RR",
    "valor_mensal": 7000.0,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-RS",
    "fornecedor": "COMPANHIA ESTADUAL DE DISTRIBUICAO DE ENERGIA ELETRICA - CEEE-D",
    "objeto": "Distribuição de energia elétrica às instalações da SEC-RS",
    "sec": "SEC-RS",
    "valor_mensal": 6785.6,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-AC",
    "fornecedor": "ENERGISA ACRE – DISTRIBUIDORA DE ENERGIA S.A",
    "objeto": "Fornecimento de Energia Elétrica",
    "sec": "SEC-AC",
    "valor_mensal": 2951.39,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO Nº 2/2025",
    "fornecedor": "ENERGISA MATO GROSSO DO SUL - DISTRIBUIDORA DE ENERGIA S.A",
    "objeto": "Fornecimento de Energia Elétrica",
    "sec": "SEC-MS",
    "valor_mensal": 2570.92,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2015 SEC-AC",
    "fornecedor": "FECOMERCIO-AC.",
    "objeto": "Locação de Imóvel",
    "sec": "SEC-AC",
    "valor_mensal": 11225.7,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2024 SEC-AP",
    "fornecedor": "COMPANHIA DE ELETRICIDADE DO AMAPÁ",
    "objeto": "Fornecimento de energia elétrica",
    "sec": "SEC-AP",
    "valor_mensal": 5403.52,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 2/2024 SEC-AL",
    "fornecedor": "EQUATORIAL ALAGOAS DISTRIBUIDORA DE ENERGIA S.A.COMPANHIA DE ELETRICIDADE DO AMAPÁCOMPANHIA DE ELETRICIDADE DO AMAPÁ",
    "objeto": "Fornecimento de Energia Elétrica",
    "sec": "SEC-AL",
    "valor_mensal": 7296.14,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO 1/2025- SE-MA",
    "fornecedor": "EQUATORIAL MARANHAO DISTRIBUIDORA DE ENERGIA S.A",
    "objeto": "Fornecimento de Energia Elétrica",
    "sec": "SEC-MA",
    "valor_mensal": 2538.07,
    "valor_anual": 0
  },
  {
    "numero": "CONTRATO nº 1/2025 SEC-SE",
    "fornecedor": "ENERGISA SERGIPE - DISTRIBUIDORA DE ENERGIA S.A",
    "objeto": "Energia Elétrica",
    "sec": "SEC-SE",
    "valor_mensal": 1850.0,
    "valor_anual": 0
  }
];

export const despesasSemContrato: DespesaSemContrato[] = [
  {
    "sec": "AM",
    "servico": "Energia/Condominio/Água",
    "fornecedor": "Edificio The Office",
    "objeto": "Pagamento de Taxa de Condomínio (salas e vagas de garagem rotativas) do Edifício The Office - imóvel locado para abrigar a nova Sede da SEC-AM",
    "valor_mensal": 8500.0,
    "valor_anual": 0
  },
  {
    "sec": "MS",
    "servico": "Água",
    "fornecedor": "Aguas Guariroba SA",
    "objeto": "Águas Guariroba S.A. Abastecimento de água potável e captação de esgoto para a SEC-MS",
    "valor_mensal": 800.0,
    "valor_anual": 0
  },
  {
    "sec": "AL",
    "servico": "Água",
    "fornecedor": "BRK AMBIENTAL - REGIÃO METROPOLITANA DE MACEIÓ S.A",
    "objeto": "Serviço de abastecimento de água potável e captação de esgoto prestados à SEC-AL",
    "valor_mensal": 2000.0,
    "valor_anual": 0
  },
  {
    "sec": "TO",
    "servico": "Condomínio",
    "fornecedor": "Carlos Tamotsu Koike",
    "objeto": "Despesas condominiais do imóvel sede da Representação do TCU no Estado de Tocantins - SEC-TO",
    "valor_mensal": 2800.0,
    "valor_anual": 0
  },
  {
    "sec": "TO",
    "servico": "Energia",
    "fornecedor": "Cia. de EN.Elétrica do Estado do TO",
    "objeto": "SERVIÇO DE FORNECIMENTO DE ENERGIA ELÉTRICA À SEC-TO",
    "valor_mensal": 0,
    "valor_anual": 0
  },
  {
    "sec": "RO",
    "servico": "Água",
    "fornecedor": "Companhia de Aguas e Esgotos de Rondonia Caerd",
    "objeto": "Abastecimento de água potável e captação de esgoto, para a SEC-RO",
    "valor_mensal": 1000.0,
    "valor_anual": 0
  },
  {
    "sec": "RR",
    "servico": "Água",
    "fornecedor": "Companhia de Aguas e Esgotos de Roraima Caer",
    "objeto": "Serviços de Águas e Esgotos prestados à SEC-RR",
    "valor_mensal": 650.0,
    "valor_anual": 0
  },
  {
    "sec": "PR",
    "servico": "Locação",
    "fornecedor": "Diamond Parking Ltda",
    "objeto": "Locação mensal de vagas de garagem para a SEC-PR",
    "valor_mensal": 2700.0,
    "valor_anual": 32400.0
  },
  {
    "sec": "PA",
    "servico": "Água",
    "fornecedor": "Companhia de Saneamento do Pará",
    "objeto": "Abastecimento de água potável e captação de esgoto para a Representação do TCU no Estado do Pará - SEC-PA",
    "valor_mensal": 400.0,
    "valor_anual": 0
  },
  {
    "sec": "TO",
    "servico": "Água",
    "fornecedor": "COMPANHIA DE SANEAMENTO DO TOCANTINS - SANEATINS",
    "objeto": "Fornecimento de água e captação de esgoto",
    "valor_mensal": 2500.0,
    "valor_anual": 30000.0
  },
  {
    "sec": "SP",
    "servico": "Condomínio/Energia",
    "fornecedor": "Condomínio Cetenco Plaza Torre Norte",
    "objeto": "Despesas com Condomínio e fundo de obras, com inclusão de rateio de energia e manutenção de ar condicionado",
    "valor_mensal": 46000.0,
    "valor_anual": 0
  },
  {
    "sec": "MG",
    "servico": "Condomínio/Água",
    "fornecedor": "Condomínio do Edifício Soinco Business Center",
    "objeto": "CONDOMINIO DO EDIFICIO SOINCO BUSINESS CENTER",
    "valor_mensal": 12100.0,
    "valor_anual": 0
  },
  {
    "sec": "PE",
    "servico": "Condomínio/Água/Energia",
    "fornecedor": "Condominio do Edificio The Plaza",
    "objeto": "DESPESAS CONDOMINIAIS REFERENTES À NOVA SEDE DA REPRESENTAÇÃO DO TCU NO ESTADO DE PERNAMBUCO - SEC-PE",
    "valor_mensal": 6363.42,
    "valor_anual": 0
  },
  {
    "sec": "MT",
    "servico": "Condomínio/Água",
    "fornecedor": "Condomínio Edifício Xingu Business Center",
    "objeto": "Despesa condominial, referente ao imóvel ocupado pela Representação do TCU no Estado do Mato Grosso - SEC-MT",
    "valor_mensal": 8982.6,
    "valor_anual": 0
  },
  {
    "sec": "PB",
    "servico": "Condomínio/Água/Energia",
    "fornecedor": "Condominio Empresarial Eco Business Center",
    "objeto": "Despesa condominial referente a 7 (sete) salas e 7 (sete) vagas de garagem rotativas do imóvel no condomínio Empresarial ECO Business Center",
    "valor_mensal": 8224.75,
    "valor_anual": 0
  },
  {
    "sec": "BA",
    "servico": "Condomínio/Água",
    "fornecedor": "Condomínio Salvador Prime",
    "objeto": "Despesas condominiais das salas onde funciona a sede da SEC-BA. Edifício Salvador Prime Work, 17º andar - Caminho das Árvores - Salvador-BA",
    "valor_mensal": 11000.0,
    "valor_anual": 0
  },
  {
    "sec": "ES",
    "servico": "Condomínio/Água",
    "fornecedor": "Condominio Vertice Empresarial Enseada",
    "objeto": "Despesa condominial referente a salas e vagas de garagem do Edifício VÉRTICE EMPRESARIAL ENSEADA",
    "valor_mensal": 2400.0,
    "valor_anual": 0
  },
  {
    "sec": "MT",
    "servico": "Energia",
    "fornecedor": "Energisa Mato Grosso - Distribuidora de Energia S.A",
    "objeto": "Fornecimento de Energia Elétrica à SEC-MT e Contribuição de Iluminação Pública (CIP)",
    "valor_mensal": 0,
    "valor_anual": 0
  },
  {
    "sec": "RO",
    "servico": "Coleta de lixo",
    "fornecedor": "Prefeitura Municipal de Porto Velho",
    "objeto": "Taxa de Coleta de Lixo – TCL da SEC-RO",
    "valor_mensal": 0,
    "valor_anual": 1823.05
  },
  {
    "sec": "RO",
    "servico": "Energia",
    "fornecedor": "Energisa Rondônia",
    "objeto": "Fornecimento de energia elétrica e contribuição para iluminação pública à SEC-RO",
    "valor_mensal": 7150.0,
    "valor_anual": 0
  },
  {
    "sec": "RS",
    "servico": "Condomínio",
    "fornecedor": "Guarida Servicos Imobiliarios Ltda",
    "objeto": "Despesa condominial, referente ao imóvel ocupado pela Representação do TCU no Estado do Rio Grande do Sul - SEC-RS",
    "valor_mensal": 0,
    "valor_anual": 0
  },
  {
    "sec": "SE",
    "servico": "Água",
    "fornecedor": "Iguá Sergipe S.A",
    "objeto": "Fornecimento de água e serviços de esgoto para a Representação do TCU no Estado de Sergipe",
    "valor_mensal": 600.0,
    "valor_anual": 0
  },
  {
    "sec": "SE",
    "servico": "Condomínio",
    "fornecedor": "Jfc Trade Center",
    "objeto": "Taxa de condomínio de salas e vagas de garagem do JFC Trade Center onde está instalada a Secretaria do TCU no Estado de Sergipe",
    "valor_mensal": 14000.0,
    "valor_anual": 0
  },
  {
    "sec": "MA",
    "servico": "Condomínio/Água",
    "fornecedor": "Marcus Barbosa Intelligent Office",
    "objeto": "Despesas condominiais referentes ao Edifício Comercial Marcus Barbosa Intelligent Office",
    "valor_mensal": 3108.84,
    "valor_anual": 37306.08
  },
  {
    "sec": "RN",
    "servico": "Condomínio/Água",
    "fornecedor": "Pjbank Pagamentos S.A",
    "objeto": "Pagamento taxa condominial referente a 5 (cinco) salas comerciais e 7 (sete) vagas de garagem do condomínio Manhattan Business Office",
    "valor_mensal": 3400.0,
    "valor_anual": 0
  },
  {
    "sec": "RJ",
    "servico": "Seguro veicular",
    "fornecedor": "PORTO SEGURO COMPANHIA DE SEGUROS GERAIS",
    "objeto": "Seguro veicular para 01 veículo pertencente à secretaria do TCU no Estado do Rio de Janeiro (SEC-RJ)",
    "valor_mensal": 1851.54,
    "valor_anual": 1991.97
  },
  {
    "sec": "SP",
    "servico": "Seguro veicular",
    "fornecedor": "PORTO SEGURO COMPANHIA DE SEGUROS GERAIS",
    "objeto": "Seguro veicular para a viatura em uso na Sec-SP",
    "valor_mensal": 1533.13,
    "valor_anual": 1533.13
  },
  {
    "sec": "PI",
    "servico": "Condomínio",
    "fornecedor": "Predial Servicos de Cobranca Condominial Ltda",
    "objeto": "TAXA CONDOMÍNIO MANHATTAN RIVER CENTER, 14 SALAS E 25 VAGAS DE GARAGEM - SEDE DA SEC-PI",
    "valor_mensal": 11002.4,
    "valor_anual": 0
  },
  {
    "sec": "PE",
    "servico": "Motorista",
    "fornecedor": "SERCOSERV SERVICOS TERCEIRIZADOS LTDA",
    "objeto": "Serviço de motorista - SEC-PE",
    "valor_mensal": 10419.49,
    "valor_anual": 0
  },
  {
    "sec": "MS",
    "servico": "MANUTENÇÃO PREVENTIVA E CORRETIVA",
    "fornecedor": "TORO ELEVADORES LTDA",
    "objeto": "PRESTAÇÃO DE SERVIÇOS TERCEIRIZADOS, DE NATUREZA CONTINUADA, SEM DEDICAÇÃO EXCLUSIVA DE MÃO DE OBRA, PARA MANUTENÇÃO PREVENTIVA E CORRETIVA, ALÉM DE ADEQUAÇÃO ÀS NORMAS DE SEGURANÇA, DO ELEVADOR INSTALADO NA REP-MS.",
    "valor_mensal": 4825.0,
    "valor_anual": 57900.0
  }
];

export const secs = ["AL", "AM", "BA", "Diop-Estados", "ES", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SE", "SEC-AC", "SEC-AL", "SEC-AM", "SEC-AP", "SEC-BA", "SEC-CE", "SEC-ES", "SEC-GO", "SEC-MA", "SEC-MG", "SEC-MS", "SEC-MT", "SEC-PA", "SEC-PB", "SEC-PE", "SEC-PI", "SEC-PR", "SEC-RJ", "SEC-RN", "SEC-RO", "SEC-RR", "SEC-RS", "SEC-SC", "SEC-SE", "SEC-SP", "SEC-TO", "SP", "TO"];

export const totaisContratos = {
  mensal: 1349936.7299999988,
  anual: 349370.96,
};

export const totaisDespesasSem = {
  mensal: 174311.17,
  anual: 162954.23,
};

export const totalGeral = {
  mensal: 1524247.8999999987,
  anual: 512325.19000000006,
};
