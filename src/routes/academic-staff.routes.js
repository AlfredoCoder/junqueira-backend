/**
 * @swagger
 * tags:
 *   - name: Gestão Acadêmica - Pessoal Docente
 *     description: Sistema completo de gestão do pessoal docente
 *   - name: Especialidades
 *     description: Gestão de especialidades acadêmicas
 *   - name: Docentes
 *     description: Gestão de professores e docentes
 *   - name: Disciplinas Docente
 *     description: Associação entre docentes e disciplinas
 *   - name: Diretores de Turmas
 *     description: Gestão de diretores de turmas
 *   - name: Docente Turma
 *     description: Associação entre docentes e turmas
 *   - name: Consultas Acadêmicas
 *     description: Operações especiais e relatórios acadêmicos
 *
 * components:
 *   schemas:
 *     Especialidade:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da especialidade
 *         designacao:
 *           type: string
 *           maxLength: 45
 *           description: Designação da especialidade
 *       example:
 *         designacao: "Matemática"
 *
 *     Docente:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do docente
 *         nome:
 *           type: string
 *           maxLength: 100
 *           description: Nome completo do docente
 *         status:
 *           type: integer
 *           enum: [0, 1]
 *           description: Status do docente (0=inativo, 1=ativo)
 *         codigo_disciplina:
 *           type: integer
 *           description: Código da disciplina principal
 *         codigo_Utilizador:
 *           type: integer
 *           description: Código do utilizador associado
 *         codigo_Especialidade:
 *           type: integer
 *           description: Código da especialidade
 *         contacto:
 *           type: string
 *           maxLength: 45
 *           description: Contacto telefónico
 *         email:
 *           type: string
 *           maxLength: 45
 *           description: Email do docente
 *       example:
 *         nome: "João Silva"
 *         status: 1
 *         codigo_Especialidade: 1
 *         contacto: "923456789"
 *         email: "joao.silva@escola.ao"
 */

import { Router } from 'express';
import { AcademicStaffController } from '../controller/academic-staff.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// ===============================
// ROTAS ESPECIALIDADES
// ===============================

/**
 * @swagger
 * /api/academic-staff/especialidades:
 *   post:
 *     summary: Criar nova especialidade
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Especialidade'
 *     responses:
 *       201:
 *         description: Especialidade criada com sucesso
 *       409:
 *         description: Especialidade já existe
 */
router.post('/especialidades', AcademicStaffController.createEspecialidade);

/**
 * @swagger
 * /api/academic-staff/especialidades:
 *   get:
 *     summary: Listar especialidades
 *     tags: [Especialidades]
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
 *         description: Lista de especialidades
 */
router.get('/especialidades', AcademicStaffController.getEspecialidades);

/**
 * @swagger
 * /api/academic-staff/especialidades/{id}:
 *   get:
 *     summary: Buscar especialidade por ID
 *     tags: [Especialidades]
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
 *         description: Especialidade encontrada
 *       404:
 *         description: Especialidade não encontrada
 */
router.get('/especialidades/:id', AcademicStaffController.getEspecialidadeById);

/**
 * @swagger
 * /api/academic-staff/especialidades/{id}:
 *   put:
 *     summary: Atualizar especialidade
 *     tags: [Especialidades]
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
 *             $ref: '#/components/schemas/Especialidade'
 *     responses:
 *       200:
 *         description: Especialidade atualizada com sucesso
 */
router.put('/especialidades/:id', AcademicStaffController.updateEspecialidade);

/**
 * @swagger
 * /api/academic-staff/especialidades/{id}:
 *   delete:
 *     summary: Excluir especialidade
 *     tags: [Especialidades]
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
 *         description: Especialidade excluída com sucesso
 *       400:
 *         description: Especialidade possui dependências
 */
router.delete('/especialidades/:id', AcademicStaffController.deleteEspecialidade);

// ===============================
// ROTAS DOCENTES
// ===============================

/**
 * @swagger
 * /api/academic-staff/docentes:
 *   post:
 *     summary: Criar novo docente
 *     tags: [Docentes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Docente'
 *     responses:
 *       201:
 *         description: Docente criado com sucesso
 */
router.post('/docentes', AcademicStaffController.createDocente);

/**
 * @swagger
 * /api/academic-staff/docentes:
 *   get:
 *     summary: Listar docentes
 *     tags: [Docentes]
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
 *         description: Lista de docentes
 */
router.get('/docentes', AcademicStaffController.getDocentes);

// ROTAS ESPECIAIS ANTES DAS ROTAS COM PARÂMETROS
/**
 * @swagger
 * /api/academic-staff/docentes/ativos:
 *   get:
 *     summary: Buscar docentes ativos
 *     tags: [Consultas Acadêmicas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Docentes ativos encontrados
 */
