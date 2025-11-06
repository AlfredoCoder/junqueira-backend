// validations/academic-staff.validations.js
import { z } from 'zod';

// ===============================
// ESPECIALIDADES VALIDATIONS
// ===============================

export const especialidadeCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
}).strict();

export const especialidadeUpdateSchema = z.object({
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
// DOCENTES VALIDATIONS
// ===============================

export const docenteCreateSchema = z.object({
  nome: z
    .string({
      invalid_type_error: "Nome deve ser um texto"
    })
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .optional(),
  status: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => !isNaN(val) && [0, 1].includes(val), "Status deve ser 0 (inativo) ou 1 (ativo)")
    .optional(),
  codigo_disciplina: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  codigo_Utilizador: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  codigo_Especialidade: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  contacto: z
    .string({
      invalid_type_error: "Contacto deve ser um texto"
    })
    .max(45, "Contacto deve ter no máximo 45 caracteres")
    .trim()
    .optional()
    .nullable(),
  email: z
    .string({
      invalid_type_error: "Email deve ser um texto"
    })
    .email("Email deve ter um formato válido")
    .max(45, "Email deve ter no máximo 45 caracteres")
    .trim()
    .optional()
    .nullable(),
  user_id: z
    .union([
      z.string().transform(val => BigInt(val)),
      z.number().transform(val => BigInt(val)),
      z.bigint()
    ])
    .optional()
}).strict();

export const docenteUpdateSchema = z.object({
  nome: z
    .string({
      invalid_type_error: "Nome deve ser um texto"
    })
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .optional(),
  status: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => !isNaN(val) && [0, 1].includes(val), "Status deve ser 0 (inativo) ou 1 (ativo)")
    .optional(),
  codigo_disciplina: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  codigo_Utilizador: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  codigo_Especialidade: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  contacto: z
    .string({
      invalid_type_error: "Contacto deve ser um texto"
    })
    .max(45, "Contacto deve ter no máximo 45 caracteres")
    .trim()
    .optional()
    .nullable(),
  email: z
    .string({
      invalid_type_error: "Email deve ser um texto"
    })
    .email("Email deve ter um formato válido")
    .max(45, "Email deve ter no máximo 45 caracteres")
    .trim()
    .optional()
    .nullable(),
  user_id: z
    .union([
      z.string().transform(val => BigInt(val)),
      z.number().transform(val => BigInt(val)),
      z.bigint()
    ])
    .optional()
}).strict();

// ===============================
// DISCIPLINAS DOCENTE VALIDATIONS
// ===============================

export const disciplinaDocenteCreateSchema = z.object({
  codigoDocente: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .refine(val => !isNaN(val) && val > 0, "Código do docente deve ser um número válido"),
  codigoCurso: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .refine(val => !isNaN(val) && val > 0, "Código do curso deve ser um número válido"),
  codigoDisciplina: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .refine(val => !isNaN(val) && val > 0, "Código da disciplina deve ser um número válido")
}).strict();

// ===============================
// DIRETORES TURMAS VALIDATIONS
// ===============================

export const diretorTurmaCreateSchema = z.object({
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
    .optional()
    .nullable(),
  codigoAnoLectivo: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .refine(val => !isNaN(val) && val > 0, "Código do ano letivo deve ser um número válido"),
  codigoTurma: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .refine(val => !isNaN(val) && val > 0, "Código da turma deve ser um número válido"),
  codigoDocente: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .refine(val => !isNaN(val) && val > 0, "Código do docente deve ser um número válido")
}).strict();

// ===============================
// DOCENTE TURMA VALIDATIONS
// ===============================

export const docenteTurmaCreateSchema = z.object({
  codigo_Docente: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .refine(val => !isNaN(val) && val > 0, "Código do docente deve ser um número válido"),
  codigo_turma: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .refine(val => !isNaN(val) && val > 0, "Código da turma deve ser um número válido")
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
  docenteId: z
    .string()
    .regex(/^\d+$/, "ID do docente deve ser um número válido")
    .transform(val => parseInt(val))
    .optional()
});

// ===============================
// SCHEMAS PARA FILTROS
// ===============================

export const filtroDocenteSchema = z.object({
  status: z
    .enum(["0", "1", "todos"])
    .optional(),
  especialidade: z
    .string()
    .regex(/^\d+$/, "Especialidade deve ser um número válido")
    .transform(val => parseInt(val))
    .optional(),
  disciplina: z
    .string()
    .regex(/^\d+$/, "Disciplina deve ser um número válido")
    .transform(val => parseInt(val))
    .optional()
});

// ===============================
// SCHEMAS FLEXÍVEIS (PARA CASOS ESPECIAIS)
// ===============================

export const docenteFlexibleCreateSchema = z.object({
  nome: z
    .union([z.string(), z.null()])
    .transform(val => val?.trim() || "teste")
    .optional(),
  status: z
    .union([
      z.string().transform(val => val ? parseInt(val) : 1),
      z.number().int(),
      z.null()
    ])
    .optional(),
  codigo_disciplina: z
    .union([
      z.string().transform(val => val ? parseInt(val) : null),
      z.number().int(),
      z.null()
    ])
    .optional(),
  codigo_Utilizador: z
    .union([
      z.string().transform(val => val ? parseInt(val) : null),
      z.number().int(),
      z.null()
    ])
    .optional(),
  codigo_Especialidade: z
    .union([
      z.string().transform(val => val ? parseInt(val) : null),
      z.number().int(),
      z.null()
    ])
    .optional(),
  contacto: z
    .union([z.string(), z.null()])
    .transform(val => val?.trim() || null)
    .optional(),
  email: z
    .union([z.string(), z.null()])
    .transform(val => val?.trim() || null)
    .optional(),
  user_id: z
    .union([
      z.string().transform(val => val ? BigInt(val) : BigInt(1)),
      z.number().transform(val => BigInt(val)),
      z.bigint(),
      z.null()
    ])
    .optional()
}).strict();

// ===============================
// SCHEMAS PARA RELATÓRIOS
// ===============================

export const relatorioAcademicoSchema = z.object({
  incluirInativos: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  especialidadeId: z
    .string()
    .regex(/^\d+$/, "ID da especialidade deve ser um número válido")
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
