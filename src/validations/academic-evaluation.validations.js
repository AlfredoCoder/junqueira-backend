// validations/academic-evaluation.validations.js
import { z } from 'zod';

// ===============================
// SCHEMAS AUXILIARES
// ===============================

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID deve ser um número válido")
    .transform(val => parseInt(val))
});

// ===============================
// SCHEMAS PARA CONSULTAS
// ===============================

export const searchQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Página deve ser um número")
    .transform(val => parseInt(val))
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limite deve ser um número")
    .transform(val => parseInt(val))
    .optional(),
  search: z
    .string()
    .optional(),
  tipoNotaId: z
    .string()
    .regex(/^\d+$/, "ID do tipo de nota deve ser um número válido")
    .transform(val => parseInt(val))
    .optional()
});

// ===============================
// SCHEMAS PARA FILTROS
// ===============================

export const filtroTipoAvaliacaoSchema = z.object({
  tipoAvaliacao: z
    .string()
    .regex(/^\d+$/, "Tipo de avaliação deve ser um número válido")
    .transform(val => parseInt(val))
    .optional()
});

export const filtroTipoNotaSchema = z.object({
  status: z
    .enum(["0", "1", "todos"])
    .optional(),
  positivaMinima: z
    .string()
    .transform(val => parseFloat(val))
    .optional()
});

export const filtroTipoNotaValorSchema = z.object({
  codigoTipoNota: z
    .string()
    .regex(/^\d+$/, "Código do tipo de nota deve ser um número válido")
    .transform(val => parseInt(val))
    .optional(),
  tipoValor: z
    .string()
    .optional(),
  valorMinimo: z
    .string()
    .transform(val => parseFloat(val))
    .optional(),
  valorMaximo: z
    .string()
    .transform(val => parseFloat(val))
    .optional()
});

// ===============================
// SCHEMAS PARA RELATÓRIOS
// ===============================

export const relatorioAvaliacaoSchema = z.object({
  incluirInativos: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  tipoAvaliacao: z
    .string()
    .regex(/^\d+$/, "Tipo de avaliação deve ser um número válido")
    .transform(val => parseInt(val))
    .optional(),
  dataInicio: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
    .optional(),
  dataFim: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
    .optional()
});

// ===============================
// SCHEMAS DE VALIDAÇÃO PARA DADOS
// ===============================

export const tipoAvaliacaoSchema = z.object({
  codigo: z.number().int().positive().optional(),
  descricao: z.string().max(45).optional().nullable(),
  designacao: z.string().max(45),
  tipoAvaliacao: z.number().int()
});

export const tipoNotaSchema = z.object({
  codigo: z.number().int().positive().optional(),
  designacao: z.string().max(45).optional().nullable(),
  positivaMinima: z.number().min(0).max(20).optional().nullable(),
  status: z.number().int().min(0).max(1)
});

export const tipoNotaValorSchema = z.object({
  codigo: z.number().int().positive().optional(),
  codigoTipoNota: z.number().int().positive(),
  tipoValor: z.string().max(45),
  valorNumerico: z.number().min(0).max(20),
  valorSprecao: z.string().max(45)
});

export const tipoPautaSchema = z.object({
  codigo: z.number().int().positive().optional(),
  designacao: z.string().max(45)
});

export const trimestreSchema = z.object({
  codigo: z.number().int().positive().optional(),
  designacao: z.string().max(45)
});

// ===============================
// SCHEMAS PARA PARÂMETROS DE ROTA
// ===============================

export const tipoAvaliacaoParamSchema = z.object({
  tipoAvaliacao: z
    .string()
    .regex(/^\d+$/, "Tipo de avaliação deve ser um número válido")
    .transform(val => parseInt(val))
});

export const tipoNotaParamSchema = z.object({
  tipoNotaId: z
    .string()
    .regex(/^\d+$/, "ID do tipo de nota deve ser um número válido")
    .transform(val => parseInt(val))
});

// ===============================
// SCHEMAS PARA ESTATÍSTICAS
// ===============================

export const estatisticasNotasSchema = z.object({
  incluirValores: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  agruparPorTipo: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  calcularMedias: z
    .string()
    .transform(val => val === 'true')
    .optional()
});

// ===============================
// SCHEMAS DE RESPOSTA (PARA DOCUMENTAÇÃO)
// ===============================

export const tipoAvaliacaoResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.union([
    tipoAvaliacaoSchema,
    z.array(tipoAvaliacaoSchema)
  ])
});

export const tipoNotaResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.union([
    tipoNotaSchema,
    z.array(tipoNotaSchema)
  ])
});

export const paginatedResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.any()),
  pagination: z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    totalItems: z.number(),
    itemsPerPage: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean()
  })
});
