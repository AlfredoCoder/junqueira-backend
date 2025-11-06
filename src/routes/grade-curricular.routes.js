import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { GradeCurricularController } from '../controllers/grade-curricular.controller.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/grade-curricular/turma/{turmaId}/disciplinas:
 *   get:
 *     summary: Buscar disciplinas da grade curricular por turma
 *     tags: [Grade Curricular]
 *     parameters:
 *       - in: path
 *         name: turmaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       codigo:
 *                         type: integer
 *                       designacao:
 *                         type: string
 *                       codigo_disciplina:
 *                         type: integer
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/turma/:turmaId/disciplinas', async (req, res) => {
  try {
    const { turmaId } = req.params;

    // Buscar informações da turma
    const turma = await prisma.tb_turmas.findUnique({
      where: { codigo: parseInt(turmaId) },
      include: {
        tb_classes: true,
        tb_cursos: true
      }
    });

    if (!turma) {
      return res.status(404).json({
        success: false,
        message: 'Turma não encontrada'
      });
    }

    // Buscar disciplinas da grade curricular baseado na classe e curso da turma
    const disciplinasGrade = await prisma.tb_grade_curricular.findMany({
      where: {
        codigo_Classe: turma.codigo_Classe,
        codigo_Curso: turma.codigo_Curso,
        status: 'Activo'
      },
      include: {
        tb_disciplinas: {
          select: {
            codigo: true,
            designacao: true,
            status: true
          }
        }
      }
    });

    // Filtrar apenas disciplinas ativas
    const disciplinas = disciplinasGrade
      .filter(grade => grade.tb_disciplinas && grade.tb_disciplinas.status === 'Activo')
      .map(grade => ({
        codigo: grade.tb_disciplinas.codigo,
        designacao: grade.tb_disciplinas.designacao,
        codigo_disciplina: grade.codigo_disciplina,
        codigo_grade: grade.codigo
      }));

    res.json({
      success: true,
      data: disciplinas,
      turma: {
        codigo: turma.codigo,
        designacao: turma.designacao,
        classe: turma.tb_classes?.designacao,
        curso: turma.tb_cursos?.designacao
      }
    });

  } catch (error) {
    console.error('Erro ao buscar disciplinas da turma:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/grade-curricular/turma/{turmaId}/alunos-confirmados:
 *   get:
 *     summary: Buscar alunos confirmados de uma turma
 *     tags: [Grade Curricular]
 *     parameters:
 *       - in: path
 *         name: turmaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *       - in: query
 *         name: anoLectivo
 *         schema:
 *           type: string
 *         description: Ano letivo (opcional, padrão atual)
 *     responses:
 *       200:
 *         description: Alunos encontrados
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/turma/:turmaId/alunos-confirmados', async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { anoLectivo = '2024' } = req.query;

    // Buscar alunos confirmados na turma
    const alunosConfirmados = await prisma.tb_confirmacoes.findMany({
      where: {
        codigo_Turma: parseInt(turmaId),
        // Filtrar por ano letivo se necessário
        ...(anoLectivo && { codigo_Ano_lectivo: parseInt(anoLectivo) })
      },
      include: {
        tb_matriculas: {
          include: {
            tb_alunos: {
              select: {
                codigo: true,
                nome: true,
                numeroEstudante: true,
                email: true,
                telefone: true,
                status: true
              }
            }
          }
        },
        tb_turmas: {
          select: {
            designacao: true
          }
        }
      }
    });

    // Mapear dados dos alunos
    const alunos = alunosConfirmados
      .filter(confirmacao => confirmacao.tb_matriculas?.tb_alunos)
      .map(confirmacao => ({
        codigo: confirmacao.tb_matriculas.tb_alunos.codigo,
        nome: confirmacao.tb_matriculas.tb_alunos.nome,
        numeroEstudante: confirmacao.tb_matriculas.tb_alunos.numeroEstudante,
        email: confirmacao.tb_matriculas.tb_alunos.email,
        telefone: confirmacao.tb_matriculas.tb_alunos.telefone,
        status: confirmacao.tb_matriculas.tb_alunos.status,
        dataConfirmacao: confirmacao.data_Confirmacao,
        codigoConfirmacao: confirmacao.codigo
      }));

    res.json({
      success: true,
      data: alunos,
      total: alunos.length
    });

  } catch (error) {
    console.error('Erro ao buscar alunos confirmados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/grade-curricular/professor/{professorId}/turmas-disciplinas:
 *   get:
 *     summary: Buscar turmas e disciplinas de um professor
 *     tags: [Grade Curricular]
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do professor
 *       - in: query
 *         name: anoLectivo
 *         schema:
 *           type: string
 *         description: Ano letivo
 *     responses:
 *       200:
 *         description: Turmas e disciplinas encontradas
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/professor/:professorId/turmas-disciplinas', async (req, res) => {
  try {
    const { professorId } = req.params;
    const { anoLectivo = '2024/2025' } = req.query;

    // Buscar atribuições do professor
    const atribuicoesTurmas = await prisma.tb_professor_turma.findMany({
      where: {
        codigo_Professor: parseInt(professorId),
        anoLectivo: anoLectivo,
        status: 'Activo'
      },
      include: {
        tb_turmas: {
          include: {
            tb_classes: { select: { designacao: true } },
            tb_cursos: { select: { designacao: true } }
          }
        },
        tb_disciplinas: {
          select: {
            codigo: true,
            designacao: true
          }
        }
      }
    });

    // Agrupar por turma
    const turmasMap = new Map();
    
    atribuicoesTurmas.forEach(atribuicao => {
      const turmaId = atribuicao.codigo_Turma;
      
      if (!turmasMap.has(turmaId)) {
        turmasMap.set(turmaId, {
          codigo: atribuicao.tb_turmas.codigo,
          designacao: atribuicao.tb_turmas.designacao,
          classe: atribuicao.tb_turmas.tb_classes?.designacao,
          curso: atribuicao.tb_turmas.tb_cursos?.designacao,
          disciplinas: []
        });
      }
      
      turmasMap.get(turmaId).disciplinas.push({
        codigo: atribuicao.tb_disciplinas.codigo,
        designacao: atribuicao.tb_disciplinas.designacao
      });
    });

    const turmas = Array.from(turmasMap.values());

    res.json({
      success: true,
      data: turmas,
      total: turmas.length
    });

  } catch (error) {
    console.error('Erro ao buscar turmas do professor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Novas rotas para gestão da grade curricular
/**
 * @swagger
 * /api/grade-curricular:
 *   post:
 *     summary: Criar grade curricular para uma turma
 *     tags: [Grade Curricular]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gradeCurricular:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     codigo_disciplina:
 *                       type: integer
 *                     codigo_Classe:
 *                       type: integer
 *                     codigo_Curso:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Grade curricular criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', GradeCurricularController.criarGradeCurricular);

/**
 * @swagger
 * /api/grade-curricular/turma/{turmaId}:
 *   get:
 *     summary: Obter grade curricular por turma
 *     tags: [Grade Curricular]
 *     parameters:
 *       - in: path
 *         name: turmaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Grade curricular encontrada
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/turma/:turmaId', GradeCurricularController.obterGradePorTurma);

/**
 * @swagger
 * /api/grade-curricular:
 *   get:
 *     summary: Listar todas as grades curriculares
 *     tags: [Grade Curricular]
 *     responses:
 *       200:
 *         description: Grades curriculares listadas
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', GradeCurricularController.listarGradesCurriculares);

/**
 * @swagger
 * /api/grade-curricular/{id}:
 *   delete:
 *     summary: Remover disciplina da grade curricular
 *     tags: [Grade Curricular]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item da grade curricular
 *     responses:
 *       200:
 *         description: Disciplina removida da grade
 *       404:
 *         description: Item não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', GradeCurricularController.removerDisciplinaGrade);

export default router;
