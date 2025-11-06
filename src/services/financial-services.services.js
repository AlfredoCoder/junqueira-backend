// services/financial-services.services.js
import prisma from '../config/database.js';
import { AppError } from '../utils/validation.utils.js';

export class FinancialServicesService {
  // ===============================
  // MOEDAS - CRUD COMPLETO
  // ===============================

  static async createMoeda(data) {
    try {
      const { designacao } = data;

      const existingMoeda = await prisma.tb_moedas.findFirst({
        where: {
          designacao: designacao.trim()
        }
      });

      if (existingMoeda) {
        throw new AppError('Já existe uma moeda com esta designação', 409);
      }

      return await prisma.tb_moedas.create({
        data: {
          designacao: designacao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar moeda', 500);
    }
  }

  static async updateMoeda(id, data) {
    try {
      const existingMoeda = await prisma.tb_moedas.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingMoeda) {
        throw new AppError('Moeda não encontrada', 404);
      }

      if (data.designacao) {
        const duplicateMoeda = await prisma.tb_moedas.findFirst({
          where: {
            designacao: data.designacao.trim(),
            codigo: { not: parseInt(id) }
          }
        });

        if (duplicateMoeda) {
          throw new AppError('Já existe uma moeda com esta designação', 409);
        }
      }

      return await prisma.tb_moedas.update({
        where: { codigo: parseInt(id) },
        data: { designacao: data.designacao.trim() }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar moeda', 500);
    }
  }

  static async getMoedas(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};

      const [moedas, total] = await Promise.all([
        prisma.tb_moedas.findMany({
          where,
          skip,
          take: limit,
          include: {
            _count: {
              select: { tb_tipo_servicos: true }
            }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_moedas.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: moedas,
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
      throw new AppError('Erro ao buscar moedas', 500);
    }
  }

  static async getMoedaById(id) {
    try {
      const moeda = await prisma.tb_moedas.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_servicos: {
            select: { codigo: true, designacao: true, preco: true },
            orderBy: { designacao: 'asc' }
          }
        }
      });

      if (!moeda) {
        throw new AppError('Moeda não encontrada', 404);
      }

      return moeda;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar moeda', 500);
    }
  }

  static async deleteMoeda(id) {
    try {
      const existingMoeda = await prisma.tb_moedas.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_servicos: true
        }
      });

      if (!existingMoeda) {
        throw new AppError('Moeda não encontrada', 404);
      }

      if (existingMoeda.tb_tipo_servicos.length > 0) {
        throw new AppError('Não é possível excluir esta moeda pois possui serviços associados', 400);
      }

      await prisma.tb_moedas.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Moeda excluída com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir moeda', 500);
    }
  }

  // ===============================
  // CATEGORIAS DE SERVIÇOS - CRUD COMPLETO
  // ===============================

  static async createCategoriaServico(data) {
    try {
      const { designacao } = data;

      if (designacao) {
        const existingCategoria = await prisma.tb_categoria_servicos.findFirst({
          where: {
            designacao: designacao.trim()
          }
        });

        if (existingCategoria) {
          throw new AppError('Já existe uma categoria com esta designação', 409);
        }
      }

      return await prisma.tb_categoria_servicos.create({
        data: {
          designacao: designacao?.trim() || ""
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar categoria de serviço', 500);
    }
  }

  static async updateCategoriaServico(id, data) {
    try {
      const existingCategoria = await prisma.tb_categoria_servicos.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingCategoria) {
        throw new AppError('Categoria de serviço não encontrada', 404);
      }

      if (data.designacao) {
        const duplicateCategoria = await prisma.tb_categoria_servicos.findFirst({
          where: {
            designacao: data.designacao.trim(),
            codigo: { not: parseInt(id) }
          }
        });

        if (duplicateCategoria) {
          throw new AppError('Já existe uma categoria com esta designação', 409);
        }
      }

      return await prisma.tb_categoria_servicos.update({
        where: { codigo: parseInt(id) },
        data: { designacao: data.designacao?.trim() || "" }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar categoria de serviço', 500);
    }
  }

  static async getCategoriasServicos(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};

      const [categorias, total] = await Promise.all([
        prisma.tb_categoria_servicos.findMany({
          where,
          skip,
          take: limit,
          include: {
            _count: {
              select: { tb_tipo_servicos: true }
            }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_categoria_servicos.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: categorias,
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
      throw new AppError('Erro ao buscar categorias de serviços', 500);
    }
  }

  static async getCategoriaServicoById(id) {
    try {
      const categoria = await prisma.tb_categoria_servicos.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_servicos: {
            select: { codigo: true, designacao: true, preco: true, status: true },
            orderBy: { designacao: 'asc' }
          }
        }
      });

      if (!categoria) {
        throw new AppError('Categoria de serviço não encontrada', 404);
      }

      return categoria;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar categoria de serviço', 500);
    }
  }

  static async deleteCategoriaServico(id) {
    try {
      const existingCategoria = await prisma.tb_categoria_servicos.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_servicos: true
        }
      });

      if (!existingCategoria) {
        throw new AppError('Categoria de serviço não encontrada', 404);
      }

      if (existingCategoria.tb_tipo_servicos.length > 0) {
        throw new AppError('Não é possível excluir esta categoria pois possui serviços associados', 400);
      }

      await prisma.tb_categoria_servicos.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Categoria de serviço excluída com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir categoria de serviço', 500);
    }
  }

  // ===============================
  // TIPOS DE SERVIÇOS - CRUD COMPLETO
  // ===============================

  static async createTipoServico(data) {
    try {
      const {
        designacao, preco, descricao, codigo_Utilizador, codigo_Moeda,
        tipoServico, status, aplicarMulta, aplicarDesconto, codigo_Ano,
        codigoAnoLectivo, valorMulta, iva, codigoRasao, categoria, codigo_multa,
        codigo_Classe, codigo_Curso
      } = data;

      // Verificar entidades relacionadas
      const moedaExists = await prisma.tb_moedas.findUnique({
        where: { codigo: parseInt(codigo_Moeda) }
      });

      if (!moedaExists) {
        throw new AppError('Moeda não encontrada', 404);
      }

      const existingTipoServico = await prisma.tb_tipo_servicos.findFirst({
        where: {
          designacao: designacao.trim()
        }
      });

      if (existingTipoServico) {
        throw new AppError('Já existe um tipo de serviço com esta designação', 409);
      }

      return await prisma.tb_tipo_servicos.create({
        data: {
          designacao: designacao.trim(),
          preco: parseFloat(preco),
          descricao: descricao.trim(),
          codigo_Utilizador: parseInt(codigo_Utilizador),
          codigo_Moeda: parseInt(codigo_Moeda),
          tipoServico: tipoServico.trim(),
          status: status?.trim() || "Activo",
          aplicarMulta: aplicarMulta !== undefined ? Boolean(aplicarMulta) : false,
          aplicarDesconto: aplicarDesconto !== undefined ? Boolean(aplicarDesconto) : false,
          codigo_Ano: codigo_Ano ? parseInt(codigo_Ano) : 1,
          codigoAnoLectivo: codigoAnoLectivo ? parseInt(codigoAnoLectivo) : null,
          valorMulta: valorMulta ? parseFloat(valorMulta) : 0,
          iva: iva ? parseInt(iva) : null,
          codigoRasao: codigoRasao ? parseInt(codigoRasao) : null,
          categoria: categoria ? parseInt(categoria) : null,
          codigo_multa: codigo_multa ? parseInt(codigo_multa) : null,
          codigo_Classe: codigo_Classe ? parseInt(codigo_Classe) : null,
          codigo_Curso: codigo_Curso ? parseInt(codigo_Curso) : null
        },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro detalhado ao criar tipo de serviço:', error);
      throw new AppError('Erro ao criar tipo de serviço', 500);
    }
  }

  static async updateTipoServico(id, data) {
    try {
      const existingTipoServico = await prisma.tb_tipo_servicos.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingTipoServico) {
        throw new AppError('Tipo de serviço não encontrado', 404);
      }

      // Verificar moeda se fornecida
      if (data.codigo_Moeda) {
        const moedaExists = await prisma.tb_moedas.findUnique({
          where: { codigo: parseInt(data.codigo_Moeda) }
        });
        if (!moedaExists) throw new AppError('Moeda não encontrada', 404);
      }

      if (data.designacao) {
        const duplicateTipoServico = await prisma.tb_tipo_servicos.findFirst({
          where: {
            designacao: data.designacao.trim(),
            codigo: { not: parseInt(id) }
          }
        });

        if (duplicateTipoServico) {
          throw new AppError('Já existe um tipo de serviço com esta designação', 409);
        }
      }

      const updateData = {};
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          switch (key) {
            case 'designacao':
            case 'descricao':
            case 'tipoServico':
            case 'status':
              updateData[key] = data[key].trim();
              break;
            case 'preco':
            case 'valorMulta':
              updateData[key] = parseFloat(data[key]);
              break;
            case 'aplicarMulta':
            case 'aplicarDesconto':
              updateData[key] = Boolean(data[key]);
              break;
            case 'codigo_Utilizador':
            case 'codigo_Moeda':
            case 'codigo_Ano':
            case 'codigoAnoLectivo':
            case 'iva':
            case 'codigoRasao':
            case 'categoria':
            case 'codigo_multa':
              updateData[key] = parseInt(data[key]);
              break;
          }
        }
      });

      return await prisma.tb_tipo_servicos.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_moedas: { select: { codigo: true, designacao: true } },
          tb_categoria_servicos: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar tipo de serviço', 500);
    }
  }

