import { autenticarUsuario, logout } from '../services/userService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ===============================================================
// CONTROLADOR DE AUTENTICAÇÃO
// ===============================================================

/**
 * Login do usuário (professores, alunos e administradores)
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validações básicas
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username e senha são obrigatórios'
      });
    }

    // Autenticar usuário
    const dadosUsuario = await autenticarUsuario(username, password);

    // Gerar token JWT (opcional, para sessões)
    const token = jwt.sign(
      { 
        codigo: dadosUsuario.codigo,
        username: dadosUsuario.username,
        tipo: dadosUsuario.tipo
      },
      process.env.JWT_SECRET || 'junqueira_secret_key',
      { expiresIn: '24h' }
    );

    // Log de acesso
    console.log(`🔐 Login realizado:`);
    console.log(`   Usuário: ${dadosUsuario.username}`);
    console.log(`   Nome: ${dadosUsuario.nome}`);
    console.log(`   Tipo: ${dadosUsuario.tipo}`);
    console.log(`   Dados específicos: ${dadosUsuario.tipoDados}`);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        usuario: {
          codigo: dadosUsuario.codigo,
          nome: dadosUsuario.nome,
          username: dadosUsuario.username,
          tipo: dadosUsuario.tipo
        },
        dadosEspecificos: {
          tipo: dadosUsuario.tipoDados,
          dados: dadosUsuario.dados
        },
        token,
        expiresIn: '24h'
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    
    // Retornar erro específico baseado na mensagem
    if (error.message.includes('não encontrado') || error.message.includes('incorreta')) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Logout do usuário
 */
const logoutUsuario = async (req, res) => {
  try {
    const { codigo } = req.body;

    if (!codigo) {
      return res.status(400).json({
        success: false,
        message: 'Código do usuário é obrigatório'
      });
    }

    await logout(codigo);

    console.log(`🔓 Logout realizado para usuário código: ${codigo}`);

    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Verificar status do token/sessão
 */
const verificarSessao = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'junqueira_secret_key');

    // Buscar dados completos do usuário
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

    // Determinar dados específicos baseado no tipo
    let dadosEspecificos = null;
    const tipoUsuario = usuario.tb_tipos_utilizador.designacao;

    if (tipoUsuario === 'Professor' && usuario.professor) {
      dadosEspecificos = {
        tipo: 'professor',
        dados: usuario.professor
      };
    } else if (tipoUsuario === 'Aluno' && usuario.aluno) {
      dadosEspecificos = {
        tipo: 'aluno',
        dados: usuario.aluno
      };
    } else {
      dadosEspecificos = {
        tipo: tipoUsuario.toLowerCase(),
        dados: null
      };
    }

    res.json({
      success: true,
      message: 'Sessão válida',
      data: {
        usuario: {
          codigo: usuario.codigo,
          nome: usuario.nome,
          username: usuario.user,
          tipo: tipoUsuario,
          estadoActual: usuario.estadoActual,
          dataCadastro: usuario.dataCadastro
        },
        dadosEspecificos: dadosEspecificos
      }
    });

  } catch (error) {
    console.error('Erro na verificação de sessão:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
};

/**
 * Alterar senha do usuário
 */
const alterarSenha = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { senhaAtual, novaSenha } = req.body;

    // Verificar se token foi fornecido
    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    // Validações básicas
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual e nova senha são obrigatórias'
      });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Nova senha deve ter pelo menos 6 caracteres'
      });
    }

    // Extrair e verificar token
    const token = authorization.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'junqueira_secret_key_2025');

    // Buscar usuário
    const usuario = await prisma.tb_utilizadores.findUnique({
      where: { codigo: decoded.codigo }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, usuario.passe);
    if (!senhaValida) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Gerar hash da nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha no banco
    await prisma.tb_utilizadores.update({
      where: { codigo: decoded.codigo },
      data: { passe: novaSenhaHash }
    });

    console.log(`🔐 Senha alterada para usuário: ${usuario.user}`);
    
    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Obter permissões do usuário atual
 */
const obterPermissoes = async (req, res) => {
  try {
    const { authorization } = req.headers;
    
    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    const token = authorization.replace('Bearer ', '');
    
    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'junqueira_secret_key_2025');
    
    // Buscar usuário com tipo
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

    // Importar permissões
    const { getUserPermissions } = await import('../middleware/permissions.middleware.js');
    
    const tipoUsuario = usuario.tb_tipos_utilizador.designacao;
    const permissoes = getUserPermissions(tipoUsuario);

    res.json({
      success: true,
      message: 'Permissões obtidas com sucesso',
      data: {
        usuario: {
          codigo: usuario.codigo,
          nome: usuario.nome,
          username: usuario.user,
          tipo: tipoUsuario
        },
        permissoes: permissoes
      }
    });

  } catch (error) {
    console.error('Erro ao obter permissões:', error);
    
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

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

export {
  login,
  logoutUsuario,
  verificarSessao,
  alterarSenha,
  obterPermissoes
};
