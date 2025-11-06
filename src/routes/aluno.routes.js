import { Router } from 'express';
import { AlunoController } from '../controllers/aluno.controller.js';
import { authenticateIntegratedToken } from '../middleware/integrated-auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/aluno/perfil:
 *   get:
 *     summary: Obter perfil do aluno logado
 *     tags: [Aluno]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do aluno obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
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
 *                         user:
 *                           type: string
 *                         tipo:
 *                           type: string
 *                     aluno:
 *                       type: object
 *                       properties:
 *                         codigo:
 *                           type: integer
 *                         nome:
 *                           type: string
 *                         email:
 *                           type: string
 *                         telefone:
 *                           type: string
 *                         dataNascimento:
 *                           type: string
 *                         sexo:
 *                           type: string
 *                         saldo:
 *                           type: number
 *                     turma:
 *                       type: object
 *                       properties:
 *                         codigo:
 *                           type: integer
 *                         designacao:
 *                           type: string
 *                         classe:
 *                           type: object
 *                           properties:
 *                             codigo:
 *                               type: integer
 *                             designacao:
 *                               type: string
 *                         curso:
 *                           type: object
 *                           properties:
 *                             codigo:
 *                               type: integer
 *                             designacao:
 *                               type: string
 *                     disciplinas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           codigo:
 *                             type: integer
 *                           designacao:
 *                             type: string
 *                     notas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           disciplina:
 *                             type: object
 *                             properties:
 *                               codigo:
 *                                 type: integer
 *                               designacao:
 *                                 type: string
 *                           trimestre1:
 *                             type: object
 *                             properties:
 *                               mac:
 *                                 type: number
 *                                 nullable: true
 *                               pp:
 *                                 type: number
 *                                 nullable: true
 *                               pt:
 *                                 type: number
 *                                 nullable: true
 *                               media:
 *                                 type: number
 *                                 nullable: true
 *                               classificacao:
 *                                 type: string
 *                                 nullable: true
 *                           trimestre2:
 *                             type: object
 *                             properties:
 *                               mac:
 *                                 type: number
 *                                 nullable: true
 *                               pp:
 *                                 type: number
 *                                 nullable: true
 *                               pt:
 *                                 type: number
 *                                 nullable: true
 *                               media:
 *                                 type: number
 *                                 nullable: true
 *                               classificacao:
 *                                 type: string
 *                                 nullable: true
 *                           trimestre3:
 *                             type: object
 *                             properties:
 *                               mac:
 *                                 type: number
 *                                 nullable: true
 *                               pp:
 *                                 type: number
 *                                 nullable: true
 *                               pt:
 *                                 type: number
 *                                 nullable: true
 *                               media:
 *                                 type: number
 *                                 nullable: true
 *                               classificacao:
 *                                 type: string
 *                                 nullable: true
 *                           mediaFinal:
 *                             type: number
 *                             nullable: true
 *                           classificacaoFinal:
 *                             type: string
 *                             nullable: true
 *                     estadoFinanceiro:
 *                       type: object
 *                       properties:
 *                         saldo:
 *                           type: number
 *                         totalPago:
 *                           type: number
 *                         totalDevido:
 *                           type: number
 *                         ultimoPagamento:
 *                           type: object
 *                           nullable: true
 *                           properties:
 *                             data:
 *                               type: string
 *                             valor:
 *                               type: number
 *                             descricao:
 *                               type: string
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Perfil não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/perfil', authenticateIntegratedToken, AlunoController.getPerfil);

export default router;
