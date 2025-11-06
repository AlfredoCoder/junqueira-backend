import { z } from "zod";
import { MAX_STRING, 
         NAME_REGEX, 
         PASSWORD_REGEX 
} from "../utils/validation.utils.js";

// ===== Registro de Usuário =====
export const registerSchema = z.object({
  name: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(MAX_STRING, `Nome deve ter no máximo ${MAX_STRING} caracteres`)
    .regex(NAME_REGEX, "Nome deve conter apenas letras e espaços"),

  email: z.email("Email inválido")
    .toLowerCase()
    .max(MAX_STRING, `Email deve ter no máximo ${MAX_STRING} caracteres`),
  
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(MAX_STRING, `Senha deve ter no máximo ${MAX_STRING} caracteres`)
    .regex(PASSWORD_REGEX, "Senha deve conter pelo menos 1 letra maiúscula, 1 minúscula e 1 número"),
  
  tipo: z.number()
    .int()
    .min(1, "Tipo inválido")
    .max(10, "Tipo inválido")
    .default(1),
});

// ===== Login =====
export const loginSchema = z.object({
  login: z.string()
    .trim()
    .min(1, "Login é obrigatório")
    .max(MAX_STRING, `Login deve ter no máximo ${MAX_STRING} caracteres`),
  
  password: z.string()
    .min(1, "Senha é obrigatória")
});

// ===== Registro no Sistema Legado =====
export const legacyRegisterSchema = z.object({
  nome: z.string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(45, "Nome deve ter no máximo 45 caracteres"),

  user: z.string()
    .trim()
    .min(3, "Usuário deve ter pelo menos 3 caracteres")
    .max(45, "Usuário deve ter no máximo 45 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Usuário deve conter apenas letras, números, _ e -"),

  passe: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(45, "Senha deve ter no máximo 45 caracteres"),

  codigo_Tipo_Utilizador: z.number()
    .int()
    .min(1, "Tipo de utilizador inválido")
    .optional()
    .default(2),

  estadoActual: z.string()
    .trim()
    .max(10, "Estado deve ter no máximo 10 caracteres")
    .optional()
    .default("Activo")
});

// ===== Login no Sistema Legado =====
export const legacyLoginSchema = z.object({
  user: z.string()
    .trim()
    .min(1, "Usuário é obrigatório")
    .max(45, "Usuário deve ter no máximo 45 caracteres"),
  
  passe: z.string()
    .min(1, "Senha é obrigatória")
});

// ===== Mudança de Senha - Usuário Legado =====
export const changePasswordLegacySchema = z.object({
  currentPassword: z.string()
    .min(1, "Senha atual é obrigatória")
    .max(100, "Senha atual muito longa"),
  
  newPassword: z.string()
    .min(6, "Nova senha deve ter pelo menos 6 caracteres")
    .max(50, "Nova senha deve ter no máximo 50 caracteres")
    .refine(
      (password) => password.trim().length >= 6,
      "Nova senha não pode conter apenas espaços"
    ),
  
  confirmPassword: z.string()
    .min(1, "Confirmação de senha é obrigatória")
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Nova senha e confirmação devem ser iguais",
    path: ["confirmPassword"]
  }
);

// ===== Reset de Senha por Admin - Usuário Legado =====
export const resetPasswordLegacySchema = z.object({
  userId: z.union([
    z.string().regex(/^\d+$/, "ID do usuário deve ser numérico").transform(val => parseInt(val)),
    z.number().int().positive("ID do usuário deve ser um número positivo")
  ]),
  
  newPassword: z.string()
    .min(6, "Nova senha deve ter pelo menos 6 caracteres")
    .max(50, "Nova senha deve ter no máximo 50 caracteres")
    .refine(
      (password) => password.trim().length >= 6,
      "Nova senha não pode conter apenas espaços"
    ),
  
  confirmPassword: z.string()
    .min(1, "Confirmação de senha é obrigatória"),
  
  adminUserId: z.union([
    z.string().regex(/^\d+$/, "ID do admin deve ser numérico").transform(val => parseInt(val)),
    z.number().int().positive("ID do admin deve ser um número positivo")
  ]).optional()
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Nova senha e confirmação devem ser iguais",
    path: ["confirmPassword"]
  }
);

// ===== Parâmetros de Rota =====
export const userIdParamSchema = z.object({
  userId: z.string()
    .regex(/^\d+$/, "ID do usuário deve ser numérico")
    .transform(val => parseInt(val))
});


