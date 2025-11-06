/**
 * @swagger
 * components:
 *   schemas:
 *     AnoLectivo:
 *       type: object
 *       required:
 *         - designacao
 *         - mesInicial
 *         - mesFinal
 *         - anoInicial
 *         - anoFinal
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do ano letivo
 *         designacao:
 *           type: string
 *           maxLength: 100
 *           description: Designação do ano letivo
 *         mesInicial:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           description: Mês inicial do ano letivo
 *         mesFinal:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           description: Mês final do ano letivo
 *         anoInicial:
 *           type: integer
 *           description: Ano inicial do período letivo
 *         anoFinal:
 *           type: integer
 *           description: Ano final do período letivo
 *       example:
 *         designacao: "2024/2025"
 *         mesInicial: 9
 *         mesFinal: 7
 *         anoInicial: 2024
 *         anoFinal: 2025
 *
 *     Curso:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do curso
 *         designacao:
 *           type: string
 *           maxLength: 100
 *           description: Nome do curso
 *         observacoes:
 *           type: string
 *           description: Observações sobre o curso
 *       example:
 *         designacao: "Informática de Gestão"
 *         observacoes: "Curso técnico profissional"
 *
 *     Classe:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da classe
 *         designacao:
 *           type: string
 *           maxLength: 50
 *           description: Nome da classe/série
 *       example:
 *         designacao: "10ª Classe"
 *
 *     Disciplina:
 *       type: object
 *       required:
 *         - designacao
 *         - codigo_Curso
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da disciplina
 *         designacao:
 *           type: string
 *           maxLength: 100
 *           description: Nome da disciplina
 *         codigo_Curso:
 *           type: integer
 *           description: Código do curso ao qual pertence
 *       example:
 *         designacao: "Programação I"
 *         codigo_Curso: 1
 *
 *     Sala:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da sala
 *         designacao:
 *           type: string
 *           maxLength: 50
 *           description: Nome/número da sala
 *         capacidade:
 *           type: integer
 *           description: Capacidade máxima da sala
 *       example:
 *         designacao: "Sala 101"
 *         capacidade: 30
 *
 *     Periodo:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do período
 *         designacao:
 *           type: string
 *           maxLength: 50
 *           description: Nome do período
 *       example:
 *         designacao: "Manhã"
 *
 *     Turma:
 *       type: object
 *       required:
 *         - designacao
 *         - codigo_Classe
 *         - codigo_Curso
 *         - codigo_Sala
 *         - codigo_Periodo
 *         - codigo_AnoLectivo
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da turma
 *         designacao:
 *           type: string
 *           maxLength: 50
 *           description: Nome da turma
 *         codigo_Classe:
 *           type: integer
 *           description: Código da classe
 *         codigo_Curso:
 *           type: integer
 *           description: Código do curso
 *         codigo_Sala:
 *           type: integer
 *           description: Código da sala
 *         codigo_Periodo:
 *           type: integer
 *           description: Código do período
 *         codigo_AnoLectivo:
 *           type: integer
 *           description: Código do ano letivo
 *       example:
 *         designacao: "10IG-A"
 *         codigo_Classe: 1
 *         codigo_Curso: 1
 *         codigo_Sala: 1
 *         codigo_Periodo: 1
 *         codigo_AnoLectivo: 1
 *
 *     GradeCurricular:
 *       type: object
 *       required:
 *         - codigo_Disciplina
 *         - codigo_Classe
 *         - codigo_Curso
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da grade curricular
 *         codigo_Disciplina:
 *           type: integer
 *           description: Código da disciplina
 *         codigo_Classe:
 *           type: integer
 *           description: Código da classe
 *         codigo_Curso:
 *           type: integer
 *           description: Código do curso
 *         cargaHoraria:
 *           type: integer
 *           description: Carga horária da disciplina na grade
 *       example:
 *         codigo_Disciplina: 1
 *         codigo_Classe: 1
 *         codigo_Curso: 1
 *         cargaHoraria: 60
 *
 *     BatchCursos:
 *       type: object
 *       required:
 *         - cursos
 *       properties:
 *         cursos:
 *           type: array
 *           maxItems: 50
 *           items:
 *             $ref: '#/components/schemas/Curso'
 *       example:
 *         cursos:
 *           - designacao: "Informática de Gestão"
 *             observacoes: "Curso técnico"
 *           - designacao: "Contabilidade"
 *             observacoes: "Curso comercial"
 *
 *     BatchDisciplinas:
 *       type: object
 *       required:
 *         - disciplinas
 *       properties:
 *         disciplinas:
 *           type: array
 *           maxItems: 50
 *           items:
 *             $ref: '#/components/schemas/Disciplina'
 *       example:
 *         disciplinas:
 *           - designacao: "Programação I"
 *             codigo_Curso: 1
 *           - designacao: "Base de Dados"
 *             codigo_Curso: 1
 *
 *     BatchTurmas:
 *       type: object
 *       required:
 *         - turmas
 *       properties:
 *         turmas:
 *           type: array
 *           maxItems: 20
 *           items:
 *             $ref: '#/components/schemas/Turma'
 *       example:
 *         turmas:
 *           - designacao: "10IG-A"
 *             codigo_Classe: 1
 *             codigo_Curso: 1
 *             codigo_Sala: 1
 *             codigo_Periodo: 1
 *             codigo_AnoLectivo: 1
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
 *     ApiError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         error:
 *           type: string
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           example: 1
 *         totalPages:
 *           type: integer
 *           example: 5
 *         totalItems:
 *           type: integer
 *           example: 50
 *         itemsPerPage:
 *           type: integer
 *           example: 10
 *         hasNextPage:
 *           type: boolean
 *           example: true
 *         hasPreviousPage:
 *           type: boolean
 *           example: false
 *
 *   tags:
 *     - name: Academic Management
 *       description: Gestão da estrutura curricular acadêmica
 *     - name: Anos Letivos
 *       description: Gestão de anos letivos
 *     - name: Cursos
 *       description: Gestão de cursos
 *     - name: Classes
 *       description: Gestão de classes/séries
 *     - name: Disciplinas
 *       description: Gestão de disciplinas
 *     - name: Salas
 *       description: Gestão de salas de aula
 *     - name: Períodos
 *       description: Gestão de períodos letivos
 *     - name: Turmas
 *       description: Gestão de turmas
 *     - name: Grade Curricular
 *       description: Gestão da grade curricular
 *     - name: Operações Especiais
 *       description: Consultas e operações avançadas
 *     - name: Operações em Lote
 *       description: Criação múltipla de registros
 */

