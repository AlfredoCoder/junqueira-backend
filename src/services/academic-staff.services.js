// services/academic-staff.services.js
import prisma from '../config/database.js';
import { AppError } from '../utils/validation.utils.js';

export class AcademicStaffService {
  // ===============================
  // ESPECIALIDADES - CRUD COMPLETO
  // ===============================

  static async createEspecialidade(data) {
    try {
      const { designacao } = data;

      const existingEspecialidade = await prisma.tb_especialidade.findFirst({
        where: {
          designacao: designacao.trim()
        }
      });

      if (existingEspecialidade) {
        throw new AppError('Já existe uma especialidade com esta designação', 409);
      }

      return await prisma.tb_especialidade.create({
        data: {
          designacao: designacao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar especialidade', 500);
    }
  }

  static async updateEspecialidade(id, data) {
    try {
      const existingEspecialidade = await prisma.tb_especialidade.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingEspecialidade) {
        throw new AppError('Especialidade não encontrada', 404);
      }

      if (data.designacao) {
        const duplicateEspecialidade = await prisma.tb_especialidade.findFirst({
          where: {
            designacao: data.designacao.trim(),
            codigo: { not: parseInt(id) }
          }
        });

        if (duplicateEspecialidade) {
          throw new AppError('Já existe uma especialidade com esta designação', 409);
        }
      }

      return await prisma.tb_especialidade.update({
        where: { codigo: parseInt(id) },
        data: { designacao: data.designacao.trim() }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar especialidade', 500);
    }
  }

  static async getEspecialidades(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search
        }
      } : {};

      const [especialidades, total] = await Promise.all([
        prisma.tb_especialidade.findMany({
          where,
          skip,
          take: limit,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_especialidade.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: especialidades,
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
      throw new AppError('Erro ao buscar especialidades', 500);
    }
  }

  static async getEspecialidadeById(id) {
    try {
      const especialidade = await prisma.tb_especialidade.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!especialidade) {
        throw new AppError('Especialidade não encontrada', 404);
      }

      return especialidade;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar especialidade', 500);
    }
  }

  static async deleteEspecialidade(id) {
    try {
      const existingEspecialidade = await prisma.tb_especialidade.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_docente: true
        }
      });

      if (!existingEspecialidade) {
        throw new AppError('Especialidade não encontrada', 404);
      }

      if (existingEspecialidade.tb_docente.length > 0) {
        throw new AppError('Não é possível excluir esta especialidade pois possui docentes associados', 400);
      }

      await prisma.tb_especialidade.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Especialidade excluída com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir especialidade', 500);
    }
  }

  // ===============================
  // DOCENTES - CRUD COMPLETO
  // ===============================

  static async createDocente(data) {
    try {
      const {
        nome, status, codigo_disciplina, codigo_Utilizador, 
        codigo_Especialidade, contacto, email, user_id
      } = data;

      // Verificar entidades relacionadas se fornecidas
      if (codigo_disciplina) {
        const disciplinaExists = await prisma.tb_disciplinas.findUnique({
          where: { codigo: parseInt(codigo_disciplina) }
        });
        if (!disciplinaExists) throw new AppError('Disciplina não encontrada', 404);
      }

      if (codigo_Utilizador) {
        const utilizadorExists = await prisma.tb_utilizadores.findUnique({
          where: { codigo: parseInt(codigo_Utilizador) }
        });
        if (!utilizadorExists) throw new AppError('Utilizador não encontrado', 404);
      }

      if (codigo_Especialidade) {
        const especialidadeExists = await prisma.tb_especialidade.findUnique({
          where: { codigo: parseInt(codigo_Especialidade) }
        });
        if (!especialidadeExists) throw new AppError('Especialidade não encontrada', 404);
      }

      return await prisma.tb_docente.create({
        data: {
          nome: nome?.trim() || "teste",
          status: status ? parseInt(status) : 1,
          codigo_disciplina: codigo_disciplina ? parseInt(codigo_disciplina) : null,
          codigo_Utilizador: codigo_Utilizador ? parseInt(codigo_Utilizador) : null,
          codigo_Especialidade: codigo_Especialidade ? parseInt(codigo_Especialidade) : null,
          contacto: contacto?.trim() || null,
          email: email?.trim() || null,
          user_id: user_id ? BigInt(user_id) : BigInt(1)
        },
        include: {
          tb_disciplinas: { select: { codigo: true, designacao: true } },
          tb_utilizadores: { select: { codigo: true, nome: true } },
          tb_especialidade: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro detalhado ao criar docente:', error);
      throw new AppError('Erro ao criar docente', 500);
    }
  }

  static async updateDocente(id, data) {
    try {
      const existingDocente = await prisma.tb_docente.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingDocente) {
        throw new AppError('Docente não encontrado', 404);
      }

      // Verificar entidades relacionadas se fornecidas
      if (data.codigo_disciplina) {
        const disciplinaExists = await prisma.tb_disciplinas.findUnique({
          where: { codigo: parseInt(data.codigo_disciplina) }
        });
        if (!disciplinaExists) throw new AppError('Disciplina não encontrada', 404);
      }

      if (data.codigo_Utilizador) {
        const utilizadorExists = await prisma.tb_utilizadores.findUnique({
          where: { codigo: parseInt(data.codigo_Utilizador) }
        });
        if (!utilizadorExists) throw new AppError('Utilizador não encontrado', 404);
      }

      if (data.codigo_Especialidade) {
        const especialidadeExists = await prisma.tb_especialidade.findUnique({
          where: { codigo: parseInt(data.codigo_Especialidade) }
        });
        if (!especialidadeExists) throw new AppError('Especialidade não encontrada', 404);
      }

      const updateData = {};
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          switch (key) {
            case 'nome':
            case 'contacto':
            case 'email':
              updateData[key] = data[key].trim();
              break;
            case 'status':
            case 'codigo_disciplina':
            case 'codigo_Utilizador':
            case 'codigo_Especialidade':
              updateData[key] = parseInt(data[key]);
              break;
            case 'user_id':
              updateData[key] = BigInt(data[key]);
              break;
          }
        }
      });

      return await prisma.tb_docente.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_disciplinas: { select: { codigo: true, designacao: true } },
          tb_utilizadores: { select: { codigo: true, nome: true } },
          tb_especialidade: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar docente', 500);
    }
  }