router.get('/docentes/ativos', AcademicStaffController.getDocentesAtivos);

/**
 * @swagger
 * /api/academic-staff/docentes/{id}:
 *   get:
 *     summary: Buscar docente por ID
 *     tags: [Docentes]
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
 *         description: Docente encontrado
 *       404:
 *         description: Docente não encontrado
 */
router.get('/docentes/:id', AcademicStaffController.getDocenteById);

/**
 * @swagger
 * /api/academic-staff/docentes/{id}:
 *   put:
 *     summary: Atualizar docente
 *     tags: [Docentes]
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
 *             $ref: '#/components/schemas/Docente'
 *     responses:
 *       200:
 *         description: Docente atualizado com sucesso
 */
router.put('/docentes/:id', AcademicStaffController.updateDocente);

/**
 * @swagger
 * /api/academic-staff/docentes/{id}:
 *   delete:
 *     summary: Excluir docente
 *     tags: [Docentes]
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
 *         description: Docente excluído com sucesso
 *       400:
 *         description: Docente possui dependências
 */
router.delete('/docentes/:id', AcademicStaffController.deleteDocente);

// ===============================
// ROTAS DISCIPLINAS DOCENTE
// ===============================

/**
 * @swagger
 * /api/academic-staff/disciplinas-docente:
 *   post:
 *     summary: Criar associação disciplina-docente
 *     tags: [Disciplinas Docente]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigoDocente
 *               - codigoCurso
 *               - codigoDisciplina
 *             properties:
 *               codigoDocente:
 *                 type: integer
 *               codigoCurso:
 *                 type: integer
 *               codigoDisciplina:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Associação criada com sucesso
 */
router.post('/disciplinas-docente', AcademicStaffController.createDisciplinaDocente);

/**
 * @swagger
 * /api/academic-staff/disciplinas-docente/estatisticas:
 *   get:
 *     summary: Obter estatísticas de disciplinas-docente
 *     tags: [Consultas Acadêmicas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas geradas com sucesso
 */
router.get('/disciplinas-docente/estatisticas', AcademicStaffController.getEstatisticasDisciplinasDocente);

/**
 * @swagger
 * /api/academic-staff/disciplinas-docente:
 *   get:
 *     summary: Listar disciplinas-docente
 *     tags: [Disciplinas Docente]
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
 *         description: Buscar por nome do docente, disciplina ou curso
 *       - in: query
 *         name: docenteId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de disciplinas-docente
 */
router.get('/disciplinas-docente', AcademicStaffController.getDisciplinasDocente);

/**
 * @swagger
 * /api/academic-staff/disciplinas-docente/{id}:
 *   get:
 *     summary: Buscar associação disciplina-docente por ID
 *     tags: [Disciplinas Docente]
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
 *         description: Associação encontrada com sucesso
 */
router.get('/disciplinas-docente/:id', AcademicStaffController.getDisciplinaDocenteById);

/**
 * @swagger
 * /api/academic-staff/disciplinas-docente/{id}:
 *   put:
 *     summary: Atualizar associação disciplina-docente
 *     tags: [Disciplinas Docente]
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
 *             required:
 *               - codigoDocente
 *               - codigoCurso
 *               - codigoDisciplina
 *             properties:
 *               codigoDocente:
 *                 type: integer
 *               codigoCurso:
 *                 type: integer
 *               codigoDisciplina:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Associação atualizada com sucesso
 */
router.put('/disciplinas-docente/:id', AcademicStaffController.updateDisciplinaDocente);

/**
 * @swagger
 * /api/academic-staff/disciplinas-docente/{id}:
 *   delete:
 *     summary: Excluir associação disciplina-docente
 *     tags: [Disciplinas Docente]
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
 *         description: Associação excluída com sucesso
 */
router.delete('/disciplinas-docente/:id', AcademicStaffController.deleteDisciplinaDocente);

// ===============================
// ROTAS CONSULTAS ESPECIAIS
// ===============================

/**
 * @swagger
 * /api/academic-staff/especialidades/{id}/docentes:
 *   get:
 *     summary: Buscar docentes por especialidade
 *     tags: [Consultas Acadêmicas]
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
 *         description: Docentes encontrados por especialidade
 */
router.get('/especialidades/:id/docentes', AcademicStaffController.getDocentesPorEspecialidade);

/**
 * @swagger
 * /api/academic-staff/relatorio:
 *   get:
 *     summary: Gerar relatório acadêmico
 *     tags: [Consultas Acadêmicas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório acadêmico gerado
 */
router.get('/relatorio', AcademicStaffController.getRelatorioAcademico);

