// validations/financial-services.validations.js
import { z } from 'zod';

// ===============================
// MOEDAS VALIDATIONS
// ===============================

export const moedaCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
}).strict();

export const moedaUpdateSchema = z.object({
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
// CATEGORIAS DE SERVIÇOS VALIDATIONS
// ===============================

export const categoriaServicoCreateSchema = z.object({
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .max(50, "Designação deve ter no máximo 50 caracteres")
    .trim()
    .optional()
    .nullable()
}).strict();

export const categoriaServicoUpdateSchema = z.object({
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .max(50, "Designação deve ter no máximo 50 caracteres")
    .trim()
    .optional()
    .nullable()
}).strict();

// ===============================
// TIPOS DE SERVIÇOS VALIDATIONS
// ===============================

export const tipoServicoCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim(),
  preco: z
    .union([
      z.string().transform(val => parseFloat(val)),
      z.number()
    ])
    .refine(val => !isNaN(val) && val >= 0, "Preço deve ser um número válido e não negativo"),
  descricao: z
    .string({
      required_error: "Descrição é obrigatória",
      invalid_type_error: "Descrição deve ser um texto"
    })
    .min(1, "Descrição não pode estar vazia")
    .max(45, "Descrição deve ter no máximo 45 caracteres")
    .trim(),
  codigo_Utilizador: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ]),
  codigo_Moeda: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ]),
  tipoServico: z
    .string({
      required_error: "Tipo de serviço é obrigatório",
      invalid_type_error: "Tipo de serviço deve ser um texto"
    })
    .max(15, "Tipo de serviço deve ter no máximo 15 caracteres")
    .trim(),
  status: z
    .string()
    .max(45, "Status deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  aplicarMulta: z
    .union([
      z.boolean(),
      z.string().transform(val => val === 'true')
    ])
    .optional(),
  aplicarDesconto: z
    .union([
      z.boolean(),
      z.string().transform(val => val === 'true')
    ])
    .optional(),
  codigo_Ano: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional(),
  codigoAnoLectivo: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  valorMulta: z
    .union([
      z.string().transform(val => parseFloat(val)),
      z.number()
    ])
    .refine(val => !isNaN(val) && val >= 0, "Valor da multa deve ser um número válido e não negativo")
    .optional(),
  iva: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  codigoRasao: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  categoria: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  codigo_multa: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  percentualDesconto: z
    .union([
      z.string().transform(val => parseFloat(val)),
      z.number()
    ])
    .refine(val => !isNaN(val) && val >= 0 && val <= 100, "Percentual de desconto deve ser entre 0 e 100")
    .optional(),
  codigo_Classe: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  codigo_Curso: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable()
});

