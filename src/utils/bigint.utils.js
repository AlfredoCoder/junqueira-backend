/**
 * Utilitários para lidar com serialização de BigInt
 * 
 * O JavaScript não consegue serializar BigInt nativamente para JSON,
 * causando erros quando tentamos enviar dados do banco via API.
 * Estas funções convertem BigInt para string de forma recursiva.
 */

/**
 * Converte valores BigInt para string de forma recursiva
 * @param {any} obj - Objeto, array ou valor a ser convertido
 * @returns {any} - Objeto com BigInt convertidos para string
 */
export const convertBigIntToString = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  // Se é BigInt, converte para string
  if (typeof obj === 'bigint') return obj.toString();
  
  // Se é Date, mantém como está (será serializado automaticamente pelo JSON.stringify)
  if (obj instanceof Date) return obj;
  
  // Se é array, processa cada elemento
  if (Array.isArray(obj)) return obj.map(convertBigIntToString);
  
  // Se é objeto, processa cada propriedade
  if (typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToString(value);
    }
    return converted;
  }
  
  // Para tipos primitivos, retorna como está
  return obj;
};

/**
 * Middleware para converter BigInt em respostas JSON automaticamente
 * Pode ser usado como middleware global no Express
 */
export const bigIntMiddleware = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    const convertedData = convertBigIntToString(data);
    return originalJson.call(this, convertedData);
  };
  
  next();
};

/**
 * Configura JSON.stringify para lidar com BigInt globalmente
 * ATENÇÃO: Esta função modifica o comportamento global do JSON.stringify
 */
export const setupGlobalBigIntSerialization = () => {
  // Sobrescreve o comportamento padrão do JSON.stringify para BigInt
  BigInt.prototype.toJSON = function() {
    return this.toString();
  };
};
