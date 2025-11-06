// validations/academic-management.validations.js
import { z } from 'zod';

// ===============================
// ANO LETIVO VALIDATIONS
// ===============================

export const anoLectivoCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim(),
  mesInicial: z
    .string({
      required_error: "Mês inicial é obrigatório",
      invalid_type_error: "Mês inicial deve ser um texto"
    })
    .min(1, "Mês inicial não pode estar vazio")
    .max(45, "Mês inicial deve ter no máximo 45 caracteres")
    .trim(),
  mesFinal: z
    .string({
      required_error: "Mês final é obrigatório",
      invalid_type_error: "Mês final deve ser um texto"
    })
    .min(1, "Mês final não pode estar vazio")
    .max(45, "Mês final deve ter no máximo 45 caracteres")
    .trim(),
  anoInicial: z
    .string({
      required_error: "Ano inicial é obrigatório",
      invalid_type_error: "Ano inicial deve ser um texto"
    })
    .min(4, "Ano inicial deve ter 4 dígitos")
    .max(45, "Ano inicial deve ter no máximo 45 caracteres")
    .trim(),
  anoFinal: z
    .string({
      required_error: "Ano final é obrigatório",
      invalid_type_error: "Ano final deve ser um texto"
    })
    .min(4, "Ano final deve ter 4 dígitos")
    .max(45, "Ano final deve ter no máximo 45 caracteres")
    .trim()
}).strict();

export const anoLectivoUpdateSchema = anoLectivoCreateSchema.partial();

// Schema flexível para ano letivo
export const anoLectivoFlexibleCreateSchema = z.object({
  designacao: z.string().min(1).max(45).trim(),
  nome: z.string().min(1).max(45).trim().optional(),
  titulo: z.string().min(1).max(45).trim().optional(),
  
  mesInicial: z.string().min(1).max(45).trim(),
  mes_inicial: z.string().min(1).max(45).trim().optional(),
  inicio_mes: z.string().min(1).max(45).trim().optional(),
  
  mesFinal: z.string().min(1).max(45).trim(),
  mes_final: z.string().min(1).max(45).trim().optional(),
  fim_mes: z.string().min(1).max(45).trim().optional(),
  
  anoInicial: z.string().min(4).max(45).trim(),
  ano_inicial: z.string().min(4).max(45).trim().optional(),
  inicio_ano: z.string().min(4).max(45).trim().optional(),
  
  anoFinal: z.string().min(4).max(45).trim(),
  ano_final: z.string().min(4).max(45).trim().optional(),
  fim_ano: z.string().min(4).max(45).trim().optional()
})
.transform(data => {
  return {
    designacao: (data.designacao || data.nome || data.titulo).trim(),
    mesInicial: (data.mesInicial || data.mes_inicial || data.inicio_mes).trim(),
    mesFinal: (data.mesFinal || data.mes_final || data.fim_mes).trim(),
    anoInicial: (data.anoInicial || data.ano_inicial || data.inicio_ano).trim(),
    anoFinal: (data.anoFinal || data.ano_final || data.fim_ano).trim()
  };
});

// ===============================
// CURSOS VALIDATIONS
// ===============================

export const cursoCreateSchema = z.object({
  designacao: z
    .string()
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),
  codigo_Status: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val >= 0, {
      message: "Status deve ser um número inteiro não negativo"
    })
    .optional()
}).strict();

export const cursoUpdateSchema = cursoCreateSchema.partial();

// Schema flexível para cursos
export const cursoFlexibleCreateSchema = z.object({
  designacao: z.string().max(45).trim().optional(),
  nome: z.string().max(45).trim().optional(),
  titulo: z.string().max(45).trim().optional(),
  name: z.string().max(45).trim().optional(),
  
  codigo_Status: z.union([z.string(), z.number()]).optional(),
  status: z.union([z.string(), z.number()]).optional(),
  codigo_status: z.union([z.string(), z.number()]).optional()
})
.transform(data => {
  const designacao = data.designacao || data.nome || data.titulo || data.name || null;
  const status = data.codigo_Status || data.status || data.codigo_status || 1;
  
  return {
    designacao: designacao?.trim() || null,
    codigo_Status: status ? parseInt(status) : 1
  };
});

// ===============================
// CLASSES VALIDATIONS
// ===============================

export const classeCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim(),
  status: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val >= 0, {
      message: "Status deve ser um número inteiro não negativo"
    })
    .optional(),
  notaMaxima: z
    .union([
      z.string().transform(val => parseFloat(val)),
      z.number()
    ])
    .refine(val => !isNaN(val) && val >= 0, {
      message: "Nota máxima deve ser um número não negativo"
    })
    .optional(),
  exame: z
    .union([
      z.boolean(),
      z.string().transform(val => val.toLowerCase() === 'true' || val === '1'),
      z.number().transform(val => val === 1)
    ])
    .optional()
}).strict();

