// services/academic-management.services.js
import prisma from '../config/database.js';
import { AppError } from '../utils/validation.utils.js';

export class AcademicManagementService {
  // ===============================
  // ANO LETIVO - CRUD COMPLETO
  // ===============================

  static async createAnoLectivo(data) {
    try {
      const { designacao, mesInicial, mesFinal, anoInicial, anoFinal } = data;

      const existingAno = await prisma.tb_ano_lectivo.findFirst({
        where: {
          designacao: designacao.trim()
        }
      });

      if (existingAno) {
        throw new AppError('Já existe um ano letivo com esta designação', 409);
      }

      if (parseInt(anoInicial) > parseInt(anoFinal)) {
        throw new AppError('Ano inicial não pode ser maior que ano final', 400);
      }

      return await prisma.tb_ano_lectivo.create({
        data: {
          designacao: designacao.trim(),
          mesInicial: mesInicial.trim(),
          mesFinal: mesFinal.trim(),
          anoInicial: anoInicial.trim(),
          anoFinal: anoFinal.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar ano letivo', 500);
    }
  }

  static async updateAnoLectivo(id, data) {
    try {
      const existingAno = await prisma.tb_ano_lectivo.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingAno) {
        throw new AppError('Ano letivo não encontrado', 404);
      }

      if (data.designacao) {
        const duplicateAno = await prisma.tb_ano_lectivo.findFirst({
          where: {
            designacao: data.designacao.trim(),
            codigo: { not: parseInt(id) }
          }
        });

        if (duplicateAno) {
          throw new AppError('Já existe um ano letivo com esta designação', 409);
        }
      }

      const updateData = {};
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          updateData[key] = typeof data[key] === 'string' ? data[key].trim() : data[key];
        }
      });

      return await prisma.tb_ano_lectivo.update({
        where: { codigo: parseInt(id) },
        data: updateData
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar ano letivo', 500);
    }
  }

  static async getAnosLectivos(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search
        }
      } : {};

      const [anosLectivos, total] = await Promise.all([
        prisma.tb_ano_lectivo.findMany({
          where,
          skip,
          take: limit,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_ano_lectivo.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: anosLectivos,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      throw new AppError('Erro ao buscar anos letivos', 500);
    }
  }

  static async getAnoLectivoById(id) {
    try {
      const anoLectivo = await prisma.tb_ano_lectivo.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!anoLectivo) {
        throw new AppError('Ano letivo não encontrado', 404);
      }

      return anoLectivo;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar ano letivo', 500);
    }
  }

  static async deleteAnoLectivo(id) {
    try {
      const existingAno = await prisma.tb_ano_lectivo.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_confirmacoes: true
        }
      });

      if (!existingAno) {
        throw new AppError('Ano letivo não encontrado', 404);
      }

      // TÉCNICA: VALIDAÇÃO COM DETALHES
      if (existingAno.tb_confirmacoes.length > 0) {
        throw new AppError(
          `Não é possível excluir este ano letivo pois está sendo usado por ${existingAno.tb_confirmacoes.length} confirmação(ões)`, 
          400
        );
      }

      // TÉCNICA: HARD DELETE (Exclusão Física)
      await prisma.tb_ano_lectivo.delete({
        where: { codigo: parseInt(id) }
      });

