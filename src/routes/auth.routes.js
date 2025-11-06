/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Mensagem de erro"
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do usuário
 *         nome:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         tipo:
 *           type: integer
 *           description: Tipo de usuário (1-Admin, 2-Professor, 3-Aluno)
 *         legacy:
 *           type: boolean
 *           description: Indica se é usuário do sistema legado
 */

import express from 'express';
import { AuthController } from '../controller/auth.controller.js';
import { login, logoutUsuario, verificarSessao, alterarSenha, obterPermissoes } from '../controllers/auth.controller.js';
import { 
  authenticateToken, 
  verifyUserExists,
  requireModernUser,
  requireLegacyUser,
  requireAdmin,
  requireUserType,
  requireLegacyUserType
} from '../middleware/auth.middleware.js';

const router = express.Router();

// ========== ROTAS PÚBLICAS ==========

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     description: Cria uma nova conta de usuário no sistema moderno
 *     tags: [Autenticação - Público]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - tipo
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email único do usuário
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Senha do usuário
 *               tipo:
 *                 type: integer
 *                 description: Tipo de usuário (6-Admin, 2-Operador, 4-Chefe de Secretaria, 3 -Pedagogico)
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos ou email já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login do usuário moderno
 *     description: Autentica usuário do sistema moderno e retorna token JWT
 *     tags: [Autenticação - Público]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Email ou Username do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/legacy/register:
 *   post:
 *     summary: Registrar novo usuário legado
 *     description: Cria uma nova conta de usuário no sistema legado
 *     tags: [Autenticação - Sistema Legado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - user
 *               - passe
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome completo do utilizador
 *                 maxLength: 45
 *               user:
 *                 type: string
 *                 description: Username único do utilizador
 *                 maxLength: 45
 *               passe:
 *                 type: string
 *                 description: Senha do utilizador (será convertida para hash MD5)
 *                 minLength: 6
 *                 maxLength: 45
 *               codigo_Tipo_Utilizador:
 *                 type: integer
 *                 description: Tipo de utilizador (1-Admin, 2-Operador, etc.)
 *                 default: 2
 *               estadoActual:
 *                 type: string
 *                 description: Estado atual do utilizador
 *                 maxLength: 10
 *                 default: "Activo"
 *     responses:
 *       201:
 *         description: Utilizador criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Username já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/legacy/register', AuthController.legacyRegister);

/**
 * @swagger
 * /api/auth/legacy/login:
 *   post:
 *     summary: Login do usuário legado
 *     description: Autentica usuário do sistema legado e retorna token JWT
 *     tags: [Autenticação - Sistema Legado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - passe
 *             properties:
 *               user:
 *                 type: string
 *                 description: Username do utilizador
 *                 maxLength: 45
 *               passe:
 *                 type: string
 *                 description: Senha do utilizador
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         nome:
 *                           type: string
 *                         username:
 *                           type: string
 *                         tipo:
 *                           type: integer
 *                         tipoDesignacao:
 *                           type: string
 *                         legacy:
 *                           type: boolean
 *                     token:
 *                       type: string
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/legacy/login', AuthController.legacyLogin);

// ========== ROTAS PROTEGIDAS ==========

/**
 * @swagger
 * /api/auth/legacy/logout:
 *   post:
 *     summary: Logout do usuário legado
 *     description: Realiza logout do usuário do sistema legado
 *     tags: [Autenticação - Sistema Legado]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso"
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/legacy/logout', authenticateToken, requireLegacyUser, AuthController.legacyLogout);

/**
 * @swagger
 * /api/auth/legacy/me:
 *   get:
 *     summary: Obter usuário legado atual
 *     description: Retorna informações do usuário legado autenticado atualmente
 *     tags: [Autenticação - Sistema Legado]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário atual obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuário atual obtido com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     username:
 *                       type: string
 *                     tipo:
 *                       type: integer
 *                     tipoDesignacao:
 *                       type: string
 *                     estadoActual:
 *                       type: string
 *                     dataCadastro:
 *                       type: string
 *                       format: date-time
 *                     loginStatus:
 *                       type: string
 *                     legacy:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/legacy/me', authenticateToken, requireLegacyUser, AuthController.legacyMe);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter usuário atual
 *     description: Retorna informações do usuário moderno autenticado atualmente
 *     tags: [Autenticação - Sistema Moderno]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário atual obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuário atual obtido com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/me', authenticateToken, requireModernUser, AuthController.me);

/**
 * @swagger
 * /api/auth/user-types:
 *   get:
 *     summary: Obter tipos de usuário
 *     description: Retorna lista de tipos de usuário disponíveis no sistema
 *     tags: [Autenticação - Público]
 *     responses:
 *       200:
 *         description: Lista de tipos de usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nome:
 *                         type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/user-types', AuthController.getUserTypes);

// ===============================
// ROTAS MUDANÇA DE SENHA - USUÁRIO LEGADO
// ===============================

/**
 * @swagger
 * /api/auth/legacy/change-password/{userId}:
 *   put:
 *     summary: Alterar senha do usuário legado
 *     description: Permite ao usuário alterar sua própria senha no sistema legado
 *     tags: [Autenticação Legacy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário legado
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Senha atual do usuário
 *                 minLength: 1
 *                 maxLength: 100
 *               newPassword:
 *                 type: string
 *                 description: Nova senha (mínimo 6 caracteres)
 *                 minLength: 6
 *                 maxLength: 50
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmação da nova senha
 *                 minLength: 1
 *           example:
 *             currentPassword: "senhaAtual123"
 *             newPassword: "novaSenha456"
 *             confirmPassword: "novaSenha456"
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Senha alterada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     codigo:
 *                       type: integer
 *                       example: 123
 *                     nome:
 *                       type: string
 *                       example: "João Silva"
 *                     username:
 *                       type: string
 *                       example: "joao.silva"
 *       400:
 *         description: Dados inválidos ou senha atual incorreta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou expirado
 *       403:
 *         description: Usuário inativo
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/legacy/change-password/:userId', authenticateToken, AuthController.changePasswordLegacy);

/**
 * @swagger
 * /api/auth/legacy/reset-password:
 *   post:
 *     summary: Resetar senha de usuário legado (Admin)
 *     description: Permite a administradores resetar a senha de outros usuários no sistema legado
 *     tags: [Autenticação Legacy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID do usuário que terá a senha resetada
 *                 minimum: 1
 *               newPassword:
 *                 type: string
 *                 description: Nova senha (mínimo 6 caracteres)
 *                 minLength: 6
 *                 maxLength: 50
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmação da nova senha
 *                 minLength: 1
 *               adminUserId:
 *                 type: integer
 *                 description: ID do administrador (opcional, será pego do token)
 *                 minimum: 1
 *           example:
 *             userId: 456
 *             newPassword: "novaSenha789"
 *             confirmPassword: "novaSenha789"
 *             adminUserId: 1
 *     responses:
 *       200:
 *         description: Senha resetada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Senha resetada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     codigo:
 *                       type: integer
 *                       example: 456
 *                     nome:
 *                       type: string
 *                       example: "Maria Santos"
 *                     username:
 *                       type: string
 *                       example: "maria.santos"
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido ou expirado
 *       403:
 *         description: Sem permissão de administrador
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/legacy/reset-password', authenticateToken, AuthController.resetPasswordLegacy);

/**
 * @swagger
 * /api/auth/legacy/me:
 *   get:
 *     summary: Obter dados do usuário legado atual
 *     description: Retorna os dados do usuário legado autenticado
 *     tags: [Autenticação Legacy]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dados do usuário obtidos com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     codigo:
 *                       type: integer
 *                       example: 123
 *                     nome:
 *                       type: string
 *                       example: "João Silva"
 *                     username:
 *                       type: string
 *                       example: "joao.silva"
 *                     tipo:
 *                       type: integer
 *                       example: 1
 *                     tipoDesignacao:
 *                       type: string
 *                       example: "Administrador"
 *                     estadoActual:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Token inválido ou usuário não autenticado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/legacy/me', authenticateToken, AuthController.getCurrentUserLegacy);

// ========== SISTEMA INTEGRADO DE USUÁRIOS ==========

/**
 * @swagger
 * /api/auth/integrated/login:
 *   post:
 *     summary: Login integrado (Professores, Alunos e Administradores)
 *     description: Sistema de login unificado que autentica professores, alunos e administradores
 *     tags: [Sistema Integrado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username gerado automaticamente
 *                 example: "joao.silva"
 *               password:
 *                 type: string
 *                 description: Senha do usuário (padrão 123456)
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login realizado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         codigo:
 *                           type: integer
 *                         nome:
 *                           type: string
 *                         username:
 *                           type: string
 *                         tipo:
 *                           type: string
 *                           enum: [Professor, Aluno, Administrador]
 *                     dadosEspecificos:
 *                       type: object
 *                       properties:
 *                         tipo:
 *                           type: string
 *                           enum: [professor, aluno, admin]
 *                         dados:
 *                           type: object
 *                     token:
 *                       type: string
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/integrated/login', login);

/**
 * @swagger
 * /api/auth/integrated/logout:
 *   post:
 *     summary: Logout do sistema integrado
 *     description: Realiza logout de usuários do sistema integrado
 *     tags: [Sistema Integrado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *             properties:
 *               codigo:
 *                 type: integer
 *                 description: Código do usuário
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/integrated/logout', logoutUsuario);

/**
 * @swagger
 * /api/auth/integrated/verify:
 *   get:
 *     summary: Verificar sessão ativa
 *     description: Verifica se o token JWT é válido
 *     tags: [Sistema Integrado]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessão válida
 *       401:
 *         description: Token inválido ou expirado
 */
router.get('/integrated/verify', verificarSessao);

/**
 * @swagger
 * /api/auth/integrated/change-password:
 *   post:
 *     summary: Alterar senha do usuário
 *     description: Permite alterar a senha do usuário autenticado
 *     tags: [Sistema Integrado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - senhaAtual
 *               - novaSenha
 *             properties:
 *               codigo:
 *                 type: integer
 *                 description: Código do usuário
 *               senhaAtual:
 *                 type: string
 *                 description: Senha atual
 *               novaSenha:
 *                 type: string
 *                 description: Nova senha (mínimo 6 caracteres)
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/integrated/change-password', alterarSenha);

/**
 * @swagger
 * /api/auth/integrated/permissions:
 *   get:
 *     summary: Obter permissões do usuário atual
 *     description: Retorna as permissões específicas do usuário baseado no seu tipo
 *     tags: [Sistema Integrado]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissões obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Permissões obtidas com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         codigo:
 *                           type: integer
 *                         nome:
 *                           type: string
 *                         username:
 *                           type: string
 *                         tipo:
 *                           type: string
 *                           enum: [Administrador, Professor, Aluno, Secretaria, Diretor, Operador]
 *                     permissoes:
 *                       type: object
 *                       properties:
 *                         dashboard:
 *                           type: array
 *                           items:
 *                             type: string
 *                         gestaoAcademica:
 *                           type: array
 *                           items:
 *                             type: string
 *                         gestaoAlunos:
 *                           type: array
 *                           items:
 *                             type: string
 *                         professores:
 *                           type: array
 *                           items:
 *                             type: string
 *                         financeiro:
 *                           type: array
 *                           items:
 *                             type: string
 *       401:
 *         description: Token inválido ou expirado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/integrated/permissions', obterPermissoes);

// Rota de teste
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Rota de auth funcionando' });
});

export default router;
