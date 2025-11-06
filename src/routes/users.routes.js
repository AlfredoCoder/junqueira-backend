import express from "express";
import { UsersController } from "../controller/users.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Rotas para gestão de usuários do sistema moderno e legado
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os usuários do sistema moderno
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de registros por página
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
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
 *                   example: Lista de usuários obtida com sucesso
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 42
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "João da Silva"
 *                       email:
 *                         type: string
 *                         example: "joao@email.com"
 *                       tipo:
 *                         type: integer
 *                         example: 2
 *                       foto:
 *                         type: string
 *                         example: "img_avatar1.png"
 *       401:
 *         description: Token inválido ou não fornecido
 *       403:
 *         description: Acesso negado (não é administrador)
 */
router.get("/", UsersController.getAllUsers);

/**
 * @swagger
 * /api/users/legacy:
 *   get:
 *     summary: Lista todos os usuários do sistema legado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de usuários legados retornada com sucesso
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
 *                   example: Lista de usuários legados obtida com sucesso
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       codigo:
 *                         type: integer
 *                         example: 15
 *                       nome:
 *                         type: string
 *                         example: "Carlos Alberto"
 *                       user:
 *                         type: string
 *                         example: "calberto"
 *                       codigo_Tipo_Utilizador:
 *                         type: integer
 *                         example: 2
 *                       estadoActual:
 *                         type: string
 *                         example: "ACTIVO"
 *                       dataCadastro:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-20"
 *       401:
 *         description: Token inválido ou não fornecido
 *       403:
 *         description: Acesso negado (não é administrador)
 */
router.get("/legacy", UsersController.getAllLegacyUsers);

/**
 * @swagger
 * /api/users/legacy/{id}:
 *   get:
 *     summary: Buscar usuário legado por ID
 *     description: Retorna os dados de um usuário do sistema legado (tabela `tb_utilizadores`) com base no ID fornecido.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do utilizador no sistema legado
 *     responses:
 *       200:
 *         description: Utilizador encontrado com sucesso.
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
 *                   example: "Utilizador legado obtido com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     codigo:
 *                       type: integer
 *                       example: 12
 *                     nome:
 *                       type: string
 *                       example: "João Manuel"
 *                     user:
 *                       type: string
 *                       example: "jmanuel"
 *                     codigo_Tipo_Utilizador:
 *                       type: integer
 *                       example: 1
 *                     estadoActual:
 *                       type: string
 *                       example: "ATIVO"
 *                     dataCadastro:
 *                       type: string
 *                       format: date
 *                       example: "2024-03-15"
 *                     tb_tipos_utilizador:
 *                       type: object
 *                       properties:
 *                         codigo:
 *                           type: integer
 *                           example: 1
 *                         designacao:
 *                           type: string
 *                           example: "Administrador"
 *       404:
 *         description: Utilizador não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/legacy/:id', UsersController.getUserLegacyById);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Buscar usuário moderno por ID
 *     description: Retorna os dados de um usuário do sistema moderno (tabela `users`) com base no ID fornecido.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário (BigInt convertido para string)
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso.
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
 *                   example: "Usuário obtido com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     name:
 *                       type: string
 *                       example: "Emanuel Malungo"
 *                     username:
 *                       type: string
 *                       example: "emanuel_malungo"
 *                     email:
 *                       type: string
 *                       example: "emanuelmalungo@example.com"
 *                     tipo:
 *                       type: integer
 *                       example: 2
 *                     foto:
 *                       type: string
 *                       example: "img_avatar1.png"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-20T10:30:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-20T10:30:00.000Z"
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
// Rota de teste
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Rota de usuários funcionando' });
});

/**
 * @swagger
 * /api/users/legacy:
 *   post:
 *     summary: Criar novo usuário no sistema legado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *               user:
 *                 type: string
 *                 example: "jsilva"
 *               passe:
 *                 type: string
 *                 example: "senha123"
 *               codigo_Tipo_Utilizador:
 *                 type: integer
 *                 example: 2
 *               estadoActual:
 *                 type: string
 *                 example: "ATIVO"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Nome de usuário já existe
 */
router.post('/legacy', UsersController.createLegacyUser);

/**
 * @swagger
 * /api/users/legacy/{id}:
 *     summary: Atualizar usuário do sistema legado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               user:
 *                 type: string
 *               passe:
 *                 type: string
 *               codigo_Tipo_Utilizador:
 *                 type: integer
 *               estadoActual:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/legacy/:id', UsersController.updateLegacyUser);

/**
 * @swagger
 * /api/users/legacy/{id}:
 *   delete:
 *     summary: Excluir usuário do sistema legado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       409:
 *         description: Usuário não pode ser excluído (tem dependências)
 */
router.delete('/legacy/:id', UsersController.deleteLegacyUser);

/**
 * @swagger
 * /api/users/legacy/{id}/deactivate:
 *   patch:
 *     summary: Desativar usuário do sistema legado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário desativado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.patch('/legacy/:id/deactivate', UsersController.deactivateLegacyUser);

// Rota genérica /:id deve ficar por último para não interceptar outras rotas
router.get('/:id', UsersController.getUserById);

export default router;
