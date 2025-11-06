/**
 * @swagger
 * components:
 *   schemas:
 *     TipoStatus:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do tipo de status
 *         designacao:
 *           type: string
 *           maxLength: 45
 *           description: Designação do tipo de status
 *       example:
 *         designacao: "Acadêmico"
 *
 *     Status:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do status
 *         designacao:
 *           type: string
 *           maxLength: 45
 *           description: Designação do status
 *         tipoStatus:
 *           type: integer
 *           description: Código do tipo de status associado
 *       example:
 *         designacao: "Ativo"
 *         tipoStatus: 1
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *             totalPages:
 *               type: integer
 *             totalItems:
 *               type: integer
 *             itemsPerPage:
 *               type: integer
 *             hasNextPage:
 *               type: boolean
 *             hasPreviousPage:
 *               type: boolean
 */

import { Router } from 'express';
import { StatusControlController } from '../controller/status-control.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// ===============================
// ROTAS TIPO STATUS
// ===============================

/**
 * @swagger
 * /api/status-control/tipos-status:
 *   post:
 *     summary: Criar novo tipo de status
 *     tags: [Tipos de Status]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoStatus'
 *     responses:
 *       201:
 *         description: Tipo de status criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Tipo de status já existe
 */
router.post('/tipos-status', StatusControlController.createTipoStatus);

/**
 * @swagger
 * /api/status-control/tipos-status:
 *   get:
 *     summary: Listar tipos de status
 *     tags: [Tipos de Status]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Lista de tipos de status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/tipos-status', StatusControlController.getTiposStatus);

/**
 * @swagger
 * /api/status-control/tipos-status/{id}:
 *   get:
 *     summary: Buscar tipo de status por ID
 *     tags: [Tipos de Status]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de status
 *     responses:
 *       200:
 *         description: Tipo de status encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Tipo de status não encontrado
 */
router.get('/tipos-status/:id', StatusControlController.getTipoStatusById);

/**
 * @swagger
 * /api/status-control/tipos-status/{id}:
 *   put:
 *     summary: Atualizar tipo de status
 *     tags: [Tipos de Status]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoStatus'
 *     responses:
 *       200:
 *         description: Tipo de status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Tipo de status não encontrado
 *       409:
 *         description: Designação já existe
 */
router.put('/tipos-status/:id', StatusControlController.updateTipoStatus);

/**
 * @swagger
 * /api/status-control/tipos-status/{id}:
 *   delete:
 *     summary: Excluir tipo de status
 *     tags: [Tipos de Status]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de status
 *     responses:
 *       200:
 *         description: Tipo de status excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Tipo de status possui dependências
 *       404:
 *         description: Tipo de status não encontrado
 */
router.delete('/tipos-status/:id', StatusControlController.deleteTipoStatus);

// ===============================
// ROTAS STATUS
// ===============================

/**
 * @swagger
 * /api/status-control/status:
 *   post:
 *     summary: Criar novo status
 *     tags: [Status]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Status'
 *     responses:
 *       201:
 *         description: Status criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Status já existe
 */
router.post('/status', StatusControlController.createStatus);

/**
 * @swagger
 * /api/status-control/status:
 *   get:
 *     summary: Listar status
 *     tags: [Status]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Lista de status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/status', StatusControlController.getStatus);

/**
 * @swagger
 * /api/status-control/status/{id}:
 *   get:
 *     summary: Buscar status por ID
 *     tags: [Status]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do status
 *     responses:
 *       200:
 *         description: Status encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Status não encontrado
 */
router.get('/status/:id', StatusControlController.getStatusById);

/**
 * @swagger
 * /api/status-control/status/{id}:
 *   put:
 *     summary: Atualizar status
 *     tags: [Status]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Status'
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Status não encontrado
 *       409:
 *         description: Designação já existe
 */
router.put('/status/:id', StatusControlController.updateStatus);

/**
 * @swagger
 * /api/status-control/status/{id}:
 *   delete:
 *     summary: Excluir status
 *     tags: [Status]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do status
 *     responses:
 *       200:
 *         description: Status excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Status não encontrado
 */
router.delete('/status/:id', StatusControlController.deleteStatus);

// ===============================
// ROTAS OPERAÇÕES ESPECIAIS
// ===============================

/**
 * @swagger
 * /api/status-control/tipos-status/{id}/status:
 *   get:
 *     summary: Buscar status por tipo
 *     tags: [Operações Especiais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de status
 *     responses:
 *       200:
 *         description: Status encontrados por tipo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Tipo de status não encontrado
 */
router.get('/tipos-status/:id/status', StatusControlController.getStatusByTipo);

/**
 * @swagger
 * /api/status-control/status/sem-tipo:
 *   get:
 *     summary: Buscar status sem tipo associado
 *     tags: [Operações Especiais]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status sem tipo encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/status/sem-tipo', StatusControlController.getStatusSemTipo);

/**
 * @swagger
 * /api/status-control/tipos-status/com-contagem:
 *   get:
 *     summary: Buscar tipos de status com contagem de status
 *     tags: [Operações Especiais]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tipos de status com contagem
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/tipos-status/com-contagem', StatusControlController.getTiposStatusComContagem);

/**
 * @swagger
 * /api/status-control/status/buscar:
 *   get:
 *     summary: Buscar status por designação
 *     tags: [Operações Especiais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: designacao
 *         required: true
 *         schema:
 *           type: string
 *         description: Designação para busca
 *     responses:
 *       200:
 *         description: Status encontrados por designação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Parâmetro designação é obrigatório
 */
router.get('/status/buscar', StatusControlController.buscarStatusPorDesignacao);

/**
 * @swagger
 * /api/status-control/status/associar:
 *   post:
 *     summary: Associar status a um tipo
 *     tags: [Operações Especiais]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statusId
 *               - tipoStatusId
 *             properties:
 *               statusId:
 *                 type: integer
 *                 description: ID do status
 *               tipoStatusId:
 *                 type: integer
 *                 description: ID do tipo de status
 *     responses:
 *       200:
 *         description: Status associado ao tipo com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Status ou tipo de status não encontrado
 */
router.post('/status/associar', StatusControlController.associarStatusAoTipo);

/**
 * @swagger
 * /api/status-control/status/{id}/desassociar:
 *   post:
 *     summary: Desassociar status do tipo
 *     tags: [Operações Especiais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do status
 *     responses:
 *       200:
 *         description: Status desassociado do tipo com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Status não encontrado
 */
router.post('/status/:id/desassociar', StatusControlController.desassociarStatusDoTipo);

export default router;
