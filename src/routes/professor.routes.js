// routes/professor.routes.js
import express from 'express';
import { ProfessorController } from '../controllers/professor.controller.js';
import { requirePermission } from '../middleware/permissions.middleware.js';
import { authenticateIntegratedToken } from '../middleware/integrated-auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Professor
 *   description: Funcionalidades específicas para professores
 */

/**
 * @swagger
 * /api/professor/perfil:
 *   get:
 *     summary: Obter perfil do professor logado
 *     tags: [Professor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
// Rotas removidas - duplicadas abaixo

/**
 * @swagger
 * /api/professor/turmas/{turmaId}/alunos:
 *   get:
 *     summary: Obter alunos de uma turma específica
 *     tags: [Professor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turmaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Alunos obtidos com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado a esta turma
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
// Rota do perfil do professor (sem middleware de permissão específica)
router.get('/perfil', authenticateIntegratedToken, ProfessorController.obterPerfil);

// Rotas que requerem autenticação de professors
router.get('/turmas', authenticateIntegratedToken, ProfessorController.obterTurmas);
router.get('/turmas/:id/alunos', authenticateIntegratedToken, ProfessorController.obterAlunosTurma);

/**
 * @swagger
 *   post:
 *     summary: Lançar notas para uma turma
 *     tags: [Professor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - turmaId
 *               - disciplinaId
 *               - tipoNota
 *               - trimestre
 *               - anoLectivo
 *               - notas
 *             properties:
 *               turmaId:
 *                 type: integer
 *                 example: 1
 *               disciplinaId:
 *                 type: integer
 *                 example: 1
 *               tipoNota:
 *                 type: string
 *                 enum: [MAC, PP, PT]
 *                 example: "MAC"
 *               trimestre:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 example: 1
 *               anoLectivo:
 *                 type: integer
 *                 example: 2024
 *               notas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     alunoId:
 *                       type: integer
 *                       example: 1
 *                     valor:
 *                       type: number
 *                       example: 15.5
 *     responses:
 *       200:
 *         description: Notas lançadas com sucesso
 *       400:
 *         description: Dados inválidos ou período inativo
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/lancar-notas', authenticateIntegratedToken, requirePermission('gestaoAcademica', 'lancamentoNotas'), ProfessorController.lancarNotas);

router.put('/alterar-senha', authenticateIntegratedToken, requirePermission('perfil', 'edit'), ProfessorController.alterarSenha);

export default router;