export const classeUpdateSchema = classeCreateSchema.partial();

// ===============================
// DISCIPLINAS VALIDATIONS
// ===============================

export const disciplinaCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim(),
  codigo_Curso: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código do curso deve ser um número inteiro positivo"
    }),
  status: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val >= 0, {
      message: "Status deve ser um número inteiro não negativo"
    })
    .optional(),
  cadeiraEspecifica: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val >= 0, {
      message: "Cadeira específica deve ser um número inteiro não negativo"
    })
    .optional()
}).strict();

export const disciplinaUpdateSchema = disciplinaCreateSchema.partial();

// Schema flexível para disciplinas
export const disciplinaFlexibleCreateSchema = z.object({
  designacao: z.string().min(1).max(45).trim(),
  nome: z.string().min(1).max(45).trim().optional(),
  titulo: z.string().min(1).max(45).trim().optional(),
  
  codigo_Curso: z.union([z.string(), z.number()]),
  curso_id: z.union([z.string(), z.number()]).optional(),
  id_curso: z.union([z.string(), z.number()]).optional(),
  
  status: z.union([z.string(), z.number()]).optional(),
  cadeiraEspecifica: z.union([z.string(), z.number()]).optional(),
  cadeira_especifica: z.union([z.string(), z.number()]).optional(),
  especifica: z.union([z.string(), z.number()]).optional()
})
.transform(data => {
  return {
    designacao: (data.designacao || data.nome || data.titulo).trim(),
    codigo_Curso: parseInt(data.codigo_Curso || data.curso_id || data.id_curso),
    status: data.status ? parseInt(data.status) : 1,
    cadeiraEspecifica: parseInt(data.cadeiraEspecifica || data.cadeira_especifica || data.especifica || 0)
  };
});

// ===============================
// SALAS VALIDATIONS
// ===============================

export const salaCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
}).strict();

export const salaUpdateSchema = salaCreateSchema.partial();

// ===============================
// PERÍODOS VALIDATIONS
// ===============================

export const periodoCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim()
}).strict();

export const periodoUpdateSchema = periodoCreateSchema.partial();

// ===============================
// TURMAS VALIDATIONS
// ===============================

export const turmaCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(45, "Designação deve ter no máximo 45 caracteres")
    .trim(),
  codigo_Classe: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código da classe deve ser um número inteiro positivo"
    }),
  codigo_Curso: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código do curso deve ser um número inteiro positivo"
    }),
  codigo_Sala: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código da sala deve ser um número inteiro positivo"
    }),
  codigo_Periodo: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código do período deve ser um número inteiro positivo"
    }),
  codigo_AnoLectivo: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código do ano letivo deve ser um número inteiro positivo"
    }),
  max_Alunos: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Máximo de alunos deve ser um número inteiro positivo"
    }),
  status: z
    .string()
    .max(45, "Status deve ter no máximo 45 caracteres")
    .trim()
});

export const turmaUpdateSchema = turmaCreateSchema.partial();

// Schema flexível para turmas
export const turmaFlexibleCreateSchema = z.object({
  designacao: z.string().min(1).max(45).trim(),
  nome: z.string().min(1).max(45).trim().optional(),
  titulo: z.string().min(1).max(45).trim().optional(),
  
  codigo_Classe: z.union([z.string(), z.number()]),
  classe_id: z.union([z.string(), z.number()]).optional(),
  id_classe: z.union([z.string(), z.number()]).optional(),
  
  codigo_Curso: z.union([z.string(), z.number()]),
  curso_id: z.union([z.string(), z.number()]).optional(),
  id_curso: z.union([z.string(), z.number()]).optional(),
  
  codigo_Sala: z.union([z.string(), z.number()]),
  sala_id: z.union([z.string(), z.number()]).optional(),
  id_sala: z.union([z.string(), z.number()]).optional(),
  
  codigo_Periodo: z.union([z.string(), z.number()]),
  periodo_id: z.union([z.string(), z.number()]).optional(),
  id_periodo: z.union([z.string(), z.number()]).optional(),
  
  codigo_AnoLectivo: z.union([z.string(), z.number()]),
  ano_lectivo_id: z.union([z.string(), z.number()]).optional(),
  anoLectivo: z.union([z.string(), z.number()]).optional(),
  
  max_Alunos: z.union([z.string(), z.number()]),
  maximo_alunos: z.union([z.string(), z.number()]).optional(),
  capacidade: z.union([z.string(), z.number()]).optional(),
  maxAlunos: z.union([z.string(), z.number()]).optional(),
  
  status: z.string().max(45).trim()
})
.transform(data => {
  return {
    designacao: (data.designacao || data.nome || data.titulo).trim(),
    codigo_Classe: parseInt(data.codigo_Classe || data.classe_id || data.id_classe),
    codigo_Curso: parseInt(data.codigo_Curso || data.curso_id || data.id_curso),
    codigo_Sala: parseInt(data.codigo_Sala || data.sala_id || data.id_sala),
    codigo_Periodo: parseInt(data.codigo_Periodo || data.periodo_id || data.id_periodo),
    codigo_AnoLectivo: parseInt(data.codigo_AnoLectivo || data.ano_lectivo_id || data.anoLectivo),
    max_Alunos: parseInt(data.max_Alunos || data.maximo_alunos || data.capacidade || data.maxAlunos),
    status: data.status.trim()
  };
});

