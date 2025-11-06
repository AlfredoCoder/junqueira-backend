// validations/status-control.validations.js
import { z } from 'zod';

// ===============================
// TIPO STATUS VALIDATIONS
// ===============================

export const tipoStatusCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
}).strict();

export const tipoStatusUpdateSchema = z.object({
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
// STATUS VALIDATIONS
// ===============================

export const statusCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim(),
  tipoStatus: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable()
}).strict();

export const statusUpdateSchema = z.object({
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  tipoStatus: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive(),
      z.null()
    ])
    .optional()
    .nullable()
}).strict();

// ===============================
// SCHEMAS AUXILIARES
// ===============================

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID deve ser um número válido")
    .transform(val => parseInt(val))
});

export const associarStatusSchema = z.object({
  statusId: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ]),
  tipoStatusId: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
}).strict();

// ===============================
// SCHEMAS FLEXÍVEIS (PARA CASOS ESPECIAIS)
// ===============================

export const tipoStatusFlexibleCreateSchema = z.object({
  designacao: z
    .union([z.string(), z.null()])
    .transform(val => val?.trim() || null)
    .nullable()
}).strict();

export const statusFlexibleCreateSchema = z.object({
  designacao: z
    .union([z.string(), z.null()])
    .transform(val => val?.trim() || null)
    .nullable(),
  tipoStatus: z
    .union([
      z.string().transform(val => val ? parseInt(val) : null),
      z.number().int().positive(),
      z.null()
    ])
    .optional()
    .nullable()
}).strict();

// ===============================
// SCHEMAS PARA OPERAÇÕES EM LOTE
// ===============================

export const batchTipoStatusCreateSchema = z.object({
  tiposStatus: z.array(tipoStatusCreateSchema).min(1, "Deve haver pelo menos um tipo de status")
}).strict();

export const batchStatusCreateSchema = z.object({
  status: z.array(statusCreateSchema).min(1, "Deve haver pelo menos um status")
}).strict();

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
    .optional()
});

export const designacaoQuerySchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória para busca",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
});

// ===============================
// SCHEMAS PARA RELATÓRIOS
// ===============================

export const statusReportSchema = z.object({
  incluirContagem: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  incluirSemTipo: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  tipoStatusId: z
    .string()
    .regex(/^\d+$/, "ID do tipo de status deve ser um número válido")
    .transform(val => parseInt(val))
    .optional()
});
