// validations/institutional-management.validations.js
import { z } from 'zod';

// ===============================
// REGIME IVA VALIDATIONS
// ===============================

export const regimeIvaCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(100, "Designação deve ter no máximo 100 caracteres")
    .trim()
}).strict();

export const regimeIvaUpdateSchema = z.object({
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(100, "Designação deve ter no máximo 100 caracteres")
    .trim()
    .optional()
}).strict();

// ===============================
// DADOS INSTITUIÇÃO VALIDATIONS
// ===============================

export const dadosInstituicaoCreateSchema = z.object({
  n_Escola: z
    .string()
    .max(45, "Número da escola deve ter no máximo 45 caracteres")
    .optional(),
  nome: z
    .string()
    .max(450, "Nome deve ter no máximo 450 caracteres")
    .optional(),
  director: z
    .string()
    .max(145, "Nome do diretor deve ter no máximo 145 caracteres")
    .optional(),
  subDirector: z
    .string()
    .max(45, "Nome do subdiretor deve ter no máximo 45 caracteres")
    .optional(),
  telefone_Fixo: z
    .string()
    .max(45, "Telefone fixo deve ter no máximo 45 caracteres")
    .optional(),
  telefone_Movel: z
    .string()
    .max(45, "Telefone móvel deve ter no máximo 45 caracteres")
    .optional(),
  email: z
    .string()
    .email("Email deve ter um formato válido")
    .max(145, "Email deve ter no máximo 145 caracteres")
    .optional()
    .or(z.literal("")),
  site: z
    .string()
    .max(145, "Site deve ter no máximo 145 caracteres")
    .optional(),
  localidade: z
    .string()
    .max(145, "Localidade deve ter no máximo 145 caracteres")
    .optional(),
  contribuinte: z
    .string()
    .max(45, "Contribuinte deve ter no máximo 45 caracteres")
    .optional(),
  nif: z
    .string()
    .max(45, "NIF deve ter no máximo 45 caracteres")
    .optional(),
  contaBancaria1: z
    .string()
    .max(45, "Conta bancária 1 deve ter no máximo 45 caracteres")
    .optional(),
  contaBancaria2: z
    .string()
    .max(45, "Conta bancária 2 deve ter no máximo 45 caracteres")
    .optional(),
  contaBancaria3: z
    .string()
    .max(45, "Conta bancária 3 deve ter no máximo 45 caracteres")
    .optional(),
  contaBancaria4: z
    .string()
    .max(45, "Conta bancária 4 deve ter no máximo 45 caracteres")
    .optional(),
  contaBancaria5: z
    .string()
    .max(45, "Conta bancária 5 deve ter no máximo 45 caracteres")
    .optional(),
  contaBancaria6: z
    .string()
    .max(45, "Conta bancária 6 deve ter no máximo 45 caracteres")
    .optional(),
  regime_Iva: z
    .string()
    .max(450, "Regime IVA deve ter no máximo 450 caracteres")
    .optional(),
  logotipo: z
    .string()
    .max(200, "Logotipo deve ter no máximo 200 caracteres")
    .optional(),
  provincia: z
    .string()
    .max(45, "Província deve ter no máximo 45 caracteres")
    .optional(),
  municipio: z
    .string()
    .max(45, "Município deve ter no máximo 45 caracteres")
    .optional(),
  nescola: z
    .string()
    .max(45, "Nescola deve ter no máximo 45 caracteres")
    .optional(),
  taxaIva: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Taxa IVA deve ser um número inteiro positivo"
    })
    .optional()
}).strict();

export const dadosInstituicaoUpdateSchema = dadosInstituicaoCreateSchema.partial();

// ===============================
// PARÂMETROS VALIDATIONS
// ===============================

export const parametroCreateSchema = z.object({
  designacao: z
    .string()
    .max(545, "Designação deve ter no máximo 545 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),
  valor: z
    .union([
      z.string().transform(val => {
        if (val === "" || val === null) return null;
        const parsed = parseFloat(val);
        if (isNaN(parsed)) throw new Error("Valor deve ser um número válido");
        return parsed;
      }),
      z.number(),
      z.null()
    ])
    .optional(),
  descricao: z
    .string({
      required_error: "Descrição é obrigatória",
      invalid_type_error: "Descrição deve ser um texto"
    })
    .min(1, "Descrição não pode estar vazia")
    .max(105, "Descrição deve ter no máximo 105 caracteres")
    .trim()
}).strict();

export const parametroUpdateSchema = z.object({
  designacao: z
    .string()
    .max(545, "Designação deve ter no máximo 545 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),
  valor: z
    .union([
      z.string().transform(val => {
        if (val === "" || val === null) return null;
        const parsed = parseFloat(val);
        if (isNaN(parsed)) throw new Error("Valor deve ser um número válido");
        return parsed;
      }),
      z.number(),
      z.null()
    ])
    .optional(),
  descricao: z
    .string()
    .min(1, "Descrição não pode estar vazia")
    .max(105, "Descrição deve ter no máximo 105 caracteres")
    .trim()
    .optional()
}).strict();

// ===============================
// STATUS ESCOLA VALIDATIONS
// ===============================

export const statusEscolaCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
}).strict();