// ===============================
// ROTAS DIRETORES DE TURMAS
// ===============================

/**
 * @swagger
 * /api/academic-staff/diretores-turmas:
 *   post:
 *     summary: Criar diretor de turma
 *     tags: [Diretores de Turmas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigoAnoLectivo
 *               - codigoTurma
 *               - codigoDocente
 *             properties:
 *               designacao:
 *                 type: string
 *                 maxLength: 45
 *               codigoAnoLectivo:
 *                 type: integer
 *               codigoTurma:
 *                 type: integer
 *               codigoDocente:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Diretor de turma criado com sucesso
 */
router.post('/diretores-turmas', AcademicStaffController.createDiretorTurma);

/**
 * @swagger
 * /api/academic-staff/diretores-turmas:
 *   get:
 *     summary: Listar diretores de turmas
 *     tags: [Diretores de Turmas]
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
 *         description: Lista de diretores de turmas
 */
router.get('/diretores-turmas', AcademicStaffController.getDiretoresTurmas);

/**
 * @swagger
 * /api/academic-staff/diretores-turmas/{id}:
 *   get:
 *     summary: Buscar diretor de turma por ID
 *     tags: [Diretores de Turmas]
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
 *         description: Diretor de turma encontrado
 */
router.get('/diretores-turmas/:id', AcademicStaffController.getDiretorTurmaById);

/**
 * @swagger
 * /api/academic-staff/diretores-turmas/{id}:
 *   put:
 *     summary: Atualizar diretor de turma
 *     tags: [Diretores de Turmas]
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
 *               designacao:
 *                 type: string
 *                 maxLength: 45
 *               codigoAnoLectivo:
 *                 type: integer
 *               codigoTurma:
 *                 type: integer
 *               codigoDocente:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Diretor de turma atualizado com sucesso
 */
router.put('/diretores-turmas/:id', AcademicStaffController.updateDiretorTurma);

/**
 * @swagger
 * /api/academic-staff/diretores-turmas/{id}:
 *   delete:
 *     summary: Remover diretor de turma
 *     tags: [Diretores de Turmas]
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
 *         description: Diretor de turma removido com sucesso
 */
router.delete('/diretores-turmas/:id', AcademicStaffController.deleteDiretorTurma);

// ===============================
// ROTAS DOCENTE TURMA
// ===============================

/**
 * @swagger
 * /api/academic-staff/docentes-turmas:
 *   post:
 *     summary: Criar associação docente-turma
 *     tags: [Docente Turma]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo_Docente
 *               - codigo_turma
 *             properties:
 *               codigo_Docente:
 *                 type: integer
 *               codigo_turma:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Associação criada com sucesso
 */
router.post('/docentes-turmas', AcademicStaffController.createDocenteTurma);

/**
 * @swagger
 * /api/academic-staff/docentes-turmas:
 *   get:
 *     summary: Listar associações docente-turma
 *     tags: [Docente Turma]
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
 *         name: docenteId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: turmaId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de associações docente-turma
 */
router.get('/docentes-turmas', AcademicStaffController.getDocentesTurmas);

/**
 * @swagger
 * /api/academic-staff/docentes-turmas/{codigoDocente}/{codigoTurma}:
 *   delete:
 *     summary: Remover associação docente-turma
 *     tags: [Docente Turma]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigoDocente
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: codigoTurma
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Associação removida com sucesso
 */
router.delete('/docentes-turmas/:codigoDocente/:codigoTurma', AcademicStaffController.deleteDocenteTurma);

// ===============================
// ROTAS CONSULTAS ESPECIAIS ADICIONAIS
// ===============================

/**
 * @swagger
 * /api/academic-staff/anos-lectivos/{anoLectivo}/diretores:
 *   get:
 *     summary: Buscar diretores por ano letivo
 *     tags: [Consultas Acadêmicas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: anoLectivo
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Diretores encontrados por ano letivo
 */
router.get('/anos-lectivos/:anoLectivo/diretores', AcademicStaffController.getDiretoresPorAnoLectivo);

/**
 * @swagger
 * /api/academic-staff/docentes/{id}/turmas:
 *   get:
 *     summary: Buscar turmas por docente
 *     tags: [Consultas Acadêmicas]
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
 *         description: Turmas encontradas por docente
 */
router.get('/docentes/:id/turmas', AcademicStaffController.getTurmasPorDocente);

/**
 * @swagger
 * /api/academic-staff/turmas/{id}/docentes:
 *   get:
 *     summary: Buscar docentes por turma
 *     tags: [Consultas Acadêmicas]
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
 *         description: Docentes encontrados por turma
 */
router.get('/turmas/:id/docentes', AcademicStaffController.getDocentesPorTurma);

export default router;