      return { 
        message: 'Ano letivo excluído com sucesso',
        tipo: 'hard_delete',
        detalhes: {
          anoNome: existingAno.designacao
        }
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir ano letivo:', error);
      throw new AppError('Erro ao excluir ano letivo', 500);
    }
  }

  // ===============================
  // CURSOS - CRUD COMPLETO
  // ===============================

  static async createCurso(data) {
    try {
      const { designacao, codigo_Status } = data;

      if (designacao) {
        const existingCurso = await prisma.tb_cursos.findFirst({
          where: {
            designacao: designacao.trim()
          }
        });

        if (existingCurso) {
          throw new AppError('Já existe um curso com esta designação', 409);
        }
      }

      return await prisma.tb_cursos.create({
        data: {
          designacao: designacao?.trim() || null,
          codigo_Status: codigo_Status ? parseInt(codigo_Status) : 1
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar curso', 500);
    }
  }

  static async updateCurso(id, data) {
    try {
      const existingCurso = await prisma.tb_cursos.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingCurso) {
        throw new AppError('Curso não encontrado', 404);
      }

      if (data.designacao) {
        const duplicateCurso = await prisma.tb_cursos.findFirst({
          where: {
            designacao: data.designacao.trim(),
            codigo: { not: parseInt(id) }
          }
        });

        if (duplicateCurso) {
          throw new AppError('Já existe um curso com esta designação', 409);
        }
      }

      const updateData = {};
      if (data.designacao !== undefined) {
        updateData.designacao = data.designacao?.trim() || null;
      }
      if (data.codigo_Status !== undefined) {
        updateData.codigo_Status = data.codigo_Status ? parseInt(data.codigo_Status) : null;
      }

      return await prisma.tb_cursos.update({
        where: { codigo: parseInt(id) },
        data: updateData
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar curso', 500);
    }
  }

  static async getCursos(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search
        }
      } : {};

      const [cursos, total] = await Promise.all([
        prisma.tb_cursos.findMany({
          where,
          skip,
          take: limit,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_cursos.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: cursos,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      throw new AppError('Erro ao buscar cursos', 500);
    }
  }

  // Estatísticas simples dos cursos
  static async getCourseStatistics() {
    try {
      const total = await prisma.tb_cursos.count();
      const active = await prisma.tb_cursos.count({ where: { codigo_Status: 1 } });
      const inactive = await prisma.tb_cursos.count({ where: { codigo_Status: 0 } });

      return { total, active, inactive };
    } catch (error) {
      throw new AppError('Erro ao obter estatísticas de cursos', 500);
    }
  }

  static async getCursoById(id) {
    try {
      const curso = await prisma.tb_cursos.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!curso) {
        throw new AppError('Curso não encontrado', 404);
      }

      return curso;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar curso', 500);
    }
  }

  static async deleteCurso(id) {
    try {
      const existingCurso = await prisma.tb_cursos.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_disciplinas: true,
          tb_turmas: true,
          tb_grade_curricular: true,
          tb_matriculas: true
        }
      });

      if (!existingCurso) {
        throw new AppError('Curso não encontrado', 404);
      }

      // TÉCNICA: VALIDAÇÃO COM DETALHES
      // Verificar todas as dependências e retornar informações detalhadas
      const temDependencias = existingCurso.tb_disciplinas.length > 0 || 
                              existingCurso.tb_turmas.length > 0 || 
                              existingCurso.tb_grade_curricular.length > 0 ||
                              existingCurso.tb_matriculas.length > 0;

      if (temDependencias) {
        const detalhes = {
          disciplinas: existingCurso.tb_disciplinas.length,
          turmas: existingCurso.tb_turmas.length,
          gradeCurricular: existingCurso.tb_grade_curricular.length,
          matriculas: existingCurso.tb_matriculas.length
        };
        
        throw new AppError(
          `Não é possível excluir este curso pois possui ${existingCurso.tb_disciplinas.length} disciplina(s), ` +
          `${existingCurso.tb_turmas.length} turma(s), ${existingCurso.tb_grade_curricular.length} item(ns) na grade curricular ` +
          `e ${existingCurso.tb_matriculas.length} matrícula(s) associadas.`, 
          400,
          detalhes
        );
      }

      // TÉCNICA: HARD DELETE (Exclusão Física)
      // Curso sem dependências pode ser excluído permanentemente
      await prisma.tb_cursos.delete({
        where: { codigo: parseInt(id) }
      });

      return { 
        message: 'Curso excluído com sucesso',
        tipo: 'hard_delete',
        detalhes: {
          cursoNome: existingCurso.designacao
        }
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir curso:', error);
      throw new AppError('Erro ao excluir curso', 500);
    }
  }

  // ===============================
  // CLASSES - CRUD COMPLETO
  // ===============================

  static async createClasse(data) {
    try {
      const { designacao, status, notaMaxima, exame } = data;

      const existingClasse = await prisma.tb_classes.findFirst({
        where: {
          designacao: designacao.trim()
        }
      });

      if (existingClasse) {
        throw new AppError('Já existe uma classe com esta designação', 409);
      }

      return await prisma.tb_classes.create({
        data: {
          designacao: designacao.trim(),
          status: status ? parseInt(status) : 1,
          notaMaxima: notaMaxima ? parseFloat(notaMaxima) : 0,
          exame: exame !== undefined ? Boolean(exame) : false
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar classe', 500);
    }
  }

  static async updateClasse(id, data) {
    try {
      const existingClasse = await prisma.tb_classes.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingClasse) {
        throw new AppError('Classe não encontrada', 404);
      }

      if (data.designacao) {
        const duplicateClasse = await prisma.tb_classes.findFirst({
          where: {
            designacao: data.designacao.trim(),
            codigo: { not: parseInt(id) }
          }
        });

        if (duplicateClasse) {
          throw new AppError('Já existe uma classe com esta designação', 409);
        }
      }

      const updateData = {};
      if (data.designacao !== undefined) updateData.designacao = data.designacao.trim();
      if (data.status !== undefined) updateData.status = parseInt(data.status);
      if (data.notaMaxima !== undefined) updateData.notaMaxima = parseFloat(data.notaMaxima);
      if (data.exame !== undefined) updateData.exame = Boolean(data.exame);

      return await prisma.tb_classes.update({
        where: { codigo: parseInt(id) },
        data: updateData
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar classe', 500);
    }
  }

  static async getClasses(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search
        }
      } : {};

      const [classes, total] = await Promise.all([
        prisma.tb_classes.findMany({
          where,
          skip,
          take: limit,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_classes.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: classes,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      throw new AppError('Erro ao buscar classes', 500);
    }
  }

  static async getClasseById(id) {
    try {
      const classe = await prisma.tb_classes.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!classe) {
        throw new AppError('Classe não encontrada', 404);
      }

      return classe;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar classe', 500);
    }
  }

  static async deleteClasse(id) {
    try {
      const existingClasse = await prisma.tb_classes.findUnique({
        where: { codigo: parseInt(id) },
        include: { 
          tb_turmas: {
            include: {
              tb_confirmacoes: {
                include: {
                  tb_matriculas: true
                }
              }
            }
          }, 
          tb_grade_curricular: true 
        }
      });

      if (!existingClasse) {
        throw new AppError('Classe não encontrada', 404);
      }

      // TÉCNICA: CASCADE DELETE (Exclusão em Cascata)
      // Excluir a classe e todas as suas dependências em uma transação
      const result = await prisma.$transaction(async (tx) => {
        console.log(`[DELETE CLASSE] Iniciando exclusão em cascata da classe ${id} - ${existingClasse.designacao}`);
        
        // ===================================
        // PASSO 1: EXCLUIR CONFIRMAÇÕES (via turmas)
        // ===================================
        let confirmacoesCount = 0;
        if (existingClasse.tb_turmas.length > 0) {
          const turmaIds = existingClasse.tb_turmas.map(t => t.codigo);
          const confirmacoesResult = await tx.tb_confirmacoes.deleteMany({
            where: { codigo_Turma: { in: turmaIds } }
          });
          confirmacoesCount = confirmacoesResult.count;
          if (confirmacoesCount > 0) {
            console.log(`[DELETE CLASSE] ✓ Excluídas ${confirmacoesCount} confirmações`);
          }
        }
        
        // ===================================
        // PASSO 2: EXCLUIR SERVIÇOS DOS ALUNOS (via turmas)
        // ===================================
        let servicosCount = 0;
        if (existingClasse.tb_turmas.length > 0) {
          const turmaIds = existingClasse.tb_turmas.map(t => t.codigo);
          const servicosResult = await tx.tb_servico_aluno.deleteMany({
            where: { codigo_Turma: { in: turmaIds } }
          });
          servicosCount = servicosResult.count;
          if (servicosCount > 0) {
            console.log(`[DELETE CLASSE] ✓ Excluídos ${servicosCount} serviços de alunos`);
          }
        }
        
        // ===================================
        // PASSO 3: EXCLUIR RELAÇÕES DOCENTE-TURMA
        // ===================================
        let docenteTurmaCount = 0;
        if (existingClasse.tb_turmas.length > 0) {
          const turmaIds = existingClasse.tb_turmas.map(t => t.codigo);
          const docenteTurmaResult = await tx.tb_docente_turma.deleteMany({
            where: { codigo_turma: { in: turmaIds } }
          });
          docenteTurmaCount = docenteTurmaResult.count;
          if (docenteTurmaCount > 0) {
            console.log(`[DELETE CLASSE] ✓ Excluídas ${docenteTurmaCount} relações docente-turma`);
          }
        }
        
        // ===================================
        // PASSO 4: EXCLUIR SERVIÇOS DE TURMA
        // ===================================
        let servicosTurmaCount = 0;
        if (existingClasse.tb_turmas.length > 0) {
          const turmaIds = existingClasse.tb_turmas.map(t => t.codigo);
          const servicosTurmaResult = await tx.tb_servicos_turma.deleteMany({
            where: { codigoTurma: { in: turmaIds } }
          });
          servicosTurmaCount = servicosTurmaResult.count;
          if (servicosTurmaCount > 0) {
            console.log(`[DELETE CLASSE] ✓ Excluídos ${servicosTurmaCount} serviços de turma`);
          }
        }
        
        // ===================================
        // PASSO 5: EXCLUIR DIRETORES DE TURMA
        // ===================================
        let diretoresTurmaCount = 0;
        if (existingClasse.tb_turmas.length > 0) {
          const turmaIds = existingClasse.tb_turmas.map(t => t.codigo);
          const diretoresTurmaResult = await tx.tb_directores_turmas.deleteMany({
            where: { codigoTurma: { in: turmaIds } }
          });
          diretoresTurmaCount = diretoresTurmaResult.count;
          if (diretoresTurmaCount > 0) {
            console.log(`[DELETE CLASSE] ✓ Excluídos ${diretoresTurmaCount} diretores de turma`);
          }
        }
        
        // ===================================
        // PASSO 6: EXCLUIR GRADE CURRICULAR
        // ===================================
        // ===================================
        // PASSO 6: EXCLUIR GRADE CURRICULAR
        // ===================================
        const gradeCurricularCount = existingClasse.tb_grade_curricular.length;
        if (gradeCurricularCount > 0) {
          await tx.tb_grade_curricular.deleteMany({
            where: { codigo_Classe: parseInt(id) }
          });
          console.log(`[DELETE CLASSE] ✓ Excluídos ${gradeCurricularCount} itens da grade curricular`);
        }
        
        // ===================================
        // PASSO 7: EXCLUIR TURMAS
        // ===================================
        const turmasCount = existingClasse.tb_turmas.length;
        if (turmasCount > 0) {
          await tx.tb_turmas.deleteMany({
            where: { codigo_Classe: parseInt(id) }
          });
          console.log(`[DELETE CLASSE] ✓ Excluídas ${turmasCount} turmas`);
        }
        
        // ===================================
        // PASSO 8: EXCLUIR PROPINAS DA CLASSE
        // ===================================
        const propinaClasseResult = await tx.tb_propina_classe.deleteMany({
          where: { codigoClasse: parseInt(id) }
        });
        const propinaClasseCount = propinaClasseResult.count;
        if (propinaClasseCount > 0) {
          console.log(`[DELETE CLASSE] ✓ Excluídas ${propinaClasseCount} propinas da classe`);
        }
        
        // ===================================
        // PASSO 9: EXCLUIR LIMITES DE PAGAMENTO DA CLASSE
        // ===================================
        const limitePagamentoResult = await tx.tb_limite_pagamento_propina.deleteMany({
          where: { codigoClasse: parseInt(id) }
        });
        const limitePagamentoCount = limitePagamentoResult.count;
        if (limitePagamentoCount > 0) {
          console.log(`[DELETE CLASSE] ✓ Excluídos ${limitePagamentoCount} limites de pagamento`);
        }
        
        // ===================================
        // PASSO 10: EXCLUIR MESES DA CLASSE
        // ===================================
        // ===================================
        // PASSO 10: EXCLUIR MESES DA CLASSE
        // ===================================
        const mesesClasseResult = await tx.tb_meses_classe.deleteMany({
          where: { codigoClasse: parseInt(id) }
        });
        const mesesClasseCount = mesesClasseResult.count;
        if (mesesClasseCount > 0) {
          console.log(`[DELETE CLASSE] ✓ Excluídos ${mesesClasseCount} meses da classe`);
        }
        
        // ===================================
        // PASSO 11: EXCLUIR A CLASSE
        // ===================================
        await tx.tb_classes.delete({
          where: { codigo: parseInt(id) }
        });
        console.log('[DELETE CLASSE] ✓ Classe excluída');
        
        console.log('[DELETE CLASSE] ✓ Exclusão em cascata concluída com sucesso');
        
        return { 
          message: 'Classe e todas as dependências excluídas com sucesso',
          tipo: 'cascade_delete',
          detalhes: {
            classeNome: existingClasse.designacao,
            confirmacoes: confirmacoesCount,
            servicos: servicosCount,
            docenteTurma: docenteTurmaCount,
            servicosTurma: servicosTurmaCount,
            diretoresTurma: diretoresTurmaCount,
            gradeCurricular: gradeCurricularCount,
            turmas: turmasCount,
            propinaClasse: propinaClasseCount,
            limitePagamento: limitePagamentoCount,
            mesesClasse: mesesClasseCount
          }
        };
      }, {
        maxWait: 30000,
        timeout: 30000,
      });
      
      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('[DELETE CLASSE] ✗ Erro ao excluir classe em cascata:', error);
      console.error('Stack trace:', error.stack);
      throw new AppError(`Erro ao excluir classe e dependências: ${error.message}`, 500);
    }
  }

  // ===============================
  // DISCIPLINAS - CRUD COMPLETO
  // ===============================

  static async createDisciplina(data) {
    try {
      const { designacao, codigo_Curso, status, cadeiraEspecifica } = data;

      const cursoExists = await prisma.tb_cursos.findUnique({
        where: { codigo: parseInt(codigo_Curso) }
      });

      if (!cursoExists) {
        throw new AppError('Curso não encontrado', 404);
      }

      const existingDisciplina = await prisma.tb_disciplinas.findFirst({
        where: {
          designacao: designacao.trim(),
          codigo_Curso: parseInt(codigo_Curso)
        }
      });

      if (existingDisciplina) {
        throw new AppError('Já existe uma disciplina com esta designação neste curso', 409);
      }

      return await prisma.tb_disciplinas.create({
        data: {
          designacao: designacao.trim(),
          codigo_Curso: parseInt(codigo_Curso),
          status: status ? parseInt(status) : 1,
          cadeiraEspecifica: cadeiraEspecifica ? parseInt(cadeiraEspecifica) : 0
        },
        include: {
          tb_cursos: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro detalhado ao criar disciplina:', error);
      throw new AppError('Erro ao criar disciplina', 500);
    }
  }

  static async updateDisciplina(id, data) {
    try {
      const existingDisciplina = await prisma.tb_disciplinas.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingDisciplina) {
        throw new AppError('Disciplina não encontrada', 404);
      }

      if (data.codigo_Curso) {
        const cursoExists = await prisma.tb_cursos.findUnique({
          where: { codigo: parseInt(data.codigo_Curso) }
        });
        if (!cursoExists) throw new AppError('Curso não encontrado', 404);
      }

      const updateData = {};
      if (data.designacao !== undefined) updateData.designacao = data.designacao.trim();
      if (data.codigo_Curso !== undefined) updateData.codigo_Curso = parseInt(data.codigo_Curso);
      if (data.status !== undefined) updateData.status = parseInt(data.status);
      if (data.cadeiraEspecifica !== undefined) updateData.cadeiraEspecifica = parseInt(data.cadeiraEspecifica);

      return await prisma.tb_disciplinas.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_cursos: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar disciplina', 500);
    }
  }

  static async deleteDisciplina(id) {
    try {
      const existingDisciplina = await prisma.tb_disciplinas.findUnique({
        where: { codigo: parseInt(id) },
        include: { 
          tb_grade_curricular: {
            include: {
              tb_classes: { select: { designacao: true } },
              tb_cursos: { select: { designacao: true } },
              tb_disciplinas: { select: { designacao: true } }
            }
          },
          tb_cursos: { select: { designacao: true } }
        }
      });

      if (!existingDisciplina) {
        throw new AppError('Disciplina não encontrada', 404);
      }

      // TÉCNICA: CASCADE DELETE (Exclusão em Cascata)
      // Excluir a disciplina e todas as suas dependências em uma transação
      const result = await prisma.$transaction(async (tx) => {
        console.log(`[DELETE DISCIPLINA] Iniciando exclusão em cascata da disciplina ${id} - ${existingDisciplina.designacao}`);
        
        // ===================================
        // PASSO 1: EXCLUIR GRADE CURRICULAR
        // ===================================
        const gradeCurricularCount = existingDisciplina.tb_grade_curricular.length;
        if (gradeCurricularCount > 0) {
          await tx.tb_grade_curricular.deleteMany({
            where: { codigo_disciplina: parseInt(id) }
          });
          console.log(`[DELETE DISCIPLINA] ✓ Excluídos ${gradeCurricularCount} itens da grade curricular`);
        }
        
        // ===================================
        // PASSO 2: EXCLUIR A DISCIPLINA
        // ===================================
        await tx.tb_disciplinas.delete({
          where: { codigo: parseInt(id) }
        });
        console.log('[DELETE DISCIPLINA] ✓ Disciplina excluída');
        
        console.log('[DELETE DISCIPLINA] ✓ Exclusão em cascata concluída com sucesso');
        
        return { 
          message: 'Disciplina e todas as dependências excluídas com sucesso',
          tipo: 'cascade_delete',
          detalhes: {
            disciplinaNome: existingDisciplina.designacao,
            cursoNome: existingDisciplina.tb_cursos?.designacao || 'N/A',
            gradeCurricular: gradeCurricularCount
          }
        };
      }, {
        maxWait: 30000,
        timeout: 30000,
      });
      
      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('[DELETE DISCIPLINA] ✗ Erro ao excluir disciplina em cascata:', error);
      console.error('Stack trace:', error.stack);
      throw new AppError(`Erro ao excluir disciplina e dependências: ${error.message}`, 500);
    }
  }

  static async getDisciplinas(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search
        }
      } : {};

      const [disciplinas, total] = await Promise.all([
        prisma.tb_disciplinas.findMany({
          where,
          skip,
          take: limit,
          include: {
            tb_cursos: { select: { codigo: true, designacao: true } },
            tb_grade_curricular: { select: { codigo: true } }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_disciplinas.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: disciplinas,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      throw new AppError('Erro ao buscar disciplinas', 500);
    }
  }

  static async getDisciplinaById(id) {
    try {
      const disciplina = await prisma.tb_disciplinas.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_cursos: { select: { codigo: true, designacao: true } }
        }
      });

      if (!disciplina) {
        throw new AppError('Disciplina não encontrada', 404);
      }

      return disciplina;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar disciplina', 500);
    }
  }

  static async getDisciplineStatistics() {
    try {
      const [
        totalDisciplinas,
        disciplinasAtivas,
        disciplinasInativas,
        disciplinasEspecificas,
        disciplinasNaGrade
      ] = await Promise.all([
        // Total de disciplinas
        prisma.tb_disciplinas.count(),
        
        // Disciplinas ativas (status = 1)
        prisma.tb_disciplinas.count({
          where: { status: 1 }
        }),
        
        // Disciplinas inativas (status = 0 ou 4)
        prisma.tb_disciplinas.count({
          where: { 
            OR: [
              { status: 0 },
              { status: 4 }
            ]
          }
        }),
        
        // Disciplinas específicas (cadeiraEspecifica = 1)
        prisma.tb_disciplinas.count({
          where: { cadeiraEspecifica: 1 }
        }),
        

      ]);

      return {
        totalDisciplinas,
        disciplinasAtivas,
        disciplinasInativas,
        disciplinasEspecificas,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas de disciplinas:', error);
      throw new AppError('Erro ao buscar estatísticas de disciplinas', 500);
    }
  }

  // ===============================
  // SALAS - CRUD COMPLETO
  // ===============================

  static async createSala(data) {
    try {
      const { designacao } = data;

      const existingSala = await prisma.tb_salas.findFirst({
        where: {
          designacao: { equals: designacao.trim(), mode: 'insensitive' }
        }
      });

      if (existingSala) {
        throw new AppError('Já existe uma sala com esta designação', 409);
      }

      return await prisma.tb_salas.create({
        data: { designacao: designacao.trim() }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar sala', 500);
    }
  }

  static async updateSala(id, data) {
    try {
      const existingSala = await prisma.tb_salas.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingSala) {
        throw new AppError('Sala não encontrada', 404);
      }

      return await prisma.tb_salas.update({
        where: { codigo: parseInt(id) },
        data: { designacao: data.designacao.trim() }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar sala', 500);
    }
  }

  static async deleteSala(id) {
    try {
      const existingSala = await prisma.tb_salas.findUnique({
        where: { codigo: parseInt(id) },
        include: { tb_turmas: true }
      });

      if (!existingSala) {
        throw new AppError('Sala não encontrada', 404);
      }

      if (existingSala.tb_turmas.length > 0) {
        throw new AppError('Não é possível excluir esta sala pois possui turmas associadas', 400);
      }

      await prisma.tb_salas.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Sala excluída com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir sala', 500);
    }
  }

  static async getSalas(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};

      const [salas, total] = await Promise.all([
        prisma.tb_salas.findMany({
          where,
          skip,
          take: limit,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_salas.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: salas,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      throw new AppError('Erro ao buscar salas', 500);
    }
  }

  static async getSalaById(id) {
    try {
      const sala = await prisma.tb_salas.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!sala) {
        throw new AppError('Sala não encontrada', 404);
      }

      return sala;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar sala', 500);
    }
  }

  // ===============================
  // PERÍODOS - CRUD COMPLETO
  // ===============================

  static async createPeriodo(data) {
    try {
      const { designacao } = data;

      const existingPeriodo = await prisma.tb_periodos.findFirst({
        where: {
          designacao: { equals: designacao.trim(), mode: 'insensitive' }
        }
      });

      if (existingPeriodo) {
        throw new AppError('Já existe um período com esta designação', 409);
      }

      return await prisma.tb_periodos.create({
        data: { designacao: designacao.trim() }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar período', 500);
    }
  }

  static async updatePeriodo(id, data) {
    try {
      const existingPeriodo = await prisma.tb_periodos.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingPeriodo) {
        throw new AppError('Período não encontrado', 404);
      }

      return await prisma.tb_periodos.update({
        where: { codigo: parseInt(id) },
        data: { designacao: data.designacao.trim() }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar período', 500);
    }
  }

  static async deletePeriodo(id) {
    try {
      const existingPeriodo = await prisma.tb_periodos.findUnique({
        where: { codigo: parseInt(id) },
        include: { tb_turmas: true }
      });

      if (!existingPeriodo) {
        throw new AppError('Período não encontrado', 404);
      }

      if (existingPeriodo.tb_turmas.length > 0) {
        throw new AppError('Não é possível excluir este período pois possui turmas associadas', 400);
      }

      await prisma.tb_periodos.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Período excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir período', 500);
    }
  }

  static async getPeriodos(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};

      const [periodos, total] = await Promise.all([
        prisma.tb_periodos.findMany({
          where,
          skip,
          take: limit,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_periodos.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: periodos,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      throw new AppError('Erro ao buscar períodos', 500);
    }
  }

  static async getPeriodoById(id) {
    try {
      const periodo = await prisma.tb_periodos.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!periodo) {
        throw new AppError('Período não encontrado', 404);
      }

      return periodo;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar período', 500);
    }
  }

  // ===============================
  // TURMAS - CRUD COMPLETO
  // ===============================

  static async createTurma(data) {
    try {
      const {
        designacao, codigo_Classe, codigo_Curso, codigo_Sala,
        codigo_Periodo, status, codigo_AnoLectivo, max_Alunos
      } = data;

      // Verificar entidades relacionadas
      const [classe, curso, sala, periodo] = await Promise.all([
        prisma.tb_classes.findUnique({ where: { codigo: parseInt(codigo_Classe) } }),
        prisma.tb_cursos.findUnique({ where: { codigo: parseInt(codigo_Curso) } }),
        prisma.tb_salas.findUnique({ where: { codigo: parseInt(codigo_Sala) } }),
        prisma.tb_periodos.findUnique({ where: { codigo: parseInt(codigo_Periodo) } })
      ]);

      if (!classe) throw new AppError('Classe não encontrada', 404);
      if (!curso) throw new AppError('Curso não encontrado', 404);
      if (!sala) throw new AppError('Sala não encontrada', 404);
      if (!periodo) throw new AppError('Período não encontrado', 404);

      const existingTurma = await prisma.tb_turmas.findFirst({
        where: {
          designacao: designacao.trim()
        }
      });

      if (existingTurma) {
        throw new AppError('Já existe uma turma com esta designação', 409);
      }

      return await prisma.tb_turmas.create({
        data: {
          designacao: designacao.trim(),
          codigo_Classe: parseInt(codigo_Classe),
          codigo_Curso: parseInt(codigo_Curso),
          codigo_Sala: parseInt(codigo_Sala),
          codigo_Periodo: parseInt(codigo_Periodo),
          status: status?.trim() || "Activo",
          codigo_AnoLectivo: codigo_AnoLectivo ? parseInt(codigo_AnoLectivo) : 1,
          max_Alunos: max_Alunos ? parseInt(max_Alunos) : 30
        },
        include: {
          tb_classes: { select: { codigo: true, designacao: true } },
          tb_cursos: { select: { codigo: true, designacao: true } },
          tb_salas: { select: { codigo: true, designacao: true } },
          tb_periodos: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro detalhado ao criar turma:', error);
      throw new AppError(`Erro ao criar turma: ${error.message}`, 500);
    }
  }

  static async updateTurma(id, data) {
    try {
      const existingTurma = await prisma.tb_turmas.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingTurma) {
        throw new AppError('Turma não encontrada', 404);
      }

      const updateData = {};
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (key === 'designacao' || key === 'status') {
            updateData[key] = data[key].trim();
          } else if (['codigo_Classe', 'codigo_Curso', 'codigo_Sala', 'codigo_Periodo', 'codigo_AnoLectivo', 'max_Alunos'].includes(key)) {
            updateData[key] = parseInt(data[key]);
          }
        }
      });

      return await prisma.tb_turmas.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_classes: { select: { codigo: true, designacao: true } },
          tb_cursos: { select: { codigo: true, designacao: true } },
          tb_salas: { select: { codigo: true, designacao: true } },
          tb_periodos: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar turma', 500);
    }
  }

  static async deleteTurma(id) {
    try {
      const existingTurma = await prisma.tb_turmas.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_classes: { select: { designacao: true } },
          tb_cursos: { select: { designacao: true } },
          tb_salas: { select: { designacao: true } },
          tb_periodos: { select: { designacao: true } }
        }
      });

      if (!existingTurma) {
        throw new AppError('Turma não encontrada', 404);
      }

      // TÉCNICA: CASCADE DELETE (Exclusão em Cascata)
      const result = await prisma.$transaction(async (tx) => {
        console.log(`[DELETE TURMA] Iniciando exclusão em cascata da turma ${id} - ${existingTurma.designacao}`);
        
        const turmaId = parseInt(id);
        
        // ===================================
        // PASSO 1: EXCLUIR CONFIRMAÇÕES
        // ===================================
        const confirmacoesResult = await tx.tb_confirmacoes.deleteMany({
          where: { codigo_Turma: turmaId }
        });
        const confirmacoesCount = confirmacoesResult.count;
        if (confirmacoesCount > 0) {
          console.log(`[DELETE TURMA] ✓ Excluídas ${confirmacoesCount} confirmações`);
        }
        
        // ===================================
        // PASSO 2: EXCLUIR SERVIÇOS DE ALUNOS
        // ===================================
        const servicosResult = await tx.tb_servico_aluno.deleteMany({
          where: { codigo_Turma: turmaId }
        });
        const servicosCount = servicosResult.count;
        if (servicosCount > 0) {
          console.log(`[DELETE TURMA] ✓ Excluídos ${servicosCount} serviços de alunos`);
        }
        
        // ===================================
        // PASSO 3: EXCLUIR RELAÇÕES DOCENTE-TURMA
        // ===================================
        const docenteTurmaResult = await tx.tb_docente_turma.deleteMany({
          where: { codigo_turma: turmaId }
        });
        const docenteTurmaCount = docenteTurmaResult.count;
        if (docenteTurmaCount > 0) {
          console.log(`[DELETE TURMA] ✓ Excluídas ${docenteTurmaCount} relações docente-turma`);
        }
        
        // ===================================
        // PASSO 4: EXCLUIR SERVIÇOS DE TURMA
        // ===================================
        const servicosTurmaResult = await tx.tb_servicos_turma.deleteMany({
          where: { codigoTurma: turmaId }
        });
        const servicosTurmaCount = servicosTurmaResult.count;
        if (servicosTurmaCount > 0) {
          console.log(`[DELETE TURMA] ✓ Excluídos ${servicosTurmaCount} serviços de turma`);
        }
        
        // ===================================
        // PASSO 5: EXCLUIR DIRETORES DE TURMA
        // ===================================
        const diretoresTurmaResult = await tx.tb_directores_turmas.deleteMany({
          where: { codigoTurma: turmaId }
        });
        const diretoresTurmaCount = diretoresTurmaResult.count;
        if (diretoresTurmaCount > 0) {
          console.log(`[DELETE TURMA] ✓ Excluídos ${diretoresTurmaCount} diretores de turma`);
        }
        
        // ===================================
        // PASSO 6: EXCLUIR PERMISSÕES DE TURMA-UTILIZADOR
        // ===================================
        const permissoesResult = await tx.tb_permissao_turma_utilizador.deleteMany({
          where: { codigoTurma: turmaId }
        });
        const permissoesCount = permissoesResult.count;
        if (permissoesCount > 0) {
          console.log(`[DELETE TURMA] ✓ Excluídas ${permissoesCount} permissões de turma`);
        }
        
        // ===================================
        // PASSO 7: EXCLUIR A TURMA
        // ===================================
        await tx.tb_turmas.delete({
          where: { codigo: turmaId }
        });
        console.log('[DELETE TURMA] ✓ Turma excluída');
        
        console.log('[DELETE TURMA] ✓ Exclusão em cascata concluída com sucesso');
        
        return {
          message: 'Turma e todas as dependências excluídas com sucesso',
          tipo: 'cascade_delete',
          detalhes: {
            turmaNome: existingTurma.designacao,
            confirmacoes: confirmacoesCount,
            servicos: servicosCount,
            docenteTurma: docenteTurmaCount,
            servicosTurma: servicosTurmaCount,
            diretoresTurma: diretoresTurmaCount,
            permissoes: permissoesCount
          }
        };
      }, {
        maxWait: 30000,
        timeout: 30000,
      });
      
      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('[DELETE TURMA] ✗ Erro ao excluir turma em cascata:', error);
      console.error('Stack trace:', error.stack);
      throw new AppError(`Erro ao excluir turma e dependências: ${error.message}`, 500);
    }
  }

  static async getTurmas(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search
        }
      } : {};

      const [turmas, total] = await Promise.all([
        prisma.tb_turmas.findMany({
          where,
          skip,
          take: limit,
          include: {
            tb_classes: { select: { codigo: true, designacao: true } },
            tb_cursos: { select: { codigo: true, designacao: true } },
            tb_salas: { select: { codigo: true, designacao: true } },
            tb_periodos: { select: { codigo: true, designacao: true } }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_turmas.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: turmas,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      throw new AppError('Erro ao buscar turmas', 500);
    }
  }

  static async getTurmaById(id) {
    try {
      const turma = await prisma.tb_turmas.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_classes: { select: { codigo: true, designacao: true } },
          tb_cursos: { select: { codigo: true, designacao: true } },
          tb_salas: { select: { codigo: true, designacao: true } },
          tb_periodos: { select: { codigo: true, designacao: true } }
        }
      });

      if (!turma) {
        throw new AppError('Turma não encontrada', 404);
      }

      return turma;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar turma', 500);
    }
  }

  // ===============================
  // GRADE CURRICULAR - CRUD COMPLETO
  // ===============================

  static async createGradeCurricular(data) {
    try {
      const {
        codigo_disciplina, codigo_Classe, codigo_Curso,
        codigo_user, codigo_empresa, status, codigoTipoNota
      } = data;

      // Verificar entidades relacionadas
      const [disciplina, classe, curso] = await Promise.all([
        prisma.tb_disciplinas.findUnique({ where: { codigo: parseInt(codigo_disciplina) } }),
        prisma.tb_classes.findUnique({ where: { codigo: parseInt(codigo_Classe) } }),
        prisma.tb_cursos.findUnique({ where: { codigo: parseInt(codigo_Curso) } })
      ]);

      if (!disciplina) throw new AppError('Disciplina não encontrada', 404);
      if (!classe) throw new AppError('Classe não encontrada', 404);
      if (!curso) throw new AppError('Curso não encontrado', 404);

      // Verificar se já existe essa combinação
      const existingGrade = await prisma.tb_grade_curricular.findFirst({
        where: {
          codigo_disciplina: parseInt(codigo_disciplina),
          codigo_Classe: parseInt(codigo_Classe),
          codigo_Curso: parseInt(codigo_Curso)
        }
      });

      if (existingGrade) {
        throw new AppError('Esta disciplina já está na grade curricular para esta classe e curso', 409);
      }

      return await prisma.tb_grade_curricular.create({
        data: {
          codigo_disciplina: parseInt(codigo_disciplina),
          codigo_Classe: parseInt(codigo_Classe),
          codigo_Curso: parseInt(codigo_Curso),
          codigo_user: parseInt(codigo_user),
          codigo_empresa: parseInt(codigo_empresa),
          status: parseInt(status),
          codigoTipoNota: parseInt(codigoTipoNota)
        },
        include: {
          tb_disciplinas: { select: { codigo: true, designacao: true } },
          tb_classes: { select: { codigo: true, designacao: true } },
          tb_cursos: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar grade curricular', 500);
    }
  }

  static async createGradeCurricularByTurma(data) {
    try {
      const { turmaId, disciplinas } = data;

      // Buscar informações da turma
      const turma = await prisma.tb_turmas.findUnique({
        where: { codigo: parseInt(turmaId) },
        include: {
          tb_classes: true,
          tb_cursos: true
        }
      });

      if (!turma) {
        throw new AppError('Turma não encontrada', 404);
      }

      // Verificar se as disciplinas existem
      const disciplinasExistentes = await prisma.tb_disciplinas.findMany({
        where: {
          codigo: { in: disciplinas.map(d => parseInt(d)) }
        }
      });

      if (disciplinasExistentes.length !== disciplinas.length) {
        throw new AppError('Uma ou mais disciplinas não foram encontradas', 404);
      }

      // Verificar se já existem disciplinas na grade curricular desta turma
      const disciplinasExistentesGrade = await prisma.tb_grade_curricular.findMany({
        where: {
          codigo_Turma: parseInt(turmaId),
          codigo_disciplina: { in: disciplinas.map(d => parseInt(d)) }
        }
      });

      if (disciplinasExistentesGrade.length > 0) {
        const disciplinasConflito = disciplinasExistentesGrade.map(d => d.codigo_disciplina);
        throw new AppError(`Algumas disciplinas já estão na grade curricular desta turma: ${disciplinasConflito.join(', ')}`, 409);
      }

      // Criar registros na grade curricular
      const dadosParaCriar = disciplinas.map(disciplinaId => ({
        codigo_disciplina: parseInt(disciplinaId),
        codigo_Classe: turma.codigo_Classe,
        codigo_Curso: turma.codigo_Curso,
        codigo_Turma: parseInt(turmaId),
        codigo_user: 1, // Usuário padrão
        codigo_empresa: 1, // Empresa padrão
        status: 1, // Status ativo
        codigoTipoNota: 1 // Tipo de nota padrão
      }));

      const resultado = await prisma.tb_grade_curricular.createMany({
        data: dadosParaCriar
      });

      return {
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
      };
    } catch (error) {
      console.error('Erro detalhado ao criar grade curricular por turma:', error);
      if (error instanceof AppError) throw error;
      throw new AppError(`Erro ao criar grade curricular por turma: ${error.message}`, 500);
    }
  }

  static async updateGradeCurricular(id, data) {
    try {
      const existingGrade = await prisma.tb_grade_curricular.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingGrade) {
        throw new AppError('Grade curricular não encontrada', 404);
      }

      const updateData = {};
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          updateData[key] = parseInt(data[key]);
        }
      });

      return await prisma.tb_grade_curricular.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_disciplinas: { select: { codigo: true, designacao: true } },
          tb_classes: { select: { codigo: true, designacao: true } },
          tb_cursos: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar grade curricular', 500);
    }
  }

  static async deleteGradeCurricular(id) {
    try {
      const existingGrade = await prisma.tb_grade_curricular.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingGrade) {
        throw new AppError('Grade curricular não encontrada', 404);
      }

      await prisma.tb_grade_curricular.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Grade curricular excluída com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir grade curricular', 500);
    }
  }

  static async getGradeCurricular(page = 1, limit = 10, search = '') {
    try {
      // Buscar todas as grades curriculares agrupadas por turma/classe/curso
      const gradesRaw = await prisma.tb_grade_curricular.findMany({
        include: {
          tb_disciplinas: { select: { codigo: true, designacao: true } },
          tb_classes: { select: { codigo: true, designacao: true } },
          tb_cursos: { select: { codigo: true, designacao: true } },
          tb_turmas: { select: { codigo: true, designacao: true } }
        },
        orderBy: [
          { tb_cursos: { designacao: 'asc' } },
          { tb_classes: { designacao: 'asc' } },
          { tb_turmas: { designacao: 'asc' } }
        ]
      });

      // Agrupar por turma/classe/curso
      const gradesAgrupadas = {};
      
      gradesRaw.forEach(grade => {
        const chave = `${grade.tb_cursos.designacao}-${grade.tb_classes.designacao}${grade.tb_turmas ? `-${grade.tb_turmas.designacao}` : ''}`;
        
        if (!gradesAgrupadas[chave]) {
          gradesAgrupadas[chave] = {
            curso: grade.tb_cursos.designacao,
            classe: grade.tb_classes.designacao,
            turma: grade.tb_turmas?.designacao || null,
            disciplinas: []
          };
        }
        
        gradesAgrupadas[chave].disciplinas.push({
          codigo: grade.codigo,
          disciplina: {
            codigo: grade.tb_disciplinas.codigo,
            designacao: grade.tb_disciplinas.designacao
          }
        });
      });

      // Converter para array
      const gradesArray = Object.values(gradesAgrupadas);

      // Aplicar filtro de busca se necessário
      const gradesFiltradas = search ? 
        gradesArray.filter(grade => 
          grade.curso.toLowerCase().includes(search.toLowerCase()) ||
          grade.classe.toLowerCase().includes(search.toLowerCase()) ||
          (grade.turma && grade.turma.toLowerCase().includes(search.toLowerCase())) ||
          grade.disciplinas.some(d => d.disciplina.designacao.toLowerCase().includes(search.toLowerCase()))
        ) : gradesArray;

      // Aplicar paginação
      const skip = (page - 1) * limit;
      const gradesPaginadas = gradesFiltradas.slice(skip, skip + limit);
      const total = gradesFiltradas.length;
      const totalPages = Math.ceil(total / limit);

      return {
        data: gradesPaginadas,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      console.error('Erro ao buscar grade curricular:', error);
      throw new AppError('Erro ao buscar grade curricular', 500);
    }
  }

  static async getGradeCurricularById(id) {
    try {
      const gradeCurricular = await prisma.tb_grade_curricular.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_disciplinas: { select: { codigo: true, designacao: true } },
          tb_classes: { select: { codigo: true, designacao: true } },
          tb_cursos: { select: { codigo: true, designacao: true } }
        }
      });

      if (!gradeCurricular) {
        throw new AppError('Grade curricular não encontrada', 404);
      }

      return gradeCurricular;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar grade curricular', 500);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getGradeByCursoAndClasse(codigo_Curso, codigo_Classe) {
    try {
      return await prisma.tb_grade_curricular.findMany({
        where: {
          codigo_Curso: parseInt(codigo_Curso),
          codigo_Classe: parseInt(codigo_Classe)
        },
        include: {
          tb_disciplinas: { select: { codigo: true, designacao: true } },
          tb_classes: { select: { codigo: true, designacao: true } },
          tb_cursos: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar grade curricular', 500);
    }
  }

  static async getTurmasByAnoLectivo(codigo_AnoLectivo) {
    try {
      return await prisma.tb_turmas.findMany({
        where: { codigo_AnoLectivo: parseInt(codigo_AnoLectivo) },
        include: {
          tb_classes: { select: { codigo: true, designacao: true } },
          tb_cursos: { select: { codigo: true, designacao: true } },
          tb_salas: { select: { codigo: true, designacao: true } },
          tb_periodos: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar turmas do ano letivo', 500);
    }
  }

  static async getDisciplinasByCurso(codigo_Curso) {
    try {
      return await prisma.tb_disciplinas.findMany({
        where: { codigo_Curso: parseInt(codigo_Curso) },
        include: {
          tb_cursos: { select: { codigo: true, designacao: true } }
        },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar disciplinas do curso', 500);
    }
  }

  static async getTurmasByClasseAndCurso(codigo_Classe, codigo_Curso) {
    try {
      return await prisma.tb_turmas.findMany({
        where: {
          codigo_Classe: parseInt(codigo_Classe),
          codigo_Curso: parseInt(codigo_Curso)
        },
        include: {
          tb_classes: { select: { codigo: true, designacao: true } },
          tb_cursos: { select: { codigo: true, designacao: true } },
          tb_salas: { select: { codigo: true, designacao: true } },
          tb_periodos: { select: { codigo: true, designacao: true } }
        },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar turmas por classe e curso', 500);
    }
  }

  // ===============================
  // RELATÓRIOS DE ALUNOS POR TURMA
  // ===============================

  static async getAlunosByTurma(turmaId) {
    try {
      // Primeiro verificar se a turma existe
      const turma = await prisma.tb_turmas.findUnique({
        where: { codigo: turmaId }
      });

      if (!turma) {
        throw new AppError('Turma não encontrada', 404);
      }

      // Buscar alunos matriculados na turma através das confirmações
      const confirmacoes = await prisma.tb_confirmacoes.findMany({
        where: {
          codigo_Turma: turmaId,
          codigo_Status: 1 // Apenas confirmações ativas
        },
        include: {
          tb_matriculas: {
            include: {
              tb_alunos: {
                select: {
                  codigo: true,
                  nome: true,
                  n_documento_identificacao: true,
                  email: true,
                  telefone: true,
                  dataNascimento: true,
                  sexo: true
                }
              }
            }
          }
        }
      });

      // Extrair dados dos alunos e remover duplicatas
      const alunosMap = new Map();
      confirmacoes.forEach(confirmacao => {
        const aluno = confirmacao.tb_matriculas?.tb_alunos;
        if (aluno && !alunosMap.has(aluno.codigo)) {
          alunosMap.set(aluno.codigo, {
            codigo: aluno.codigo,
            nome: aluno.nome,
            numero_documento: aluno.n_documento_identificacao,
            email: aluno.email,
            telefone: aluno.telefone,
            data_nascimento: aluno.dataNascimento,
            genero: aluno.sexo
          });
        }
      });

      return Array.from(alunosMap.values()).sort((a, b) => a.nome.localeCompare(b.nome));
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao buscar alunos da turma:', error);
      throw new AppError('Erro ao buscar alunos da turma', 500);
    }
  }

  static async getRelatorioCompletoTurmas(anoLectivoId) {
    try {
      // Construir filtros
      const where = {
        OR: [
          { status: 'Ativo' },
          { status: 'Activo' } // Variação encontrada no banco
        ]
      };
      
      // Adicionar filtro de ano letivo se fornecido
      if (anoLectivoId) {
        where.codigo_AnoLectivo = parseInt(anoLectivoId);
      }
      
      // Buscar turmas com filtros
      const turmas = await prisma.tb_turmas.findMany({
        where,
        include: {
          tb_classes: { select: { designacao: true } },
          tb_cursos: { select: { designacao: true } },
          tb_salas: { select: { designacao: true } },
          tb_periodos: { select: { designacao: true } }
        },
        orderBy: [
          { tb_classes: { designacao: 'asc' } },
          { designacao: 'asc' }
        ]
      });

      // Para cada turma, buscar seus alunos
      const relatorioCompleto = [];
      
      for (const turma of turmas) {
        try {
          const alunos = await this.getAlunosByTurma(turma.codigo);
          
          relatorioCompleto.push({
            turma: {
              codigo: turma.codigo,
              designacao: turma.designacao,
              tb_classes: turma.tb_classes,
              tb_cursos: turma.tb_cursos,
              tb_salas: turma.tb_salas,
              tb_periodos: turma.tb_periodos
            },
            alunos: alunos
          });
        } catch (error) {
          console.error(`Erro ao buscar alunos da turma ${turma.designacao}:`, error);
          // Continuar com as outras turmas mesmo se uma falhar
          relatorioCompleto.push({
            turma: {
              codigo: turma.codigo,
              designacao: turma.designacao,
              tb_classes: turma.tb_classes,
              tb_cursos: turma.tb_cursos,
              tb_salas: turma.tb_salas,
              tb_periodos: turma.tb_periodos
            },
            alunos: []
          });
        }
      }

      return relatorioCompleto;
    } catch (error) {
      console.error('Erro ao gerar relatório completo:', error);
      throw new AppError('Erro ao gerar relatório completo de turmas', 500);
    }
  }

  /**
   * Buscar alunos de uma turma específica
   */
  static async getAlunosByTurma(turmaId) {
    try {
      // Verificar se a turma existe
      const turma = await prisma.tb_turmas.findUnique({
        where: { codigo: turmaId }
      });

      if (!turma) {
        throw new AppError('Turma não encontrada', 404);
      }

      // Buscar alunos confirmados na turma
      const confirmacoes = await prisma.tb_confirmacoes.findMany({
        where: {
          codigo_Turma: turmaId
        },
        include: {
          tb_matriculas: {
            include: {
              tb_alunos: true
            }
          }
        }
      });

      // Extrair dados dos alunos
      const alunos = confirmacoes.map(confirmacao => {
        const aluno = confirmacao.tb_matriculas.tb_alunos;
        return {
          codigo: aluno.codigo,
          nome: aluno.nome,
          numero_documento: aluno.n_documento_identificacao || aluno.numero_documento || aluno.bi || aluno.documento || 'N/A',
          email: aluno.email || 'N/A',
          telefone: aluno.telefone || 'N/A',
          data_nascimento: aluno.dataNascimento,
          genero: aluno.sexo
        };
      });

      return alunos;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao buscar alunos da turma:', error);
      throw new AppError('Erro interno ao buscar alunos da turma', 500);
    }
  }

  // ===============================
  // SALAS - CRUD COMPLETO
  // ===============================

  static async createSala(data) {
    try {
      const { designacao } = data;

      // Verificar se já existe uma sala com a mesma designação
      const existingSala = await prisma.tb_salas.findFirst({
        where: {
          designacao: designacao.trim()
        }
      });

      if (existingSala) {
        throw new AppError('Já existe uma sala com esta designação', 409);
      }

      return await prisma.tb_salas.create({
        data: {
          designacao: designacao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao criar sala:', error);
      throw new AppError('Erro interno ao criar sala', 500);
    }
  }

  static async getSalas({ page = 1, limit = 10, search = '' }) {
    try {
      const offset = (page - 1) * limit;

      // Construir filtros
      const where = {};
      if (search) {
        where.designacao = {
          contains: search
        };
      }

      // Buscar salas com paginação
      const [salas, total] = await Promise.all([
        prisma.tb_salas.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: {
            codigo: 'desc'
          }
        }),
        prisma.tb_salas.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: salas,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
      throw new AppError('Erro interno ao buscar salas', 500);
    }
  }

  static async getSalaById(id) {
    try {
      const sala = await prisma.tb_salas.findUnique({
        where: {
          codigo: id
        }
      });

      return sala;
    } catch (error) {
      console.error('Erro ao buscar sala por ID:', error);
      throw new AppError('Erro interno ao buscar sala', 500);
    }
  }

  static async updateSala(id, data) {
    try {
      const { designacao } = data;

      // Verificar se a sala existe
      const existingSala = await prisma.tb_salas.findUnique({
        where: {
          codigo: id
        }
      });

      if (!existingSala) {
        throw new AppError('Sala não encontrada', 404);
      }

      // Verificar se já existe outra sala com a mesma designação
      if (designacao && designacao.trim() !== existingSala.designacao) {
        const duplicateSala = await prisma.tb_salas.findFirst({
          where: {
            designacao: designacao.trim(),
            codigo: {
              not: id
            }
          }
        });

        if (duplicateSala) {
          throw new AppError('Já existe uma sala com esta designação', 409);
        }
      }

      return await prisma.tb_salas.update({
        where: {
          codigo: id
        },
        data: {
          ...(designacao && { designacao: designacao.trim() })
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao atualizar sala:', error);
      throw new AppError('Erro interno ao atualizar sala', 500);
    }
  }

  static async deleteSala(id) {
    try {
      // Verificar se a sala existe
      const existingSala = await prisma.tb_salas.findUnique({
        where: {
          codigo: id
        }
      });

      if (!existingSala) {
        throw new AppError('Sala não encontrada', 404);
      }

      // Verificar se há turmas usando esta sala
      const turmasUsandoSala = await prisma.tb_turmas.findMany({
        where: {
          codigo_Sala: id
        }
      });

      if (turmasUsandoSala.length > 0) {
        throw new AppError(`Não é possível excluir esta sala pois existem ${turmasUsandoSala.length} turma(s) utilizando-a`, 400);
      }

      await prisma.tb_salas.delete({
        where: {
          codigo: id
        }
      });

      return { success: true };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir sala:', error);
      throw new AppError('Erro interno ao excluir sala', 500);
    }
  }
}