export const statusEscolaUpdateSchema = z.object({
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
    .optional()
}).strict();

// ===============================
// NUMERAÇÃO DOCUMENTOS VALIDATIONS
// ===============================

export const numeracaoDocumentoCreateSchema = z.object({
  designacao: z
    .string()
    .max(50, "Designação deve ter no máximo 50 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),
  next: z
    .union([
      z.string().transform(val => {
        if (val === "" || val === null) return null;
        const parsed = parseInt(val);
        if (isNaN(parsed)) throw new Error("Next deve ser um número inteiro válido");
        if (parsed < 0) throw new Error("Next deve ser um número não negativo");
        return parsed;
      }),
      z.number().int().min(0, "Next deve ser um número não negativo"),
      z.null()
    ])
    .optional()
}).strict();

export const numeracaoDocumentoUpdateSchema = numeracaoDocumentoCreateSchema.partial();

// ===============================
// ITENS GUIA VALIDATIONS
// ===============================

export const itemGuiaCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(100, "Designação deve ter no máximo 100 caracteres")
    .trim()
}).strict();

export const itemGuiaUpdateSchema = z.object({
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(100, "Designação deve ter no máximo 100 caracteres")
    .trim()
    .optional()
}).strict();

// ===============================
// VALIDAÇÃO DE ID PARA PARÂMETROS DE ROTA
// ===============================

export const idParamSchema = z.object({
  id: z
    .string()
    .transform(val => {
      const parsed = parseInt(val);
      if (isNaN(parsed) || parsed <= 0) {
        throw new Error("ID deve ser um número inteiro positivo");
      }
      return parsed;
    })
});

// ===============================
// VALIDAÇÃO PARA BUSCA DE PRÓXIMO NÚMERO
// ===============================

export const nextNumberSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(50, "Designação deve ter no máximo 50 caracteres")
    .trim()
});

// ===============================
// SCHEMAS DE VALIDAÇÃO FLEXÍVEL (SEGUINDO PADRÃO DA MEMÓRIA)
// ===============================

// Schema flexível para regime IVA que aceita diferentes formatos de campo
export const regimeIvaFlexibleCreateSchema = z.object({
  designacao: z.string().min(1).max(100).trim(),
  designacao_regime: z.string().min(1).max(100).trim().optional(),
  nome: z.string().min(1).max(100).trim().optional(),
  nome_regime: z.string().min(1).max(100).trim().optional()
})
.transform(data => {
  // Normalizar para o campo padrão 'designacao'
  const designacao = data.designacao || data.designacao_regime || data.nome || data.nome_regime;
  
  if (!designacao) {
    throw new Error("Designação é obrigatória");
  }
  
  return { designacao };
})
.refine(data => data.designacao, {
  message: "Designação é obrigatória"
});

// Schema flexível para parâmetros que aceita diferentes formatos
export const parametroFlexibleCreateSchema = z.object({
  designacao: z.string().max(545).trim().optional(),
  nome: z.string().max(545).trim().optional(),
  titulo: z.string().max(545).trim().optional(),
  
  valor: z.union([z.string(), z.number(), z.null()]).optional(),
  value: z.union([z.string(), z.number(), z.null()]).optional(),
  
  descricao: z.string().min(1).max(105).trim(),
  description: z.string().min(1).max(105).trim().optional(),
  desc: z.string().min(1).max(105).trim().optional()
})
.transform(data => {
  // Normalizar campos
  const designacao = data.designacao || data.nome || data.titulo || null;
  const valor = data.valor !== undefined ? data.valor : data.value;
  const descricao = data.descricao || data.description || data.desc;
  
  if (!descricao) {
    throw new Error("Descrição é obrigatória");
  }
  
  // Processar valor
  let processedValor = null;
  if (valor !== null && valor !== undefined && valor !== "") {
    if (typeof valor === 'string') {
      const parsed = parseFloat(valor);
      if (!isNaN(parsed)) {
        processedValor = parsed;
      }
    } else if (typeof valor === 'number') {
      processedValor = valor;
    }
  }
  
  return {
    designacao: designacao?.trim() || null,
    valor: processedValor,
    descricao: descricao.trim()
  };
})
.refine(data => data.descricao, {
  message: "Descrição é obrigatória"
});

