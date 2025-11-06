// ===============================================================
// MIDDLEWARE DE PERMISSÕES POR TIPO DE USUÁRIO
// ===============================================================

/**
 * Definição das permissões por tipo de usuário
 */
const PERMISSIONS = {
  // Administrador - Acesso total ao sistema
  'Administrador': {
    dashboard: ['view'],
    gestaoAcademica: ['view', 'create', 'edit', 'delete', 'lancamentoNotas'],
    gestaoAlunos: ['view', 'create', 'edit', 'delete'],
    professores: ['view', 'create', 'edit', 'delete'],
    financeiro: ['view', 'create', 'edit', 'delete', 'pagamentos', 'relatorios'],
    configuracoes: ['view', 'create', 'edit', 'delete'],
    usuarios: ['view', 'create', 'edit', 'delete'],
    periodosLancamento: ['view', 'create', 'edit', 'delete'] // ✅ APENAS períodos de lançamento
  },

  // Secretária Administrativa
  'Secretaria': {
    dashboard: ['view'],
    gestaoAcademica: ['view', 'create', 'edit'], // SEM lançamento de notas
    gestaoAlunos: ['view', 'create', 'edit', 'delete'],
    financeiro: ['pagamentos'], // APENAS pagamentos
    professores: [], // SEM acesso
    configuracoes: [],
    usuarios: []
  },

  // Diretor Pedagógico
  'Diretor': {
    dashboard: ['view'],
    gestaoAcademica: ['view', 'create', 'edit', 'delete', 'lancamentoNotas'], // COMPLETO
    gestaoAlunos: ['view', 'create', 'edit', 'delete'],
    professores: ['view', 'create', 'edit', 'delete'], // COMPLETO
    financeiro: ['pagamentos'], // APENAS pagamentos
    configuracoes: ['view'], // ✅ Acesso às configurações para períodos
    usuarios: [],
    periodosLancamento: ['view', 'create', 'edit', 'delete'] // ✅ APENAS períodos de lançamento
  },

  // Professor
  'Professor': {
    dashboard: ['view'], // ✅ Acesso ao dashboard para navegação
    gestaoAcademica: ['view', 'lancamentoNotas'], // ✅ Acesso à gestão acadêmica e lançamento de notas
    gestaoAlunos: [], // SEM acesso
    professores: [], // SEM acesso
    financeiro: [], // SEM acesso
    configuracoes: [], // SEM acesso
    perfil: ['view', 'edit'] // ✅ Acesso ao próprio perfil
  },

  // Aluno
  'Aluno': {
    dashboard: [], // SEM acesso ao dashboard - vai direto para perfil
    gestaoAcademica: ['visualizarNotas'], // APENAS visualizar notas
    gestaoAlunos: [], // SEM acesso
    professores: [], // SEM acesso
    financeiro: [], // SEM acesso
    configuracoes: [],
    usuarios: [],
    perfil: ['view', 'edit'] // ✅ Acesso ao próprio perfil
  },

  // Operador (caso exista)
  'Operador': {
    dashboard: ['view'],
    gestaoAcademica: ['view'], // APENAS visualizar notas
    gestaoAlunos: ['view'], // APENAS visualizar alunos
    professores: ['view'], // APENAS visualizar professores
    financeiro: ['view'], // APENAS visualizar financeiro
    configuracoes: ['view'], // APENAS visualizar configurações
    usuarios: ['view'] // APENAS visualizar usuários
  }
};

/**
 * Middleware para verificar permissões específicas
 * @param {string} modulo - Módulo do sistema (dashboard, gestaoAcademica, etc.)
 * @param {string} acao - Ação específica (view, create, edit, delete, etc.)
 */
export const requirePermission = (modulo, acao) => {
  return (req, res, next) => {
    try {
      const usuario = req.user;
      
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      // Buscar tipo de usuário
      const tipoUsuario = usuario.tb_tipos_utilizador?.designacao || usuario.tipo;
      
      if (!tipoUsuario) {
        return res.status(403).json({
          success: false,
          message: 'Tipo de usuário não definido'
        });
      }

      // Verificar se o tipo de usuário existe nas permissões
      const permissoesUsuario = PERMISSIONS[tipoUsuario];
      
      if (!permissoesUsuario) {
        return res.status(403).json({
          success: false,
          message: `Tipo de usuário '${tipoUsuario}' não reconhecido`
        });
      }

      // Verificar se tem acesso ao módulo
      const permissoesModulo = permissoesUsuario[modulo];
      
      if (!permissoesModulo || !Array.isArray(permissoesModulo)) {
        return res.status(403).json({
          success: false,
          message: `Sem acesso ao módulo '${modulo}'`
        });
      }

      // Verificar se tem permissão para a ação específica
      if (!permissoesModulo.includes(acao)) {
        return res.status(403).json({
          success: false,
          message: `Sem permissão para '${acao}' no módulo '${modulo}'`
        });
      }

      // Adicionar permissões ao request para uso posterior
      req.userPermissions = {
        tipo: tipoUsuario,
        modulo: modulo,
        acao: acao,
        todasPermissoes: permissoesUsuario
      };

      next();
    } catch (error) {
      console.error('Erro no middleware de permissões:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

/**
 * Middleware para verificar se é administrador
 */
export const requireAdmin = (req, res, next) => {
  return requirePermission('usuarios', 'view')(req, res, next);
};

/**
 * Middleware para verificar acesso ao dashboard
 */
export const requireDashboardAccess = (req, res, next) => {
  return requirePermission('dashboard', 'view')(req, res, next);
};

/**
 * Middleware para verificar acesso ao lançamento de notas
 */
export const requireNotasAccess = (req, res, next) => {
  return requirePermission('gestaoAcademica', 'lancamentoNotas')(req, res, next);
};

/**
 * Middleware para verificar acesso aos pagamentos
 */
export const requirePagamentosAccess = (req, res, next) => {
  return requirePermission('financeiro', 'pagamentos')(req, res, next);
};

/**
 * Função para obter todas as permissões de um usuário
 * @param {string} tipoUsuario - Tipo do usuário
 * @returns {object} - Objeto com todas as permissões
 */
export const getUserPermissions = (tipoUsuario) => {
  return PERMISSIONS[tipoUsuario] || {};
};

/**
 * Função para verificar se usuário tem permissão específica
 * @param {string} tipoUsuario - Tipo do usuário
 * @param {string} modulo - Módulo do sistema
 * @param {string} acao - Ação específica
 * @returns {boolean} - true se tem permissão
 */
export const hasPermission = (tipoUsuario, modulo, acao) => {
  const permissoes = PERMISSIONS[tipoUsuario];
  if (!permissoes || !permissoes[modulo]) return false;
  return permissoes[modulo].includes(acao);
};

/**
 * Middleware para adicionar permissões do usuário à resposta
 */
export const addUserPermissions = (req, res, next) => {
  try {
    const usuario = req.user;
    
    if (usuario) {
      const tipoUsuario = usuario.tb_tipos_utilizador?.designacao || usuario.tipo;
      const permissoes = getUserPermissions(tipoUsuario);
      
      // Adicionar permissões aos dados do usuário
      req.user.permissoes = permissoes;
    }
    
    next();
  } catch (error) {
    console.error('Erro ao adicionar permissões:', error);
    next();
  }
};

export default {
  requirePermission,
  requireAdmin,
  requireDashboardAccess,
  requireNotasAccess,
  requirePagamentosAccess,
  getUserPermissions,
  hasPermission,
  addUserPermissions,
  PERMISSIONS
};