  static async getDocentes(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      // MySQL não suporta mode: 'insensitive', então removemos
      const where = search ? {
        OR: [
          {
            nome: {
              contains: search
            }
          },
          {
            email: {
              contains: search
            }
          },
          {
            contacto: {
              contains: search
            }
          }
        ]
      } : {};

      const [docentes, total] = await Promise.all([
        prisma.tb_docente.findMany({
          where,
          skip,
          take: parseInt(limit),
          include: {
            tb_disciplinas: true,
            tb_especialidade: true,
            _count: {
              select: { 
                tb_disciplinas_docente: true,
                tb_directores_turmas: true,
                tb_docente_turma: true
              }
            }
          },
          orderBy: { nome: 'asc' }
        }),
        prisma.tb_docente.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: docentes,
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
      console.error('Erro detalhado ao buscar docentes:', error);
      console.error('Parâmetros de busca:', { page, limit, search });
      throw new AppError(`Erro ao buscar docentes: ${error.message}`, 500);
    }
  }

  static async getDocenteById(id) {
    try {
      // Implementando abordagem step-by-step baseada na memória para evitar erros de includes complexos
      let docente;
      
      try {
        // Primeira tentativa com includes completos
        docente = await prisma.tb_docente.findUnique({
          where: { codigo: parseInt(id) },
          include: {
            tb_disciplinas: { select: { codigo: true, designacao: true } },
            tb_utilizadores: { select: { codigo: true, nome: true } },
            tb_especialidade: { select: { codigo: true, designacao: true } },
            tb_disciplinas_docente: {
              select: { codigo: true, codigoCurso: true, codigoDisciplina: true },
              take: 5
            },
            tb_directores_turmas: {
              select: { codigo: true, designacao: true, codigoTurma: true },
              take: 5
            }
          }
        });
      } catch (includeError) {
        console.error('Erro com includes complexos, tentando abordagem simples:', includeError);
        
        // Fallback: busca simples primeiro
        docente = await prisma.tb_docente.findUnique({
          where: { codigo: parseInt(id) }
        });
        
        if (docente) {
          // Buscar relacionamentos separadamente se necessário
          try {
            const [disciplina, utilizador, especialidade] = await Promise.all([
              docente.codigo_disciplina ? prisma.tb_disciplinas.findUnique({
                where: { codigo: docente.codigo_disciplina },
                select: { codigo: true, designacao: true }
              }) : null,
              docente.codigo_Utilizador ? prisma.tb_utilizadores.findUnique({
                where: { codigo: docente.codigo_Utilizador },
                select: { codigo: true, nome: true }
              }) : null,
              docente.codigo_Especialidade ? prisma.tb_especialidade.findUnique({
                where: { codigo: docente.codigo_Especialidade },
                select: { codigo: true, designacao: true }
              }) : null
            ]);
            
            docente.tb_disciplinas = disciplina;
            docente.tb_utilizadores = utilizador;
            docente.tb_especialidade = especialidade;
          } catch (relationError) {
            console.error('Erro ao buscar relacionamentos:', relationError);
          }
        }
      }

      if (!docente) {
        throw new AppError('Docente não encontrado', 404);
      }

      return docente;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro detalhado ao buscar docente:', error);
      throw new AppError('Erro ao buscar docente', 500);
    }
  }

  static async deleteDocente(id) {
    try {
      const existingDocente = await prisma.tb_docente.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_disciplinas_docente: true,
          tb_directores_turmas: true,
          tb_docente_turma: true
        }
      });

