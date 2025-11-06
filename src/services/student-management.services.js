// services/student-management.services.js
import prisma from '../config/database.js';
import { AppError } from '../utils/validation.utils.js';
import { getPagination } from '../utils/pagination.utils.js';

export class StudentManagementService {
  // ===============================
  // ENCARREGADOS - CRUD COMPLETO
  // ===============================

  static async createEncarregado(data) {
    try {
      const { nome, telefone, email, codigo_Profissao, local_Trabalho, codigo_Utilizador, dataCadastro, status } = data;

      // Verificar se o utilizador existe
      const utilizadorExists = await prisma.tb_utilizadores.findUnique({
        where: { codigo: codigo_Utilizador }
      });

      if (!utilizadorExists) {
        throw new AppError('Utilizador não encontrado', 404);
      }

      // Verificar se a profissão existe
      const profissaoExists = await prisma.tb_profissao.findUnique({
        where: { codigo: codigo_Profissao }
      });

      if (!profissaoExists) {
        throw new AppError('Profissão não encontrada', 404);
      }

      // Verificar se já existe encarregado com mesmo utilizador
      const existingEncarregado = await prisma.tb_encarregados.findFirst({
        where: { codigo_Utilizador }
      });

      if (existingEncarregado) {
        throw new AppError('Já existe um encarregado associado a este utilizador', 409);
      }

      return await prisma.tb_encarregados.create({
        data: {
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email?.trim() || null,
          codigo_Profissao,
          local_Trabalho: local_Trabalho.trim(),
          codigo_Utilizador,
          dataCadastro: dataCadastro || new Date(),
          status: status ?? 1
        },
        include: {
          tb_profissao: true,
          tb_utilizadores: {
            select: {
              codigo: true,
              nome: true,
              user: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar encarregado', 500);
    }
  }

  static async updateEncarregado(id, data) {
    try {
      const existingEncarregado = await prisma.tb_encarregados.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingEncarregado) {
        throw new AppError('Encarregado não encontrado', 404);
      }

      // Se for atualizar o utilizador, verificar se existe
      if (data.codigo_Utilizador && data.codigo_Utilizador !== existingEncarregado.codigo_Utilizador) {
        const utilizadorExists = await prisma.tb_utilizadores.findUnique({
          where: { codigo: data.codigo_Utilizador }
        });

        if (!utilizadorExists) {
          throw new AppError('Utilizador não encontrado', 404);
        }

        // Verificar se já existe outro encarregado com este utilizador
        const existingWithUser = await prisma.tb_encarregados.findFirst({
          where: { 
            codigo_Utilizador: data.codigo_Utilizador,
            codigo: { not: parseInt(id) }
          }
        });

        if (existingWithUser) {
          throw new AppError('Já existe um encarregado associado a este utilizador', 409);
        }
      }

      // Se for atualizar a profissão, verificar se existe
      if (data.codigo_Profissao) {
        const profissaoExists = await prisma.tb_profissao.findUnique({
          where: { codigo: data.codigo_Profissao }
        });

        if (!profissaoExists) {
          throw new AppError('Profissão não encontrada', 404);
        }
      }

      const updateData = { ...data };
      if (updateData.nome) updateData.nome = updateData.nome.trim();
      if (updateData.telefone) updateData.telefone = updateData.telefone.trim();
      if (updateData.email) updateData.email = updateData.email.trim();
      if (updateData.local_Trabalho) updateData.local_Trabalho = updateData.local_Trabalho.trim();

      return await prisma.tb_encarregados.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_profissao: true,
          tb_utilizadores: {
            select: {
              codigo: true,
              nome: true,
              user: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar encarregado', 500);
    }
  }

  static async getEncarregados(page = 1, limit = 10, search = '') {
    try {
      const { skip, take } = getPagination(page, limit);

      const where = search ? {
        OR: [
          { nome: { contains: search } },
          { telefone: { contains: search } },
          { email: { contains: search } },
          { local_Trabalho: { contains: search } }
        ]
      } : {};

      const [encarregados, total] = await Promise.all([
        prisma.tb_encarregados.findMany({
          where,
          skip,
          take,
          include: {
            tb_profissao: true,
            tb_utilizadores: {
              select: {
                codigo: true,
                nome: true,
                user: true
              }
            },
            tb_alunos: {
              select: {
                codigo: true,
                nome: true
              }
            }
          },
          orderBy: { nome: 'asc' }
        }),
        prisma.tb_encarregados.count({ where })
      ]);

      return {
        data: encarregados,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new AppError('Erro ao buscar encarregados', 500);
    }
  }

  static async getEncarregadoById(id) {
    try {
      const encarregado = await prisma.tb_encarregados.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_profissao: true,
          tb_utilizadores: {
            select: {
              codigo: true,
              nome: true,
              user: true,
              email: true
            }
          },
          tb_alunos: {
            select: {
              codigo: true,
              nome: true,
              dataNascimento: true,
              sexo: true
            }
          }
        }
      });

      if (!encarregado) {
        throw new AppError('Encarregado não encontrado', 404);
      }

      return encarregado;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar encarregado', 500);
    }
  }

  static async deleteEncarregado(id) {
    try {
      const existingEncarregado = await prisma.tb_encarregados.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_alunos: true
        }
      });

      if (!existingEncarregado) {
        throw new AppError('Encarregado não encontrado', 404);
      }

      // TÉCNICA 1: SOFT DELETE (Exclusão Lógica)
      // Se houver alunos associados, fazer soft delete (desativar)
      if (existingEncarregado.tb_alunos.length > 0) {
        await prisma.tb_encarregados.update({
          where: { codigo: parseInt(id) },
          data: { 
            status: 0,  // Status = 0 indica "inativo/excluído logicamente"
          }
        });

        return { 
          message: 'Encarregado desativado com sucesso (possui alunos associados)',
          tipo: 'soft_delete',
          alunosAssociados: existingEncarregado.tb_alunos.length
        };
      }

      // TÉCNICA 2: HARD DELETE (Exclusão Física)
      // Se não houver dependências, fazer exclusão física
      await prisma.tb_encarregados.delete({
        where: { codigo: parseInt(id) }
      });

      return { 
        message: 'Encarregado excluído permanentemente com sucesso',
        tipo: 'hard_delete'
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir encarregado:', error);
      throw new AppError('Erro ao excluir encarregado', 500);
    }
  }

  // ===============================
  // PROVENIÊNCIAS - CRUD COMPLETO
  // ===============================

  static async createProveniencia(data) {
    try {
      const { designacao, codigoStatus, localizacao, contacto, codigoUtilizador, dataCadastro } = data;

      // Verificar se o utilizador existe (se fornecido)
      if (codigoUtilizador) {
        const utilizadorExists = await prisma.tb_utilizadores.findUnique({
          where: { codigo: codigoUtilizador }
        });

        if (!utilizadorExists) {
          throw new AppError('Utilizador não encontrado', 404);
        }
      }

      // Verificar se já existe proveniência com mesma designação
      const existingProveniencia = await prisma.tb_proveniencias.findFirst({
        where: {
          designacao: { equals: designacao.trim(), mode: 'insensitive' }
        }
      });

      if (existingProveniencia) {
        throw new AppError('Já existe uma proveniência com esta designação', 409);
      }

      return await prisma.tb_proveniencias.create({
        data: {
          designacao: designacao.trim(),
          codigoStatus: codigoStatus ?? 1,
          localizacao: localizacao?.trim() || null,
          contacto: contacto?.trim() || null,
          codigoUtilizador: codigoUtilizador || null,
          dataCadastro: dataCadastro || new Date()
        },
        include: {
          tb_utilizadores: codigoUtilizador ? {
            select: {
              codigo: true,
              nome: true,
              user: true
            }
          } : undefined
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar proveniência', 500);
    }
  }

  static async updateProveniencia(id, data) {
    try {
      const existingProveniencia = await prisma.tb_proveniencias.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingProveniencia) {
        throw new AppError('Proveniência não encontrada', 404);
      }

      // Se for atualizar o utilizador, verificar se existe
      if (data.codigoUtilizador) {
        const utilizadorExists = await prisma.tb_utilizadores.findUnique({
          where: { codigo: data.codigoUtilizador }
        });

        if (!utilizadorExists) {
          throw new AppError('Utilizador não encontrado', 404);
        }
      }

      // Verificar se já existe outra proveniência com mesma designação
      if (data.designacao) {
        const existingWithName = await prisma.tb_proveniencias.findFirst({
          where: {
            designacao: { equals: data.designacao.trim(), mode: 'insensitive' },
            codigo: { not: parseInt(id) }
          }
        });

        if (existingWithName) {
          throw new AppError('Já existe uma proveniência com esta designação', 409);
        }
      }

      const updateData = { ...data };
      if (updateData.designacao) updateData.designacao = updateData.designacao.trim();
      if (updateData.localizacao) updateData.localizacao = updateData.localizacao.trim();
      if (updateData.contacto) updateData.contacto = updateData.contacto.trim();

      return await prisma.tb_proveniencias.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_utilizadores: updateData.codigoUtilizador ? {
            select: {
              codigo: true,
              nome: true,
              user: true
            }
          } : undefined
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar proveniência', 500);
    }
  }

  static async getProveniencias(page = 1, limit = 10, search = '') {
    try {
      const { skip, take } = getPagination(page, limit);

      const where = search ? {
        OR: [
          { designacao: { contains: search } },
          { localizacao: { contains: search } },
          { contacto: { contains: search } }
        ]
      } : {};

      const [proveniencias, total] = await Promise.all([
        prisma.tb_proveniencias.findMany({
          where,
          skip,
          take,
          include: {
            tb_utilizadores: {
              select: {
                codigo: true,
                nome: true,
                user: true
              }
            }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_proveniencias.count({ where })
      ]);

      return {
        data: proveniencias,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new AppError('Erro ao buscar proveniências', 500);
    }
  }

  static async getProvenienciaById(id) {
    try {
      const proveniencia = await prisma.tb_proveniencias.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_utilizadores: {
            select: {
              codigo: true,
              nome: true,
              user: true,
              email: true
            }
          }
        }
      });

      if (!proveniencia) {
        throw new AppError('Proveniência não encontrada', 404);
      }

      return proveniencia;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar proveniência', 500);
    }
  }

  static async deleteProveniencia(id) {
    try {
      const existingProveniencia = await prisma.tb_proveniencias.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingProveniencia) {
        throw new AppError('Proveniência não encontrada', 404);
      }

      // TÉCNICA: SOFT DELETE (Exclusão Lógica)
      // Verificar se há dependências - neste caso, não há tabelas que referenciam proveniências
      // Mas podemos aplicar soft delete caso seja uma configuração importante
      
      // OPÇÃO: Aplicar soft delete se o status existir
      if (existingProveniencia.codigoStatus !== null && existingProveniencia.codigoStatus !== undefined) {
        await prisma.tb_proveniencias.update({
          where: { codigo: parseInt(id) },
          data: { codigoStatus: 0 }  // 0 = inativo/excluído
        });

        return { 
          message: 'Proveniência desativada com sucesso',
          tipo: 'soft_delete'
        };
      }

      // TÉCNICA: HARD DELETE (Exclusão Física)
      // Se não houver campo de status ou preferir exclusão física
      await prisma.tb_proveniencias.delete({
        where: { codigo: parseInt(id) }
      });

      return { 
        message: 'Proveniência excluída permanentemente com sucesso',
        tipo: 'hard_delete'
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir proveniência:', error);
      throw new AppError('Erro ao excluir proveniência', 500);
    }
  }

  // ===============================
  // ALUNOS - CRUD COMPLETO
  // ===============================

  static async createAlunoComEncarregado(data, codigo_Utilizador) {
    try {
      // Verificar se o utilizador existe
      const utilizadorExists = await prisma.tb_utilizadores.findUnique({
        where: { codigo: codigo_Utilizador }
      });

      if (!utilizadorExists) {
        throw new AppError('Utilizador não encontrado', 404);
      }

      // 1. Gerar username ANTES da transação
      const baseUsername = data.nome.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .split(' ')
        .filter(word => word.length > 0)
        .slice(0, 2)
        .join('.');

      let finalUsername = baseUsername;
      let counter = 1;
      while (true) {
        const existingUser = await prisma.tb_utilizadores.findUnique({
          where: { user: finalUsername }
        });
        if (!existingUser) break;
        finalUsername = `${baseUsername}${counter}`;
        counter++;
      }

      // 2. Buscar tipo Aluno ANTES da transação
      const tipoAluno = await prisma.tb_tipos_utilizador.findFirst({
        where: { designacao: 'Aluno' }
      });

      if (!tipoAluno) {
        throw new AppError('Tipo de usuário Aluno não encontrado', 404);
      }

      // 3. Executar transação
      return await prisma.$transaction(async (tx) => {
        // Criar encarregado
        const encarregado = await tx.tb_encarregados.create({
          data: {
            nome: data.encarregado.nome,
            telefone: data.encarregado.telefone,
            email: data.encarregado.email,
            codigo_Profissao: data.encarregado.codigo_Profissao,
            local_Trabalho: data.encarregado.local_Trabalho,
            codigo_Utilizador: codigo_Utilizador,
            dataCadastro: new Date(),
            status: data.encarregado.status ?? 1
          }
        });

        // Preparar dados do aluno
        const alunoData = { ...data };
        delete alunoData.encarregado;
        alunoData.codigo_Encarregado = encarregado.codigo;
        alunoData.codigo_Utilizador = codigo_Utilizador;
        alunoData.dataCadastro = new Date();

        // Criar aluno
        const aluno = await tx.tb_alunos.create({
          data: alunoData
        });

        // Criar usuário
        await tx.tb_utilizadores.create({
          data: {
            nome: aluno.nome,
            user: finalUsername,
            passe: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            codigo_Tipo_Utilizador: tipoAluno.codigo,
            estadoActual: 'ACTIVO',
            dataCadastro: new Date(),
            loginStatus: 'OFF',
            codigo_Aluno: aluno.codigo
          }
        });

        console.log(`✅ Usuário criado: ${finalUsername} (senha: 123456)`);

        return {
          success: true,
          data: {
            aluno: aluno,
            encarregado: encarregado
          },
          message: 'Aluno criado com sucesso'
        };
      });
    } catch (error) {
      console.error('Erro ao criar aluno com encarregado:', error);
      throw new AppError('Erro ao criar aluno com encarregado', 500);
    }
  }

  static async createAluno(data) {
    try {
      // Verificar se o encarregado existe
      const encarregadoExists = await prisma.tb_encarregados.findUnique({
        where: { codigo: data.codigo_Encarregado }
      });

      if (!encarregadoExists) {
        throw new AppError('Encarregado não encontrado', 404);
      }

      // Verificar se o utilizador existe
      const utilizadorExists = await prisma.tb_utilizadores.findUnique({
        where: { codigo: data.codigo_Utilizador }
      });

      if (!utilizadorExists) {
        throw new AppError('Utilizador não encontrado', 404);
      }

      // Verificar se o tipo de documento existe
      const tipoDocumentoExists = await prisma.tb_tipo_documento.findUnique({
        where: { codigo: data.codigoTipoDocumento }
      });

      if (!tipoDocumentoExists) {
        throw new AppError('Tipo de documento não encontrado', 404);
      }

      // Verificar se já existe aluno com mesmo documento de identificação
      if (data.n_documento_identificacao) {
        const existingAluno = await prisma.tb_alunos.findFirst({
          where: {
            n_documento_identificacao: data.n_documento_identificacao.trim(),
            codigoTipoDocumento: data.codigoTipoDocumento
          }
        });

        if (existingAluno) {
          throw new AppError('Já existe um aluno com este documento de identificação', 409);
        }
      }

      const cleanData = { ...data };
      if (cleanData.nome) cleanData.nome = cleanData.nome.trim();
      if (cleanData.pai) cleanData.pai = cleanData.pai.trim();
      if (cleanData.mae) cleanData.mae = cleanData.mae.trim();
      if (cleanData.email) cleanData.email = cleanData.email.trim();
      if (cleanData.telefone) cleanData.telefone = cleanData.telefone.trim();
      if (cleanData.n_documento_identificacao) cleanData.n_documento_identificacao = cleanData.n_documento_identificacao.trim();
      if (cleanData.morada) cleanData.morada = cleanData.morada.trim();
      if (cleanData.motivo_Desconto) cleanData.motivo_Desconto = cleanData.motivo_Desconto.trim();
      if (cleanData.provinciaEmissao) cleanData.provinciaEmissao = cleanData.provinciaEmissao.trim();
      if (cleanData.tipo_desconto) cleanData.tipo_desconto = cleanData.tipo_desconto.trim();
      if (cleanData.url_Foto) cleanData.url_Foto = cleanData.url_Foto.trim();

      // Definir dataCadastro se não fornecida
      if (!cleanData.dataCadastro) {
        cleanData.dataCadastro = new Date();
      }

      return await prisma.tb_alunos.create({
        data: cleanData,
        include: {
          tb_encarregados: {
            include: {
              tb_profissao: true
            }
          },
          tb_utilizadores: {
            select: {
              codigo: true,
              nome: true,
              user: true
            }
          },
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar aluno', 500);
    }
  }

  static async updateAlunoComEncarregado(id, data) {
    try {
      const existingAluno = await prisma.tb_alunos.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_encarregados: true
        }
      });

      if (!existingAluno) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // Usar transação para atualizar aluno e encarregado
      const result = await prisma.$transaction(async (tx) => {
        // 1. Atualizar dados do encarregado se fornecidos
        if (data.encarregado && Object.keys(data.encarregado).length > 0) {
          const encarregadoData = { ...data.encarregado };
          
          // Verificar se a profissão existe (se fornecida)
          if (encarregadoData.codigo_Profissao) {
            const profissaoExists = await tx.tb_profissao.findUnique({
              where: { codigo: encarregadoData.codigo_Profissao }
            });
            
            if (!profissaoExists) {
              throw new AppError('Profissão do encarregado não encontrada', 404);
            }
          }
          
          await tx.tb_encarregados.update({
            where: { codigo: existingAluno.codigo_Encarregado },
            data: encarregadoData
          });
        }

        // 2. Atualizar dados do aluno
        const alunoData = { ...data };
        delete alunoData.encarregado; // Remover dados do encarregado
        
        // Verificar referências se fornecidas
        if (alunoData.codigoTipoDocumento) {
          const tipoDocumentoExists = await tx.tb_tipo_documento.findUnique({
            where: { codigo: alunoData.codigoTipoDocumento }
          });
          
          if (!tipoDocumentoExists) {
            throw new AppError('Tipo de documento não encontrado', 404);
          }
        }
        
        // Verificar documento duplicado
        if (alunoData.n_documento_identificacao && alunoData.codigoTipoDocumento) {
          const existingWithDoc = await tx.tb_alunos.findFirst({
            where: {
              n_documento_identificacao: alunoData.n_documento_identificacao.trim(),
              codigoTipoDocumento: alunoData.codigoTipoDocumento,
              codigo: { not: parseInt(id) }
            }
          });
          
          if (existingWithDoc) {
            throw new AppError('Já existe um aluno com este documento de identificação', 409);
          }
        }
        
        // Limpar dados de texto
        if (alunoData.nome) alunoData.nome = alunoData.nome.trim();
        if (alunoData.pai) alunoData.pai = alunoData.pai.trim();
        if (alunoData.mae) alunoData.mae = alunoData.mae.trim();
        if (alunoData.email) alunoData.email = alunoData.email.trim();
        if (alunoData.telefone) alunoData.telefone = alunoData.telefone.trim();
        if (alunoData.n_documento_identificacao) alunoData.n_documento_identificacao = alunoData.n_documento_identificacao.trim();
        if (alunoData.morada) alunoData.morada = alunoData.morada.trim();
        if (alunoData.motivo_Desconto) alunoData.motivo_Desconto = alunoData.motivo_Desconto.trim();
        if (alunoData.provinciaEmissao) alunoData.provinciaEmissao = alunoData.provinciaEmissao.trim();
        if (alunoData.tipo_desconto) alunoData.tipo_desconto = alunoData.tipo_desconto.trim();
        if (alunoData.url_Foto) alunoData.url_Foto = alunoData.url_Foto.trim();
        
        // Atualizar aluno
        return await tx.tb_alunos.update({
          where: { codigo: parseInt(id) },
          data: alunoData,
          include: {
            tb_encarregados: {
              include: {
                tb_profissao: true
              }
            },
            tb_utilizadores: {
              select: {
                codigo: true,
                nome: true,
                user: true
              }
            },
          }
        });
      });
      
      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao atualizar aluno com encarregado:', error);
      throw new AppError('Erro ao atualizar aluno com encarregado', 500);
    }
  }

  static async updateAluno(id, data) {
    try {
      const existingAluno = await prisma.tb_alunos.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingAluno) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // Verificações de referências se fornecidas
      if (data.codigo_Encarregado) {
        const encarregadoExists = await prisma.tb_encarregados.findUnique({
          where: { codigo: data.codigo_Encarregado }
        });

        if (!encarregadoExists) {
          throw new AppError('Encarregado não encontrado', 404);
        }
      }

      if (data.codigo_Utilizador) {
        const utilizadorExists = await prisma.tb_utilizadores.findUnique({
          where: { codigo: data.codigo_Utilizador }
        });

        if (!utilizadorExists) {
          throw new AppError('Utilizador não encontrado', 404);
        }
      }

      if (data.codigoTipoDocumento) {
        const tipoDocumentoExists = await prisma.tb_tipo_documento.findUnique({
          where: { codigo: data.codigoTipoDocumento }
        });

        if (!tipoDocumentoExists) {
          throw new AppError('Tipo de documento não encontrado', 404);
        }
      }

      // Verificar se já existe outro aluno com mesmo documento
      if (data.n_documento_identificacao && data.codigoTipoDocumento) {
        const existingWithDoc = await prisma.tb_alunos.findFirst({
          where: {
            n_documento_identificacao: data.n_documento_identificacao.trim(),
            codigoTipoDocumento: data.codigoTipoDocumento,
            codigo: { not: parseInt(id) }
          }
        });

        if (existingWithDoc) {
          throw new AppError('Já existe um aluno com este documento de identificação', 409);
        }
      }

      const updateData = { ...data };
      if (updateData.nome) updateData.nome = updateData.nome.trim();
      if (updateData.pai) updateData.pai = updateData.pai.trim();
      if (updateData.mae) updateData.mae = updateData.mae.trim();
      if (updateData.email) updateData.email = updateData.email.trim();
      if (updateData.telefone) updateData.telefone = updateData.telefone.trim();
      if (updateData.n_documento_identificacao) updateData.n_documento_identificacao = updateData.n_documento_identificacao.trim();
      if (updateData.morada) updateData.morada = updateData.morada.trim();
      if (updateData.motivo_Desconto) updateData.motivo_Desconto = updateData.motivo_Desconto.trim();
      if (updateData.provinciaEmissao) updateData.provinciaEmissao = updateData.provinciaEmissao.trim();
      if (updateData.tipo_desconto) updateData.tipo_desconto = updateData.tipo_desconto.trim();
      if (updateData.url_Foto) updateData.url_Foto = updateData.url_Foto.trim();

      return await prisma.tb_alunos.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_encarregados: {
            include: {
              tb_profissao: true
            }
          },
          tb_utilizadores: {
            select: {
              codigo: true,
              nome: true,
              user: true
            }
          },
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar aluno', 500);
    }
  }

  static async getAlunos(page = 1, limit = 10, search = '', statusFilter = null, cursoFilter = null) {
    try {
      const { skip, take } = getPagination(page, limit);

      // Construir filtro de busca
      // Nota: Para MySQL, removemos o 'mode: insensitive' pois não é suportado
      // O MySQL já faz buscas case-insensitive por padrão (dependendo da collation)
      const where = {};
      
      // Filtro de busca por texto
      if (search) {
        where.OR = [
          { nome: { contains: search } },
          { email: { contains: search } },
          { telefone: { contains: search } },
          { n_documento_identificacao: { contains: search } },
          { pai: { contains: search } },
          { mae: { contains: search } }
        ];
      }
      
      // Filtro por status
      if (statusFilter !== null && statusFilter !== 'all') {
        where.codigo_Status = parseInt(statusFilter);
      }
      
      // Filtro por curso (via matrícula)
      // Usar abordagem diferente para garantir que a contagem funcione corretamente
      if (cursoFilter !== null && cursoFilter !== 'all') {
        where.tb_matriculas = {
          is: {
            tb_cursos: {
              codigo: parseInt(cursoFilter)
            }
          }
        };
      }

      // Implementação robusta baseada na memória - step-by-step query approach
      let alunos, total;
      
      try {
        
        
        // Tentativa com includes complexos
        [alunos, total] = await Promise.all([
          prisma.tb_alunos.findMany({
            where,
            skip,
            take,
            include: {
              tb_encarregados: {
                select: {
                  codigo: true,
                  nome: true,
                  telefone: true
                }
              },
              tb_utilizadores: {
                select: {
                  codigo: true,
                  nome: true,
                  user: true
                }
              },
              tb_tipo_documento: {
                select: {
                  codigo: true,
                  designacao: true
                }
              },
              tb_matriculas: {
                select: {
                  codigo: true,
                  data_Matricula: true,
                  codigoStatus: true,
                  tb_cursos: {
                    select: {
                      codigo: true,
                      designacao: true
                    }
                  },
                  tb_utilizadores: {
                    select: {
                      codigo: true,
                      nome: true
                    }
                  }
                }
              }
            },
            orderBy: { nome: 'asc' }
          }),
          prisma.tb_alunos.count({ where })
        ]);

        console.log(`[getAlunos] Resultados: ${alunos.length} alunos nesta página, ${total} total com filtros aplicados`);

        // Buscar dados relacionados adicionais para cada aluno
        const alunosComDadosCompletos = await Promise.all(
          alunos.map(async (aluno) => {
            try {
              // Buscar dados relacionados pelos códigos
              const [nacionalidade, estadoCivil, comuna, status] = await Promise.all([
                // Nacionalidade
                aluno.codigo_Nacionalidade ? 
                  prisma.tb_nacionalidades.findUnique({
                    where: { codigo: aluno.codigo_Nacionalidade },
                    select: { codigo: true, designacao: true }
                  }).catch(() => null) : null,
                
                // Estado Civil
                aluno.codigo_Estado_Civil ? 
                  prisma.tb_estado_civil.findUnique({
                    where: { codigo: aluno.codigo_Estado_Civil },
                    select: { codigo: true, designacao: true }
                  }).catch(() => null) : null,
                
                // Comuna
                aluno.codigo_Comuna ? 
                  prisma.tb_comunas.findUnique({
                    where: { codigo: aluno.codigo_Comuna },
                    select: { 
                      codigo: true, 
                      designacao: true,
                      tb_municipios: {
                        select: {
                          codigo: true,
                          designacao: true,
                          tb_provincias: {
                            select: {
                              codigo: true,
                              designacao: true
                            }
                          }
                        }
                      }
                    }
                  }).catch(() => null) : null,
                
                // Status
                aluno.codigo_Status ? 
                  prisma.tb_status.findUnique({
                    where: { codigo: aluno.codigo_Status },
                    select: { codigo: true, designacao: true }
                  }).catch(() => null) : null
              ]);

              return {
                ...aluno,
                tb_nacionalidade: nacionalidade,
                tb_estado_civil: estadoCivil,
                tb_comuna: comuna,
                tb_status: status
              };
            } catch (error) {
              console.error(`Erro ao buscar dados relacionados para aluno ${aluno.codigo}:`, error);
              // Retorna o aluno sem os dados relacionados em caso de erro
              return aluno;
            }
          })
        );

        return {
          data: alunosComDadosCompletos,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit
          }
        };

      } catch (complexError) {
        console.error('Erro com includes complexos, tentando abordagem simples:', complexError);
        
        // Fallback: busca simples sem includes complexos
        try {
          [alunos, total] = await Promise.all([
            prisma.tb_alunos.findMany({
              where,
              skip,
              take,
              include: {
                tb_encarregados: {
                  select: {
                    codigo: true,
                    nome: true,
                    telefone: true
                  }
                }
              },
              orderBy: { nome: 'asc' }
            }),
            prisma.tb_alunos.count({ where })
          ]);

          return {
            data: alunos,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(total / limit),
              totalItems: total,
              itemsPerPage: limit
            }
          };
        } catch (simpleError) {
          console.error('Erro com includes simples, retornando dados básicos:', simpleError);
          
          // Fallback final: apenas dados básicos
          [alunos, total] = await Promise.all([
            prisma.tb_alunos.findMany({
              where,
              skip,
              take,
              orderBy: { nome: 'asc' }
            }),
            prisma.tb_alunos.count({ where })
          ]);

          return {
            data: alunos,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(total / limit),
              totalItems: total,
              itemsPerPage: limit
            }
          };
        }
      }
    } catch (error) {
      console.error('Erro geral ao buscar alunos:', error);
      throw new AppError('Erro ao buscar alunos', 500);
    }
  }

  static async getAlunoById(id) {
    try {
      console.log(`[getAlunoById] Buscando aluno com ID: ${id}`);
      
      // Implementação robusta baseada na memória - step-by-step query approach
      let aluno;
      
      try {
        // Primeiro, verificar se o aluno existe
        const alunoBasico = await prisma.tb_alunos.findUnique({
          where: { codigo: parseInt(id) }
        });

        if (!alunoBasico) {
          throw new AppError('Aluno não encontrado', 404);
        }

        console.log(`[getAlunoById] Aluno encontrado, buscando dados relacionados...`);

        // Tentativa com includes complexos
        aluno = await prisma.tb_alunos.findUnique({
          where: { codigo: parseInt(id) },
          include: {
            tb_encarregados: {
              select: {
                codigo: true,
                nome: true,
                telefone: true
              }
            },
            tb_utilizadores: {
              select: {
                codigo: true,
                nome: true,
                user: true
              }
            },
            tb_matriculas: {
              select: {
                codigo: true,
                data_Matricula: true,
                codigoStatus: true,
                tb_cursos: {
                  select: {
                    codigo: true,
                    designacao: true
                  }
                },
                tb_utilizadores: {
                  select: {
                    codigo: true,
                    nome: true
                  }
                }
              }
            }
          }
        });

        if (!aluno) {
          throw new AppError('Aluno não encontrado', 404);
        }

        // Buscar dados relacionados adicionais
        try {
          const [nacionalidade, estadoCivil, comuna, status] = await Promise.all([
            // Nacionalidade
            aluno.codigo_Nacionalidade ? 
              prisma.tb_nacionalidades.findUnique({
                where: { codigo: aluno.codigo_Nacionalidade },
                select: { codigo: true, designacao: true }
              }).catch(() => null) : null,
            
            // Estado Civil
            aluno.codigo_Estado_Civil ? 
              prisma.tb_estado_civil.findUnique({
                where: { codigo: aluno.codigo_Estado_Civil },
                select: { codigo: true, designacao: true }
              }).catch(() => null) : null,
            
            // Comuna
            aluno.codigo_Comuna ? 
              prisma.tb_comunas.findUnique({
                where: { codigo: aluno.codigo_Comuna },
                select: { 
                  codigo: true, 
                  designacao: true,
                  tb_municipios: {
                    select: {
                      codigo: true,
                      designacao: true,
                      tb_provincias: {
                        select: {
                          codigo: true,
                          designacao: true
                        }
                      }
                    }
                  }
                }
              }).catch(() => null) : null,
            
            // Status
            aluno.codigo_Status ? 
              prisma.tb_status.findUnique({
                where: { codigo: aluno.codigo_Status },
                select: { codigo: true, designacao: true }
              }).catch(() => null) : null
          ]);

          return {
            ...aluno,
            tb_nacionalidade: nacionalidade,
            tb_estado_civil: estadoCivil,
            tb_comuna: comuna,
            tb_status: status
          };

        } catch (relatedError) {
          console.error(`Erro ao buscar dados relacionados para aluno ${aluno.codigo}:`, relatedError);
          // Retorna o aluno sem os dados relacionados em caso de erro
          return aluno;
        }

      } catch (complexError) {
        console.error('Erro com includes complexos no getAlunoById, tentando abordagem simples:', complexError);
        
        // Fallback: busca simples sem includes complexos
        try {
          aluno = await prisma.tb_alunos.findUnique({
            where: { codigo: parseInt(id) },
            include: {
              tb_encarregados: {
                select: {
                  codigo: true,
                  nome: true,
                  telefone: true
                }
              },
              tb_tipo_documento: {
                select: {
                  codigo: true,
                  designacao: true
                }
              }
            }
          });

          if (!aluno) {
            throw new AppError('Aluno não encontrado', 404);
          }

          return aluno;

        } catch (simpleError) {
          console.error('Erro com includes simples no getAlunoById, verificando se aluno existe:', simpleError);
          
          // Fallback final: verificar se o aluno existe
          aluno = await prisma.tb_alunos.findUnique({
            where: { codigo: parseInt(id) }
          });

          if (!aluno) {
            throw new AppError('Aluno não encontrado', 404);
          }

          return aluno;
        }
      }
    } catch (error) {
      console.error('Erro geral ao buscar aluno por ID:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar aluno', 500);
    }
  }

  static async deleteAluno(id) {
    try {
      const existingAluno = await prisma.tb_alunos.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_matriculas: true,
          tb_pagamentos: true,
          tb_encarregados: true
        }
      });

