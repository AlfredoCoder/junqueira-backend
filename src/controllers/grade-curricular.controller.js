// controllers/grade-curricular.controller.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GradeCurricularController {
  /**
   * Criar grade curricular para uma turma
   * POST /api/academic-management/grade-curricular
   */
  static async criarGradeCurricular(req, res) {
    try {
      const { turmaId, disciplinas } = req.body;

      if (!turmaId || !disciplinas || !Array.isArray(disciplinas) || disciplinas.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'ID da turma e lista de disciplinas são obrigatórios'
        });
      }

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

      // Verificar se as disciplinas já existem na grade curricular desta turma
      const disciplinasExistentes = await prisma.tb_grade_curricular.findMany({
        where: {
          codigo_Turma: parseInt(turmaId),
          codigo_disciplina: {
            in: disciplinas.map(d => parseInt(d))
          }
        }
      });

      if (disciplinasExistentes.length > 0) {
        const disciplinasConflito = disciplinasExistentes.map(d => d.codigo_disciplina);
        return res.status(400).json({
          success: false,
          message: `Algumas disciplinas já estão na grade curricular desta turma: ${disciplinasConflito.join(', ')}`
        });
      }

      // Criar registros na grade curricular
      const dadosParaCriar = disciplinas.map(disciplinaId => ({
        codigo_disciplina: parseInt(disciplinaId),
        codigo_Classe: turma.codigo_Classe,
        codigo_Curso: turma.codigo_Curso,
        codigo_Turma: parseInt(turmaId), // Associar diretamente à turma
        codigo_user: 1, // Usuário padrão - pode ser ajustado conforme autenticação
        codigo_empresa: 1, // Empresa padrão
        status: 1, // Status ativo
        codigoTipoNota: 1 // Tipo de nota padrão
      }));

      const resultado = await prisma.tb_grade_curricular.createMany({
        data: dadosParaCriar
      });

      res.json({
        success: true,
        message: `Grade curricular criada com ${resultado.count} disciplinas para a turma ${turma.designacao}`,
        data: {
          disciplinasAdicionadas: resultado.count,
          turma: {
            codigo: turma.codigo,
            designacao: turma.designacao,
            classe: turma.tb_classes.designacao,
            curso: turma.tb_cursos.designacao
          }
        }
      });
    } catch (error) {
      console.error('Erro ao criar grade curricular:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Obter grade curricular por turma
   * GET /api/academic-management/grade-curricular/turma/:turmaId
   */
  static async obterGradePorTurma(req, res) {
    try {
      const { turmaId } = req.params;

      // Buscar a turma
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

      // Buscar grade curricular diretamente pela turma
      const gradeCurricular = await prisma.tb_grade_curricular.findMany({
        where: {
          codigo_Turma: parseInt(turmaId)
        },
        include: {
          tb_disciplinas: true
        },
        orderBy: {
          tb_disciplinas: {
            designacao: 'asc'
          }
        }
      });

      const disciplinasFormatadas = gradeCurricular.map(item => ({
        codigo: item.codigo,
        disciplina: {
          codigo: item.tb_disciplinas.codigo,
          designacao: item.tb_disciplinas.designacao
        }
      }));

      res.json({
        success: true,
        message: `${disciplinasFormatadas.length} disciplinas encontradas na grade curricular da turma ${turma.designacao}`,
        data: {
          turma: {
            codigo: turma.codigo,
            designacao: turma.designacao,
            classe: turma.tb_classes.designacao,
            curso: turma.tb_cursos.designacao
          },
          disciplinas: disciplinasFormatadas
        }
      });
    } catch (error) {
      console.error('Erro ao obter grade curricular:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Remover disciplina da grade curricular
   * DELETE /api/academic-management/grade-curricular/:id
   */
  static async removerDisciplinaGrade(req, res) {
    try {
      const { id } = req.params;

      const gradeItem = await prisma.tb_grade_curricular.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_disciplinas: true
        }
      });

      if (!gradeItem) {
        return res.status(404).json({
          success: false,
          message: 'Item da grade curricular não encontrado'
        });
      }

      await prisma.tb_grade_curricular.delete({
        where: { codigo: parseInt(id) }
      });

      res.json({
        success: true,
        message: `Disciplina "${gradeItem.tb_disciplinas.designacao}" removida da grade curricular`
      });
    } catch (error) {
      console.error('Erro ao remover disciplina da grade:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Listar todas as grades curriculares
   * GET /api/academic-management/grade-curricular
   */
  static async listarGradesCurriculares(req, res) {
    try {
      const grades = await prisma.tb_grade_curricular.findMany({
        include: {
          tb_disciplinas: true,
          tb_classes: true,
          tb_cursos: true
        },
        orderBy: [
          { tb_cursos: { designacao: 'asc' } },
          { tb_classes: { designacao: 'asc' } },
          { tb_disciplinas: { designacao: 'asc' } }
        ]
      });

      // Agrupar por curso e classe
      const gradesAgrupadas = grades.reduce((acc, item) => {
        const chave = `${item.codigo_Curso}-${item.codigo_Classe}`;
        
        if (!acc[chave]) {
          acc[chave] = {
            curso: item.tb_cursos.designacao,
            classe: item.tb_classes.designacao,
            disciplinas: []
          };
        }
        
        acc[chave].disciplinas.push({
          codigo: item.codigo,
          disciplina: {
            codigo: item.tb_disciplinas.codigo,
            designacao: item.tb_disciplinas.designacao
          }
        });
        
        return acc;
      }, {});

      res.json({
        success: true,
        message: `${Object.keys(gradesAgrupadas).length} grades curriculares encontradas`,
        data: Object.values(gradesAgrupadas)
      });
    } catch (error) {
      console.error('Erro ao listar grades curriculares:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}
