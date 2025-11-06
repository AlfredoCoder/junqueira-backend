// middleware/integrated-auth.middleware.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware de autenticação para o sistema integrado
 * Verifica JWT e popula req.user com dados do usuário integrado
 */
export const authenticateIntegratedToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    
    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    const token = authorization.replace('Bearer ', '');
    
    // Verificar e decodificar token do sistema integrado
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'junqueira_secret_key_2025');
    
    // Buscar usuário com tipo no sistema integrado
    const usuario = await prisma.tb_utilizadores.findUnique({
      where: { codigo: decoded.codigo },
      include: {
        tb_tipos_utilizador: true,
        professor: true,
        aluno: true
      }
    });

    if (!usuario || (usuario.estadoActual !== 'ACTIVO' && usuario.estadoActual !== 'Activo')) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado ou inativo'
      });
    }

    // Popular req.user com dados necessários para o middleware de permissões
    req.user = {
      codigo: usuario.codigo,
      nome: usuario.nome,
      username: usuario.user,
      tipo: usuario.tb_tipos_utilizador.designacao,
      tb_tipos_utilizador: usuario.tb_tipos_utilizador,
      professor: usuario.professor,
      aluno: usuario.aluno,
      estadoActual: usuario.estadoActual
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação integrada:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno na autenticação'
    });
  }
};