      if (!existingAluno) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // TÉCNICA: CASCADE DELETE (Exclusão em Cascata)
      // Excluir o aluno e todas as suas dependências em uma transação
      // Aumentando timeout para 30 segundos devido ao volume de dados
      const result = await prisma.$transaction(async (tx) => {
        console.log(`[DELETE ALUNO] Iniciando exclusão em cascata do aluno ${id}`);
        
        // ===================================
        // PASSO 1: EXCLUIR CONFIRMAÇÕES
        // ===================================
        let confirmacoes = 0;
        if (existingAluno.tb_matriculas) {
          const confirmacoesList = await tx.tb_confirmacoes.findMany({
            where: { codigo_Matricula: existingAluno.tb_matriculas.codigo }
          });
          
          if (confirmacoesList.length > 0) {
            await tx.tb_confirmacoes.deleteMany({
              where: { codigo_Matricula: existingAluno.tb_matriculas.codigo }
            });
            confirmacoes = confirmacoesList.length;
            console.log(`[DELETE ALUNO] ✓ Excluídas ${confirmacoes} confirmações`);
          }
        }
        
        // ===================================
        // PASSO 2: BUSCAR PAGAMENTOS PRINCIPAIS
        // ===================================
        const pagamentoiIds = await tx.tb_pagamentoi.findMany({
          where: { codigo_Aluno: parseInt(id) },
          select: { codigo: true }
        });
        
        const pagamentoiIdsList = pagamentoiIds.map(p => p.codigo);
        console.log(`[DELETE ALUNO] Encontrados ${pagamentoiIdsList.length} pagamentos principais`);
        
        // ===================================
        // PASSO 3: EXCLUIR NOTAS DE CRÉDITO
        // ===================================
        let notasCreditoCount = 0;
        if (pagamentoiIdsList.length > 0) {
          const notasCreditoResult = await tx.tb_nota_credito.deleteMany({
            where: {
              OR: [
                { codigo_aluno: parseInt(id) },
                { codigoPagamentoi: { in: pagamentoiIdsList } }
              ]
            }
          });
          notasCreditoCount = notasCreditoResult.count;
          if (notasCreditoCount > 0) {
            console.log(`[DELETE ALUNO] ✓ Excluídas ${notasCreditoCount} notas de crédito`);
          }
        } else {
          const notasCreditoResult = await tx.tb_nota_credito.deleteMany({
            where: { codigo_aluno: parseInt(id) }
          });
          notasCreditoCount = notasCreditoResult.count;
          if (notasCreditoCount > 0) {
            console.log(`[DELETE ALUNO] ✓ Excluídas ${notasCreditoCount} notas de crédito`);
          }
        }
        
        // ===================================
        // PASSO 4: EXCLUIR PAGAMENTOS SECUNDÁRIOS
        // ===================================
        let pagamentosCount = 0;
        if (pagamentoiIdsList.length > 0) {
          const pagamentosResult = await tx.tb_pagamentos.deleteMany({
            where: {
              OR: [
                { codigo_Aluno: parseInt(id) },
                { codigoPagamento: { in: pagamentoiIdsList } }
              ]
            }
          });
          pagamentosCount = pagamentosResult.count;
          if (pagamentosCount > 0) {
            console.log(`[DELETE ALUNO] ✓ Excluídos ${pagamentosCount} pagamentos secundários`);
          }
        } else {
          const pagamentosResult = await tx.tb_pagamentos.deleteMany({
            where: { codigo_Aluno: parseInt(id) }
          });
          pagamentosCount = pagamentosResult.count;
          if (pagamentosCount > 0) {
            console.log(`[DELETE ALUNO] ✓ Excluídos ${pagamentosCount} pagamentos secundários`);
          }
        }
        
        // ===================================
        // PASSO 5: EXCLUIR PAGAMENTOS PRINCIPAIS
        // ===================================
        const pagamentoiCount = pagamentoiIds.length;
        if (pagamentoiCount > 0) {
          await tx.tb_pagamentoi.deleteMany({
            where: { codigo_Aluno: parseInt(id) }
          });
          console.log(`[DELETE ALUNO] ✓ Excluídos ${pagamentoiCount} pagamentos principais`);
        }
        
        // ===================================
        // PASSO 6: EXCLUIR SERVIÇOS DO ALUNO
        // ===================================
        const servicosResult = await tx.tb_servico_aluno.deleteMany({
          where: { codigo_Aluno: parseInt(id) }
        });
        const servicosCount = servicosResult.count;
        if (servicosCount > 0) {
          console.log(`[DELETE ALUNO] ✓ Excluídos ${servicosCount} serviços`);
        }
        
        // ===================================
        // PASSO 7: EXCLUIR TRANSFERÊNCIAS
        // ===================================
        const transferenciasResult = await tx.tb_transferencias.deleteMany({
          where: { codigoAluno: parseInt(id) }
        });
        const transferenciasCount = transferenciasResult.count;
        if (transferenciasCount > 0) {
          console.log(`[DELETE ALUNO] ✓ Excluídas ${transferenciasCount} transferências`);
        }
        
        // ===================================
        // PASSO 8: EXCLUIR MATRÍCULA
        // ===================================
        let matriculaExcluida = 0;
        if (existingAluno.tb_matriculas) {
          await tx.tb_matriculas.delete({
            where: { codigo: existingAluno.tb_matriculas.codigo }
          });
          matriculaExcluida = 1;
          console.log('[DELETE ALUNO] ✓ Matrícula excluída');
        }
        
        // ===================================
        // PASSO 9: EXCLUIR O ALUNO
        // ===================================
        await tx.tb_alunos.delete({
          where: { codigo: parseInt(id) }
        });
        console.log('[DELETE ALUNO] ✓ Aluno excluído');
        
        // ===================================
        // PASSO 10: VERIFICAR ENCARREGADO
        // (OPCIONAL - Soft Delete)
        // ===================================
        let encarregadoExcluido = false;
        if (existingAluno.tb_encarregados) {
          const outrosAlunos = await tx.tb_alunos.count({
            where: { 
              codigo_Encarregado: existingAluno.codigo_Encarregado
            }
          });
          
          if (outrosAlunos === 0) {
            // OPÇÃO A: Excluir permanentemente (Hard Delete)
            await tx.tb_encarregados.delete({
              where: { codigo: existingAluno.codigo_Encarregado }
            });
            console.log('[DELETE ALUNO] ✓ Encarregado excluído (não tinha outros alunos)');
            encarregadoExcluido = true;
            
            // OPÇÃO B: Desativar (Soft Delete) - Descomente para usar
            // await tx.tb_encarregados.update({
            //   where: { codigo: existingAluno.codigo_Encarregado },
            //   data: { status: 0 }
            // });
            // console.log('[DELETE ALUNO] ✓ Encarregado desativado (soft delete)');
            // encarregadoExcluido = false;
          } else {
            console.log(`[DELETE ALUNO] ℹ Encarregado mantido (tem ${outrosAlunos} outros alunos)`);
          }
        }
        
        console.log('[DELETE ALUNO] ✓ Exclusão em cascata concluída com sucesso');
        
        // Retornar resumo da operação
        return { 
          message: 'Aluno e todas as dependências excluídos com sucesso',
          tipo: 'cascade_delete',
          detalhes: {
            confirmacoes,
            notasCredito: notasCreditoCount,
            pagamentos: pagamentosCount,
            pagamentosPrincipais: pagamentoiCount,
            servicos: servicosCount,
            transferencias: transferenciasCount,
            matricula: matriculaExcluida,
            encarregadoExcluido
          }
        };
      }, {
        maxWait: 30000, // Tempo máximo de espera: 30 segundos
        timeout: 30000, // Timeout da transação: 30 segundos
      });
      
      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('[DELETE ALUNO] ✗ Erro ao excluir aluno em cascata:', error);
      console.error('Stack trace:', error.stack);
      throw new AppError(`Erro ao excluir aluno e dependências: ${error.message}`, 500);
    }
  }

  // ===============================
  // MATRÍCULAS - CRUD COMPLETO
  // ===============================

  static async createMatricula(data) {
    try {
      const { codigo_Aluno, data_Matricula, codigo_Curso, codigo_Utilizador, codigoStatus } = data;

      // Verificar se o aluno existe
      const alunoExists = await prisma.tb_alunos.findUnique({
        where: { codigo: codigo_Aluno }
      });

      if (!alunoExists) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // Verificar se o curso existe
      console.log('Verificando se curso existe:', codigo_Curso);
      const cursoExists = await prisma.tb_cursos.findUnique({
        where: { codigo: codigo_Curso }
      });

      if (!cursoExists) {
        throw new AppError('Curso não encontrado', 404);
      }

      // Verificar se o utilizador existe
      const utilizadorExists = await prisma.tb_utilizadores.findUnique({
        where: { codigo: codigo_Utilizador }
      });

      if (!utilizadorExists) {
        throw new AppError('Utilizador não encontrado', 404);
      }

      // Verificar se já existe matrícula para este aluno
      const existingMatricula = await prisma.tb_matriculas.findUnique({
        where: { codigo_Aluno }
      });

      if (existingMatricula) {
        throw new AppError('Já existe uma matrícula para este aluno', 409);
      }
      
      // Buscar o próximo ID disponível
      const lastMatricula = await prisma.tb_matriculas.findFirst({
        orderBy: { codigo: 'desc' }
      });
      const nextCodigo = (lastMatricula?.codigo || 0) + 1;
      
      const matricula = await prisma.tb_matriculas.create({
        data: {
          codigo: nextCodigo,
          codigo_Aluno,
          data_Matricula,
          codigo_Curso,
          codigo_Utilizador,
          codigoStatus: codigoStatus ?? 1
        },
        include: {
          tb_alunos: {
            select: {
              codigo: true,
              nome: true,
              dataNascimento: true,
              sexo: true
            }
          },
          tb_cursos: true,
          tb_utilizadores: {
            select: {
              codigo: true,
              nome: true,
              user: true
            }
          }
        }
      });
      
      return matricula;
      
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar matrícula', 500);
    }
  }

  static async updateMatricula(id, data) {
    try {
      const existingMatricula = await prisma.tb_matriculas.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingMatricula) {
        throw new AppError('Matrícula não encontrada', 404);
      }

      // Verificações de referências se fornecidas
      if (data.codigo_Aluno && data.codigo_Aluno !== existingMatricula.codigo_Aluno) {
        const alunoExists = await prisma.tb_alunos.findUnique({
          where: { codigo: data.codigo_Aluno }
        });

        if (!alunoExists) {
          throw new AppError('Aluno não encontrado', 404);
        }

        // Verificar se já existe matrícula para este aluno
        const existingWithAluno = await prisma.tb_matriculas.findFirst({
          where: {
            codigo_Aluno: data.codigo_Aluno,
            codigo: { not: parseInt(id) }
          }
        });

        if (existingWithAluno) {
          throw new AppError('Já existe uma matrícula para este aluno', 409);
        }
      }

      if (data.codigo_Curso) {
        const cursoExists = await prisma.tb_cursos.findUnique({
          where: { codigo: data.codigo_Curso }
        });

        if (!cursoExists) {
          throw new AppError('Curso não encontrado', 404);
        }
      }

      if (data.codigo_Utilizador) {
        const utilizadorExists = await prisma.tb_utilizadores.findUnique({
          where: { codigo: data.codigo_Utilizador }
        });

        if (!utilizadorExists) {
          throw new AppError('Utilizador não encontrado', 404);
        }
      }

      return await prisma.tb_matriculas.update({
        where: { codigo: parseInt(id) },
        data,
        include: {
          tb_alunos: {
            select: {
              codigo: true,
              nome: true,
              dataNascimento: true,
              sexo: true
            }
          },
          tb_cursos: true,
          tb_utilizadores: {
            select: {
              codigo: true,
              nome: true,
              user: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar matrícula', 500);
    }
  }

  static async getMatriculas(page = 1, limit = 10, search = '', statusFilter = null, cursoFilter = null) {
    try {
      const { skip, take } = getPagination(page, limit);

      // Construir filtro dinâmico
      const where = {};
      const andConditions = [];

      // Filtro de busca por texto (nome do aluno ou designação do curso)
      if (search) {
        andConditions.push({
          OR: [
            {
              tb_alunos: {
                nome: { contains: search }
              }
            },
            {
              tb_cursos: {
                designacao: { contains: search }
              }
            }
          ]
        });
      }

      // Filtro por status
      if (statusFilter !== null && statusFilter !== 'all') {
        andConditions.push({
          codigoStatus: parseInt(statusFilter)
        });
      }

      // Filtro por curso
      if (cursoFilter !== null && cursoFilter !== 'all') {
        andConditions.push({
          codigo_Curso: parseInt(cursoFilter)
        });
      }

      // Aplicar condições AND se houver filtros
      if (andConditions.length > 0) {
        where.AND = andConditions;
      }

      const [matriculas, total] = await Promise.all([
        prisma.tb_matriculas.findMany({
          where,
          skip,
          take,
          include: {
            tb_alunos: {
              select: {
                codigo: true,
                nome: true,
                dataNascimento: true,
                sexo: true,
                url_Foto: true
              }
            },
            tb_cursos: true,
            tb_utilizadores: {
              select: {
                codigo: true,
                nome: true,
                user: true
              }
            },
            tb_confirmacoes: {
              include: {
                tb_turmas: {
                  include: {
                    tb_classes: true
                  }
                }
              }
            }
          },
          orderBy: { data_Matricula: 'desc' }
        }),
        prisma.tb_matriculas.count({ where })
      ]);

      return {
        data: matriculas,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new AppError(`Erro ao buscar matrículas: ${error.message}`, 500);
    }
  }

  static async getMatriculaById(id) {
    
    try {
      const matricula = await prisma.tb_matriculas.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_alunos: {
            select: {
              codigo: true,
              nome: true,
              email: true,
              telefone: true,
              morada: true,
              sexo: true,
              dataNascimento: true,
              pai: true,
              mae: true,
              url_Foto: true
            }
          },
          tb_cursos: true,
          tb_utilizadores: {
            select: {
              codigo: true,
              nome: true,
              user: true
            }
          }
        }
      });

      if (!matricula) {
        throw new AppError('Matrícula não encontrada', 404);
      }

      return matricula;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar matrícula', 500);
    }
  }

  static async deleteMatricula(id) {
    try {
      const existingMatricula = await prisma.tb_matriculas.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_confirmacoes: true
        }
      });

      if (!existingMatricula) {
        throw new AppError('Matrícula não encontrada', 404);
      }

      // TÉCNICA: CASCADE DELETE COM CONFIRMAÇÃO
      // Se houver confirmações, excluir em cascata dentro de uma transação
      if (existingMatricula.tb_confirmacoes.length > 0) {
        const result = await prisma.$transaction(async (tx) => {
          console.log(`[DELETE MATRÍCULA] Iniciando exclusão em cascata da matrícula ${id}`);
          
          // Passo 1: Excluir todas as confirmações
          const confirmacoesCount = existingMatricula.tb_confirmacoes.length;
          await tx.tb_confirmacoes.deleteMany({
            where: { codigo_Matricula: parseInt(id) }
          });
          console.log(`[DELETE MATRÍCULA] ✓ Excluídas ${confirmacoesCount} confirmações`);
          
          // Passo 2: Excluir a matrícula
          await tx.tb_matriculas.delete({
            where: { codigo: parseInt(id) }
          });
          console.log('[DELETE MATRÍCULA] ✓ Matrícula excluída');
          
          return {
            message: 'Matrícula e confirmações excluídas com sucesso',
            tipo: 'cascade_delete',
            detalhes: {
              confirmacoes: confirmacoesCount
            }
          };
        });
        
        return result;
      }

      // TÉCNICA: HARD DELETE (Exclusão Física)
      // Se não houver confirmações, exclusão simples
      await prisma.tb_matriculas.delete({
        where: { codigo: parseInt(id) }
      });

      return { 
        message: 'Matrícula excluída com sucesso',
        tipo: 'hard_delete'
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir matrícula:', error);
      throw new AppError('Erro ao excluir matrícula', 500);
    }
  }

  // ===============================
  // CONFIRMAÇÕES - CRUD COMPLETO
  // ===============================

  static async createConfirmacao(data) {
    try {
      // Verificar se a matrícula existe
      const matriculaExists = await prisma.tb_matriculas.findUnique({
        where: { codigo: data.codigo_Matricula }
      });

      if (!matriculaExists) {
        throw new AppError('Matrícula não encontrada', 404);
      }

      // Verificar se a turma existe
      const turmaExists = await prisma.tb_turmas.findUnique({
        where: { codigo: data.codigo_Turma }
      });

      if (!turmaExists) {
        throw new AppError('Turma não encontrada', 404);
      }

      // Verificar se o utilizador existe
      const utilizadorExists = await prisma.tb_utilizadores.findUnique({
        where: { codigo: data.codigo_Utilizador }
      });

      if (!utilizadorExists) {
        throw new AppError('Utilizador não encontrado', 404);
      }

      // Verificar se o ano letivo existe
      const anoLectivoExists = await prisma.tb_ano_lectivo.findUnique({
        where: { codigo: data.codigo_Ano_lectivo }
      });

      if (!anoLectivoExists) {
        throw new AppError('Ano letivo não encontrado', 404);
      }

      // Verificar se já existe confirmação para esta matrícula no mesmo ano letivo
      const existingConfirmacao = await prisma.tb_confirmacoes.findFirst({
        where: {
          codigo_Matricula: data.codigo_Matricula,
          codigo_Ano_lectivo: data.codigo_Ano_lectivo
        }
      });

      if (existingConfirmacao) {
        throw new AppError('Já existe uma confirmação para esta matrícula neste ano letivo', 409);
      }

      const cleanData = { ...data };
      if (cleanData.classificacao) cleanData.classificacao = cleanData.classificacao.trim();

      return await prisma.tb_confirmacoes.create({
        data: cleanData
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar confirmação', 500);
    }
  }

  static async updateConfirmacao(id, data) {
    try {
      const existingConfirmacao = await prisma.tb_confirmacoes.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingConfirmacao) {
        throw new AppError('Confirmação não encontrada', 404);
      }

      // Verificações de referências se fornecidas
      if (data.codigo_Matricula) {
        const matriculaExists = await prisma.tb_matriculas.findUnique({
          where: { codigo: data.codigo_Matricula }
        });

        if (!matriculaExists) {
          throw new AppError('Matrícula não encontrada', 404);
        }
      }

      if (data.codigo_Turma) {
        const turmaExists = await prisma.tb_turmas.findUnique({
          where: { codigo: data.codigo_Turma }
        });

        if (!turmaExists) {
          throw new AppError('Turma não encontrada', 404);
        }
      }

      if (data.codigo_Utilizador) {
        const utilizadorExists = await prisma.tb_utilizadores.findUnique({
          where: { codigo: data.codigo_Utilizador }
        });

        if (!utilizadorExists) {
          throw new AppError('Utilizador não encontrado', 404);
        }
      }

      const updateData = { ...data };
      if (updateData.classificacao) updateData.classificacao = updateData.classificacao.trim();

      return await prisma.tb_confirmacoes.update({
        where: { codigo: parseInt(id) },
        data: updateData
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar confirmação', 500);
    }
  }

  static async getConfirmacoes(page = 1, limit = 10, search = '', statusFilter = null, anoLectivoFilter = null, alunoId = null) {
    try {
      const { skip, take } = getPagination(page, limit);

      // Se houver busca, buscar em turmas E alunos
      if (search && search.trim()) {
        const searchLower = search.toLowerCase();
        
        // Buscar turmas e alunos em paralelo
        const [todasTurmas, todosAlunos] = await Promise.all([
          prisma.tb_turmas.findMany({
            select: { codigo: true, designacao: true }
          }),
          prisma.tb_alunos.findMany({
            select: { codigo: true, nome: true }
          })
        ]);

        // Filtrar turmas (case-insensitive)
        const turmasFiltradas = todasTurmas.filter(t => 
          t.designacao && t.designacao.toLowerCase().includes(searchLower)
        );
        const turmaIds = turmasFiltradas.map(t => t.codigo);

        // Filtrar alunos (case-insensitive)
        const alunosFiltrados = todosAlunos.filter(a => 
          a.nome && a.nome.toLowerCase().includes(searchLower)
        );
        const alunoIds = alunosFiltrados.map(a => a.codigo);

        // Construir condições OR
        const orConditions = [];

        if (turmaIds.length > 0) {
          orConditions.push({ codigo_Turma: { in: turmaIds } });
        }

        if (alunoIds.length > 0) {
          orConditions.push({
            tb_matriculas: {
              codigo_Aluno: { in: alunoIds }
            }
          });
        }

        // Se não encontrou nada, retornar vazio
        if (orConditions.length === 0) {
          return {
            data: [],
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalItems: 0,
              itemsPerPage: limit
            }
          };
        }

        // Construir filtro principal
        const where = {
          OR: orConditions
        };

        // Adicionar filtros adicionais
        if (statusFilter !== null && statusFilter !== 'all') {
          where.codigo_Status = parseInt(statusFilter);
        }

        if (anoLectivoFilter !== null && anoLectivoFilter !== 'all') {
          where.codigo_Ano_lectivo = parseInt(anoLectivoFilter);
        }

        // Filtro por aluno específico
        if (alunoId !== null) {
          where.tb_matriculas = {
            codigo_Aluno: parseInt(alunoId)
          };
        }

        const [confirmacoes, total] = await Promise.all([
          prisma.tb_confirmacoes.findMany({
            where,
            skip,
            take,
            include: {
              tb_matriculas: {
                include: {
                  tb_alunos: {
                    select: {
                      codigo: true,
                      nome: true,
                      dataNascimento: true,
                      sexo: true,
                      url_Foto: true
                    }
                  },
                  tb_cursos: true
                }
              },
              tb_turmas: {
                include: {
                  tb_classes: true,
                  tb_salas: true,
                  tb_periodos: true
                }
              }
            },
            orderBy: { data_Confirmacao: 'desc' }
          }),
          prisma.tb_confirmacoes.count({ where })
        ]);

        return {
          data: confirmacoes,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit
          }
        };
      }

      // Sem busca - filtro simples
      const where = {};

      if (statusFilter !== null && statusFilter !== 'all') {
        where.codigo_Status = parseInt(statusFilter);
      }

      if (anoLectivoFilter !== null && anoLectivoFilter !== 'all') {
        where.codigo_Ano_lectivo = parseInt(anoLectivoFilter);
      }

      // Filtro por aluno específico
      if (alunoId !== null) {
        where.tb_matriculas = {
          codigo_Aluno: parseInt(alunoId)
        };
      }

      const [confirmacoes, total] = await Promise.all([
        prisma.tb_confirmacoes.findMany({
          where,
          skip,
          take,
          include: {
            tb_matriculas: {
              include: {
                tb_alunos: {
                  select: {
                    codigo: true,
                    nome: true,
                    dataNascimento: true,
                    sexo: true,
                    url_Foto: true
                  }
                },
                tb_cursos: true
              }
            },
            tb_turmas: {
              include: {
                tb_classes: true,
                tb_salas: true,
                tb_periodos: true
              }
            }
          },
          orderBy: { data_Confirmacao: 'desc' }
        }),
        prisma.tb_confirmacoes.count({ where })
      ]);

      return {
        data: confirmacoes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new AppError('Registro não encontrado', 404);
      }
      throw new AppError('Erro ao buscar confirmações', 500);
    }
  }

  static async getConfirmacaoById(id) {
    try {
      // Primeiro, verificar se a confirmação existe
      const confirmacao = await prisma.tb_confirmacoes.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!confirmacao) {
        throw new AppError('Confirmação não encontrada', 404);
      }

      // Buscar com includes de forma mais segura, mantendo a mesma estrutura do endpoint de listagem
      try {
        const confirmacaoCompleta = await prisma.tb_confirmacoes.findUnique({
          where: { codigo: parseInt(id) },
          include: {
            tb_matriculas: {
              include: {
                tb_alunos: {
                  select: {
                    codigo: true,
                    nome: true,
                    dataNascimento: true,
                    sexo: true,
                    url_Foto: true
                  }
                },
                tb_cursos: {
                  select: {
                    codigo: true,
                    designacao: true,
                    codigo_Status: true
                  }
                }
              }
            },
            tb_turmas: {
              include: {
                tb_classes: {
                  select: {
                    codigo: true,
                    designacao: true,
                    status: true,
                    notaMaxima: true,
                    exame: true
                  }
                },
                tb_salas: {
                  select: {
                    codigo: true,
                    designacao: true
                  }
                },
                tb_periodos: {
                  select: {
                    codigo: true,
                    designacao: true
                  }
                }
              }
            },
            tb_utilizadores: {
              select: {
                codigo: true,
                nome: true,
                user: true
              }
            }
          }
        });

        return confirmacaoCompleta || confirmacao;
      } catch (includeError) {
        
        // Se falhar com includes complexos, tentar com includes básicos
        try {
          const confirmacaoBasica = await prisma.tb_confirmacoes.findUnique({
            where: { codigo: parseInt(id) },
            include: {
              tb_matriculas: {
                include: {
                  tb_alunos: {
                    select: {
                      codigo: true,
                      nome: true,
                      dataNascimento: true,
                      sexo: true,
                      url_Foto: true
                    }
                  },
                  tb_cursos: true
                }
              },
              tb_turmas: true,
              tb_utilizadores: {
                select: {
                  codigo: true,
                  nome: true,
                  user: true
                }
              }
            }
          });

          return confirmacaoBasica || confirmacao;
        } catch (basicError) {
          // Retornar apenas a confirmação sem includes
          return confirmacao;
        }
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar confirmação', 500);
    }
  }

  static async deleteConfirmacao(id) {
    try {
      const existingConfirmacao = await prisma.tb_confirmacoes.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_matriculas: {
            include: {
              tb_alunos: {
                select: {
                  codigo: true,
                  nome: true
                }
              }
            }
          }
        }
      });

      if (!existingConfirmacao) {
        throw new AppError('Confirmação não encontrada', 404);
      }

      // TÉCNICA: SOFT DELETE COM VALIDAÇÃO
      // Verificar se é a última confirmação do aluno
      const totalConfirmacoes = await prisma.tb_confirmacoes.count({
        where: {
          codigo_Matricula: existingConfirmacao.codigo_Matricula
        }
      });

      console.log(`[DELETE CONFIRMAÇÃO] Confirmação ${id} - Total de confirmações da matrícula: ${totalConfirmacoes}`);

      // OPÇÃO A: Soft Delete (caso queira manter histórico)
      // Se for a última confirmação, pode querer avisar ao usuário
      if (totalConfirmacoes === 1) {
        console.log('[DELETE CONFIRMAÇÃO] ⚠ Aviso: Esta é a última confirmação da matrícula');
      }

      // TÉCNICA: HARD DELETE (Exclusão Física)
      // Confirmações geralmente podem ser excluídas sem problemas
      await prisma.tb_confirmacoes.delete({
        where: { codigo: parseInt(id) }
      });

      return { 
        message: 'Confirmação excluída com sucesso',
        tipo: 'hard_delete',
        info: totalConfirmacoes === 1 ? 'Esta era a última confirmação da matrícula' : null,
        detalhes: {
          alunoNome: existingConfirmacao.tb_matriculas?.tb_alunos?.nome,
          eraUltimaConfirmacao: totalConfirmacoes === 1
        }
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir confirmação:', error);
      throw new AppError('Erro ao excluir confirmação', 500);
    }
  }

  // ===============================
  // TRANSFERÊNCIAS - CRUD COMPLETO
  // ===============================

  static async createTransferencia(data) {
    try {
      // Verificar se o aluno existe
      const alunoExists = await prisma.tb_alunos.findUnique({
        where: { codigo: data.codigoAluno }
      });

      if (!alunoExists) {
        throw new AppError('Aluno não encontrado', 404);
      }

      const cleanData = { ...data };
      if (cleanData.obs) cleanData.obs = cleanData.obs.trim();

      return await prisma.tb_transferencias.create({
        data: cleanData,
        include: {
          tb_alunos: {
            select: {
              codigo: true,
              nome: true,
              dataNascimento: true,
              sexo: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar transferência', 500);
    }
  }

  static async updateTransferencia(id, data) {
    try {
      const existingTransferencia = await prisma.tb_transferencias.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingTransferencia) {
        throw new AppError('Transferência não encontrada', 404);
      }

      // Verificar se o aluno existe (se fornecido)
      if (data.codigoAluno) {
        const alunoExists = await prisma.tb_alunos.findUnique({
          where: { codigo: data.codigoAluno }
        });

        if (!alunoExists) {
          throw new AppError('Aluno não encontrado', 404);
        }
      }

      const updateData = { ...data };
      if (updateData.obs) updateData.obs = updateData.obs.trim();
      if (!updateData.dataActualizacao) updateData.dataActualizacao = new Date();

      return await prisma.tb_transferencias.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_alunos: {
            select: {
              codigo: true,
              nome: true,
              dataNascimento: true,
              sexo: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar transferência', 500);
    }
  }

  static async getTransferencias(page = 1, limit = 10, search = '') {
    try {
      const { skip, take } = getPagination(page, limit);

      const where = search ? {
        OR: [
          { tb_alunos: { nome: { contains: search } } },
          { obs: { contains: search } }
        ]
      } : {};

      const [transferencias, total] = await Promise.all([
        prisma.tb_transferencias.findMany({
          where,
          skip,
          take,
          include: {
            tb_alunos: {
              select: {
                codigo: true,
                nome: true,
                dataNascimento: true,
                sexo: true,
                url_Foto: true
              }
            }
          },
          orderBy: { dataTransferencia: 'desc' }
        }),
        prisma.tb_transferencias.count({ where })
      ]);

      // Buscar dados relacionados manualmente (apenas utilizador, pois as outras tabelas não existem)
      const transferenciasComDados = await Promise.all(
        transferencias.map(async (transferencia) => {
          // Buscar utilizador
          let utilizador = null;
          if (transferencia.codigoUtilizador) {
            try {
              utilizador = await prisma.tb_utilizadores.findUnique({
                where: { codigo: transferencia.codigoUtilizador },
                select: {
                  codigo: true,
                  nome: true,
                  user: true
                }
              });
            } catch (error) {
              throw new AppError('Erro ao buscar dados do utilizador', 500);
            }
          }

          return {
            ...transferencia,
            tb_utilizadores: utilizador
          };
        })
      );

      return {
        data: transferenciasComDados,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new AppError('Erro ao buscar transferências', 500);
    }
  }

  static async getTransferenciaById(id) {
    try {
      const transferencia = await prisma.tb_transferencias.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_alunos: {
            include: {
              tb_encarregados: {
                include: {
                  tb_profissao: true
                }
              },
              tb_matriculas: {
                include: {
                  tb_cursos: true
                }
              }
            }
          }
        }
      });

      if (!transferencia) {
        throw new AppError('Transferência não encontrada', 404);
      }

      return transferencia;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar transferência', 500);
    }
  }

  static async deleteTransferencia(id) {
    try {
      const existingTransferencia = await prisma.tb_transferencias.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_alunos: {
            select: {
              codigo: true,
              nome: true
            }
          }
        }
      });

      if (!existingTransferencia) {
        throw new AppError('Transferência não encontrada', 404);
      }

      console.log(`[DELETE TRANSFERÊNCIA] Excluindo transferência ${id} do aluno ${existingTransferencia.tb_alunos?.nome || existingTransferencia.codigoAluno}`);

      // TÉCNICA: HARD DELETE (Exclusão Física)
      // Transferências são registros históricos que podem ser excluídos
      // Mas importante: só excluir se não afetar a integridade do sistema
      
      // VALIDAÇÃO: Verificar se a transferência já foi processada
      // Se foi processada recentemente, pode querer confirmar com usuário
      const dataTransferencia = new Date(existingTransferencia.dataTransferencia);
      const diasDesdeTransferencia = Math.floor((Date.now() - dataTransferencia.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasDesdeTransferencia <= 7) {
        console.log(`[DELETE TRANSFERÊNCIA] ⚠ Aviso: Transferência recente (${diasDesdeTransferencia} dias)`);
      }

      await prisma.tb_transferencias.delete({
        where: { codigo: parseInt(id) }
      });

      return { 
        message: 'Transferência excluída com sucesso',
        tipo: 'hard_delete',
        detalhes: {
          alunoNome: existingTransferencia.tb_alunos?.nome,
          diasDesdeTransferencia,
          dataTransferencia: existingTransferencia.dataTransferencia
        },
        info: diasDesdeTransferencia <= 7 ? 'Esta transferência foi realizada recentemente' : null
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir transferência:', error);
      throw new AppError('Erro ao excluir transferência', 500);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS E CONSULTAS
  // ===============================

  static async getAlunosByTurma(codigo_Turma) {
    try {
      const alunos = await prisma.tb_confirmacoes.findMany({
        where: {
          codigo_Turma: parseInt(codigo_Turma),
          codigo_Status: 1
        },
        include: {
          tb_matriculas: {
            include: {
              tb_alunos: {
                select: {
                  codigo: true,
                  nome: true,
                  dataNascimento: true,
                  sexo: true,
                  url_Foto: true,
                  saldo: true
                }
              }
            }
          },
          tb_turmas: {
            include: {
              tb_classes: true,
              tb_salas: true,
              tb_periodos: true
            }
          }
        }
      });

      return alunos.map(confirmacao => ({
        ...confirmacao.tb_matriculas.tb_alunos,
        confirmacao: {
          codigo: confirmacao.codigo,
          data_Confirmacao: confirmacao.data_Confirmacao,
          classificacao: confirmacao.classificacao
        },
        turma: confirmacao.tb_turmas
      }));
    } catch (error) {
      throw new AppError('Erro ao buscar alunos da turma', 500);
    }
  }

  static async getMatriculasByAnoLectivo(codigo_AnoLectivo) {
    try {
      const matriculas = await prisma.tb_confirmacoes.findMany({
        where: {
          codigo_Ano_lectivo: parseInt(codigo_AnoLectivo),
          codigo_Status: 1
        },
        include: {
          tb_matriculas: {
            include: {
              tb_alunos: {
                select: {
                  codigo: true,
                  nome: true,
                  dataNascimento: true,
                  sexo: true,
                  url_Foto: true
                }
              },
              tb_cursos: true
            }
          },
          tb_turmas: {
            include: {
              tb_classes: true,
              tb_salas: true,
              tb_periodos: true
            }
          }
        }
      });

      return matriculas;
    } catch (error) {
      throw new AppError('Erro ao buscar matrículas do ano letivo', 500);
    }
  }

  static async getConfirmacoesByTurmaAndAno(codigo_Turma, codigo_AnoLectivo) {
    try {
      const confirmacoes = await prisma.tb_confirmacoes.findMany({
        where: {
          codigo_Turma: parseInt(codigo_Turma),
          codigo_Ano_lectivo: parseInt(codigo_AnoLectivo),
          codigo_Status: 1
        },
        include: {
          tb_matriculas: {
            include: {
              tb_alunos: {
                select: {
                  codigo: true,
                  nome: true,
                  dataNascimento: true,
                  sexo: true,
                  url_Foto: true,
                  saldo: true
                }
              },
              tb_cursos: true
            }
          },
          tb_turmas: {
            include: {
              tb_classes: true,
              tb_salas: true,
              tb_periodos: true
            }
          }
        }
      });

      return confirmacoes;
    } catch (error) {
      throw new AppError('Erro ao buscar confirmações da turma e ano', 500);
    }
  }

  static async getAlunosWithoutMatricula() {
    try {
      const alunos = await prisma.tb_alunos.findMany({
        where: {
          codigo_Status: 1,
          tb_matriculas: null
        },
        include: {
          tb_encarregados: {
            select: {
              codigo: true,
              nome: true,
              telefone: true
            }
          },
        },
        orderBy: { nome: 'asc' }
      });

      return alunos;
    } catch (error) {
      throw new AppError('Erro ao buscar alunos sem matrícula', 500);
    }
  }

  static async getMatriculasWithoutConfirmacao() {
    try {
      
      // Primeiro, vamos verificar se há dados básicos
      const totalMatriculas = await prisma.tb_matriculas.count();
      const totalAlunos = await prisma.tb_alunos.count();
      
      // Retornar TODAS as matrículas ativas para permitir confirmações
      const matriculas = await prisma.tb_matriculas.findMany({
        where: {
          codigoStatus: 1 // Apenas matrículas ativas
        },
        include: {
          tb_alunos: {
            select: {
              codigo: true,
              nome: true,
              dataNascimento: true,
              sexo: true,
              url_Foto: true,
              email: true,
              telefone: true
            }
          },
          tb_cursos: {
            select: {
              codigo: true,
              designacao: true,
              codigo_Status: true
            }
          },
          tb_confirmacoes: {
            select: {
              codigo: true,
              codigo_Ano_lectivo: true,
              data_Confirmacao: true,
              classificacao: true
            },
            orderBy: { data_Confirmacao: 'desc' }
          }
        },
        orderBy: { data_Matricula: 'desc' }
      });

      return matriculas;
    } catch (error) {
      throw new AppError('Erro ao buscar matrículas', 500);
    }
  }

  // ===============================
  // ESTATÍSTICAS
  // ===============================

  static async getMatriculasStatistics(statusFilter = null, cursoFilter = null) {
    try {
      console.log('[getMatriculasStatistics] Gerando estatísticas de matrículas com filtros:', { statusFilter, cursoFilter });

      // Construir filtro base
      const baseWhere = {};
      
      // Filtro por status (se fornecido)
      if (statusFilter !== null && statusFilter !== 'all') {
        baseWhere.codigoStatus = parseInt(statusFilter);
      }
      
      // Filtro por curso (se fornecido)
      if (cursoFilter !== null && cursoFilter !== 'all') {
        baseWhere.codigo_Curso = parseInt(cursoFilter);
      }

      // Executar queries em paralelo para melhor performance
      const [
        totalMatriculas,
        matriculasAtivas,
        matriculasInativas,
        matriculasComConfirmacao,
        matriculasSemConfirmacao,
        distribuicaoPorCurso
      ] = await Promise.all([
        // Total de matrículas (com filtros aplicados)
        prisma.tb_matriculas.count({ where: baseWhere }),

        // Matrículas ativas (codigoStatus = 1)
        prisma.tb_matriculas.count({ 
          where: { 
            ...baseWhere,
            codigoStatus: 1 
          } 
        }),

        // Matrículas inativas (codigoStatus != 1)
        prisma.tb_matriculas.count({ 
          where: { 
            ...baseWhere,
            codigoStatus: { not: 1 }
          } 
        }),

        // Matrículas com confirmação
        prisma.tb_matriculas.count({
          where: {
            ...baseWhere,
            tb_confirmacoes: { 
              some: {} 
            }
          }
        }),

        // Matrículas sem confirmação
        prisma.tb_matriculas.count({
          where: {
            ...baseWhere,
            tb_confirmacoes: { 
              none: {} 
            }
          }
        }),

        // Distribuição por curso (top 5)
        prisma.tb_matriculas.groupBy({
          by: ['codigo_Curso'],
          where: baseWhere,
          _count: {
            codigo: true
          },
          orderBy: {
            _count: {
              codigo: 'desc'
            }
          },
          take: 5
        })
      ]);

      // Buscar informações dos cursos para a distribuição
      const cursosIds = distribuicaoPorCurso.map(item => item.codigo_Curso);
      const cursos = await prisma.tb_cursos.findMany({
        where: {
          codigo: { in: cursosIds }
        },
        select: {
          codigo: true,
          designacao: true
        }
      });

      // Mapear cursos com suas contagens
      const cursosMap = new Map(cursos.map(c => [c.codigo, c.designacao]));
      const distribuicaoCursos = distribuicaoPorCurso.map(item => ({
        curso: cursosMap.get(item.codigo_Curso) || 'Desconhecido',
        total: item._count.codigo
      }));

      return {
        total: totalMatriculas,
        ativas: matriculasAtivas,
        inativas: matriculasInativas,
        comConfirmacao: matriculasComConfirmacao,
        semConfirmacao: matriculasSemConfirmacao,
        percentualAtivas: totalMatriculas > 0 ? ((matriculasAtivas / totalMatriculas) * 100).toFixed(2) : '0',
        percentualComConfirmacao: totalMatriculas > 0 ? ((matriculasComConfirmacao / totalMatriculas) * 100).toFixed(2) : '0',
        distribuicaoPorCurso: distribuicaoCursos
      };
    } catch (error) {
      console.error('Erro ao gerar estatísticas de matrículas:', error);
      throw new AppError('Erro ao gerar estatísticas de matrículas', 500);
    }
  }

  static async getAlunosStatistics(statusFilter = null, cursoFilter = null) {
    try {
      console.log('[getAlunosStatistics] Gerando estatísticas com filtros:', { statusFilter, cursoFilter });

      // Construir filtro base
      const baseWhere = {};
      
      // Filtro por status (se fornecido)
      if (statusFilter !== null && statusFilter !== 'all') {
        baseWhere.codigo_Status = parseInt(statusFilter);
      }
      
      // Filtro por curso (se fornecido)
      if (cursoFilter !== null && cursoFilter !== 'all') {
        baseWhere.tb_matriculas = {
          is: {
            tb_cursos: {
              codigo: parseInt(cursoFilter)
            }
          }
        };
      }

      // Executar queries em paralelo para melhor performance
      const [
        totalAlunos,
        alunosAtivos,
        alunosInativos,
        alunosComMatricula,
        alunosSemMatricula,
        distribuicaoPorSexo
      ] = await Promise.all([
        // Total de alunos (com filtros aplicados)
        prisma.tb_alunos.count({ where: baseWhere }),

        // Alunos ativos (status = 1)
        prisma.tb_alunos.count({ 
          where: { 
            ...baseWhere,
            codigo_Status: 1 
          } 
        }),

        // Alunos inativos (status != 1)
        prisma.tb_alunos.count({ 
          where: { 
            ...baseWhere,
            codigo_Status: { not: 1 }
          } 
        }),

        // Alunos com matrícula
        prisma.tb_alunos.count({
          where: {
            ...baseWhere,
            tb_matriculas: { isNot: null }
          }
        }),

        // Alunos sem matrícula
        prisma.tb_alunos.count({
          where: {
            ...baseWhere,
            tb_matriculas: null
          }
        }),

        // Distribuição por sexo
        prisma.tb_alunos.groupBy({
          by: ['sexo'],
          where: baseWhere,
          _count: {
            codigo: true
          }
        })
      ]);

      // Processar distribuição por sexo
      const sexoStats = {
        masculino: 0,
        feminino: 0,
        outro: 0
      };

      distribuicaoPorSexo.forEach(item => {
        const sexo = item.sexo?.toLowerCase() || '';
        if (sexo === 'm' || sexo === 'masculino') {
          sexoStats.masculino = item._count.codigo;
        } else if (sexo === 'f' || sexo === 'feminino') {
          sexoStats.feminino = item._count.codigo;
        } else {
          sexoStats.outro = item._count.codigo;
        }
      });

      const statistics = {
        totalAlunos,
        alunosAtivos,
        alunosInativos,
        alunosComMatricula,
        alunosSemMatricula,
        distribuicaoPorSexo: sexoStats,
        percentuais: {
          ativos: totalAlunos > 0 ? ((alunosAtivos / totalAlunos) * 100).toFixed(2) : '0.00',
          inativos: totalAlunos > 0 ? ((alunosInativos / totalAlunos) * 100).toFixed(2) : '0.00',
          comMatricula: totalAlunos > 0 ? ((alunosComMatricula / totalAlunos) * 100).toFixed(2) : '0.00',
          semMatricula: totalAlunos > 0 ? ((alunosSemMatricula / totalAlunos) * 100).toFixed(2) : '0.00',
        }
      };

      console.log('[getAlunosStatistics] Estatísticas geradas:', statistics);

      return statistics;
    } catch (error) {
      console.error('Erro ao gerar estatísticas de alunos:', error);
      throw new AppError('Erro ao gerar estatísticas de alunos', 500);
    }
  }

  static async getConfirmacoesStatistics(statusFilter = null, anoLectivoFilter = null) {
    try {
      console.log('[getConfirmacoesStatistics] Gerando estatísticas de confirmações com filtros:', { statusFilter, anoLectivoFilter });

      // Construir filtro base
      const baseWhere = {};
      
      // Filtro por status (se fornecido)
      if (statusFilter !== null && statusFilter !== 'all') {
        baseWhere.codigo_Status = parseInt(statusFilter);
      }
      
      // Filtro por ano letivo (se fornecido)
      if (anoLectivoFilter !== null && anoLectivoFilter !== 'all') {
        baseWhere.codigo_Ano_lectivo = parseInt(anoLectivoFilter);
      }

      // Executar queries em paralelo para melhor performance
      const [
        totalConfirmacoes,
        confirmacoesAtivas,
        confirmacoesInativas,
        aprovados,
        reprovados,
        pendentes,
        distribuicaoPorAnoLectivo,
        distribuicaoPorClassificacao,
        distribuicaoPorTurma
      ] = await Promise.all([
        // Total de confirmações (com filtros aplicados)
        prisma.tb_confirmacoes.count({ where: baseWhere }),

        // Confirmações ativas (codigo_Status = 1)
        prisma.tb_confirmacoes.count({ 
          where: { 
            ...baseWhere,
            codigo_Status: 1 
          } 
        }),

        // Confirmações inativas (codigo_Status != 1)
        prisma.tb_confirmacoes.count({ 
          where: { 
            ...baseWhere,
            codigo_Status: { not: 1 }
          } 
        }),

        // Aprovados
        prisma.tb_confirmacoes.count({
          where: {
            ...baseWhere,
            classificacao: { contains: 'Aprovado' }
          }
        }),

        // Reprovados
        prisma.tb_confirmacoes.count({
          where: {
            ...baseWhere,
            classificacao: { contains: 'Reprovado' }
          }
        }),

        // Pendentes
        prisma.tb_confirmacoes.count({
          where: {
            ...baseWhere,
            classificacao: { contains: 'Pendente' }
          }
        }),

        // Distribuição por ano letivo (top 5)
        prisma.tb_confirmacoes.groupBy({
          by: ['codigo_Ano_lectivo'],
          where: baseWhere,
          _count: {
            codigo: true
          },
          orderBy: {
            _count: {
              codigo: 'desc'
            }
          },
          take: 5
        }),

        // Distribuição por classificação
        prisma.tb_confirmacoes.groupBy({
          by: ['classificacao'],
          where: baseWhere,
          _count: {
            codigo: true
          },
          orderBy: {
            _count: {
              codigo: 'desc'
            }
          }
        }),

        // Distribuição por turma (top 10)
        prisma.tb_confirmacoes.groupBy({
          by: ['codigo_Turma'],
          where: baseWhere,
          _count: {
            codigo: true
          },
          orderBy: {
            _count: {
              codigo: 'desc'
            }
          },
          take: 10
        })
      ]);

      // Buscar detalhes dos anos letivos
      const anosLectivosIds = distribuicaoPorAnoLectivo.map(item => item.codigo_Ano_lectivo);
      const anosLectivosDetalhes = await prisma.tb_ano_lectivo.findMany({
        where: {
          codigo: { in: anosLectivosIds }
        },
        select: {
          codigo: true,
          designacao: true
        }
      });

      // Buscar detalhes das turmas
      const turmasIds = distribuicaoPorTurma.map(item => item.codigo_Turma);
      const turmasDetalhes = await prisma.tb_turmas.findMany({
        where: {
          codigo: { in: turmasIds }
        },
        select: {
          codigo: true,
          designacao: true,
          tb_classes: {
            select: {
              codigo: true,
              designacao: true
            }
          }
        }
      });

      // Mapear distribuição por ano letivo com detalhes
      const anosLectivosComDetalhes = distribuicaoPorAnoLectivo.map(item => {
        const anoLectivo = anosLectivosDetalhes.find(al => al.codigo === item.codigo_Ano_lectivo);
        return {
          codigo_Ano_lectivo: item.codigo_Ano_lectivo,
          designacao: anoLectivo?.designacao || 'Ano Letivo Desconhecido',
          total: item._count.codigo
        };
      });

      // Mapear distribuição por turma com detalhes
      const turmasComDetalhes = distribuicaoPorTurma.map(item => {
        const turma = turmasDetalhes.find(t => t.codigo === item.codigo_Turma);
        return {
          codigo_Turma: item.codigo_Turma,
          designacao_Turma: turma?.designacao || 'Turma Desconhecida',
          designacao_Classe: turma?.tb_classes?.designacao || 'Classe Desconhecida',
          total: item._count.codigo
        };
      });

      // Processar distribuição por classificação
      const classificacaoStats = distribuicaoPorClassificacao.map(item => ({
        classificacao: item.classificacao || 'Não Definido',
        total: item._count.codigo
      }));

      const statistics = {
        totalConfirmacoes,
        confirmacoesAtivas,
        confirmacoesInativas,
        aprovados,
        reprovados,
        pendentes,
        distribuicaoPorAnoLectivo: anosLectivosComDetalhes,
        distribuicaoPorClassificacao: classificacaoStats,
        distribuicaoPorTurma: turmasComDetalhes,
        percentuais: {
          ativas: totalConfirmacoes > 0 ? ((confirmacoesAtivas / totalConfirmacoes) * 100).toFixed(2) : '0.00',
          inativas: totalConfirmacoes > 0 ? ((confirmacoesInativas / totalConfirmacoes) * 100).toFixed(2) : '0.00',
          aprovados: totalConfirmacoes > 0 ? ((aprovados / totalConfirmacoes) * 100).toFixed(2) : '0.00',
          reprovados: totalConfirmacoes > 0 ? ((reprovados / totalConfirmacoes) * 100).toFixed(2) : '0.00',
          pendentes: totalConfirmacoes > 0 ? ((pendentes / totalConfirmacoes) * 100).toFixed(2) : '0.00'
        }
      };

      console.log('[getConfirmacoesStatistics] Estatísticas geradas:', statistics);

      return statistics;
    } catch (error) {
      console.error('Erro ao gerar estatísticas de confirmações:', error);
      throw new AppError('Erro ao gerar estatísticas de confirmações', 500);
    }
  }
}