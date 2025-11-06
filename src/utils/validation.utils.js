// ===== Utilitários para Validação =====

export const MAX_STRING = 30; // Tamanho máximo padrão para strings
export const NAME_REGEX = /^[A-Za-zÀ-ÿ\s]+$/; // Permite acentos e espaços, evita números e símbolos
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/; // Pelo menos 1 letra maiúscula, 1 minúscula e 1 número


export const handleControllerError = (res, error, defaultMessage = "Erro interno", statusCode = 500) => {
  console.error(defaultMessage, error);

  if (error.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Dados inválidos",
      errors: error.errors
    });
  }

  res.status(error.status || statusCode).json({
    success: false,
    message: error.message || defaultMessage
  });
};

/**
 * Classe de erro customizado para padronizar mensagens e status HTTP.
 * Pode ser capturada por um middleware global de erros.
 */
export class AppError extends Error {
  /**
   * 
   * @param {string} message Mensagem de erro a ser exibida
   * @param {number} statusCode Código HTTP (ex.: 400, 401, 404, 500)
   * @param {string} [code] Código interno opcional para logs/diagnósticos
   */
  constructor(message, statusCode = 500, code = 'APP_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;

    // Mantém a stack trace correta para debug
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}