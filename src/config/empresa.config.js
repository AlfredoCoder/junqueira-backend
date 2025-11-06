/**
 * Configurações da Empresa - Complexo Escolar Privado Abílio Junqueira
 * Dados centralizados para uso em todo o sistema backend
 */

const EMPRESA_CONFIG = {
  // Dados principais da empresa
  nome: "COMPLEXO ESCOLAR PRIVADO ABÍLIO JUNQUEIRA",
  nomeCompleto: "Complexo Escolar Privado Abílio Junqueira",
  nomeAbreviado: "Complexo Abílio Junqueira",
  
  // Dados fiscais
  nif: "00003697ME010",
  
  // Contactos
  contactos: {
    telefones: ["923336102", "946309668"],
    principal: "923336102",
    email: "info@complexoabiliojunqueira.ao",
    website: "www.complexoabiliojunqueira.ao"
  },
  
  // Localização
  endereco: {
    completo: "Talatona, Bairro Mirantes - Rua D Travessa 12",
    bairro: "Mirantes",
    rua: "Rua D Travessa 12",
    municipio: "Talatona",
    provincia: "Luanda",
    pais: "Angola"
  },
  
  // Dados para faturas
  faturacao: {
    regime: "REGIME SIMPLIFICADO",
    moeda: "AOA",
    simboloMoeda: "Kz",
    iva: {
      aplicaIva: false,
      taxa: 0,
      numeroContribuinte: "00003697ME010"
    }
  },
  
  // Dados bancários (se necessário)
  bancarios: {
    banco: "Banco BAI",
    iban: "AO06.0040.0000.1234.5678.1011.2",
    swift: "BAIIAO22"
  },
  
  // Configurações do sistema
  sistema: {
    versao: "1.0.0",
    ambiente: process.env.NODE_ENV || "development"
  }
};

// Funções utilitárias
const formatarTelefones = (separador = " | ") => {
  return EMPRESA_CONFIG.contactos.telefones.join(separador);
};

const formatarEndereco = (completo = true) => {
  if (completo) {
    return EMPRESA_CONFIG.endereco.completo;
  }
  return `${EMPRESA_CONFIG.endereco.bairro}, ${EMPRESA_CONFIG.endereco.municipio}`;
};

const formatarDadosFiscais = () => {
  return {
    nif: EMPRESA_CONFIG.nif,
    regime: EMPRESA_CONFIG.faturacao.regime,
    contribuinte: EMPRESA_CONFIG.faturacao.iva.numeroContribuinte
  };
};

// Dados para cabeçalho de documentos
const getCabecalhoDocumento = () => {
  return {
    nome: EMPRESA_CONFIG.nome,
    nif: EMPRESA_CONFIG.nif,
    endereco: EMPRESA_CONFIG.endereco.completo,
    telefones: formatarTelefones(),
    email: EMPRESA_CONFIG.contactos.email,
    regime: EMPRESA_CONFIG.faturacao.regime
  };
};

// Dados específicos para faturas
const getDadosFatura = () => {
  return {
    empresa: {
      nome: EMPRESA_CONFIG.nome,
      nif: EMPRESA_CONFIG.nif,
      endereco: EMPRESA_CONFIG.endereco.completo,
      telefone: EMPRESA_CONFIG.contactos.principal,
      telefones: EMPRESA_CONFIG.contactos.telefones,
      email: EMPRESA_CONFIG.contactos.email
    },
    fiscal: {
      regime: EMPRESA_CONFIG.faturacao.regime,
      iva: EMPRESA_CONFIG.faturacao.iva.taxa,
      aplicaIva: EMPRESA_CONFIG.faturacao.iva.aplicaIva
    },
    moeda: {
      codigo: EMPRESA_CONFIG.faturacao.moeda,
      simbolo: EMPRESA_CONFIG.faturacao.simboloMoeda
    }
  };
};

export {
  EMPRESA_CONFIG,
  formatarTelefones,
  formatarEndereco,
  formatarDadosFiscais,
  getCabecalhoDocumento,
  getDadosFatura
};

export default EMPRESA_CONFIG;