      if (!existingDocente) {
        throw new AppError('Docente não encontrado', 404);
      }

      // Implementação CASCADE DELETE com transação
      const result = await prisma.$transaction(async (tx) => {
        // Passo 1: Excluir registros de tb_disciplinas_docente
        const disciplinasDocenteDeleteCount = await tx.tb_disciplinas_docente.deleteMany({
          where: { codigoDocente: parseInt(id) }
        });

        // Passo 2: Excluir registros de tb_directores_turmas
        const diretoresTurmasDeleteCount = await tx.tb_directores_turmas.deleteMany({
          where: { codigoDocente: parseInt(id) }
        });

        // Passo 3: Excluir registros de tb_docente_turma
        const docenteTurmaDeleteCount = await tx.tb_docente_turma.deleteMany({
          where: { codigo_Docente: parseInt(id) }
        });

        // Passo 4: Excluir o docente
        await tx.tb_docente.delete({
          where: { codigo: parseInt(id) }
        });

        return {
          tipo: 'cascade_delete',
          detalhes: {
            docenteNome: existingDocente.nome,
            disciplinasDocente: disciplinasDocenteDeleteCount.count,
            diretoresTurma: diretoresTurmasDeleteCount.count,
            docenteTurma: docenteTurmaDeleteCount.count
          }
        };
      }, {
        maxWait: 30000,
        timeout: 30000
      });

      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir docente', 500);
    }
  }

  // ===============================
  // DISCIPLINAS DOCENTE - CRUD COMPLETO
  // ===============================

  static async createDisciplinaDocente(data) {
    try {
      const { codigoDocente, codigoCurso, codigoDisciplina } = data;

      // Verificar se as entidades relacionadas existem
      const [docenteExists, cursoExists, disciplinaExists] = await Promise.all([
        prisma.tb_docente.findUnique({ where: { codigo: parseInt(codigoDocente) } }),
        prisma.tb_cursos.findUnique({ where: { codigo: parseInt(codigoCurso) } }),
        prisma.tb_disciplinas.findUnique({ where: { codigo: parseInt(codigoDisciplina) } })
      ]);

      if (!docenteExists) throw new AppError('Docente não encontrado', 404);
      if (!cursoExists) throw new AppError('Curso não encontrado', 404);
      if (!disciplinaExists) throw new AppError('Disciplina não encontrada', 404);

      // Verificar se já existe esta associação
      const existingAssociation = await prisma.tb_disciplinas_docente.findFirst({
        where: {
          codigoDocente: parseInt(codigoDocente),
          codigoCurso: parseInt(codigoCurso),
          codigoDisciplina: parseInt(codigoDisciplina)
        }
      });

      if (existingAssociation) {
        throw new AppError('Esta associação já existe', 409);
      }

      return await prisma.tb_disciplinas_docente.create({
        data: {
          codigoDocente: parseInt(codigoDocente),
          codigoCurso: parseInt(codigoCurso),
          codigoDisciplina: parseInt(codigoDisciplina)
        },
        include: {
          tb_docente: { select: { codigo: true, nome: true } },
          tb_cursos: { select: { codigo: true, designacao: true } },
          tb_disciplinas: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar associação disciplina-docente', 500);
    }
  }

  static async getDisciplinasDocente(page = 1, limit = 10, search = '', docenteId = null) {
    try {
      const skip = (page - 1) * limit;
      
      // Construir filtros
      const where = {};
      
      // Filtro por docente específico
      if (docenteId) {
        where.codigoDocente = parseInt(docenteId);
      }

      // Filtro de busca por nome do docente, disciplina ou curso
      if (search && search.trim() !== '') {
        where.OR = [
          {
            tb_docente: {
              nome: {
                contains: search.trim()
              }
            }
          },
          {
            tb_disciplinas: {
              designacao: {
                contains: search.trim()
              }
            }
          },
          {
            tb_cursos: {
              designacao: {
                contains: search.trim()
              }
            }
          }
        ];
      }

      const [associacoes, total] = await Promise.all([
        prisma.tb_disciplinas_docente.findMany({
          where,
          skip,
          take: limit,
          include: {
            tb_docente: { select: { codigo: true, nome: true } },
            tb_cursos: { select: { codigo: true, designacao: true } },
            tb_disciplinas: { select: { codigo: true, designacao: true } }
          },
          orderBy: { codigo: 'desc' }
        }),
        prisma.tb_disciplinas_docente.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: associacoes,
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
      console.error('Erro detalhado ao buscar disciplinas-docente:', error);
      throw new AppError('Erro ao buscar disciplinas-docente', 500);
    }
  }

  static async getDisciplinaDocenteById(id) {
    try {
      const associacao = await prisma.tb_disciplinas_docente.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_docente: { select: { codigo: true, nome: true } },
          tb_cursos: { select: { codigo: true, designacao: true } },
          tb_disciplinas: { select: { codigo: true, designacao: true } }
        }
      });

      if (!associacao) {
        throw new AppError('Associação disciplina-docente não encontrada', 404);
      }

      return associacao;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar associação disciplina-docente', 500);
    }
  }

  static async updateDisciplinaDocente(id, data) {
    try {
      const { codigoDocente, codigoCurso, codigoDisciplina } = data;

      // Verificar se a associação existe
      const existingAssociation = await prisma.tb_disciplinas_docente.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingAssociation) {
        throw new AppError('Associação não encontrada', 404);
      }

      // Verificar se as entidades relacionadas existem
      const [docenteExists, cursoExists, disciplinaExists] = await Promise.all([
        prisma.tb_docente.findUnique({ where: { codigo: parseInt(codigoDocente) } }),
        prisma.tb_cursos.findUnique({ where: { codigo: parseInt(codigoCurso) } }),
        prisma.tb_disciplinas.findUnique({ where: { codigo: parseInt(codigoDisciplina) } })
      ]);

      if (!docenteExists) throw new AppError('Docente não encontrado', 404);
      if (!cursoExists) throw new AppError('Curso não encontrado', 404);
      if (!disciplinaExists) throw new AppError('Disciplina não encontrada', 404);

      // Verificar se já existe outra associação com os mesmos dados
      const duplicateAssociation = await prisma.tb_disciplinas_docente.findFirst({
        where: {
          AND: [
            { codigo: { not: parseInt(id) } },
            { codigoDocente: parseInt(codigoDocente) },
            { codigoCurso: parseInt(codigoCurso) },
            { codigoDisciplina: parseInt(codigoDisciplina) }
          ]
        }
      });

      if (duplicateAssociation) {
        throw new AppError('Já existe uma associação com estes dados', 409);
      }

      return await prisma.tb_disciplinas_docente.update({
        where: { codigo: parseInt(id) },
        data: {
          codigoDocente: parseInt(codigoDocente),
          codigoCurso: parseInt(codigoCurso),
          codigoDisciplina: parseInt(codigoDisciplina)
        },
        include: {
          tb_docente: { select: { codigo: true, nome: true } },
          tb_cursos: { select: { codigo: true, designacao: true } },
          tb_disciplinas: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar associação disciplina-docente', 500);
    }
  }

  static async deleteDisciplinaDocente(id) {
    try {
      const existingAssociation = await prisma.tb_disciplinas_docente.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingAssociation) {
        throw new AppError('Associação não encontrada', 404);
      }

      await prisma.tb_disciplinas_docente.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Associação excluída com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir associação disciplina-docente', 500);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getDocentesPorEspecialidade(especialidadeId) {
    try {
      const especialidadeExists = await prisma.tb_especialidade.findUnique({
        where: { codigo: parseInt(especialidadeId) }
      });

      if (!especialidadeExists) {
        throw new AppError('Especialidade não encontrada', 404);
      }

      return await prisma.tb_docente.findMany({
        where: { codigo_Especialidade: parseInt(especialidadeId) },
        include: {
          tb_disciplinas: { select: { codigo: true, designacao: true } },
          tb_especialidade: { select: { codigo: true, designacao: true } }
        },
        orderBy: { nome: 'asc' }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar docentes por especialidade', 500);
    }
  }

  static async getDocentesAtivos() {
    try {
      return await prisma.tb_docente.findMany({
        where: { status: 1 },
        include: {
          tb_disciplinas: { select: { codigo: true, designacao: true } },
          tb_especialidade: { select: { codigo: true, designacao: true } }
        },
        orderBy: { nome: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar docentes ativos', 500);
    }
  }

  static async getRelatorioAcademico() {
    try {
      const [
        totalEspecialidades,
        totalDocentes,
        docentesAtivos,
        totalDisciplinasDocente,
        totalDiretoresTurmas
      ] = await Promise.all([
        prisma.tb_especialidade.count(),
        prisma.tb_docente.count(),
        prisma.tb_docente.count({ where: { status: 1 } }),
        prisma.tb_disciplinas_docente.count(),
        prisma.tb_directores_turmas.count()
      ]);

      return {
        resumo: {
          totalEspecialidades,
          totalDocentes,
          docentesAtivos,
          totalDisciplinasDocente,
          totalDiretoresTurmas
        }
      };
    } catch (error) {
      throw new AppError('Erro ao gerar relatório acadêmico', 500);
    }
  }

  static async getEstatisticasDisciplinasDocente() {
    try {
      const [
        totalAtribuicoes,
        professoresAtivos,
        cursosUnicos,
        disciplinasUnicas,
        atribuicoesPorDocente,
        atribuicoesPorCurso
      ] = await Promise.all([
        // Total de atribuições
        prisma.tb_disciplinas_docente.count(),
        
        // Professores com atribuições (únicos e ativos)
        prisma.tb_disciplinas_docente.findMany({
          distinct: ['codigoDocente'],
          select: {
            codigoDocente: true,
            tb_docente: {
              select: { status: true }
            }
          }
        }).then(result => result.filter(r => r.tb_docente.status === 1).length),
        
        // Cursos únicos com atribuições
        prisma.tb_disciplinas_docente.findMany({
          distinct: ['codigoCurso'],
          select: { codigoCurso: true }
        }).then(result => result.length),
        
        // Disciplinas únicas atribuídas
        prisma.tb_disciplinas_docente.findMany({
          distinct: ['codigoDisciplina'],
          select: { codigoDisciplina: true }
        }).then(result => result.length),
        
        // Top 5 docentes com mais atribuições
        prisma.tb_disciplinas_docente.groupBy({
          by: ['codigoDocente'],
          _count: { codigo: true },
          orderBy: { _count: { codigo: 'desc' } },
          take: 5
        }),
        
        // Top 5 cursos com mais atribuições
        prisma.tb_disciplinas_docente.groupBy({
          by: ['codigoCurso'],
          _count: { codigo: true },
          orderBy: { _count: { codigo: 'desc' } },
          take: 5
        })
      ]);

      // Buscar nomes dos docentes do top 5
      const topDocentes = await Promise.all(
        atribuicoesPorDocente.map(async (item) => {
          const docente = await prisma.tb_docente.findUnique({
            where: { codigo: item.codigoDocente },
            select: { nome: true, codigo: true }
          });
          return {
            codigo: item.codigoDocente,
            nome: docente?.nome || 'N/A',
            totalAtribuicoes: item._count.codigo
          };
        })
      );

      // Buscar nomes dos cursos do top 5
      const topCursos = await Promise.all(
        atribuicoesPorCurso.map(async (item) => {
          const curso = await prisma.tb_cursos.findUnique({
            where: { codigo: item.codigoCurso },
            select: { designacao: true, codigo: true }
          });
          return {
            codigo: item.codigoCurso,
            nome: curso?.designacao || 'N/A',
            totalAtribuicoes: item._count.codigo
          };
        })
      );

      return {
        resumo: {
          totalAtribuicoes,
          professoresAtivos,
          cursosUnicos,
          disciplinasUnicas
        },
        rankings: {
          topDocentes,
          topCursos
        }
      };
    } catch (error) {
      console.error('Erro ao gerar estatísticas de disciplinas-docente:', error);
      throw new AppError('Erro ao gerar estatísticas de disciplinas-docente', 500);
    }
  }

  // ===============================
  // DIRETORES DE TURMAS - CRUD COMPLETO
  // ===============================

  static async createDiretorTurma(data) {
    try {
      const { designacao, codigoAnoLectivo, codigoTurma, codigoDocente } = data;

      // Verificar se as entidades relacionadas existem
      const [turmaExists, docenteExists] = await Promise.all([
        prisma.tb_turmas.findUnique({ where: { codigo: parseInt(codigoTurma) } }),
        prisma.tb_docente.findUnique({ where: { codigo: parseInt(codigoDocente) } })
      ]);

      if (!turmaExists) throw new AppError('Turma não encontrada', 404);
      if (!docenteExists) throw new AppError('Docente não encontrado', 404);

      // Verificar se já existe um diretor para esta turma no ano letivo
      const existingDiretor = await prisma.tb_directores_turmas.findFirst({
        where: {
          codigoAnoLectivo: parseInt(codigoAnoLectivo),
          codigoTurma: parseInt(codigoTurma)
        }
      });

      if (existingDiretor) {
        throw new AppError('Já existe um diretor para esta turma neste ano letivo', 409);
      }

      return await prisma.tb_directores_turmas.create({
        data: {
          designacao: designacao?.trim() || null,
          codigoAnoLectivo: parseInt(codigoAnoLectivo),
          codigoTurma: parseInt(codigoTurma),
          codigoDocente: parseInt(codigoDocente)
        },
        include: {
          tb_turmas: { select: { codigo: true, designacao: true } },
          tb_docente: { select: { codigo: true, nome: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar diretor de turma', 500);
    }
  }

  static async updateDiretorTurma(id, data) {
    try {
      const existingDiretor = await prisma.tb_directores_turmas.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingDiretor) {
        throw new AppError('Diretor de turma não encontrado', 404);
      }

      // Verificar entidades relacionadas se fornecidas
      if (data.codigoTurma) {
        const turmaExists = await prisma.tb_turmas.findUnique({
          where: { codigo: parseInt(data.codigoTurma) }
        });
        if (!turmaExists) throw new AppError('Turma não encontrada', 404);
      }

      if (data.codigoDocente) {
        const docenteExists = await prisma.tb_docente.findUnique({
          where: { codigo: parseInt(data.codigoDocente) }
        });
        if (!docenteExists) throw new AppError('Docente não encontrado', 404);
      }

      const updateData = {};
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          switch (key) {
            case 'designacao':
              updateData[key] = data[key].trim();
              break;
            case 'codigoAnoLectivo':
            case 'codigoTurma':
            case 'codigoDocente':
              updateData[key] = parseInt(data[key]);
              break;
          }
        }
      });

      return await prisma.tb_directores_turmas.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_turmas: { select: { codigo: true, designacao: true } },
          tb_docente: { select: { codigo: true, nome: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar diretor de turma', 500);
    }
  }

  static async getDiretoresTurmas(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        OR: [
          {
            designacao: {
              contains: search
            }
          },
          {
            tb_docente: {
              nome: {
                contains: search
              }
            }
          }
        ]
      } : {};

      const [diretores, total] = await Promise.all([
        prisma.tb_directores_turmas.findMany({
          where,
          skip,
          take: limit,
          include: {
            tb_turmas: { select: { codigo: true, designacao: true } },
            tb_docente: { select: { codigo: true, nome: true, contacto: true } }
          },
          orderBy: { codigo: 'desc' }
        }),
        prisma.tb_directores_turmas.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: diretores,
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
      throw new AppError('Erro ao buscar diretores de turmas', 500);
    }
  }

  static async getDiretorTurmaById(id) {
    try {
      const diretor = await prisma.tb_directores_turmas.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_turmas: { 
            select: { 
              codigo: true, 
              designacao: true,
              codigo_Classe: true,
              codigo_Curso: true 
            } 
          },
          tb_docente: { 
            select: { 
              codigo: true, 
              nome: true, 
              contacto: true, 
              email: true 
            } 
          }
        }
      });

      if (!diretor) {
        throw new AppError('Diretor de turma não encontrado', 404);
      }

      return diretor;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar diretor de turma', 500);
    }
  }

  static async deleteDiretorTurma(id) {
    try {
      const existingDiretor = await prisma.tb_directores_turmas.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingDiretor) {
        throw new AppError('Diretor de turma não encontrado', 404);
      }

      await prisma.tb_directores_turmas.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Diretor de turma removido com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao remover diretor de turma', 500);
    }
  }

  // ===============================
  // DOCENTE TURMA - CRUD COMPLETO
  // ===============================

  static async createDocenteTurma(data) {
    try {
      const { codigo_Docente, codigo_turma } = data;

      // Verificar se as entidades relacionadas existem
      const [docenteExists, turmaExists] = await Promise.all([
        prisma.tb_docente.findUnique({ where: { codigo: parseInt(codigo_Docente) } }),
        prisma.tb_turmas.findUnique({ where: { codigo: parseInt(codigo_turma) } })
      ]);

      if (!docenteExists) throw new AppError('Docente não encontrado', 404);
      if (!turmaExists) throw new AppError('Turma não encontrada', 404);

      // Verificar se já existe esta associação
      const existingAssociation = await prisma.tb_docente_turma.findUnique({
        where: {
          codigo_Docente_codigo_turma: {
            codigo_Docente: parseInt(codigo_Docente),
            codigo_turma: parseInt(codigo_turma)
          }
        }
      });

      if (existingAssociation) {
        throw new AppError('Esta associação já existe', 409);
      }

      return await prisma.tb_docente_turma.create({
        data: {
          codigo_Docente: parseInt(codigo_Docente),
          codigo_turma: parseInt(codigo_turma)
        },
        include: {
          tb_docente: { select: { codigo: true, nome: true } },
          tb_turmas: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar associação docente-turma', 500);
    }
  }

  static async getDocentesTurmas(page = 1, limit = 10, docenteId = null, turmaId = null) {
    try {
      const skip = (page - 1) * limit;
      
      const where = {};
      if (docenteId) where.codigo_Docente = parseInt(docenteId);
      if (turmaId) where.codigo_turma = parseInt(turmaId);

      const [associacoes, total] = await Promise.all([
        prisma.tb_docente_turma.findMany({
          where,
          skip,
          take: limit,
          include: {
            tb_docente: { select: { codigo: true, nome: true, contacto: true } },
            tb_turmas: { select: { codigo: true, designacao: true } }
          },
          orderBy: [
            { codigo_Docente: 'asc' },
            { codigo_turma: 'asc' }
          ]
        }),
        prisma.tb_docente_turma.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: associacoes,
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
      throw new AppError('Erro ao buscar associações docente-turma', 500);
    }
  }

  static async deleteDocenteTurma(codigoDocente, codigoTurma) {
    try {
      const existingAssociation = await prisma.tb_docente_turma.findUnique({
        where: {
          codigo_Docente_codigo_turma: {
            codigo_Docente: parseInt(codigoDocente),
            codigo_turma: parseInt(codigoTurma)
          }
        }
      });

      if (!existingAssociation) {
        throw new AppError('Associação não encontrada', 404);
      }

      await prisma.tb_docente_turma.delete({
        where: {
          codigo_Docente_codigo_turma: {
            codigo_Docente: parseInt(codigoDocente),
            codigo_turma: parseInt(codigoTurma)
          }
        }
      });

      return { message: 'Associação docente-turma removida com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao remover associação docente-turma', 500);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS ADICIONAIS
  // ===============================

  static async getDiretoresPorAnoLectivo(anoLectivo) {
    try {
      return await prisma.tb_directores_turmas.findMany({
        where: { codigoAnoLectivo: parseInt(anoLectivo) },
        include: {
          tb_turmas: { select: { codigo: true, designacao: true } },
          tb_docente: { select: { codigo: true, nome: true, contacto: true } }
        },
        orderBy: { codigoTurma: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar diretores por ano letivo', 500);
    }
  }

  static async getTurmasPorDocente(docenteId) {
    try {
      const docenteExists = await prisma.tb_docente.findUnique({
        where: { codigo: parseInt(docenteId) }
      });

      if (!docenteExists) {
        throw new AppError('Docente não encontrado', 404);
      }

      return await prisma.tb_docente_turma.findMany({
        where: { codigo_Docente: parseInt(docenteId) },
        include: {
          tb_turmas: { 
            select: { 
              codigo: true, 
              designacao: true,
              codigo_Classe: true,
              codigo_Curso: true
            } 
          }
        },
        orderBy: { codigo_turma: 'asc' }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar turmas por docente', 500);
    }
  }

  static async getDocentesPorTurma(turmaId) {
    try {
      const turmaExists = await prisma.tb_turmas.findUnique({
        where: { codigo: parseInt(turmaId) }
      });

      if (!turmaExists) {
        throw new AppError('Turma não encontrada', 404);
      }

      return await prisma.tb_docente_turma.findMany({
        where: { codigo_turma: parseInt(turmaId) },
        include: {
          tb_docente: { 
            select: { 
              codigo: true, 
              nome: true, 
              contacto: true,
              email: true,
              tb_especialidade: {
                select: { codigo: true, designacao: true }
              }
            } 
          }
        },
        orderBy: { codigo_Docente: 'asc' }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar docentes por turma', 500);
    }
  }
}