  static async getTiposServicos(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      // MySQL não suporta mode: 'insensitive', então usamos uma abordagem diferente
      const where = search ? {
        OR: [
          {
            designacao: {
              contains: search
            }
          },
          {
            descricao: {
              contains: search
            }
          }
        ]
      } : {};

      const [tiposServicos, total] = await Promise.all([
        prisma.tb_tipo_servicos.findMany({
          where,
          skip,
          take: limit,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_tipo_servicos.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: tiposServicos,
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
      throw new AppError('Erro ao buscar tipos de serviços', 500);
    }
  }

  static async getTipoServicoById(id) {
    try {
      // Implementando abordagem step-by-step baseada na memória para evitar erros de includes complexos
      let tipoServico;
      
      try {
        // Primeira tentativa com includes completos
        tipoServico = await prisma.tb_tipo_servicos.findUnique({
          where: { codigo: parseInt(id) },
          include: {
            tb_moedas: { select: { codigo: true, designacao: true } },
            tb_categoria_servicos: { select: { codigo: true, designacao: true } },
            tb_servicos_turma: {
              select: { codigo: true, anoLectivo: true },
              take: 5
            },
            tb_servico_aluno: {
              select: { codigo: true, status: true },
              take: 5
            }
          }
        });
      } catch (includeError) {
        console.error('Erro com includes complexos, tentando abordagem simples:', includeError);
        
        // Fallback: busca simples primeiro
        tipoServico = await prisma.tb_tipo_servicos.findUnique({
          where: { codigo: parseInt(id) }
        });
        
        if (tipoServico) {
          // Buscar relacionamentos separadamente se necessário
          try {
            const [moeda, categoria] = await Promise.all([
              tipoServico.codigo_Moeda ? prisma.tb_moedas.findUnique({
                where: { codigo: tipoServico.codigo_Moeda },
                select: { codigo: true, designacao: true }
              }) : null,
              tipoServico.categoria ? prisma.tb_categoria_servicos.findUnique({
                where: { codigo: tipoServico.categoria },
                select: { codigo: true, designacao: true }
              }) : null
            ]);
            
            tipoServico.tb_moedas = moeda;
            tipoServico.tb_categoria_servicos = categoria;
          } catch (relationError) {
            console.error('Erro ao buscar relacionamentos:', relationError);
          }
        }
      }

      if (!tipoServico) {
        throw new AppError('Tipo de serviço não encontrado', 404);
      }

      return tipoServico;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro detalhado ao buscar tipo de serviço:', error);
      throw new AppError('Erro ao buscar tipo de serviço', 500);
    }
  }

  static async deleteTipoServico(id) {
    try {
      const existingTipoServico = await prisma.tb_tipo_servicos.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_pagamentos: true
        }
      });

      if (!existingTipoServico) {
        throw new AppError('Tipo de serviço não encontrado', 404);
      }

      // Implementar delete em cascata - remover todas as dependências
      // Usar uma transação para garantir que tudo seja deletado ou nada
      await prisma.$transaction(async (tx) => {
        // 1. Deletar pagamentos associados
        if (existingTipoServico.tb_pagamentos.length > 0) {
          await tx.tb_pagamentos.deleteMany({
            where: { codigo_Servico: parseInt(id) }
          });
        }

        // 2. Deletar propinas de classe associadas
        if (existingTipoServico.tb_propina_classe.length > 0) {
          await tx.tb_propina_classe.deleteMany({
            where: { codigoTipoServico: parseInt(id) }
          });
        }

        // 3. Deletar serviços de aluno associados
        if (existingTipoServico.tb_servico_aluno.length > 0) {
          await tx.tb_servico_aluno.deleteMany({
            where: { codigo_Servico: parseInt(id) }
          });
        }

        // 4. Deletar serviços de turma associados
        if (existingTipoServico.tb_servicos_turma.length > 0) {
          await tx.tb_servicos_turma.deleteMany({
            where: { codigoServico: parseInt(id) }
          });
        }

        // 5. Finalmente, deletar o tipo de serviço
        await tx.tb_tipo_servicos.delete({
          where: { codigo: parseInt(id) }
        });
      });

      return { 
        message: 'Tipo de serviço e todas as suas dependências foram excluídos com sucesso',
        deleted: {
          pagamentos: existingTipoServico.tb_pagamentos.length,
          propinasClasse: existingTipoServico.tb_propina_classe.length,
          servicosAluno: existingTipoServico.tb_servico_aluno.length,
          servicosTurma: existingTipoServico.tb_servicos_turma.length
        }
      };
    } catch (error) {
      console.error('Erro detalhado ao excluir tipo de serviço:', error);
      if (error instanceof AppError) throw error;
      
      // Lançar erro mais detalhado
      const errorMessage = error.message || 'Erro desconhecido ao excluir tipo de serviço';
      throw new AppError(`Erro ao excluir tipo de serviço: ${errorMessage}`, 500);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getTiposServicosPorCategoria(categoriaId) {
    try {
      const categoriaExists = await prisma.tb_categoria_servicos.findUnique({
        where: { codigo: parseInt(categoriaId) }
      });

      if (!categoriaExists) {
        throw new AppError('Categoria não encontrada', 404);
      }

      return await prisma.tb_tipo_servicos.findMany({
        where: { categoria: parseInt(categoriaId) },
        include: {
          tb_moedas: { select: { codigo: true, designacao: true } }
        },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar tipos de serviços por categoria', 500);
    }
  }

  static async getTiposServicosPorMoeda(moedaId) {
    try {
      const moedaExists = await prisma.tb_moedas.findUnique({
        where: { codigo: parseInt(moedaId) }
      });

      if (!moedaExists) {
        throw new AppError('Moeda não encontrada', 404);
      }

      return await prisma.tb_tipo_servicos.findMany({
        where: { codigo_Moeda: parseInt(moedaId) },
        include: {
          tb_categoria_servicos: { select: { codigo: true, designacao: true } }
        },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar tipos de serviços por moeda', 500);
    }
  }

  static async getTiposServicosAtivos() {
    try {
      return await prisma.tb_tipo_servicos.findMany({
        where: { status: "Activo" },
        include: {
          tb_moedas: { select: { codigo: true, designacao: true } },
          tb_categoria_servicos: { select: { codigo: true, designacao: true } }
        },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar tipos de serviços ativos', 500);
    }
  }

  static async getTiposServicosComMulta() {
    try {
      return await prisma.tb_tipo_servicos.findMany({
        where: { aplicarMulta: true },
        include: {
          tb_moedas: { select: { codigo: true, designacao: true } },
          tb_categoria_servicos: { select: { codigo: true, designacao: true } }
        },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar tipos de serviços com multa', 500);
    }
  }

  static async getRelatorioFinanceiro() {
    try {
      const [
        totalMoedas,
        totalCategorias,
        totalTiposServicos,
        servicosAtivos,
        servicosComMulta,
        servicosComDesconto
      ] = await Promise.all([
        prisma.tb_moedas.count(),
        prisma.tb_categoria_servicos.count(),
        prisma.tb_tipo_servicos.count(),
        prisma.tb_tipo_servicos.count({ where: { status: "Activo" } }),
        prisma.tb_tipo_servicos.count({ where: { aplicarMulta: true } }),
        prisma.tb_tipo_servicos.count({ where: { aplicarDesconto: true } })
      ]);

      return {
        resumo: {
          totalMoedas,
          totalCategorias,
          totalTiposServicos,
          servicosAtivos,
          servicosComMulta,
          servicosComDesconto
        }
      };
    } catch (error) {
      throw new AppError('Erro ao gerar relatório financeiro', 500);
    }
  }

  // ===============================
  // RELATÓRIOS DE VENDAS
  // ===============================

  static async getRelatorioVendas(filters = {}) {
    try {
      const { periodo, ano, mes, dataInicio, dataFim } = filters;
      
      // Construir filtros de data
      let whereClause = {};
      
      if (dataInicio && dataFim) {
        whereClause.data = {
          gte: new Date(dataInicio),
          lte: new Date(dataFim)
        };
      } else if (ano) {
        const startDate = new Date(`${ano}-01-01`);
        const endDate = new Date(`${ano}-12-31`);
        whereClause.data = {
          gte: startDate,
          lte: endDate
        };
        
        if (mes) {
          const mesStart = new Date(`${ano}-${mes.toString().padStart(2, '0')}-01`);
          const mesEnd = new Date(ano, mes, 0); // Último dia do mês
          whereClause.data = {
            gte: mesStart,
            lte: mesEnd
          };
        }
      }

      // Buscar pagamentos com filtros
      const [pagamentos, totalVendas, vendasHoje] = await Promise.all([
        prisma.tb_pagamentos.findMany({
          where: whereClause,
          include: {
            aluno: {
              select: {
                nome: true,
                codigo: true
              }
            },
            tb_tipo_servicos: {
              select: {
                designacao: true,
                codigo: true
              }
            }
          },
          orderBy: {
            data: 'desc'
          }
        }),
        
        // Total de vendas no período
        prisma.tb_pagamentos.aggregate({
          where: whereClause,
          _sum: {
            preco: true
          },
          _count: {
            codigo: true
          }
        }),
        
        // Vendas de hoje
        prisma.tb_pagamentos.aggregate({
          where: {
            data: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(new Date().setHours(23, 59, 59, 999))
            }
          },
          _sum: {
            preco: true
          },
          _count: {
            codigo: true
          }
        })
      ]);

      // Agrupar vendas por dia
      const vendasPorDia = pagamentos.reduce((acc, pagamento) => {
        const data = new Date(pagamento.data).toISOString().split('T')[0];
        if (!acc[data]) {
          acc[data] = {
            data,
            quantidade: 0,
            valor: 0,
            pagamentos: []
          };
        }
        acc[data].quantidade += 1;
        acc[data].valor += parseFloat(pagamento.preco) || 0;
        acc[data].pagamentos.push({
          codigo: pagamento.codigo,
          aluno: pagamento.aluno?.nome || 'N/A',
          servico: pagamento.tb_tipo_servicos?.designacao || 'N/A',
          valor: parseFloat(pagamento.preco) || 0,
          mes: pagamento.mes,
          fatura: pagamento.fatura
        });
        return acc;
      }, {});

      // Converter para array e ordenar
      const vendasDiarias = Object.values(vendasPorDia).sort((a, b) => 
        new Date(b.data) - new Date(a.data)
      );

      return {
        resumo: {
          totalVendas: totalVendas._count.codigo || 0,
          valorTotal: totalVendas._sum.preco || 0,
          vendasHoje: vendasHoje._count.codigo || 0,
          valorHoje: vendasHoje._sum.preco || 0,
          periodo: {
            dataInicio: dataInicio || (ano ? `${ano}-01-01` : null),
            dataFim: dataFim || (ano ? `${ano}-12-31` : null),
            ano,
            mes
          }
        },
        vendasDiarias,
        pagamentos: pagamentos.map(p => ({
          codigo: p.codigo,
          data: p.data,
          aluno: p.aluno?.nome || 'N/A',
          servico: p.tb_tipo_servicos?.designacao || 'N/A',
          valor: parseFloat(p.preco) || 0,
          mes: p.mes,
          fatura: p.fatura
        }))
      };
    } catch (error) {
      console.error('Erro ao gerar relatório de vendas:', error);
      throw new AppError('Erro ao gerar relatório de vendas', 500);
    }
  }

  static async getRelatorioVendasFuncionarios(filters = {}) {
    try {
      const { dataInicio, dataFim } = filters;
      
      // Construir filtros de data
      let whereClause = {};
      
      if (dataInicio && dataFim) {
        whereClause.data = {
          gte: new Date(dataInicio + 'T00:00:00.000Z'),
          lte: new Date(dataFim + 'T23:59:59.999Z')
        };
      }

      // Buscar pagamentos com filtros de data aplicados
      const pagamentos = await prisma.tb_pagamentos.findMany({
        where: whereClause,
        select: {
          codigo: true,
          data: true,
          preco: true,
          mes: true,
          fatura: true,
          codigo_Utilizador: true,
          codigo_Aluno: true
        },
        orderBy: {
          data: 'desc'
        }
      });

      // Buscar nomes dos alunos
      const alunoIds = [...new Set(pagamentos.map(p => p.codigo_Aluno).filter(Boolean))];
      const alunos = await prisma.tb_alunos.findMany({
        where: { codigo: { in: alunoIds } },
        select: { codigo: true, nome: true }
      });
      const alunosMap = alunos.reduce((acc, a) => { acc[a.codigo] = a.nome; return acc; }, {});

      // Buscar nomes dos utilizadores/funcionários
      const utilizadorIds = [...new Set(pagamentos.map(p => p.codigo_Utilizador).filter(Boolean))];
      const utilizadores = await prisma.tb_utilizadores.findMany({
        where: { codigo: { in: utilizadorIds } },
        select: { codigo: true, user: true, nome: true }
      });
      const utilizadoresMap = utilizadores.reduce((acc, u) => { 
        acc[u.codigo] = u.nome || u.user || `Funcionário ${u.codigo}`; 
        return acc; 
      }, {});

      // Agrupar por funcionário (usando codigo_Utilizador)
      const funcionarios = {};
      
      pagamentos.forEach(p => {
        const funcId = p.codigo_Utilizador || 1;
        if (!funcionarios[funcId]) {
          funcionarios[funcId] = {
            codigo: funcId,
            nome: utilizadoresMap[funcId] || `Funcionário ${funcId}`,
            totalVendas: 0,
            valorTotal: 0
          };
        }
        funcionarios[funcId].totalVendas += 1;
        funcionarios[funcId].valorTotal += parseFloat(p.preco) || 0;
      });

      const rankingFuncionarios = Object.values(funcionarios).sort((a, b) => b.valorTotal - a.valorTotal);
      const totalGeral = pagamentos.reduce((sum, p) => sum + (parseFloat(p.preco) || 0), 0);

      return {
        resumo: {
          totalGeral,
          totalPagamentos: pagamentos.length,
          funcionariosAtivos: rankingFuncionarios.length,
          mediaPorFuncionario: rankingFuncionarios.length > 0 ? totalGeral / rankingFuncionarios.length : 0,
          periodo: {
            dataInicio: filters.dataInicio || new Date().toISOString().split('T')[0],
            dataFim: filters.dataFim || new Date().toISOString().split('T')[0]
          }
        },
        rankingFuncionarios,
        pagamentos: pagamentos.map(p => ({
          codigo: p.codigo,
          data: p.data,
          funcionario: utilizadoresMap[p.codigo_Utilizador] || `Funcionário ${p.codigo_Utilizador || 1}`,
          aluno: alunosMap[p.codigo_Aluno] || 'N/A',
          valor: parseFloat(p.preco) || 0,
          mes: p.mes,
          fatura: p.fatura
        }))
      };
    } catch (error) {
      console.error('Erro ao gerar relatório de vendas por funcionários:', error);
      throw new AppError('Erro ao gerar relatório de vendas por funcionários', 500);
    }
  }

  // ===============================
  // MOTIVOS IVA - CRUD COMPLETO
  // ===============================

  static async createMotivoIva(data) {
    try {
      const { codigomotivo, designacao } = data;

      const existingMotivo = await prisma.motivos_iva.findFirst({
        where: {
          codigomotivo: codigomotivo.trim()
        }
      });

      if (existingMotivo) {
        throw new AppError('Já existe um motivo IVA com este código', 409);
      }

      return await prisma.motivos_iva.create({
        data: {
          codigomotivo: codigomotivo.trim(),
          designacao: designacao?.trim() || null
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar motivo IVA', 500);
    }
  }

  static async updateMotivoIva(id, data) {
    try {
      const existingMotivo = await prisma.motivos_iva.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingMotivo) {
        throw new AppError('Motivo IVA não encontrado', 404);
      }

      if (data.codigomotivo) {
        const duplicateMotivo = await prisma.motivos_iva.findFirst({
          where: {
            codigomotivo: data.codigomotivo.trim(),
            codigo: { not: parseInt(id) }
          }
        });

        if (duplicateMotivo) {
          throw new AppError('Já existe um motivo IVA com este código', 409);
        }
      }

      return await prisma.motivos_iva.update({
        where: { codigo: parseInt(id) },
        data: {
          codigomotivo: data.codigomotivo?.trim(),
          designacao: data.designacao?.trim() || null
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar motivo IVA', 500);
    }
  }

  static async getMotivosIva(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        OR: [
          {
            codigomotivo: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            designacao: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      } : {};

      const [motivos, total] = await Promise.all([
        prisma.motivos_iva.findMany({
          where,
          skip,
          take: limit,
          include: {
            _count: {
              select: { tb_tipo_servicos: true }
            }
          },
          orderBy: { codigomotivo: 'asc' }
        }),
        prisma.motivos_iva.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: motivos,
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
      throw new AppError('Erro ao buscar motivos IVA', 500);
    }
  }

  static async getMotivoIvaById(id) {
    try {
      const motivo = await prisma.motivos_iva.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_servicos: {
            select: { codigo: true, designacao: true, preco: true },
            orderBy: { designacao: 'asc' }
          }
        }
      });

      if (!motivo) {
        throw new AppError('Motivo IVA não encontrado', 404);
      }

      return motivo;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar motivo IVA', 500);
    }
  }

  static async deleteMotivoIva(id) {
    try {
      const existingMotivo = await prisma.motivos_iva.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_servicos: true
        }
      });

      if (!existingMotivo) {
        throw new AppError('Motivo IVA não encontrado', 404);
      }

      if (existingMotivo.tb_tipo_servicos.length > 0) {
        throw new AppError('Não é possível excluir este motivo IVA pois possui serviços associados', 400);
      }

      await prisma.motivos_iva.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Motivo IVA excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir motivo IVA', 500);
    }
  }

  // ===============================
  // TAXAS IVA - CRUD COMPLETO
  // ===============================

  static async createTaxaIva(data) {
    try {
      const { taxa, designcao } = data;

      return await prisma.taxa_iva.create({
        data: {
          taxa: parseFloat(taxa),
          designcao: designcao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar taxa IVA', 500);
    }
  }

  static async updateTaxaIva(id, data) {
    try {
      const existingTaxa = await prisma.taxa_iva.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingTaxa) {
        throw new AppError('Taxa IVA não encontrada', 404);
      }

      return await prisma.taxa_iva.update({
        where: { codigo: parseInt(id) },
        data: {
          taxa: data.taxa ? parseFloat(data.taxa) : undefined,
          designcao: data.designcao?.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar taxa IVA', 500);
    }
  }

  static async getTaxasIva(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designcao: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};

      const [taxas, total] = await Promise.all([
        prisma.taxa_iva.findMany({
          where,
          skip,
          take: limit,
          include: {
            _count: {
              select: { tb_tipo_servicos: true }
            }
          },
          orderBy: { taxa: 'asc' }
        }),
        prisma.taxa_iva.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: taxas,
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
      throw new AppError('Erro ao buscar taxas IVA', 500);
    }
  }

  static async getTaxaIvaById(id) {
    try {
      const taxa = await prisma.taxa_iva.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_servicos: {
            select: { codigo: true, designacao: true, preco: true },
            orderBy: { designacao: 'asc' }
          }
        }
      });

      if (!taxa) {
        throw new AppError('Taxa IVA não encontrada', 404);
      }

      return taxa;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar taxa IVA', 500);
    }
  }

  static async deleteTaxaIva(id) {
    try {
      const existingTaxa = await prisma.taxa_iva.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_servicos: true
        }
      });

      if (!existingTaxa) {
        throw new AppError('Taxa IVA não encontrada', 404);
      }

      if (existingTaxa.tb_tipo_servicos.length > 0) {
        throw new AppError('Não é possível excluir esta taxa IVA pois possui serviços associados', 400);
      }

      await prisma.taxa_iva.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Taxa IVA excluída com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir taxa IVA', 500);
    }
  }

  // ===============================
  // TIPOS DE MULTA - CRUD COMPLETO
  // ===============================

  static async createTipoMulta(data) {
    try {
      const { descrisao } = data;

      return await prisma.tb_tipo_multa.create({
        data: {
          descrisao: descrisao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar tipo de multa', 500);
    }
  }

  static async updateTipoMulta(id, data) {
    try {
      const existingTipo = await prisma.tb_tipo_multa.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingTipo) {
        throw new AppError('Tipo de multa não encontrado', 404);
      }

      return await prisma.tb_tipo_multa.update({
        where: { codigo: parseInt(id) },
        data: {
          descrisao: data.descrisao?.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar tipo de multa', 500);
    }
  }

  static async getTiposMulta(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        descrisao: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};

      const [tipos, total] = await Promise.all([
        prisma.tb_tipo_multa.findMany({
          where,
          skip,
          take: limit,
          include: {
            _count: {
              select: { tb_tipo_servicos: true }
            }
          },
          orderBy: { descrisao: 'asc' }
        }),
        prisma.tb_tipo_multa.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: tipos,
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
      throw new AppError('Erro ao buscar tipos de multa', 500);
    }
  }

  static async getTipoMultaById(id) {
    try {
      const tipo = await prisma.tb_tipo_multa.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_servicos: {
            select: { codigo: true, designacao: true, valorMulta: true },
            orderBy: { designacao: 'asc' }
          }
        }
      });

      if (!tipo) {
        throw new AppError('Tipo de multa não encontrado', 404);
      }

      return tipo;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar tipo de multa', 500);
    }
  }

  static async deleteTipoMulta(id) {
    try {
      const existingTipo = await prisma.tb_tipo_multa.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_servicos: true
        }
      });

      if (!existingTipo) {
        throw new AppError('Tipo de multa não encontrado', 404);
      }

      if (existingTipo.tb_tipo_servicos.length > 0) {
        throw new AppError('Não é possível excluir este tipo de multa pois possui serviços associados', 400);
      }

      await prisma.tb_tipo_multa.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Tipo de multa excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir tipo de multa', 500);
    }
  }

  // ===============================
  // MOTIVOS DE ISENÇÃO - CRUD COMPLETO
  // ===============================

  static async createMotivoIsencao(data) {
    try {
      const { codigo_Isencao, designacao, status } = data;

      const existingMotivo = await prisma.tb_motivo_isencao.findFirst({
        where: {
          codigo_Isencao: codigo_Isencao.trim()
        }
      });

      if (existingMotivo) {
        throw new AppError('Já existe um motivo de isenção com este código', 409);
      }

      return await prisma.tb_motivo_isencao.create({
        data: {
          codigo_Isencao: codigo_Isencao.trim(),
          designacao: designacao.trim(),
          status: status?.trim() || "Activo"
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar motivo de isenção', 500);
    }
  }

  static async updateMotivoIsencao(id, data) {
    try {
      const existingMotivo = await prisma.tb_motivo_isencao.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingMotivo) {
        throw new AppError('Motivo de isenção não encontrado', 404);
      }

      if (data.codigo_Isencao) {
        const duplicateMotivo = await prisma.tb_motivo_isencao.findFirst({
          where: {
            codigo_Isencao: data.codigo_Isencao.trim(),
            codigo: { not: parseInt(id) }
          }
        });

        if (duplicateMotivo) {
          throw new AppError('Já existe um motivo de isenção com este código', 409);
        }
      }

      return await prisma.tb_motivo_isencao.update({
        where: { codigo: parseInt(id) },
        data: {
          codigo_Isencao: data.codigo_Isencao?.trim(),
          designacao: data.designacao?.trim(),
          status: data.status?.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar motivo de isenção', 500);
    }
  }

  static async getMotivosIsencao(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        OR: [
          {
            codigo_Isencao: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            designacao: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      } : {};

      const [motivos, total] = await Promise.all([
        prisma.tb_motivo_isencao.findMany({
          where,
          skip,
          take: limit,
          include: {
            _count: {
              select: { tb_tipo_taxa_iva: true }
            }
          },
          orderBy: { codigo_Isencao: 'asc' }
        }),
        prisma.tb_motivo_isencao.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: motivos,
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
      throw new AppError('Erro ao buscar motivos de isenção', 500);
    }
  }

  static async getMotivoIsencaoById(id) {
    try {
      const motivo = await prisma.tb_motivo_isencao.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_taxa_iva: {
            select: { codigo: true, designacao: true, taxa: true, status: true },
            orderBy: { designacao: 'asc' }
          }
        }
      });

      if (!motivo) {
        throw new AppError('Motivo de isenção não encontrado', 404);
      }

      return motivo;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar motivo de isenção', 500);
    }
  }

  static async deleteMotivoIsencao(id) {
    try {
      const existingMotivo = await prisma.tb_motivo_isencao.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_taxa_iva: true
        }
      });

      if (!existingMotivo) {
        throw new AppError('Motivo de isenção não encontrado', 404);
      }

      if (existingMotivo.tb_tipo_taxa_iva.length > 0) {
        throw new AppError('Não é possível excluir este motivo de isenção pois possui tipos de taxa IVA associados', 400);
      }

      await prisma.tb_motivo_isencao.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Motivo de isenção excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir motivo de isenção', 500);
    }
  }

  // ===============================
  // TIPOS DE TAXA IVA - CRUD COMPLETO
  // ===============================

  static async createTipoTaxaIva(data) {
    try {
      const { taxa, designacao, codigo_Isencao, status } = data;

      // Verificar se o motivo de isenção existe (se fornecido)
      if (codigo_Isencao && codigo_Isencao > 0) {
        const motivoExists = await prisma.tb_motivo_isencao.findUnique({
          where: { codigo: parseInt(codigo_Isencao) }
        });

        if (!motivoExists) {
          throw new AppError('Motivo de isenção não encontrado', 404);
        }
      }

      return await prisma.tb_tipo_taxa_iva.create({
        data: {
          taxa: parseInt(taxa),
          designacao: designacao?.trim() || "",
          codigo_Isencao: codigo_Isencao && codigo_Isencao > 0 ? parseInt(codigo_Isencao) : null,
          status: status?.trim() || "Activo"
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar tipo de taxa IVA', 500);
    }
  }

  static async updateTipoTaxaIva(id, data) {
    try {
      const existingTipo = await prisma.tb_tipo_taxa_iva.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingTipo) {
        throw new AppError('Tipo de taxa IVA não encontrado', 404);
      }

      // Verificar motivo de isenção se fornecido
      if (data.codigo_Isencao && data.codigo_Isencao > 0) {
        const motivoExists = await prisma.tb_motivo_isencao.findUnique({
          where: { codigo: parseInt(data.codigo_Isencao) }
        });
        if (!motivoExists) throw new AppError('Motivo de isenção não encontrado', 404);
      }

      return await prisma.tb_tipo_taxa_iva.update({
        where: { codigo: parseInt(id) },
        data: {
          taxa: data.taxa ? parseInt(data.taxa) : undefined,
          designacao: data.designacao?.trim(),
          codigo_Isencao: data.codigo_Isencao && data.codigo_Isencao > 0 ? parseInt(data.codigo_Isencao) : null,
          status: data.status?.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar tipo de taxa IVA', 500);
    }
  }

  static async getTiposTaxaIva(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        OR: [
          {
            designacao: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            status: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      } : {};

      const [tipos, total] = await Promise.all([
        prisma.tb_tipo_taxa_iva.findMany({
          where,
          skip,
          take: limit,
          include: {
            tb_motivo_isencao: {
              select: { codigo: true, codigo_Isencao: true, designacao: true }
            }
          },
          orderBy: { taxa: 'asc' }
        }),
        prisma.tb_tipo_taxa_iva.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: tipos,
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
      throw new AppError('Erro ao buscar tipos de taxa IVA', 500);
    }
  }

  static async getTipoTaxaIvaById(id) {
    try {
      const tipo = await prisma.tb_tipo_taxa_iva.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_motivo_isencao: {
            select: { codigo: true, codigo_Isencao: true, designacao: true, status: true }
          }
        }
      });

      if (!tipo) {
        throw new AppError('Tipo de taxa IVA não encontrado', 404);
      }

      return tipo;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar tipo de taxa IVA', 500);
    }
  }

  static async deleteTipoTaxaIva(id) {
    try {
      const existingTipo = await prisma.tb_tipo_taxa_iva.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingTipo) {
        throw new AppError('Tipo de taxa IVA não encontrado', 404);
      }

      await prisma.tb_tipo_taxa_iva.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Tipo de taxa IVA excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir tipo de taxa IVA', 500);
    }
  }
}
