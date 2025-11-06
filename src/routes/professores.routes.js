import express from 'express';
import professoresController from '../controllers/professores.controller.js';

const router = express.Router();

// ===============================================================
// ROTAS DE PROFESSORES
// ===============================================================

/**
 * @route GET /api/professores
 * @desc Listar todos os professores
 * @access Private
 */
router.get('/', professoresController.listarProfessores);

/**
 * @route GET /api/professores/:id
 * @desc Buscar professor por ID
 * @access Private
 */
router.get('/:id', professoresController.buscarProfessor);

/**
 * @route POST /api/professores
 * @desc Criar novo professor
 * @access Private
 */
router.post('/', professoresController.criarProfessor);

/**
 * @route PUT /api/professores/:id
 * @desc Atualizar professor
 * @access Private
 */
router.put('/:id', professoresController.atualizarProfessor);

/**
 * @route DELETE /api/professores/:id
 * @desc Excluir professor
 * @access Private
 */
router.delete('/:id', professoresController.excluirProfessor);

/**
 * @route GET /api/professores/:id/turmas
 * @desc Buscar turmas do professor
 * @access Private
 */
router.get('/:id/turmas', professoresController.buscarTurmasProfessor);

/**
 * @route POST /api/professores/:professorId/disciplinas
 * @desc Atribuir disciplina ao professor
 * @access Private
 */
router.post('/:professorId/disciplinas', professoresController.atribuirDisciplina);

/**
 * @route POST /api/professores/:professorId/turmas
 * @desc Atribuir turma ao professor
 * @access Private
 */
router.post('/:professorId/turmas', professoresController.atribuirTurma);

export default router;
