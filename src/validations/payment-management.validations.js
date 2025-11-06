import { z } from "zod";

// ===============================
// VALIDAÇÕES AUXILIARES
// ===============================

const positiveNumber = z.number().min(0, "Valor deve ser positivo");
const positiveInt = z.number().int().positive("ID deve ser um número positivo");
const optionalPositiveInt = z.number().int().positive().optional();

// ===============================
// FORMAS DE PAGAMENTO
// ===============================

export const formaPagamentoCreateSchema = z.object({
  designacao: z.string()
    .min(1, "Designação é obrigatória")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
});

export const formaPagamentoUpdateSchema = formaPagamentoCreateSchema.partial();

// ===============================
// PAGAMENTO PRINCIPAL (tb_pagamentoi)
// ===============================

export const pagamentoiCreateSchema = z.object({
  data: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
    .transform(val => new Date(val)),
  
  codigo_Aluno: positiveInt,
  status: z.number().int().min(0, "Status inválido"),
  total: positiveNumber.optional(),
  valorEntregue: positiveNumber,
  
  dataBanco: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data do banco deve estar no formato YYYY-MM-DD")
    .transform(val => new Date(val)),
  
  totalDesconto: positiveNumber.default(0),
  obs: z.string().max(200, "Observação deve ter no máximo 200 caracteres").optional(),
  borderoux: z.string().max(200, "Borderoux deve ter no máximo 200 caracteres").optional(),
  saldoAnterior: positiveNumber.default(0),
  descontoSaldo: positiveNumber.default(0),
  saldo: positiveNumber.default(0),
  codigoPagamento: z.number().int().default(0),
  saldoOperacao: positiveNumber.default(0),
  codigoUtilizador: optionalPositiveInt,
  hash: z.string().max(1000, "Hash deve ter no máximo 1000 caracteres").optional(),
  tipoDocumento: z.string().max(50, "Tipo documento deve ter no máximo 50 caracteres").optional(),
  totalIva: positiveNumber.optional(),
  nifCliente: z.string().max(50, "NIF deve ter no máximo 50 caracteres").optional(),
  troco: positiveNumber.optional()
});

export const pagamentoiUpdateSchema = pagamentoiCreateSchema.partial();

// ===============================
// DETALHES DE PAGAMENTO (tb_pagamentos)
// ===============================

// Schema completo para pagamentos (uso interno)
export const pagamentoCreateSchemaFull = z.object({
  codigo_Aluno: positiveInt,
  codigo_Tipo_Servico: optionalPositiveInt,
  
  data: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
    .transform(val => new Date(val)),
  
  n_Bordoro: z.string()
    .min(1, "Número do borderô é obrigatório")
    .max(200, "Número do borderô deve ter no máximo 200 caracteres"),
  
  multa: positiveNumber.default(0),
  mes: z.string().max(45, "Mês deve ter no máximo 45 caracteres").optional(),
  codigo_Utilizador: positiveInt,
  
  observacao: z.string()
    .max(100, "Observação deve ter no máximo 100 caracteres")
    .default(""),
  
  ano: z.number().int().min(1900).max(2100).default(new Date().getFullYear()),
  
  contaMovimentada: z.string()
    .min(1, "Conta movimentada é obrigatória")
    .max(45, "Conta movimentada deve ter no máximo 45 caracteres"),
  
  quantidade: z.number().int().positive().optional(),
  desconto: positiveNumber.optional(),
  totalgeral: positiveNumber.optional(),
  
  dataBanco: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data do banco deve estar no formato YYYY-MM-DD")
    .transform(val => new Date(val))
    .optional(),
  
  codigo_Estatus: z.number().int().default(1),
  codigo_Empresa: z.number().int().default(1),
  codigo_FormaPagamento: z.number().int().default(1),
  saldo_Anterior: positiveNumber.default(0),
  codigoPagamento: positiveInt,
  descontoSaldo: positiveNumber.default(1),
  
  tipoDocumento: z.string()
    .min(1, "Tipo de documento é obrigatório")
    .max(45, "Tipo de documento deve ter no máximo 45 caracteres"),
  
  next: z.string()
    .max(45, "Next deve ter no máximo 45 caracteres")
    .default(""),
  
  codoc: z.number().int().default(0),
  
  fatura: z.string()
    .min(1, "Fatura é obrigatória")
    .max(45, "Fatura deve ter no máximo 45 caracteres"),
  
  taxa_iva: z.number().min(0).max(100, "Taxa IVA deve estar entre 0 e 100").optional(),
  
  hash: z.string()
    .min(1, "Hash é obrigatório")
    .max(555, "Hash deve ter no máximo 555 caracteres"),
  
  preco: positiveNumber.default(0),
  indice_mes: z.number().int().min(1).max(12).optional(),
  indice_ano: z.number().int().min(1900).max(2100).optional()
});

