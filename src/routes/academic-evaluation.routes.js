/**
 * @swagger
 * tags:
 *   - name: Gestão Acadêmica - Avaliação e Notas
 *     description: Sistema de consulta para avaliação e notas acadêmicas
 *   - name: Tipos de Avaliação
 *     description: Consulta de tipos de avaliação
 *   - name: Tipos de Nota
 *     description: Consulta de tipos de nota
 *   - name: Tipos de Nota Valor
 *     description: Consulta de valores de tipos de nota
 *   - name: Tipos de Pauta
 *     description: Consulta de tipos de pauta
 *   - name: Trimestres
 *     description: Consulta de trimestres acadêmicos
 *   - name: Relatórios de Avaliação
 *     description: Relatórios e estatísticas de avaliação
 *
 * components:
 *   schemas:
 *     TipoAvaliacao:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do tipo de avaliação
 *         descricao:
 *           type: string
 *           maxLength: 45
 *           description: Descrição do tipo de avaliação
 *         designacao:
 *           type: string
 *           maxLength: 45
 *           description: Designação do tipo de avaliação
 *         tipoAvaliacao:
 *           type: integer
 *           description: Código do tipo de avaliação
 *       example:
 *         codigo: 1
 *         descricao: "Avaliação contínua"
 *         designacao: "Teste Escrito"
 *         tipoAvaliacao: 1
 *
 *     TipoNota:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do tipo de nota
 *         designacao:
 *           type: string
 *           maxLength: 45
 *           description: Designação do tipo de nota
 *         positivaMinima:
 *           type: number
 *           format: float
 *           description: Nota mínima para aprovação
 *         status:
 *           type: integer
 *           enum: [0, 1]
 *           description: Status do tipo de nota (0=inativo, 1=ativo)
 *       example:
 *         codigo: 1
 *         designacao: "Escala 0-20"
 *         positivaMinima: 10.0
 *         status: 1
 *
 *     TipoNotaValor:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do valor
 *         codigoTipoNota:
 *           type: integer
 *           description: Código do tipo de nota
 *         tipoValor:
 *           type: string
 *           maxLength: 45
 *           description: Tipo do valor
 *         valorNumerico:
 *           type: number
 *           format: float
 *           description: Valor numérico
 *         valorSprecao:
 *           type: string
 *           maxLength: 45
 *           description: Valor por extenso
 *       example:
 *         codigo: 1
 *         codigoTipoNota: 1
 *         tipoValor: "Excelente"
 *         valorNumerico: 18.0
 *         valorSprecao: "Dezoito valores"
 */

import { Router } from 'express';
import { AcademicEvaluationController } from '../controller/academic-evaluation.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// ===============================
// ROTAS TIPOS DE AVALIAÇÃO
// ===============================

/**
 * @swagger
 * /api/academic-evaluation/tipos-avaliacao:
 *   get:
 *     summary: Listar tipos de avaliação
 *     description: Lista todos os tipos de avaliação com paginação e busca
 *     tags: [Tipos de Avaliação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Número da página
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Itens por página
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         description: Termo de busca (designação ou descrição)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tipos de avaliação
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
 *                   example: "Tipos de avaliação encontrados"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TipoAvaliacao'
 */
router.get('/tipos-avaliacao', AcademicEvaluationController.getTiposAvaliacao);

/**
 * @swagger
 * /api/academic-evaluation/tipos-avaliacao/{id}:
 *   get:
 *     summary: Buscar tipo de avaliação por ID
 *     tags: [Tipos de Avaliação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Código do tipo de avaliação
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Tipo de avaliação encontrado
 *       404:
 *         description: Tipo de avaliação não encontrado
 */
router.get('/tipos-avaliacao/:id', AcademicEvaluationController.getTipoAvaliacaoById);

/**
 * @swagger
 * /api/academic-evaluation/tipos-avaliacao/tipo/{tipoAvaliacao}:
 *   get:
 *     summary: Buscar tipos de avaliação por tipo
 *     tags: [Tipos de Avaliação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tipoAvaliacao
 *         required: true
 *         description: Código do tipo de avaliação
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Tipos de avaliação encontrados por tipo
 */
router.get('/tipos-avaliacao/tipo/:tipoAvaliacao', AcademicEvaluationController.getTiposAvaliacaoPorTipo);

// ===============================
// ROTAS TIPOS DE NOTA
// ===============================