// Schema flexível para dados da instituição
export const dadosInstituicaoFlexibleCreateSchema = z.object({
  // Aceitar diferentes formatos para nome da escola
  nome: z.string().max(450).optional(),
  nome_escola: z.string().max(450).optional(),
  name: z.string().max(450).optional(),
  escola_nome: z.string().max(450).optional(),
  
  // Aceitar diferentes formatos para diretor
  director: z.string().max(145).optional(),
  diretor: z.string().max(145).optional(),
  director_nome: z.string().max(145).optional(),
  
  // Aceitar diferentes formatos para email
  email: z.string().email().max(145).optional().or(z.literal("")),
  email_institucional: z.string().email().max(145).optional().or(z.literal("")),
  
  // Aceitar diferentes formatos para telefone
  telefone_Fixo: z.string().max(45).optional(),
  telefone_fixo: z.string().max(45).optional(),
  telefone: z.string().max(45).optional(),
  phone: z.string().max(45).optional(),
  
  telefone_Movel: z.string().max(45).optional(),
  telefone_movel: z.string().max(45).optional(),
  celular: z.string().max(45).optional(),
  mobile: z.string().max(45).optional(),
  
  // Outros campos com flexibilidade
  nif: z.string().max(45).optional(),
  contribuinte: z.string().max(45).optional(),
  localidade: z.string().max(145).optional(),
  provincia: z.string().max(45).optional(),
  municipio: z.string().max(45).optional(),
  
  // Contas bancárias
  contaBancaria1: z.string().max(45).optional(),
  conta_bancaria_1: z.string().max(45).optional(),
  contaBancaria2: z.string().max(45).optional(),
  conta_bancaria_2: z.string().max(45).optional(),
  contaBancaria3: z.string().max(45).optional(),
  conta_bancaria_3: z.string().max(45).optional(),
  
  // Taxa IVA
  taxaIva: z.union([z.string(), z.number()]).optional(),
  taxa_iva: z.union([z.string(), z.number()]).optional(),
  iva: z.union([z.string(), z.number()]).optional()
})
.transform(data => {
  // Normalizar todos os campos para o formato padrão
  return {
    nome: (data.nome || data.nome_escola || data.name || data.escola_nome || "nenhum").trim(),
    director: (data.director || data.diretor || data.director_nome || "nenhum").trim(),
    email: (data.email || data.email_institucional || "nenhum").trim(),
    telefone_Fixo: (data.telefone_Fixo || data.telefone_fixo || data.telefone || data.phone || "0").trim(),
    telefone_Movel: (data.telefone_Movel || data.telefone_movel || data.celular || data.mobile || "0").trim(),
    nif: (data.nif || "nenhum").trim(),
    contribuinte: (data.contribuinte || "0").trim(),
    localidade: (data.localidade || "0").trim(),
    provincia: (data.provincia || "0").trim(),
    municipio: (data.municipio || "0").trim(),
    contaBancaria1: (data.contaBancaria1 || data.conta_bancaria_1 || "0").trim(),
    contaBancaria2: (data.contaBancaria2 || data.conta_bancaria_2 || "0").trim(),
    contaBancaria3: (data.contaBancaria3 || data.conta_bancaria_3 || "0").trim(),
    taxaIva: data.taxaIva || data.taxa_iva || data.iva ? 
      parseInt(data.taxaIva || data.taxa_iva || data.iva) : 1
  };
});

export default {
  regimeIvaCreateSchema,
  regimeIvaUpdateSchema,
  dadosInstituicaoCreateSchema,
  dadosInstituicaoUpdateSchema,
  parametroCreateSchema,
  parametroUpdateSchema,
  statusEscolaCreateSchema,
  statusEscolaUpdateSchema,
  numeracaoDocumentoCreateSchema,
  numeracaoDocumentoUpdateSchema,
  itemGuiaCreateSchema,
  itemGuiaUpdateSchema,
  idParamSchema,
  nextNumberSchema,
  regimeIvaFlexibleCreateSchema,
  parametroFlexibleCreateSchema,
  dadosInstituicaoFlexibleCreateSchema
};