import express from 'express';
import { AcademicManagementController } from '../controller/academic-management.controller.js';

const router = express.Router();

// Rota de teste para verificar dados
router.get('/test-data', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const anosLetivos = await prisma.tb_anos_lectivos.count();
    const turmas = await prisma.tb_turmas.count();
    const cursos = await prisma.tb_cursos.count();
    
    // Buscar algumas turmas de exemplo
    const exemploTurmas = await prisma.tb_turmas.findMany({
      take: 3,
      include: {
        tb_classes: {
          select: {
            codigo: true,
            designacao: true
          }
        },
        tb_cursos: {
          select: {
            codigo: true,
            designacao: true
          }
        }
      }
    });
    
    res.json({
      success: true,
      data: {
        anosLetivos,
        turmas,
        cursos,
        turmasAtivas: await prisma.tb_turmas.count({
          where: {
            status: 'Ativo'
          }
        }),
        exemploTurmas
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Rota simples para buscar turmas ativas
router.get('/turmas-ativas', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    console.log('Buscando turmas ativas...');
    
    const turmas = await prisma.tb_turmas.findMany({
      where: {
        status: 'Ativo'
      },
      include: {
        tb_classes: true,
        tb_salas: true,
        tb_periodos: true,
        tb_cursos: true,
        tb_anos_lectivos: true
      },
      orderBy: {
        designacao: 'asc'
      }
    });
    
    console.log(`Encontradas ${turmas.length} turmas ativas`);
    
    res.json({
      success: true,
      message: `${turmas.length} turmas encontradas`,
      data: turmas
    });
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ========== ANO LETIVO - CRUD ==========

/**
 * @swagger
 * /api/academic-management/anos-lectivos:
 *   post:
 *     summary: Criar novo ano letivo
 *     tags: [Anos Letivos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnoLectivo'
 *           examples:
 *             exemplo1:
 *               summary: Ano letivo 2024/2025
 *               value:
 *                 designacao: "2024/2025"
 *                 mesInicial: 9
 *                 mesFinal: 7
 *                 anoInicial: 2024
 *                 anoFinal: 2025
 *             exemplo2:
 *               summary: Formato alternativo
 *               value:
 *                 nome: "2025/2026"
 *                 mes_inicial: 9
 *                 mes_final: 7
 *                 ano_inicial: 2025
 *                 ano_final: 2026
 *     responses:
 *       201:
 *         description: Ano letivo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Ano letivo já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/anos-lectivos', AcademicManagementController.createAnoLectivo);

/**
 * @swagger
 * /api/academic-management/anos-lectivos:
 *   get:
 *     summary: Listar anos letivos com paginação
 *     tags: [Anos Letivos]
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
 *         description: Lista de anos letivos
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
 *                   example: "Anos letivos encontrados"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AnoLectivo'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPreviousPage:
 *                       type: boolean
 */
router.get('/anos-lectivos', AcademicManagementController.getAnosLectivos);

/**
 * @swagger
 * /api/academic-management/anos-lectivos/{id}:
 *   get:
 *     summary: Obter ano letivo por ID
 *     tags: [Anos Letivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ano letivo
 *     responses:
 *       200:
 *         description: Ano letivo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Ano letivo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/anos-lectivos/:id', AcademicManagementController.getAnoLectivoById);

/**
 * @swagger
 * /api/academic-management/anos-lectivos/{id}:
 *   put:
 *     summary: Atualizar ano letivo
 *     tags: [Anos Letivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do ano letivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnoLectivo'
 *     responses:
 *       200:
 *         description: Ano letivo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Ano letivo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.put('/anos-lectivos/:id', AcademicManagementController.updateAnoLectivo);

/**
 * @swagger
 * /api/academic-management/anos-lectivos/{id}:
 *   delete:
 *     summary: Excluir ano letivo
 *     tags: [Anos Letivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do ano letivo
 *     responses:
 *       200:
 *         description: Ano letivo excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Ano letivo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Não é possível excluir - existem dependências
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/anos-lectivos/:id', AcademicManagementController.deleteAnoLectivo);

// ========== CURSOS - CRUD ==========

/**
 * @swagger
 * /api/academic-management/cursos:
 *   post:
 *     summary: Criar novo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *           examples:
 *             exemplo1:
 *               summary: Curso de Informática
 *               value:
 *                 designacao: "Informática de Gestão"
 *                 observacoes: "Curso técnico profissional"
 *             exemplo2:
 *               summary: Formato alternativo
 *               value:
 *                 nome: "Contabilidade"
 *                 observacoes: "Curso comercial"
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Curso já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/cursos', AcademicManagementController.createCurso);

/**
 * @swagger
 * /api/academic-management/cursos:
 *   get:
 *     summary: Listar cursos com paginação
 *     tags: [Cursos]
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
 *         description: Lista de cursos
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
 *                   example: "Cursos encontrados"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Curso'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/cursos', AcademicManagementController.getCursos);
// Estatísticas de cursos
router.get('/cursos/stats', AcademicManagementController.getCourseStatistics);

/**
 * @swagger
 * /api/academic-management/cursos/{id}:
 *   get:
 *     summary: Obter curso por ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Curso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/cursos/:id', AcademicManagementController.getCursoById);

/**
 * @swagger
 * /api/academic-management/cursos/{id}:
 *   put:
 *     summary: Atualizar curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Curso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.put('/cursos/:id', AcademicManagementController.updateCurso);

/**
 * @swagger
 * /api/academic-management/cursos/{id}:
 *   delete:
 *     summary: Excluir curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do curso
 *     responses:
 *       200:
 *         description: Curso excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Curso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Não é possível excluir - existem dependências
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/cursos/:id', AcademicManagementController.deleteCurso);

// ========== CLASSES - CRUD ==========

/**
 * @swagger
 * /api/academic-management/classes:
 *   post:
 *     summary: Criar nova classe
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Classe'
 *           examples:
 *             exemplo1:
 *               summary: Classe 10ª
 *               value:
 *                 designacao: "10ª Classe"
 *             exemplo2:
 *               summary: Formato alternativo
 *               value:
 *                 nome: "11ª Classe"
 *     responses:
 *       201:
 *         description: Classe criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Classe já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/classes', AcademicManagementController.createClasse);

/**
 * @swagger
 * /api/academic-management/classes:
 *   get:
 *     summary: Listar classes com paginação
 *     tags: [Classes]
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
 *         description: Lista de classes
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
 *                   example: "Classes encontradas"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Classe'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/classes', AcademicManagementController.getClasses);

/**
 * @swagger
 * /api/academic-management/classes/{id}:
 *   get:
 *     summary: Obter classe por ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da classe
 *     responses:
 *       200:
 *         description: Classe encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Classe não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/classes/:id', AcademicManagementController.getClasseById);

/**
 * @swagger
 * /api/academic-management/classes/{id}:
 *   put:
 *     summary: Atualizar classe
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da classe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Classe'
 *     responses:
 *       200:
 *         description: Classe atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Classe não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.put('/classes/:id', AcademicManagementController.updateClasse);

/**
 * @swagger
 * /api/academic-management/classes/{id}:
 *   delete:
 *     summary: Excluir classe
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da classe
 *     responses:
 *       200:
 *         description: Classe excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Classe não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Não é possível excluir - existem dependências
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/classes/:id', AcademicManagementController.deleteClasse);

// ========== DISCIPLINAS - CRUD ==========

/**
 * @swagger
 * /api/academic-management/disciplinas:
 *   post:
 *     summary: Criar nova disciplina
 *     tags: [Disciplinas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Disciplina'
 *           examples:
 *             exemplo1:
 *               summary: Disciplina de Programação
 *               value:
 *                 designacao: "Programação I"
 *                 codigo_Curso: 1
 *             exemplo2:
 *               summary: Formato alternativo
 *               value:
 *                 nome: "Base de Dados"
 *                 curso_id: 1
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Disciplina já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/disciplinas', AcademicManagementController.createDisciplina);

/**
 * @swagger
 * /api/academic-management/disciplinas:
 *   get:
 *     summary: Listar disciplinas com paginação
 *     tags: [Disciplinas]
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
 *         description: Lista de disciplinas
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
 *                   example: "Disciplinas encontradas"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Disciplina'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/disciplinas', AcademicManagementController.getDisciplinas);

/**
 * @swagger
 * /api/academic-management/disciplinas/stats:
 *   get:
 *     summary: Obter estatísticas de disciplinas
 *     tags: [Disciplinas]
 *     responses:
 *       200:
 *         description: Estatísticas de disciplinas obtidas com sucesso
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
 *                   example: "Estatísticas de disciplinas obtidas com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalDisciplinas:
 *                       type: integer
 *                       example: 45
 *                       description: Total de disciplinas cadastradas
 *                     disciplinasAtivas:
 *                       type: integer
 *                       example: 40
 *                       description: Disciplinas com status ativo
 *                     disciplinasInativas:
 *                       type: integer
 *                       example: 5
 *                       description: Disciplinas com status inativo
 *                     disciplinasEspecificas:
 *                       type: integer
 *                       example: 12
 *                       description: Disciplinas marcadas como específicas
 *                     naGradeCurricular:
 *                       type: integer
 *                       example: 38
 *                       description: Disciplinas que estão na grade curricular
 */
router.get('/disciplinas/stats', AcademicManagementController.getDisciplineStatistics);

/**
 * @swagger
 * /api/academic-management/disciplinas/{id}:
 *   get:
 *     summary: Obter disciplina por ID
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *     responses:
 *       200:
 *         description: Disciplina encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Disciplina não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/disciplinas/:id', AcademicManagementController.getDisciplinaById);

/**
 * @swagger
 * /api/academic-management/disciplinas/{id}:
 *   put:
 *     summary: Atualizar disciplina
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da disciplina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Disciplina'
 *     responses:
 *       200:
 *         description: Disciplina atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Disciplina não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.put('/disciplinas/:id', AcademicManagementController.updateDisciplina);

/**
 * @swagger
 * /api/academic-management/disciplinas/{id}:
 *   delete:
 *     summary: Excluir disciplina
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da disciplina
 *     responses:
 *       200:
 *         description: Disciplina excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Disciplina não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Não é possível excluir - existem dependências
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/disciplinas/:id', AcademicManagementController.deleteDisciplina);

// ========== SALAS - CRUD ==========

/**
 * @swagger
 * /api/academic-management/salas:
 *   post:
 *     summary: Criar nova sala
 *     tags: [Salas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sala'
 *           examples:
 *             exemplo1:
 *               summary: Sala 101
 *               value:
 *                 designacao: "Sala 101"
 *                 capacidade: 30
 *             exemplo2:
 *               summary: Formato alternativo
 *               value:
 *                 nome: "Laboratório de Informática"
 *                 capacidade: 25
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Sala já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/salas', AcademicManagementController.createSala);

/**
 * @swagger
 * /api/academic-management/salas:
 *   get:
 *     summary: Listar salas com paginação
 *     tags: [Salas]
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
 *         description: Lista de salas
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
 *                   example: "Salas encontradas"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sala'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/salas', AcademicManagementController.getSalas);

/**
 * @swagger
 * /api/academic-management/salas/{id}:
 *   get:
 *     summary: Obter sala por ID
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sala
 *     responses:
 *       200:
 *         description: Sala encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Sala não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/salas/:id', AcademicManagementController.getSalaById);

/**
 * @swagger
 * /api/academic-management/salas/{id}:
 *   put:
 *     summary: Atualizar sala
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da sala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sala'
 *     responses:
 *       200:
 *         description: Sala atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Sala não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.put('/salas/:id', AcademicManagementController.updateSala);

/**
 * @swagger
 * /api/academic-management/salas/{id}:
 *   delete:
 *     summary: Excluir sala
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da sala
 *     responses:
 *       200:
 *         description: Sala excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Sala não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Não é possível excluir - existem dependências
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/salas/:id', AcademicManagementController.deleteSala);

// ========== PERÍODOS - CRUD ==========

/**
 * @swagger
 * /api/academic-management/periodos:
 *   post:
 *     summary: Criar novo período
 *     tags: [Períodos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Periodo'
 *           examples:
 *             exemplo1:
 *               summary: Período Manhã
 *               value:
 *                 designacao: "Manhã"
 *             exemplo2:
 *               summary: Formato alternativo
 *               value:
 *                 nome: "Tarde"
 *     responses:
 *       201:
 *         description: Período criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Período já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/periodos', AcademicManagementController.createPeriodo);

/**
 * @swagger
 * /api/academic-management/periodos:
 *   get:
 *     summary: Listar períodos com paginação
 *     tags: [Períodos]
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
 *         description: Lista de períodos
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
 *                   example: "Períodos encontrados"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Periodo'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/periodos', AcademicManagementController.getPeriodos);

/**
 * @swagger
 * /api/academic-management/periodos/{id}:
 *   get:
 *     summary: Obter período por ID
 *     tags: [Períodos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do período
 *     responses:
 *       200:
 *         description: Período encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Período não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/periodos/:id', AcademicManagementController.getPeriodoById);

/**
 * @swagger
 * /api/academic-management/periodos/{id}:
 *   put:
 *     summary: Atualizar período
 *     tags: [Períodos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do período
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Periodo'
 *     responses:
 *       200:
 *         description: Período atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Período não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.put('/periodos/:id', AcademicManagementController.updatePeriodo);

/**
 * @swagger
 * /api/academic-management/periodos/{id}:
 *   delete:
 *     summary: Excluir período
 *     tags: [Períodos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do período
 *     responses:
 *       200:
 *         description: Período excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Período não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Não é possível excluir - existem dependências
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/periodos/:id', AcademicManagementController.deletePeriodo);

// ========== TURMAS - CRUD ==========

/**
 * @swagger
 * /api/academic-management/turmas:
 *   post:
 *     summary: Criar nova turma
 *     tags: [Turmas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turma'
 *           examples:
 *             exemplo1:
 *               summary: Turma 10IG-A
 *               value:
 *                 designacao: "10IG-A"
 *                 codigo_Classe: 1
 *                 codigo_Curso: 1
 *                 codigo_Sala: 1
 *                 codigo_Periodo: 1
 *                 codigo_AnoLectivo: 1
 *             exemplo2:
 *               summary: Formato alternativo
 *               value:
 *                 nome: "11CT-B"
 *                 classe_id: 2
 *                 curso_id: 2
 *                 sala_id: 2
 *                 periodo_id: 2
 *                 ano_lectivo_id: 1
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Turma já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/turmas', AcademicManagementController.createTurma);

/**
 * @swagger
 * /api/academic-management/turmas:
 *   get:
 *     summary: Listar turmas com paginação
 *     tags: [Turmas]
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
 *         description: Lista de turmas
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
 *                   example: "Turmas encontradas"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Turma'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/turmas', AcademicManagementController.getTurmas);

/**
 * @swagger
 * /api/academic-management/turmas/{id}:
 *   get:
 *     summary: Obter turma por ID
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Turma não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
// Rota para alunos de uma turma (deve vir antes da rota genérica)
router.get('/turmas/:id/alunos', AcademicManagementController.getAlunosByTurma);

router.get('/turmas/:id', AcademicManagementController.getTurmaById);

/**
 * @swagger
 * /api/academic-management/turmas/{id}:
 *   put:
 *     summary: Atualizar turma
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da turma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turma'
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Turma não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.put('/turmas/:id', AcademicManagementController.updateTurma);

/**
 * @swagger
 * /api/academic-management/turmas/{id}:
 *   delete:
 *     summary: Excluir turma
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da turma
 *     responses:
 *       200:
 *         description: Turma excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Turma não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Não é possível excluir - existem dependências
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/turmas/:id', AcademicManagementController.deleteTurma);

// ========== GRADE CURRICULAR - CRUD ==========

/**
 * @swagger
 * /api/academic-management/grade-curricular:
 *   post:
 *     summary: Criar nova grade curricular
 *     tags: [Grade Curricular]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeCurricular'
 *           examples:
 *             exemplo1:
 *               summary: Grade Curricular
 *               value:
 *                 codigo_Disciplina: 1
 *                 codigo_Classe: 1
 *                 codigo_Curso: 1
 *                 cargaHoraria: 60
 *             exemplo2:
 *               summary: Formato alternativo
 *               value:
 *                 disciplina_id: 2
 *                 classe_id: 1
 *                 curso_id: 1
 *                 carga_horaria: 45
 *     responses:
 *       201:
 *         description: Grade curricular criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Grade curricular já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/grade-curricular', AcademicManagementController.createGradeCurricularByTurma);

/**
 * @swagger
 * /api/academic-management/grade-curricular:
 *   get:
 *     summary: Listar grade curricular com paginação
 *     tags: [Grade Curricular]
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
 *         description: Lista de grade curricular
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
 *                   example: "Grade curricular encontrada"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GradeCurricular'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/grade-curricular', AcademicManagementController.getGradeCurricular);

/**
 * @swagger
 * /api/academic-management/grade-curricular/{id}:
 *   get:
 *     summary: Obter grade curricular por ID
 *     tags: [Grade Curricular]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da grade curricular
 *     responses:
 *       200:
 *         description: Grade curricular encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Grade curricular não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/grade-curricular/:id', AcademicManagementController.getGradeCurricularById);

/**
 * @swagger
 * /api/academic-management/grade-curricular/{id}:
 *   put:
 *     summary: Atualizar grade curricular
 *     tags: [Grade Curricular]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da grade curricular
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeCurricular'
 *     responses:
 *       200:
 *         description: Grade curricular atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Grade curricular não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.put('/grade-curricular/:id', AcademicManagementController.updateGradeCurricular);

/**
 * @swagger
 * /api/academic-management/grade-curricular/{id}:
 *   delete:
 *     summary: Excluir grade curricular
 *     tags: [Grade Curricular]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da grade curricular
 *     responses:
 *       200:
 *         description: Grade curricular excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Grade curricular não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Não é possível excluir - existem dependências
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/grade-curricular/:id', AcademicManagementController.deleteGradeCurricular);

// ========== OPERAÇÕES ESPECIAIS ==========

/**
 * @swagger
 * /api/academic-management/grade-curricular/curso/{codigo_Curso}/classe/{codigo_Classe}:
 *   get:
 *     summary: Obter grade curricular por curso e classe
 *     tags: [Operações Especiais]
 *     parameters:
 *       - in: path
 *         name: codigo_Curso
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do curso
 *       - in: path
 *         name: codigo_Classe
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da classe
 *     responses:
 *       200:
 *         description: Grade curricular encontrada
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
 *                   example: "Grade curricular encontrada"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GradeCurricular'
 *       404:
 *         description: Grade curricular não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/grade-curricular/curso/:codigo_Curso/classe/:codigo_Classe', AcademicManagementController.getGradeByCursoAndClasse);

/**
 * @swagger
 * /api/academic-management/turmas/ano-lectivo/{codigo_AnoLectivo}:
 *   get:
 *     summary: Obter turmas por ano letivo
 *     tags: [Operações Especiais]
 *     parameters:
 *       - in: path
 *         name: codigo_AnoLectivo
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do ano letivo
 *     responses:
 *       200:
 *         description: Turmas encontradas
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
 *                   example: "Turmas encontradas"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Turma'
 *       404:
 *         description: Nenhuma turma encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Parâmetro inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/turmas/ano-lectivo/:codigo_AnoLectivo', AcademicManagementController.getTurmasByAnoLectivo);

/**
 * @swagger
 * /api/academic-management/disciplinas/curso/{codigo_Curso}:
 *   get:
 *     summary: Obter disciplinas por curso
 *     tags: [Operações Especiais]
 *     parameters:
 *       - in: path
 *         name: codigo_Curso
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do curso
 *     responses:
 *       200:
 *         description: Disciplinas encontradas
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
 *                   example: "Disciplinas encontradas"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Disciplina'
 *       404:
 *         description: Nenhuma disciplina encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Parâmetro inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/disciplinas/curso/:codigo_Curso', AcademicManagementController.getDisciplinasByCurso);

/**
 * @swagger
 * /api/academic-management/turmas/classe/{codigo_Classe}/curso/{codigo_Curso}:
 *   get:
 *     summary: Obter turmas por classe e curso
 *     tags: [Operações Especiais]
 *     parameters:
 *       - in: path
 *         name: codigo_Classe
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da classe
 *       - in: path
 *         name: codigo_Curso
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do curso
 *     responses:
 *       200:
 *         description: Turmas encontradas
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
 *                   example: "Turmas encontradas"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Turma'
 *       404:
 *         description: Nenhuma turma encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/turmas/classe/:codigo_Classe/curso/:codigo_Curso', AcademicManagementController.getTurmasByClasseAndCurso);

// ========== OPERAÇÕES EM LOTE ==========

/**
 * @swagger
 * /api/academic-management/cursos/batch:
 *   post:
 *     summary: Criar múltiplos cursos
 *     tags: [Operações em Lote]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchCursos'
 *           examples:
 *             exemplo1:
 *               summary: Criação em lote de cursos
 *               value:
 *                 cursos:
 *                   - designacao: "Informática de Gestão"
 *                     observacoes: "Curso técnico profissional"
 *                   - designacao: "Contabilidade"
 *                     observacoes: "Curso comercial"
 *                   - designacao: "Administração"
 *                     observacoes: "Curso de gestão"
 *     responses:
 *       201:
 *         description: Cursos criados com sucesso
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
 *                   example: "Operação em lote concluída"
 *                 data:
 *                   type: object
 *                   properties:
 *                     sucessos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Curso'
 *                     falhas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           item:
 *                             type: object
 *                           erro:
 *                             type: string
 *                     total:
 *                       type: integer
 *                     sucessos_count:
 *                       type: integer
 *                     falhas_count:
 *                       type: integer
 *       400:
 *         description: Dados inválidos ou limite excedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/cursos/batch', AcademicManagementController.createMultipleCursos);

/**
 * @swagger
 * /api/academic-management/disciplinas/batch:
 *   post:
 *     summary: Criar múltiplas disciplinas
 *     tags: [Operações em Lote]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchDisciplinas'
 *           examples:
 *             exemplo1:
 *               summary: Criação em lote de disciplinas
 *               value:
 *                 disciplinas:
 *                   - designacao: "Programação I"
 *                     codigo_Curso: 1
 *                   - designacao: "Base de Dados"
 *                     codigo_Curso: 1
 *                   - designacao: "Redes de Computadores"
 *                     codigo_Curso: 1
 *     responses:
 *       201:
 *         description: Disciplinas criadas com sucesso
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
 *                   example: "Operação em lote concluída"
 *                 data:
 *                   type: object
 *                   properties:
 *                     sucessos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Disciplina'
 *                     falhas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           item:
 *                             type: object
 *                           erro:
 *                             type: string
 *                     total:
 *                       type: integer
 *                     sucessos_count:
 *                       type: integer
 *                     falhas_count:
 *                       type: integer
 *       400:
 *         description: Dados inválidos ou limite excedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/disciplinas/batch', AcademicManagementController.createMultipleDisciplinas);

/**
 * @swagger
 * /api/academic-management/turmas/batch:
 *   post:
 *     summary: Criar múltiplas turmas
 *     tags: [Operações em Lote]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchTurmas'
 *           examples:
 *             exemplo1:
 *               summary: Criação em lote de turmas
 *               value:
 *                 turmas:
 *                   - designacao: "10IG-A"
 *                     codigo_Classe: 1
 *                     codigo_Curso: 1
 *                     codigo_Sala: 1
 *                   - designacao: "10IG-B"
 *                     codigo_Classe: 1
 *                     codigo_Curso: 1
 *                     codigo_Sala: 2
 *                     codigo_Periodo: 1
 *                     codigo_AnoLectivo: 1
 *     responses:
 *       200:
 *         description: Turmas criadas com sucesso
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
 *                   type: array
 *                   items:
 *                     type: integer
 *       400:
 *         description: Dados inválidos ou limite excedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/turmas/batch', AcademicManagementController.createMultipleTurmas);

// ========== RELATÓRIOS DE ALUNOS POR TURMA ==========

/**
 * @swagger
 * /api/academic-management/turmas/relatorio-completo:
 *   get:
 *     summary: Obter relatório completo de todas as turmas com seus alunos
 *     tags: [Relatórios]
 *     responses:
 *       200:
 *         description: Relatório completo de turmas e alunos
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       turma:
 *                         type: object
 *                         properties:
 *                           codigo:
 *                             type: integer
 *                           designacao:
 *                             type: string
 *                           tb_classes:
 *                             type: object
 *                           tb_cursos:
 *                             type: object
 *                           tb_salas:
 *                             type: object
 *                           tb_periodos:
 *                             type: object
 *                       alunos:
 *                         type: array
 *                         items:
 *                           type: object
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/relatorio-turmas-completo', AcademicManagementController.getRelatorioCompletoTurmas);

/**
 * @swagger
 * /api/academic-management/turmas/{id}/alunos:
 *   get:
 *     summary: Buscar alunos de uma turma específica
 *     tags: [Academic Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Lista de alunos da turma
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/turmas/:id/alunos', AcademicManagementController.getAlunosByTurma);

export default router;