/**
 * @swagger
 * /api/academic-evaluation/tipos-nota:
 *   get:
 *     summary: Listar tipos de nota
 *     tags: [Tipos de Nota]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tipos de nota
 */
router.get('/tipos-nota', AcademicEvaluationController.getTiposNota);

/**
 * @swagger
 * /api/academic-evaluation/tipos-nota/ativos:
 *   get:
 *     summary: Buscar tipos de nota ativos
 *     tags: [Tipos de Nota]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tipos de nota ativos encontrados
 */
router.get('/tipos-nota/ativos', AcademicEvaluationController.getTiposNotaAtivos);

/**
 * @swagger
 * /api/academic-evaluation/tipos-nota/{id}:
 *   get:
 *     summary: Buscar tipo de nota por ID
 *     tags: [Tipos de Nota]
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
 *         description: Tipo de nota encontrado
 *       404:
 *         description: Tipo de nota não encontrado
 */
router.get('/tipos-nota/:id', AcademicEvaluationController.getTipoNotaById);

/**
 * @swagger
 * /api/academic-evaluation/tipos-nota/{id}/valores:
 *   get:
 *     summary: Buscar valores por tipo de nota
 *     tags: [Tipos de Nota Valor]
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
 *         description: Valores encontrados por tipo de nota
 */
router.get('/tipos-nota/:id/valores', AcademicEvaluationController.getValoresPorTipoNota);

// ===============================
// ROTAS TIPOS DE NOTA VALOR
// ===============================

/**
 * @swagger
 * /api/academic-evaluation/tipos-nota-valor:
 *   get:
 *     summary: Listar tipos de nota valor
 *     tags: [Tipos de Nota Valor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: tipoNotaId
 *         description: Filtrar por tipo de nota específico
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tipos de nota valor
 */
router.get('/tipos-nota-valor', AcademicEvaluationController.getTiposNotaValor);

/**
 * @swagger
 * /api/academic-evaluation/tipos-nota-valor/{id}:
 *   get:
 *     summary: Buscar tipo de nota valor por ID
 *     tags: [Tipos de Nota Valor]
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
 *         description: Tipo de nota valor encontrado
 */
router.get('/tipos-nota-valor/:id', AcademicEvaluationController.getTipoNotaValorById);

// ===============================
// ROTAS TIPOS DE PAUTA
// ===============================

/**
 * @swagger
 * /api/academic-evaluation/tipos-pauta:
 *   get:
 *     summary: Listar tipos de pauta
 *     tags: [Tipos de Pauta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tipos de pauta
 */
router.get('/tipos-pauta', AcademicEvaluationController.getTiposPauta);

/**
 * @swagger
 * /api/academic-evaluation/tipos-pauta/{id}:
 *   get:
 *     summary: Buscar tipo de pauta por ID
 *     tags: [Tipos de Pauta]
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
 *         description: Tipo de pauta encontrado
 */
router.get('/tipos-pauta/:id', AcademicEvaluationController.getTipoPautaById);

// ===============================
// ROTAS TRIMESTRES
// ===============================

/**
 * @swagger
 * /api/academic-evaluation/trimestres:
 *   get:
 *     summary: Listar trimestres
 *     tags: [Trimestres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de trimestres
 */
router.get('/trimestres', AcademicEvaluationController.getTrimestres);

/**
 * @swagger
 * /api/academic-evaluation/trimestres/{id}:
 *   get:
 *     summary: Buscar trimestre por ID
 *     tags: [Trimestres]
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
 *         description: Trimestre encontrado
 */
router.get('/trimestres/:id', AcademicEvaluationController.getTrimestreById);

// ===============================
// ROTAS RELATÓRIOS E ESTATÍSTICAS
// ===============================

/**
 * @swagger
 * /api/academic-evaluation/relatorio:
 *   get:
 *     summary: Gerar relatório de avaliação
 *     tags: [Relatórios de Avaliação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório de avaliação gerado
 */
router.get('/relatorio', AcademicEvaluationController.getRelatorioAvaliacao);

/**
 * @swagger
 * /api/academic-evaluation/estatisticas/notas:
 *   get:
 *     summary: Gerar estatísticas de notas
 *     tags: [Relatórios de Avaliação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de notas geradas
 */
router.get('/estatisticas/notas', AcademicEvaluationController.getEstatisticasNotas);

export default router;