export const tipoServicoUpdateSchema = z.object({
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  preco: z
    .union([
      z.string().transform(val => parseFloat(val)),
      z.number()
    ])
    .refine(val => !isNaN(val) && val >= 0, "Preço deve ser um número válido e não negativo")
    .optional(),
  descricao: z
    .string({
      invalid_type_error: "Descrição deve ser um texto"
    })
    .max(45, "Descrição deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  codigo_Utilizador: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional(),
  codigo_Moeda: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional(),
  tipoServico: z
    .string({
      invalid_type_error: "Tipo de serviço deve ser um texto"
    })
    .max(15, "Tipo de serviço deve ter no máximo 15 caracteres")
    .trim()
    .optional(),
  status: z
    .string()
    .max(45, "Status deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  aplicarMulta: z
    .union([
      z.boolean(),
      z.string().transform(val => val === 'true')
    ])
    .optional(),
  aplicarDesconto: z
    .union([
      z.boolean(),
      z.string().transform(val => val === 'true')
    ])
    .optional(),
  codigo_Ano: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional(),
  codigoAnoLectivo: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  valorMulta: z
    .union([
      z.string().transform(val => parseFloat(val)),
      z.number()
    ])
    .refine(val => !isNaN(val) && val >= 0, "Valor da multa deve ser um número válido e não negativo")
    .optional(),
  iva: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  codigoRasao: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  categoria: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  codigo_multa: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
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

// ===============================
// SCHEMAS FLEXÍVEIS (PARA CASOS ESPECIAIS)
// ===============================

export const moedaFlexibleCreateSchema = z.object({
  designacao: z
    .union([z.string(), z.null()])
    .transform(val => val?.trim() || null)
    .nullable()
}).strict();

export const tipoServicoFlexibleCreateSchema = z.object({
  designacao: z
    .union([z.string(), z.null()])
    .transform(val => val?.trim() || null)
    .nullable(),
  preco: z
    .union([
      z.string().transform(val => val ? parseFloat(val) : 0),
      z.number(),
      z.null()
    ])
    .optional(),
  descricao: z
    .union([z.string(), z.null()])
    .transform(val => val?.trim() || null)
    .nullable(),
  codigo_Utilizador: z
    .union([
      z.string().transform(val => val ? parseInt(val) : 1),
      z.number().int(),
      z.null()
    ])
    .optional(),
  codigo_Moeda: z
    .union([
      z.string().transform(val => val ? parseInt(val) : 1),
      z.number().int(),
      z.null()
    ])
    .optional(),
  tipoServico: z
    .union([z.string(), z.null()])
    .transform(val => val?.trim() || "Geral")
    .optional()
}).strict();

// ===============================
// SCHEMAS PARA OPERAÇÕES EM LOTE
// ===============================

export const batchMoedaCreateSchema = z.object({
  moedas: z.array(moedaCreateSchema).min(1, "Deve haver pelo menos uma moeda")
}).strict();

export const batchCategoriaServicoCreateSchema = z.object({
  categorias: z.array(categoriaServicoCreateSchema).min(1, "Deve haver pelo menos uma categoria")
}).strict();

export const batchTipoServicoCreateSchema = z.object({
  tiposServicos: z.array(tipoServicoCreateSchema).min(1, "Deve haver pelo menos um tipo de serviço")
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

export const precoRangeSchema = z.object({
  precoMin: z
    .string()
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val >= 0, "Preço mínimo deve ser um número válido")
    .optional(),
  precoMax: z
    .string()
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val >= 0, "Preço máximo deve ser um número válido")
    .optional()
});

// ===============================
// SCHEMAS PARA RELATÓRIOS
// ===============================

export const relatorioFinanceiroSchema = z.object({
  incluirInativos: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  categoriaId: z
    .string()
    .regex(/^\d+$/, "ID da categoria deve ser um número válido")
    .transform(val => parseInt(val))
    .optional(),
  moedaId: z
    .string()
    .regex(/^\d+$/, "ID da moeda deve ser um número válido")
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
// SCHEMAS PARA FILTROS AVANÇADOS
// ===============================

export const filtroTipoServicoSchema = z.object({
  status: z
    .enum(["Activo", "Inactivo", "Todos"])
    .optional(),
  aplicarMulta: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  aplicarDesconto: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  categoria: z
    .string()
    .regex(/^\d+$/, "Categoria deve ser um número válido")
    .transform(val => parseInt(val))
    .optional(),
  moeda: z
    .string()
    .regex(/^\d+$/, "Moeda deve ser um número válido")
    .transform(val => parseInt(val))
    .optional()
});

// ===============================
// MOTIVOS IVA VALIDATIONS
// ===============================

export const motivoIvaCreateSchema = z.object({
  codigomotivo: z
    .string({
      required_error: "Código do motivo é obrigatório",
      invalid_type_error: "Código do motivo deve ser um texto"
    })
    .min(1, "Código do motivo não pode estar vazio")
    .max(45, "Código do motivo deve ter no máximo 45 caracteres")
    .trim(),
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
    .optional()
    .nullable()
}).strict();

export const motivoIvaUpdateSchema = z.object({
  codigomotivo: z
    .string({
      invalid_type_error: "Código do motivo deve ser um texto"
    })
    .min(1, "Código do motivo não pode estar vazio")
    .max(45, "Código do motivo deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
    .optional()
    .nullable()
}).strict();

// ===============================
// TAXAS IVA VALIDATIONS
// ===============================

export const taxaIvaCreateSchema = z.object({
  taxa: z
    .union([
      z.string().transform(val => parseFloat(val)),
      z.number()
    ])
    .refine(val => !isNaN(val) && val >= 0, "Taxa deve ser um número válido e não negativo"),
  designcao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
}).strict();

export const taxaIvaUpdateSchema = z.object({
  taxa: z
    .union([
      z.string().transform(val => parseFloat(val)),
      z.number()
    ])
    .refine(val => !isNaN(val) && val >= 0, "Taxa deve ser um número válido e não negativo")
    .optional(),
  designcao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
    .optional()
}).strict();

// ===============================
// TIPOS DE MULTA VALIDATIONS
// ===============================

export const tipoMultaCreateSchema = z.object({
  descrisao: z
    .string({
      required_error: "Descrição é obrigatória",
      invalid_type_error: "Descrição deve ser um texto"
    })
    .min(1, "Descrição não pode estar vazia")
    .max(45, "Descrição deve ter no máximo 45 caracteres")
    .trim()
}).strict();

export const tipoMultaUpdateSchema = z.object({
  descrisao: z
    .string({
      invalid_type_error: "Descrição deve ser um texto"
    })
    .min(1, "Descrição não pode estar vazia")
    .max(45, "Descrição deve ter no máximo 45 caracteres")
    .trim()
    .optional()
}).strict();

// ===============================
// MOTIVOS DE ISENÇÃO VALIDATIONS
// ===============================

export const motivoIsencaoCreateSchema = z.object({
  codigo_Isencao: z
    .string({
      required_error: "Código de isenção é obrigatório",
      invalid_type_error: "Código de isenção deve ser um texto"
    })
    .min(1, "Código de isenção não pode estar vazio")
    .max(5, "Código de isenção deve ter no máximo 5 caracteres")
    .trim(),
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(300, "Designação deve ter no máximo 300 caracteres")
    .trim(),
  status: z
    .string()
    .max(30, "Status deve ter no máximo 30 caracteres")
    .trim()
    .optional()
}).strict();

export const motivoIsencaoUpdateSchema = z.object({
  codigo_Isencao: z
    .string({
      invalid_type_error: "Código de isenção deve ser um texto"
    })
    .min(1, "Código de isenção não pode estar vazio")
    .max(5, "Código de isenção deve ter no máximo 5 caracteres")
    .trim()
    .optional(),
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(300, "Designação deve ter no máximo 300 caracteres")
    .trim()
    .optional(),
  status: z
    .string()
    .max(30, "Status deve ter no máximo 30 caracteres")
    .trim()
    .optional()
}).strict();

// ===============================
// TIPOS DE TAXA IVA VALIDATIONS
// ===============================

export const tipoTaxaIvaCreateSchema = z.object({
  taxa: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => !isNaN(val) && val >= 0, "Taxa deve ser um número inteiro válido e não negativo"),
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  codigo_Isencao: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  status: z
    .string()
    .max(45, "Status deve ter no máximo 45 caracteres")
    .trim()
    .optional()
}).strict();

export const tipoTaxaIvaUpdateSchema = z.object({
  taxa: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => !isNaN(val) && val >= 0, "Taxa deve ser um número inteiro válido e não negativo")
    .optional(),
  designacao: z
    .string({
      invalid_type_error: "Designação deve ser um texto"
    })
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  codigo_Isencao: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int().positive()
    ])
    .optional()
    .nullable(),
  status: z
    .string()
    .max(45, "Status deve ter no máximo 45 caracteres")
    .trim()
    .optional()
}).strict();
