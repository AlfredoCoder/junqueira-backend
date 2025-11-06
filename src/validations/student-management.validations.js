// validations/student-management.validations.js
import { z } from 'zod';

// ===============================
// ENCARREGADOS VALIDATIONS
// ===============================

export const encarregadoCreateSchema = z.object({
  nome: z
    .string({
      required_error: "Nome é obrigatório",
      invalid_type_error: "Nome deve ser um texto"
    })
    .min(1, "Nome não pode estar vazio")
    .max(250, "Nome deve ter no máximo 250 caracteres")
    .trim(),
  telefone: z
    .string({
      required_error: "Telefone é obrigatório",
      invalid_type_error: "Telefone deve ser um texto"
    })
    .min(1, "Telefone não pode estar vazio")
    .max(45, "Telefone deve ter no máximo 45 caracteres")
    .trim(),
  email: z
    .string()
    .email("Email deve ter um formato válido")
    .max(45, "Email deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  codigo_Profissao: z
    .number({
      required_error: "Código da profissão é obrigatório",
      invalid_type_error: "Código da profissão deve ser um número"
    })
    .int("Código da profissão deve ser um número inteiro")
    .positive("Código da profissão deve ser positivo"),
  local_Trabalho: z
    .string({
      required_error: "Local de trabalho é obrigatório",
      invalid_type_error: "Local de trabalho deve ser um texto"
    })
    .min(1, "Local de trabalho não pode estar vazio")
    .max(45, "Local de trabalho deve ter no máximo 45 caracteres")
    .trim(),
  codigo_Utilizador: z
    .number({
      required_error: "Código do utilizador é obrigatório",
      invalid_type_error: "Código do utilizador deve ser um número"
    })
    .int("Código do utilizador deve ser um número inteiro")
    .positive("Código do utilizador deve ser positivo"),
  dataCadastro: z
    .string()
    .datetime("Data de cadastro deve estar no formato ISO")
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  status: z
    .number()
    .int("Status deve ser um número inteiro")
    .min(0, "Status deve ser 0 ou 1")
    .max(1, "Status deve ser 0 ou 1")
    .default(1)
}).strict();

export const encarregadoUpdateSchema = encarregadoCreateSchema.partial();

export const encarregadoFlexibleCreateSchema = z.object({
  nome: z.string().min(1).max(250).trim(),
  telefone: z.string().min(1).max(45).trim(),
  email: z.string().email().max(45).trim().optional(),
  codigo_Profissao: z.number().int().positive(),
  local_Trabalho: z.string().min(1).max(45).trim(),
  codigo_Utilizador: z.number().int().positive(),
  dataCadastro: z.union([z.string().datetime(), z.date()]).transform(val => new Date(val)).optional(),
  status: z.number().int().min(0).max(1).default(1)
});

// ===============================
// PROVENIÊNCIAS VALIDATIONS
// ===============================

export const provenienciaCreateSchema = z.object({
  designacao: z
    .string({
      required_error: "Designação é obrigatória",
      invalid_type_error: "Designação deve ser um texto"
    })
    .min(1, "Designação não pode estar vazia")
    .max(100, "Designação deve ter no máximo 100 caracteres")
    .trim(),
  codigoStatus: z
    .number()
    .int("Status deve ser um número inteiro")
    .min(0, "Status deve ser 0 ou 1")
    .max(1, "Status deve ser 0 ou 1")
    .default(1),
  localizacao: z
    .string()
    .max(45, "Localização deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  contacto: z
    .string()
    .max(45, "Contacto deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  codigoUtilizador: z
    .number()
    .int("Código do utilizador deve ser um número inteiro")
    .positive("Código do utilizador deve ser positivo")
    .optional(),
  dataCadastro: z
    .string()
    .datetime("Data de cadastro deve estar no formato ISO")
    .or(z.date())
    .transform((val) => new Date(val))
    .optional()
}).strict();

export const provenienciaUpdateSchema = provenienciaCreateSchema.partial();

// ===============================
// ALUNOS VALIDATIONS
// ===============================

export const alunoCreateSchema = z.object({
  nome: z
    .string({
      required_error: "Nome é obrigatório",
      invalid_type_error: "Nome deve ser um texto"
    })
    .min(1, "Nome não pode estar vazio")
    .max(200, "Nome deve ter no máximo 200 caracteres")
    .trim(),
  pai: z
    .string()
    .max(200, "Nome do pai deve ter no máximo 200 caracteres")
    .trim()
    .optional(),
  mae: z
    .string()
    .max(200, "Nome da mãe deve ter no máximo 200 caracteres")
    .trim()
    .optional(),
  codigo_Nacionalidade: z
    .number({
      required_error: "Código da nacionalidade é obrigatório",
      invalid_type_error: "Código da nacionalidade deve ser um número"
    })
    .int("Código da nacionalidade deve ser um número inteiro")
    .positive("Código da nacionalidade deve ser positivo"),
  codigo_Estado_Civil: z
    .number()
    .int("Código do estado civil deve ser um número inteiro")
    .positive("Código do estado civil deve ser positivo")
    .optional(),
  dataNascimento: z
    .string()
    .datetime("Data de nascimento deve estar no formato ISO")
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  email: z
    .string()
    .email("Email deve ter um formato válido")
    .max(45, "Email deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  telefone: z
    .string()
    .max(45, "Telefone deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  codigo_Status: z
    .number()
    .int("Status deve ser um número inteiro")
    .min(0, "Status deve ser 0 ou 1")
    .max(1, "Status deve ser 0 ou 1")
    .default(1),
  codigo_Comuna: z
    .number({
      required_error: "Código da comuna é obrigatório",
      invalid_type_error: "Código da comuna deve ser um número"
    })
    .int("Código da comuna deve ser um número inteiro")
    .positive("Código da comuna deve ser positivo"),
  codigo_Encarregado: z
    .number({
      required_error: "Código do encarregado é obrigatório",
      invalid_type_error: "Código do encarregado deve ser um número"
    })
    .int("Código do encarregado deve ser um número inteiro")
    .positive("Código do encarregado deve ser positivo"),
  codigo_Utilizador: z
    .number({
      required_error: "Código do utilizador é obrigatório",
      invalid_type_error: "Código do utilizador deve ser um número"
    })
    .int("Código do utilizador deve ser um número inteiro")
    .positive("Código do utilizador deve ser positivo"),
  sexo: z
    .string()
    .max(10, "Sexo deve ter no máximo 10 caracteres")
    .refine((val) => ['M', 'F', 'Masculino', 'Feminino'].includes(val), {
      message: "Sexo deve ser M, F, Masculino ou Feminino"
    })
    .optional(),
  n_documento_identificacao: z
    .string()
    .max(45, "Número do documento deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  dataCadastro: z
    .string()
    .datetime("Data de cadastro deve estar no formato ISO")
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  saldo: z
    .number()
    .min(0, "Saldo não pode ser negativo")
    .default(0),
  desconto: z
    .number()
    .min(0, "Desconto não pode ser negativo")
    .max(100, "Desconto não pode ser maior que 100%")
    .optional(),
  url_Foto: z
    .string()
    .max(345, "URL da foto deve ter no máximo 345 caracteres")
    .trim()
    .default("fotoDefault.png"),
  tipo_desconto: z
    .string()
    .max(45, "Tipo de desconto deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  escolaProveniencia: z
    .number()
    .int("Escola de proveniência deve ser um número inteiro")
    .positive("Escola de proveniência deve ser positivo")
    .optional(),
  saldo_Anterior: z
    .number()
    .optional(),
  codigoTipoDocumento: z
    .number()
    .int("Código do tipo de documento deve ser um número inteiro")
    .positive("Código do tipo de documento deve ser positivo")
    .default(1),
  morada: z
    .string()
    .max(60, "Morada deve ter no máximo 60 caracteres")
    .trim()
    .default("..."),
  dataEmissao: z
    .string()
    .datetime("Data de emissão deve estar no formato ISO")
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  motivo_Desconto: z
    .string()
    .max(455, "Motivo do desconto deve ter no máximo 455 caracteres")
    .trim()
    .optional(),
  provinciaEmissao: z
    .string()
    .max(45, "Província de emissão deve ter no máximo 45 caracteres")
    .trim()
    .default("LUANDA"),
  user_id: z
    .bigint()
    .positive("User ID deve ser positivo")
    .default(BigInt(1))
    .optional()
}).strict();

export const alunoUpdateSchema = alunoCreateSchema.partial();

// Schema para atualizar aluno com dados do encarregado
export const alunoComEncarregadoUpdateSchema = alunoCreateSchema.partial().extend({
  encarregado: z.object({
    nome: z
      .string()
      .min(1, "Nome do encarregado não pode estar vazio")
      .max(250, "Nome do encarregado deve ter no máximo 250 caracteres")
      .trim()
      .optional(),
    telefone: z
      .string()
      .max(45, "Telefone do encarregado deve ter no máximo 45 caracteres")
      .trim()
      .optional(),
    email: z
      .string()
      .email("Email do encarregado deve ter um formato válido")
      .max(45, "Email do encarregado deve ter no máximo 45 caracteres")
      .trim()
      .optional(),
    codigo_Profissao: z
      .number()
      .int("Código da profissão deve ser um número inteiro")
      .positive("Código da profissão deve ser positivo")
      .optional(),
    local_Trabalho: z
      .string()
      .max(45, "Local de trabalho deve ter no máximo 45 caracteres")
      .trim()
      .optional(),
  }).optional()
});

// Schema para criar aluno com encarregado embutido
export const alunoComEncarregadoCreateSchema = z.object({
  // Dados do Aluno
  nome: z
    .string({
      required_error: "Nome é obrigatório",
      invalid_type_error: "Nome deve ser um texto"
    })
    .min(1, "Nome não pode estar vazio")
    .max(200, "Nome deve ter no máximo 200 caracteres")
    .trim(),
  pai: z
    .string()
    .max(200, "Nome do pai deve ter no máximo 200 caracteres")
    .trim()
    .optional(),
  mae: z
    .string()
    .max(200, "Nome da mãe deve ter no máximo 200 caracteres")
    .trim()
    .optional(),
  codigo_Nacionalidade: z
    .number({
      required_error: "Código da nacionalidade é obrigatório",
      invalid_type_error: "Código da nacionalidade deve ser um número"
    })
    .int("Código da nacionalidade deve ser um número inteiro")
    .positive("Código da nacionalidade deve ser positivo"),
  codigo_Estado_Civil: z
    .number()
    .int("Código do estado civil deve ser um número inteiro")
    .positive("Código do estado civil deve ser positivo")
    .optional(),
  dataNascimento: z
    .string()
    .datetime("Data de nascimento deve estar no formato ISO")
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  email: z
    .string()
    .email("Email deve ter um formato válido")
    .max(45, "Email deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  telefone: z
    .string()
    .max(45, "Telefone deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  codigo_Status: z
    .number()
    .int("Status deve ser um número inteiro")
    .min(0, "Status deve ser 0 ou 1")
    .max(1, "Status deve ser 0 ou 1")
    .default(1),
  codigo_Comuna: z
    .number({
      required_error: "Código da comuna é obrigatório",
      invalid_type_error: "Código da comuna deve ser um número"
    })
    .int("Código da comuna deve ser um número inteiro")
    .positive("Código da comuna deve ser positivo"),
  sexo: z
    .string()
    .max(10, "Sexo deve ter no máximo 10 caracteres")
    .refine((val) => ['M', 'F', 'Masculino', 'Feminino'].includes(val), {
      message: "Sexo deve ser M, F, Masculino ou Feminino"
    })
    .optional(),
  n_documento_identificacao: z
    .string()
    .max(45, "Número do documento deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  saldo: z
    .number()
    .min(0, "Saldo não pode ser negativo")
    .default(0),
  desconto: z
    .number()
    .min(0, "Desconto não pode ser negativo")
    .max(100, "Desconto não pode ser maior que 100%")
    .optional(),
  url_Foto: z
    .string()
    .max(345, "URL da foto deve ter no máximo 345 caracteres")
    .trim()
    .default("fotoDefault.png"),
  tipo_desconto: z
    .string()
    .max(45, "Tipo de desconto deve ter no máximo 45 caracteres")
    .trim()
    .optional(),
  escolaProveniencia: z
    .number()
    .int("Escola de proveniência deve ser um número inteiro")
    .positive("Escola de proveniência deve ser positivo")
    .optional(),
  saldo_Anterior: z
    .number()
    .optional(),
  codigoTipoDocumento: z
    .number()
    .int("Código do tipo de documento deve ser um número inteiro")
    .positive("Código do tipo de documento deve ser positivo")
    .default(1),
  morada: z
    .string()
    .max(60, "Morada deve ter no máximo 60 caracteres")
    .trim()
    .default("..."),
  dataEmissao: z
    .string()
    .datetime("Data de emissão deve estar no formato ISO")
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  motivo_Desconto: z
    .string()
    .max(455, "Motivo do desconto deve ter no máximo 455 caracteres")
    .trim()
    .optional(),
  provinciaEmissao: z
    .string()
    .max(45, "Província de emissão deve ter no máximo 45 caracteres")
    .trim()
    .default("LUANDA"),
  user_id: z
    .bigint()
    .positive("User ID deve ser positivo")
    .default(BigInt(1))
    .optional(),
  
  // Campos adicionais do frontend (ignorados no backend)
  codigo_Utilizador: z.string().optional(),
  provincia: z.string().optional(),
  municipio: z.string().optional(),
  
  // Dados do Encarregado (objeto aninhado)
  encarregado: z.object({
    nome: z
      .string({
        required_error: "Nome do encarregado é obrigatório",
      })
      .min(1, "Nome do encarregado não pode estar vazio"),
    telefone: z
      .string({
        required_error: "Telefone do encarregado é obrigatório",
      })
      .min(1, "Telefone do encarregado não pode estar vazio"),
    email: z
      .email("Email do encarregado deve ter um formato válido")
      .max(45, "Email do encarregado deve ter no máximo 45 caracteres")
      .trim()
      .optional(),
    codigo_Profissao: z
      .number({
        required_error: "Código da profissão do encarregado é obrigatório",
      })
      .int("Código da profissão do encarregado deve ser um número inteiro")
      .positive("Código da profissão do encarregado deve ser positivo"),
    local_Trabalho: z
      .string({
        required_error: "Local de trabalho do encarregado é obrigatório",
        invalid_type_error: "Local de trabalho do encarregado deve ser um texto"
      })
      .min(1, "Local de trabalho do encarregado não pode estar vazio")
      .max(45, "Local de trabalho do encarregado deve ter no máximo 45 caracteres")
      .trim(),
    status: z
      .number()
      .int("Status do encarregado deve ser um número inteiro")
      .default(1)
  })
});

export const alunoFlexibleCreateSchema = z.object({
  nome: z.string().min(1).max(200).trim(),
  pai: z.string().max(200).trim().optional(),
  mae: z.string().max(200).trim().optional(),
  codigo_Nacionalidade: z.number().int().positive(),
  codigo_Estado_Civil: z.number().int().positive().optional(),
  dataNascimento: z.union([z.string().datetime(), z.date()]).transform(val => new Date(val)).optional(),
  email: z.string().email().max(45).trim().optional(),
  telefone: z.string().max(45).trim().optional(),
  codigo_Status: z.number().int().min(0).max(1).default(1),
  codigo_Comuna: z.number().int().positive(),
  codigo_Encarregado: z.number().int().positive(),
  codigo_Utilizador: z.number().int().positive(),
  sexo: z.string().max(10).refine(val => ['M', 'F', 'Masculino', 'Feminino'].includes(val)).optional(),
  n_documento_identificacao: z.string().max(45).trim().optional(),
  dataCadastro: z.union([z.string().datetime(), z.date()]).transform(val => new Date(val)).optional(),
  saldo: z.number().min(0).default(0),
  desconto: z.number().min(0).max(100).optional(),
  url_Foto: z.string().max(345).trim().default("fotoDefault.png"),
  tipo_desconto: z.string().max(45).trim().optional(),
  escolaProveniencia: z.number().int().positive().optional(),
  saldo_Anterior: z.number().optional(),
  codigoTipoDocumento: z.number().int().positive().default(1),
  morada: z.string().max(60).trim().default("..."),
  dataEmissao: z.union([z.string().datetime(), z.date()]).transform(val => new Date(val)).optional(),
  motivo_Desconto: z.string().max(455).trim().optional(),
  provinciaEmissao: z.string().max(45).trim().default("LUANDA"),
  user_id: z.bigint().positive().default(BigInt(1)).optional()
});

// ===============================
// MATRÍCULAS VALIDATIONS
// ===============================

export const matriculaCreateSchema = z.object({
  codigo_Aluno: z
    .number({
      required_error: "Código do aluno é obrigatório",
      invalid_type_error: "Código do aluno deve ser um número"
    })
    .int("Código do aluno deve ser um número inteiro")
    .positive("Código do aluno deve ser positivo"),
  data_Matricula: z
    .string({
      required_error: "Data da matrícula é obrigatória"
    })
    .datetime("Data da matrícula deve estar no formato ISO")
    .or(z.date())
    .transform((val) => new Date(val)),
  codigo_Curso: z
    .number({
      required_error: "Código do curso é obrigatório",
      invalid_type_error: "Código do curso deve ser um número"
    })
    .int("Código do curso deve ser um número inteiro")
    .positive("Código do curso deve ser positivo"),
  codigo_Utilizador: z
    .number({
      required_error: "Código do utilizador é obrigatório",
      invalid_type_error: "Código do utilizador deve ser um número"
    })
    .int("Código do utilizador deve ser um número inteiro")
    .positive("Código do utilizador deve ser positivo"),
  codigoStatus: z
    .number()
    .int("Status deve ser um número inteiro")
    .min(0, "Status deve ser 0 ou 1")
    .max(1, "Status deve ser 0 ou 1")
    .default(1)
}).strict();

export const matriculaUpdateSchema = matriculaCreateSchema.partial();

export const matriculaFlexibleCreateSchema = z.object({
  codigo_Aluno: z.number().int().positive(),
  data_Matricula: z.union([z.string().datetime(), z.date()]).transform(val => new Date(val)),
  codigo_Curso: z.number().int().positive(),
  codigo_Utilizador: z.number().int().positive(),
  codigoStatus: z.number().int().min(0).max(1).default(1)
});

// ===============================
// CONFIRMAÇÕES VALIDATIONS
// ===============================

export const confirmacaoCreateSchema = z.object({
  codigo_Matricula: z
    .number({
      required_error: "Código da matrícula é obrigatório",
      invalid_type_error: "Código da matrícula deve ser um número"
    })
    .int("Código da matrícula deve ser um número inteiro")
    .positive("Código da matrícula deve ser positivo"),
  data_Confirmacao: z
    .string({
      required_error: "Data da confirmação é obrigatória"
    })
    .refine((val) => !isNaN(Date.parse(val)), "Data da confirmação deve ser uma data válida")
    .transform((val) => new Date(val)),
  codigo_Turma: z
    .number({
      required_error: "Código da turma é obrigatório",
      invalid_type_error: "Código da turma deve ser um número"
    })
    .int("Código da turma deve ser um número inteiro")
    .positive("Código da turma deve ser positivo"),
  codigo_Ano_lectivo: z
    .number({
      required_error: "Código do ano letivo é obrigatório",
      invalid_type_error: "Código do ano letivo deve ser um número"
    })
    .int("Código do ano letivo deve ser um número inteiro")
    .positive("Código do ano letivo deve ser positivo"),
  codigo_Utilizador: z
    .number({
      required_error: "Código do utilizador é obrigatório",
      invalid_type_error: "Código do utilizador deve ser um número"
    })
    .int("Código do utilizador deve ser um número inteiro")
    .positive("Código do utilizador deve ser positivo"),
  mes_Comecar: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Mês para começar deve ser uma data válida")
    .transform((val) => new Date(val))
    .optional(),
  codigo_Status: z
    .number()
    .int("Status deve ser um número inteiro")
    .min(0, "Status deve ser 0 ou 1")
    .max(1, "Status deve ser 0 ou 1")
    .default(1),
  classificacao: z
    .string()
    .max(45, "Classificação deve ter no máximo 45 caracteres")
    .trim()
    .optional()
});

export const confirmacaoUpdateSchema = confirmacaoCreateSchema.partial();

export const confirmacaoFlexibleCreateSchema = z.object({
  codigo_Matricula: z.number().int().positive(),
  data_Confirmacao: z.union([
    z.string().transform(val => new Date(val)),
    z.date()
  ]),
  codigo_Turma: z.number().int().positive(),
  codigo_Ano_lectivo: z.number().int().positive(),
  codigo_Utilizador: z.number().int().positive(),
  mes_Comecar: z.union([
    z.string().transform(val => new Date(val)),
    z.date()
  ]).optional(),
  codigo_Status: z.number().int().min(0).max(1).default(1),
  classificacao: z.string().max(45).trim().optional()
}).passthrough();

// ===============================
// TRANSFERÊNCIAS VALIDATIONS
// ===============================

export const transferenciaCreateSchema = z.object({
  codigoAluno: z
    .number({
      required_error: "Código do aluno é obrigatório",
      invalid_type_error: "Código do aluno deve ser um número"
    })
    .int("Código do aluno deve ser um número inteiro")
    .positive("Código do aluno deve ser positivo"),
  codigoEscola: z
    .number()
    .int("Código da escola deve ser um número inteiro")
    .positive("Código da escola deve ser positivo")
    .default(1),
  codigoUtilizador: z
    .number()
    .int("Código do utilizador deve ser um número inteiro")
    .positive("Código do utilizador deve ser positivo")
    .default(1),
  dataTransferencia: z
    .string()
    .datetime("Data da transferência deve estar no formato ISO")
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  codigoMotivo: z
    .number()
    .int("Código do motivo deve ser um número inteiro")
    .positive("Código do motivo deve ser positivo")
    .default(1),
  obs: z
    .string()
    .max(150, "Observação deve ter no máximo 150 caracteres")
    .trim()
    .optional(),
  dataActualizacao: z
    .string()
    .datetime("Data de atualização deve estar no formato ISO")
    .or(z.date())
    .transform((val) => new Date(val))
    .optional()
}).strict();

export const transferenciaUpdateSchema = transferenciaCreateSchema.partial();

// ===============================
// SCHEMAS AUXILIARES
// ===============================

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID deve ser um número válido").transform(Number)
});

export const alunosByTurmaSchema = z.object({
  codigo_Turma: z.string().regex(/^\d+$/, "Código da turma deve ser um número válido").transform(Number)
});

export const matriculasByAnoLectivoSchema = z.object({
  codigo_AnoLectivo: z.string().regex(/^\d+$/, "Código do ano letivo deve ser um número válido").transform(Number)
});

export const confirmacoesByTurmaAnoSchema = z.object({
  codigo_Turma: z.string().regex(/^\d+$/, "Código da turma deve ser um número válido").transform(Number),
  codigo_AnoLectivo: z.string().regex(/^\d+$/, "Código do ano letivo deve ser um número válido").transform(Number)
});

// ===============================
// BATCH OPERATIONS SCHEMAS
// ===============================

export const batchEncarregadoCreateSchema = z.object({
  encarregados: z.array(encarregadoFlexibleCreateSchema).min(1, "Deve haver pelo menos um encarregado")
});

export const batchAlunoCreateSchema = z.object({
  alunos: z.array(alunoFlexibleCreateSchema).min(1, "Deve haver pelo menos um aluno")
});

export const batchMatriculaCreateSchema = z.object({
  matriculas: z.array(matriculaFlexibleCreateSchema).min(1, "Deve haver pelo menos uma matrícula")
});

export const batchConfirmacaoCreateSchema = z.object({
  confirmacoes: z.array(confirmacaoFlexibleCreateSchema).min(1, "Deve haver pelo menos uma confirmação")
});