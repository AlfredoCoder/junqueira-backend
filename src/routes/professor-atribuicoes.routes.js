import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ===============================================================
// ROTAS DE ATRIBUIÇÕES DE PROFESSORES
// ===============================================================

/**
 * @route GET /api/professor-disciplinas
 * @desc Listar atribuições de disciplinas
 * @access Private
 */
router.get('/professor-disciplinas', async (req, res) => {
  try {
    const atribuicoes = await prisma.tb_professor_disciplina.findMany({
      include: {
        tb_professores: {
          select: {
            codigo: true,
            nome: true,
            numeroFuncionario: true,
            status: true
          }
        },
        tb_disciplinas: {
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
      },
      orderBy: [
        { anoLectivo: 'desc' },
        { tb_professores: { nome: 'asc' } }
      ]
    });

    res.json({
      success: true,
      data: atribuicoes
    });
  } catch (error) {
    console.error('Erro ao listar atribuições de disciplinas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * @route GET /api/professor-turmas
 * @desc Listar atribuições de turmas
 * @access Private
 */
router.get('/professor-turmas', async (req, res) => {
  try {
    const atribuicoes = await prisma.tb_professor_turma.findMany({
      include: {
        tb_professores: {
          select: {
            codigo: true,
            nome: true,
            numeroFuncionario: true,
            status: true
          }
        },
        tb_disciplinas: {
          select: {
            codigo: true,
            designacao: true
          }
        },
        tb_turmas: {
          select: {
            codigo: true,
            designacao: true,
            tb_classes: {
              select: {
                designacao: true
              }
            }
          }
        }
      },
      orderBy: [
        { anoLectivo: 'desc' },
        { tb_professores: { nome: 'asc' } }
      ]
    });

    res.json({
      success: true,
      data: atribuicoes
    });
  } catch (error) {
    console.error('Erro ao listar atribuições de turmas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * @route POST /api/professor-disciplinas
 * @desc Criar atribuição de disciplina
 * @access Private
 */
router.post('/professor-disciplinas', async (req, res) => {
  try {
    const { professorId, disciplinaId, cursoId, anoLectivo } = req.body;

    // Validações
    if (!professorId || !disciplinaId || !cursoId || !anoLectivo) {
      return res.status(400).json({
        success: false,
        message: 'Professor, disciplina, curso e ano letivo são obrigatórios'
      });
    }

    // Verificar se já existe a atribuição
    const atribuicaoExiste = await prisma.tb_professor_disciplina.findFirst({
      where: {
        codigo_Professor: parseInt(professorId),
        codigo_Disciplina: parseInt(disciplinaId),
        codigo_Curso: parseInt(cursoId),
        anoLectivo,
        status: 'Activo'
      }
    });

    if (atribuicaoExiste) {
      return res.status(400).json({
        success: false,
        message: 'Professor já possui esta disciplina atribuída para este curso e ano letivo'
      });
    }

    const atribuicao = await prisma.tb_professor_disciplina.create({
      data: {
        codigo_Professor: parseInt(professorId),
        codigo_Disciplina: parseInt(disciplinaId),
        codigo_Curso: parseInt(cursoId),
        anoLectivo,
        status: 'Activo'
      },
      include: {
        tb_professores: {
          select: { nome: true }
        },
        tb_disciplinas: {
          select: { designacao: true }
        },
        tb_cursos: {
          select: { designacao: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Atribuição de disciplina criada com sucesso',
      data: atribuicao
    });
  } catch (error) {
    console.error('Erro ao criar atribuição de disciplina:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * @route POST /api/professor-turmas
 * @desc Criar atribuição de turma
 * @access Private
 */
router.post('/professor-turmas', async (req, res) => {
  try {
    const { professorId, turmaId, disciplinaId, anoLectivo } = req.body;

    // Validações
    if (!professorId || !turmaId || !disciplinaId || !anoLectivo) {
      return res.status(400).json({
        success: false,
        message: 'Professor, turma, disciplina e ano letivo são obrigatórios'
      });
    }

    // Verificar se já existe a atribuição
    const atribuicaoExiste = await prisma.tb_professor_turma.findFirst({
      where: {
        codigo_Professor: parseInt(professorId),
        codigo_Turma: parseInt(turmaId),
        codigo_Disciplina: parseInt(disciplinaId),
        anoLectivo,
        status: 'Activo'
      }
    });

    if (atribuicaoExiste) {
      return res.status(400).json({
        success: false,
        message: 'Professor já possui esta turma atribuída para esta disciplina e ano letivo'
      });
    }

    const atribuicao = await prisma.tb_professor_turma.create({
      data: {
        codigo_Professor: parseInt(professorId),
        codigo_Turma: parseInt(turmaId),
        codigo_Disciplina: parseInt(disciplinaId),
        anoLectivo,
        status: 'Activo'
      },
      include: {
        tb_professores: {
          select: { nome: true }
        },
        tb_disciplinas: {
          select: { designacao: true }
        },
        tb_turmas: {
          select: { designacao: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Atribuição de turma criada com sucesso',
      data: atribuicao
    });
  } catch (error) {
    console.error('Erro ao criar atribuição de turma:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/professor-disciplinas/:id
 * @desc Excluir atribuição de disciplina
 * @access Private
 */
router.delete('/professor-disciplinas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se existe
    const atribuicao = await prisma.tb_professor_disciplina.findUnique({
      where: { codigo: parseInt(id) }
    });

    if (!atribuicao) {
      return res.status(404).json({
        success: false,
        message: 'Atribuição não encontrada'
      });
    }

    // Excluir
    await prisma.tb_professor_disciplina.delete({
      where: { codigo: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Atribuição de disciplina excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir atribuição de disciplina:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/professor-turmas/:id
 * @desc Excluir atribuição de turma
 * @access Private
 */
router.delete('/professor-turmas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se existe
    const atribuicao = await prisma.tb_professor_turma.findUnique({
      where: { codigo: parseInt(id) }
    });

    if (!atribuicao) {
      return res.status(404).json({
        success: false,
        message: 'Atribuição não encontrada'
      });
    }

    // Excluir
    await prisma.tb_professor_turma.delete({
      where: { codigo: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Atribuição de turma excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir atribuição de turma:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * @route POST /api/atribuicao-completa
 * @desc Criar atribuição completa (professor → disciplina → turma)
 * @access Private
 */
router.post('/atribuicao-completa', async (req, res) => {
  try {
    const { professorId, disciplinaId, cursoId, turmaId, anoLectivo } = req.body;

    // Validações
    if (!professorId || !disciplinaId || !cursoId || !anoLectivo) {
      return res.status(400).json({
        success: false,
        message: 'Professor, disciplina, curso e ano letivo são obrigatórios'
      });
    }

    // Usar transação para garantir consistência
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Criar/verificar atribuição professor-disciplina
      let atribuicaoDisciplina = await tx.tb_professor_disciplina.findFirst({
        where: {
          codigo_Professor: parseInt(professorId),
          codigo_Disciplina: parseInt(disciplinaId),
          codigo_Curso: parseInt(cursoId),
          anoLectivo,
          status: 'Activo'
        }
      });

      if (!atribuicaoDisciplina) {
        atribuicaoDisciplina = await tx.tb_professor_disciplina.create({
          data: {
            codigo_Professor: parseInt(professorId),
            codigo_Disciplina: parseInt(disciplinaId),
            codigo_Curso: parseInt(cursoId),
            anoLectivo,
            status: 'Activo'
          }
        });
      } else {
        return {
          success: false,
          message: 'Professor já possui esta disciplina atribuída para este curso e ano letivo'
        };
      }

      // 2. Se turma foi especificada, criar atribuição professor-turma-disciplina
      let atribuicaoTurma = null;
      if (turmaId) {
        // Verificar se já existe
        const turmaExiste = await tx.tb_professor_turma.findFirst({
          where: {
            codigo_Professor: parseInt(professorId),
            codigo_Turma: parseInt(turmaId),
            codigo_Disciplina: parseInt(disciplinaId),
            anoLectivo,
            status: 'Activo'
          }
        });

        if (turmaExiste) {
          return {
            success: false,
            message: 'Professor já possui esta turma atribuída para esta disciplina e ano letivo'
          };
        }

        atribuicaoTurma = await tx.tb_professor_turma.create({
          data: {
            codigo_Professor: parseInt(professorId),
            codigo_Turma: parseInt(turmaId),
            codigo_Disciplina: parseInt(disciplinaId),
            anoLectivo,
            status: 'Activo'
          }
        });
      }

      return {
        success: true,
        atribuicaoDisciplina,
        atribuicaoTurma
      };
    });

    if (!resultado.success) {
      return res.status(400).json(resultado);
    }

    // Buscar dados completos para retorno
    const dadosCompletos = await prisma.tb_professor_disciplina.findUnique({
      where: { codigo: resultado.atribuicaoDisciplina.codigo },
      include: {
        tb_professores: {
          select: { codigo: true, nome: true }
        },
        tb_disciplinas: {
          select: { codigo: true, designacao: true }
        },
        tb_cursos: {
          select: { codigo: true, designacao: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: turmaId ? 
        'Atribuição completa (disciplina + turma) criada com sucesso' : 
        'Atribuição de disciplina criada com sucesso',
      data: {
        disciplina: dadosCompletos,
        turma: resultado.atribuicaoTurma
      }
    });
  } catch (error) {
    console.error('Erro ao criar atribuição completa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * @route GET /api/atribuicoes-professor/:professorId
 * @desc Buscar todas as atribuições de um professor
 * @access Private
 */
router.get('/atribuicoes-professor/:professorId', async (req, res) => {
  try {
    const { professorId } = req.params;

    const [disciplinas, turmas] = await Promise.all([
      // Buscar disciplinas atribuídas
      prisma.tb_professor_disciplina.findMany({
        where: {
          codigo_Professor: parseInt(professorId),
          status: 'Activo'
        },
        include: {
          tb_disciplinas: {
            select: { codigo: true, designacao: true }
          },
          tb_cursos: {
            select: { codigo: true, designacao: true }
          }
        }
      }),
      // Buscar turmas atribuídas
      prisma.tb_professor_turma.findMany({
        where: {
          codigo_Professor: parseInt(professorId),
          status: 'Activo'
        },
        include: {
          tb_disciplinas: {
            select: { codigo: true, designacao: true }
          },
          tb_turmas: {
            select: { 
              codigo: true, 
              designacao: true,
              tb_classes: {
                select: { designacao: true }
              }
            }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        disciplinas,
        turmas,
        totalDisciplinas: disciplinas.length,
        totalTurmas: turmas.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar atribuições do professor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// ===============================================================
// REMOÇÃO DE ATRIBUIÇÕES
// ===============================================================

/**
 * @route DELETE /api/professores/:professorId/disciplinas/:atribuicaoId
 * @desc Remover atribuição de disciplina
 * @access Private
 */
router.delete('/professores/:professorId/disciplinas/:atribuicaoId', async (req, res) => {
  try {
    const { professorId, atribuicaoId } = req.params;

    // Verificar se a atribuição existe e pertence ao professor
    const atribuicao = await prisma.tb_professor_disciplina.findFirst({
      where: {
        codigo: parseInt(atribuicaoId),
        codigo_Professor: parseInt(professorId)
      }
    });

    if (!atribuicao) {
      return res.status(404).json({
        success: false,
        message: 'Atribuição de disciplina não encontrada'
      });
    }

    // Remover a atribuição
    await prisma.tb_professor_disciplina.delete({
      where: {
        codigo: parseInt(atribuicaoId)
      }
    });

    res.json({
      success: true,
      message: 'Atribuição de disciplina removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover atribuição de disciplina:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/professores/:professorId/turmas/:atribuicaoId
 * @desc Remover atribuição de turma
 * @access Private
 */
router.delete('/professores/:professorId/turmas/:atribuicaoId', async (req, res) => {
  try {
    const { professorId, atribuicaoId } = req.params;

    // Verificar se a atribuição existe e pertence ao professor
    const atribuicao = await prisma.tb_professor_turma.findFirst({
      where: {
        codigo: parseInt(atribuicaoId),
        codigo_Professor: parseInt(professorId)
      }
    });

    if (!atribuicao) {
      return res.status(404).json({
        success: false,
        message: 'Atribuição de turma não encontrada'
      });
    }

    // Remover a atribuição
    await prisma.tb_professor_turma.delete({
      where: {
        codigo: parseInt(atribuicaoId)
      }
    });

    res.json({
      success: true,
      message: 'Atribuição de turma removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover atribuição de turma:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

export default router;
