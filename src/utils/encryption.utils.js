import bcrypt from "bcryptjs";
import crypto from "crypto";

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const hashPassword = async (password) => {
  // Usar salt rounds menor para garantir que o hash caiba na coluna
  const saltRounds = Math.min(BCRYPT_SALT_ROUNDS, 10);
  return await bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Função para hash legado (MD5 para compatibilidade com sistema antigo)
export const hashLegacyPassword = (password) => {
  return crypto.createHash('md5').update(password).digest('hex');
};

// Função para comparar senhas legadas
export const compareLegacyPasswords = (password, hashedPassword) => {
  // Primeiro tenta MD5
  const md5Hash = crypto.createHash('md5').update(password).digest('hex');
  if (md5Hash === hashedPassword) {
    return true;
  }
  
  // Se não for MD5, compara diretamente (texto plano)
  return password === hashedPassword;
};

