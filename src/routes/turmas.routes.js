import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/turmas - Listar todas as turmas
router.get('/', async (req, res) => {
  try {
    const turmas = await prisma.tb_turmas.findMany({
      include: {
        tb_classes: {
          select: { designacao: true }
        },
        tb_cursos: {
          select: { designacao: true }
        },
        tb_salas: {
          select: { designacao: true }
        },
        tb_periodos: {
          select: { designacao: true }
        }
      },
      orderBy: { codigo: 'asc' }
    });

    res.json({
      success: true,
      data: turmas,
      pagination: {
        page: 1,
        limit: turmas.length,
        total: turmas.length,
        pages: 1
      }
    });
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/turmas/:id - Buscar turma específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const turma = await prisma.tb_turmas.findUnique({
      where: { codigo: parseInt(id) },
      include: {
        tb_classes: {
          select: { designacao: true }
        },
        tb_cursos: {
          select: { designacao: true }
        },
        tb_salas: {
          select: { designacao: true }
        },
        tb_periodos: {
          select: { designacao: true }
        }
      }
    });

    if (!turma) {
      return res.status(404).json({
        success: false,
        message: 'Turma não encontrada'
      });
    }

    res.json({
      success: true,
      data: turma
    });
  } catch (error) {
    console.error('Erro ao buscar turma:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/turmas/:id/alunos - Buscar alunos de uma turma
router.get('/:id/alunos', async (req, res) => {
  try {
    const { id } = req.params;
    const { anoLectivo = '2024' } = req.query;
    
    // Buscar alunos confirmados na turma
    const confirmacoes = await prisma.tb_confirmacoes.findMany({
      where: {
        codigo_Turma: parseInt(id),
        codigo_Status: 1, // Ativo
        tb_matriculas: {
          codigoStatus: 1 // Matrícula ativa
        }
      },
      include: {
        tb_matriculas: {
          include: {
            tb_alunos: {
              select: {
                codigo: true,
                nome: true,
                email: true,
                telefone: true,
                dataNascimento: true,
                sexo: true
              }
            }
          }
        }
      },
      orderBy: {
        tb_matriculas: {
          tb_alunos: {
            nome: 'asc'
          }
        }
      }
    });

    // Extrair dados dos alunos
    const alunos = confirmacoes.map(confirmacao => ({
      codigo: confirmacao.tb_matriculas.tb_alunos.codigo,
      nome: confirmacao.tb_matriculas.tb_alunos.nome,
      email: confirmacao.tb_matriculas.tb_alunos.email,
      telefone: confirmacao.tb_matriculas.tb_alunos.telefone,
      dataNascimento: confirmacao.tb_matriculas.tb_alunos.dataNascimento,
      sexo: confirmacao.tb_matriculas.tb_alunos.sexo,
      dataConfirmacao: confirmacao.data_Confirmacao,
      classificacao: confirmacao.classificacao
    }));

    res.json({
      success: true,
      data: alunos,
      meta: {
        turmaId: parseInt(id),
        anoLectivo,
        totalAlunos: alunos.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar alunos da turma:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/turmas/:id/disciplinas - Buscar disciplinas de uma turma
router.get('/:id/disciplinas', async (req, res) => {
  try {
    const { id } = req.params;
    const { anoLectivo = '2024' } = req.query;
    
    // Buscar professores atribuídos à turma
    const atribuicoes = await prisma.tb_professor_turma.findMany({
      where: {
        codigo_Turma: parseInt(id),
        anoLectivo,
        status: 'Activo'
      },
      include: {
        tb_disciplinas: {
          select: {
            codigo: true,
            designacao: true
          }
        },
        tb_professores: {
          select: {
            codigo: true,
            nome: true
          }
        }
      },
      orderBy: {
        tb_disciplinas: {
          designacao: 'asc'
        }
      }
    });

    // Agrupar por disciplina
    const disciplinas = atribuicoes.map(atribuicao => ({
      codigo: atribuicao.tb_disciplinas.codigo,
      designacao: atribuicao.tb_disciplinas.designacao,
      professor: {
        codigo: atribuicao.tb_professores.codigo,
        nome: atribuicao.tb_professores.nome
      }
    }));

    res.json({
      success: true,
      data: disciplinas,
      meta: {
        turmaId: parseInt(id),
        anoLectivo,
        totalDisciplinas: disciplinas.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar disciplinas da turma:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

export default router;