// ===============================
// GRADE CURRICULAR VALIDATIONS
// ===============================

export const gradeCurricularCreateSchema = z.object({
  codigo_disciplina: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código da disciplina deve ser um número inteiro positivo"
    }),
  codigo_Classe: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código da classe deve ser um número inteiro positivo"
    }),
  codigo_Curso: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código do curso deve ser um número inteiro positivo"
    }),
  codigo_user: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código do usuário deve ser um número inteiro positivo"
    }),
  codigo_empresa: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código da empresa deve ser um número inteiro positivo"
    }),
  status: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val >= 0, {
      message: "Status deve ser um número inteiro não negativo"
    }),
  codigoTipoNota: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "Código do tipo de nota deve ser um número inteiro positivo"
    })
}).strict();

export const gradeCurricularUpdateSchema = gradeCurricularCreateSchema.partial();

// Schema para criação de grade curricular por turma
export const gradeCurricularByTurmaSchema = z.object({
  turmaId: z
    .union([
      z.string().transform(val => parseInt(val)),
      z.number().int()
    ])
    .refine(val => Number.isInteger(val) && val > 0, {
      message: "ID da turma deve ser um número inteiro positivo"
    }),
  disciplinas: z
    .array(
      z.union([
        z.string().transform(val => parseInt(val)),
        z.number().int()
      ]).refine(val => Number.isInteger(val) && val > 0, {
        message: "ID da disciplina deve ser um número inteiro positivo"
      })
    )
    .min(1, { message: "Pelo menos uma disciplina deve ser selecionada" })
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
// VALIDAÇÕES PARA OPERAÇÕES ESPECIAIS
// ===============================

export const gradeByCursoClasseSchema = z.object({
  codigo_Curso: z
    .string()
    .transform(val => {
      const parsed = parseInt(val);
      if (isNaN(parsed) || parsed <= 0) {
        throw new Error("Código do curso deve ser um número inteiro positivo");
      }
      return parsed;
    }),
  codigo_Classe: z
    .string()
    .transform(val => {
      const parsed = parseInt(val);
      if (isNaN(parsed) || parsed <= 0) {
        throw new Error("Código da classe deve ser um número inteiro positivo");
      }
      return parsed;
    })
});

export const turmasByAnoLectivoSchema = z.object({
  codigo_AnoLectivo: z
    .string()
    .transform(val => {
      const parsed = parseInt(val);
      if (isNaN(parsed) || parsed <= 0) {
        throw new Error("Código do ano letivo deve ser um número inteiro positivo");
      }
      return parsed;
    })
});

// ===============================
// SCHEMAS DE VALIDAÇÃO EM LOTE
// ===============================

export const batchCursoCreateSchema = z.object({
  cursos: z
    .array(cursoCreateSchema)
    .min(1, "Lista de cursos deve conter pelo menos um item")
    .max(50, "Máximo de 50 cursos por lote")
});

export const batchDisciplinaCreateSchema = z.object({
  disciplinas: z
    .array(disciplinaCreateSchema)
    .min(1, "Lista de disciplinas deve conter pelo menos um item")
    .max(50, "Máximo de 50 disciplinas por lote")
});

export const batchTurmaCreateSchema = z.object({
  turmas: z
    .array(turmaCreateSchema)
    .min(1, "Lista de turmas deve conter pelo menos um item")
    .max(20, "Máximo de 20 turmas por lote")
});

// ===============================
// EXPORT DEFAULT
// ===============================

export default {
  anoLectivoCreateSchema,
  anoLectivoUpdateSchema,
  anoLectivoFlexibleCreateSchema,
  cursoCreateSchema,
  cursoUpdateSchema,
  cursoFlexibleCreateSchema,
  classeCreateSchema,
  classeUpdateSchema,
  disciplinaCreateSchema,
  disciplinaUpdateSchema,
  disciplinaFlexibleCreateSchema,
  salaCreateSchema,
  salaUpdateSchema,
  periodoCreateSchema,
  periodoUpdateSchema,
  turmaCreateSchema,
  turmaUpdateSchema,
  turmaFlexibleCreateSchema,
  gradeCurricularCreateSchema,
  gradeCurricularUpdateSchema,
  gradeCurricularByTurmaSchema,
  idParamSchema,
  gradeByCursoClasseSchema,
  turmasByAnoLectivoSchema,
  batchCursoCreateSchema,
  batchDisciplinaCreateSchema,
  batchTurmaCreateSchema
};
