import prisma from '../config/database.js';
import { verifyToken } from '../utils/token.utils.js';
import { AppError } from '../utils/validation.utils.js';
import { AuthService } from '../services/auth.services.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) throw new AppError('Token de acesso requerido', 401);

    const decoded = verifyToken(token);
    if (!decoded) throw new AppError('Token inválido ou expirado', 403);

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyUserExists = async (req, res, next) => {
  try {
    const { id: userId, legacy } = req.user;
    const user = legacy
      ? await AuthService.getLegacyUserById(userId)
      : await AuthService.getUserById(userId);

    req.userProfile = user;
    next();
  } catch (error) {
    next(new AppError('Usuário não encontrado', 404));
  }
};

export const requireUserType = (allowedTypes) => (req, res, next) => {
  try {
    const userType = req.user.tipo;

    if (req.user.legacy) return requireLegacyUserType(allowedTypes)(req, res, next);

    if (!allowedTypes.includes(userType)) {
      throw new AppError('Acesso negado. Tipo de usuário não autorizado.', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireLegacyUserType = (allowedTypes) => (req, res, next) => {
  try {
    const userType = req.user.tipo;

    if (!allowedTypes.includes(userType)) {
      throw new AppError('Acesso negado. Tipo de utilizador não autorizado.', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = requireUserType([1]);

export const requireLegacyPermission = (requiredPermissions) => async (req, res, next) => {
  try {
    if (!req.user.legacy) throw new AppError('Middleware apenas para usuários do sistema legado', 400);

    const userId = parseInt(req.user.id);

    const userPermissions = await prisma.tb_item_permissao_utilizador.findMany({
      where: {
        codigo_Utilizador: userId,
        status: 'activo',
        data_Inicio: { lte: new Date() },
        data_fin: { gte: new Date() }
      },
      include: { tb_permissao: true }
    });

    const hasPermission = userPermissions.some(up =>
      requiredPermissions.includes(up.tb_permissao.codigo) ||
      requiredPermissions.includes(up.tb_permissao.designacao)
    );

    if (!hasPermission) throw new AppError('Acesso negado. Permissão insuficiente.', 403);

    req.userPermissions = userPermissions.map(up => ({
      codigo: up.tb_permissao.codigo,
      designacao: up.tb_permissao.designacao,
      dataInicio: up.data_Inicio,
      dataFim: up.data_fin
    }));

    next();
  } catch (error) {
    next(error);
  }
};

export const requireModernUser = (req, res, next) => {
  if (req.user.legacy) return next(new AppError('Apenas para usuários do sistema moderno', 403));
  next();
};

export const requireLegacyUser = (req, res, next) => {
  if (!req.user.legacy) return next(new AppError('Apenas para usuários do sistema legado', 403));
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) req.user = decoded;
    }
    next();
  } catch {
    next(); // ignora erros de token e segue sem usuário autenticado
  }
};