// Schema simplificado para frontend
export const pagamentoCreateSchema = z.object({
  codigo_Aluno: positiveInt,
  codigo_Tipo_Servico: positiveInt,
  mes: z.string().min(1, "Mês é obrigatório").max(45, "Mês deve ter no máximo 45 caracteres"),
  ano: z.number().int().min(1900).max(2100),
  preco: positiveNumber,
  observacao: z.string().max(100, "Observação deve ter no máximo 100 caracteres").optional().default(""),
  codigo_FormaPagamento: positiveInt,
  codigo_Utilizador: positiveInt, // Funcionário que processa o pagamento (obrigatório)
  // Campos opcionais para depósito bancário
  tipoConta: z.enum(['BAI', 'BFA']).optional(),
  numeroBordero: z.string()
    .regex(/^\d{9}$/, "Número de borderô deve conter exatamente 9 dígitos")
    .optional()
});

export const pagamentoUpdateSchema = pagamentoCreateSchema.partial();

// ===============================
// NOTA DE CRÉDITO
// ===============================

export const notaCreditoCreateSchema = z.object({
  designacao: z.string()
    .min(1, "Designação é obrigatória")
    .max(200, "Designação deve ter no máximo 200 caracteres"),
  
  fatura: z.string()
    .min(1, "Fatura é obrigatória")
    .max(100, "Fatura deve ter no máximo 100 caracteres"),
  
  descricao: z.string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
  
  valor: z.string()
    .min(1, "Valor é obrigatório")
    .max(45, "Valor deve ter no máximo 45 caracteres"),
  
  codigo_aluno: z.number().int().positive("Código do aluno deve ser um número positivo"),
  
  documento: z.string()
    .min(1, "Documento é obrigatório")
    .max(100, "Documento deve ter no máximo 100 caracteres"),
  
  next: z.string()
    .max(45, "Next deve ter no máximo 45 caracteres")
    .default(""),
  
  dataOperacao: z.string()
    .max(45, "Data operação deve ter no máximo 45 caracteres")
    .default("00-00-0000"),
  
  hash: z.string()
    .max(555, "Hash deve ter no máximo 555 caracteres")
    .optional(),
  
  codigoPagamentoi: z.number().int().positive("Código do pagamento deve ser um número positivo").optional(),
  
  pagamento_ref: z.string()
    .max(50, "Referência do pagamento deve ter no máximo 50 caracteres")
    .optional()
});

export const notaCreditoUpdateSchema = notaCreditoCreateSchema.partial();

// ===============================
// MOTIVOS DE ANULAÇÃO
// ===============================

export const motivoAnulacaoCreateSchema = z.object({
  designacao: z.string()
    .min(1, "Designação é obrigatória")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
});

export const motivoAnulacaoUpdateSchema = motivoAnulacaoCreateSchema.partial();

// ===============================
// PARÂMETROS E FILTROS
// ===============================

export const idParamSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, "ID deve ser numérico")
    .transform(val => parseInt(val))
});

export const paginationSchema = z.object({
  page: z.string()
    .regex(/^\d+$/, "Página deve ser numérica")
    .transform(val => parseInt(val))
    .refine(val => val > 0, "Página deve ser maior que 0")
    .default("1"),
  
  limit: z.string()
    .regex(/^\d+$/, "Limite deve ser numérico")
    .transform(val => parseInt(val))
    .refine(val => val > 0 && val <= 100, "Limite deve estar entre 1 e 100")
    .default("10")
});

export const pagamentoFilterSchema = z.object({
  search: z.string()
    .min(1)
    .optional(),
  
  codigo_Aluno: z.string()
    .regex(/^\d+$/, "Código do aluno deve ser numérico")
    .transform(val => parseInt(val))
    .optional(),
  
  codigo_Tipo_Servico: z.string()
    .regex(/^\d+$/, "Código do tipo de serviço deve ser numérico")
    .transform(val => parseInt(val))
    .optional(),
  
  tipo_servico: z.string()
    .min(1)
    .optional(),
  
  dataInicio: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data início deve estar no formato YYYY-MM-DD")
    .optional(),
  
  dataFim: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data fim deve estar no formato YYYY-MM-DD")
    .optional(),
  
  status: z.string()
    .regex(/^\d+$/, "Status deve ser numérico")
    .transform(val => parseInt(val))
    .optional(),
  
  codigo_FormaPagamento: z.string()
    .regex(/^\d+$/, "Código da forma de pagamento deve ser numérico")
    .transform(val => parseInt(val))
    .optional(),
  
  mes: z.string().max(45).optional(),
  ano: z.string()
    .regex(/^\d{4}$/, "Ano deve ter 4 dígitos")
    .transform(val => parseInt(val))
    .optional()
});

// ===============================
// RELATÓRIOS
// ===============================

export const relatorioFinanceiroSchema = z.object({
  dataInicio: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data início deve estar no formato YYYY-MM-DD"),
  
  dataFim: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data fim deve estar no formato YYYY-MM-DD"),
  
  codigo_Aluno: z.string()
    .regex(/^\d+$/, "Código do aluno deve ser numérico")
    .transform(val => parseInt(val))
    .optional(),
  
  codigo_FormaPagamento: z.string()
    .regex(/^\d+$/, "Código da forma de pagamento deve ser numérico")
    .transform(val => parseInt(val))
    .optional(),
  
  tipoRelatorio: z.enum(["resumo", "detalhado", "por_aluno", "por_servico"], {
    errorMap: () => ({ message: "Tipo de relatório deve ser: resumo, detalhado, por_aluno ou por_servico" })
  }).default("resumo")
});
