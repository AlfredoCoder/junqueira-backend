// services/payment-management.services.js
import prisma from '../config/database.js';
import { AppError } from '../utils/validation.utils.js';
import { getDadosFatura } from '../config/empresa.config.js';
import { getPagination } from '../utils/pagination.utils.js';

export class PaymentManagementService {
  // ===============================
  // FORMAS DE PAGAMENTO - CRUD COMPLETO
  // ===============================

  static async createFormaPagamento(data) {
    try {
      const formaPagamento = await prisma.tb_forma_pagamento.create({
        data: {
          designacao: data.designacao
        }
      });

      return formaPagamento;
    } catch (error) {
      console.error('Erro ao criar forma de pagamento:', error);
      throw new AppError('Erro ao criar forma de pagamento', 500);
    }
  }

  static async getFormasPagamento(page = 1, limit = 10, search = '') {
    try {
      const { skip, take } = getPagination(page, limit);
      
      const where = search ? {
        designacao: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};

      const [formasPagamento, total] = await Promise.all([
        prisma.tb_forma_pagamento.findMany({
          where,
          skip,
          take,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_forma_pagamento.count({ where })
      ]);

      return {
        data: formasPagamento,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      console.error('Erro ao buscar formas de pagamento:', error);
      throw new AppError('Erro ao buscar formas de pagamento', 500);
    }
  }

  static async getFormaPagamentoById(id) {
    try {
      const formaPagamento = await prisma.tb_forma_pagamento.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!formaPagamento) {
        throw new AppError('Forma de pagamento não encontrada', 404);
      }

      return formaPagamento;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao buscar forma de pagamento:', error);
      throw new AppError('Erro ao buscar forma de pagamento', 500);
    }
  }

  static async updateFormaPagamento(id, data) {
    try {
      const existingFormaPagamento = await this.getFormaPagamentoById(id);

      const updatedFormaPagamento = await prisma.tb_forma_pagamento.update({
        where: { codigo: parseInt(id) },
        data: {
          designacao: data.designacao
        }
      });

      return updatedFormaPagamento;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao atualizar forma de pagamento:', error);
      throw new AppError('Erro ao atualizar forma de pagamento', 500);
    }
  }

  static async deleteFormaPagamento(id) {
    try {
      const existingFormaPagamento = await this.getFormaPagamentoById(id);

      // Verificar se há pagamentos associados
      const pagamentosCount = await prisma.tb_pagamentos.count({
        where: { codigo_FormaPagamento: parseInt(id) }
      });

      if (pagamentosCount > 0) {
        throw new AppError('Não é possível excluir forma de pagamento com pagamentos associados', 400);
      }

      await prisma.tb_forma_pagamento.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Forma de pagamento excluída com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir forma de pagamento:', error);
      throw new AppError('Erro ao excluir forma de pagamento', 500);
    }
  }

  // ===============================
  // PAGAMENTO PRINCIPAL (tb_pagamentoi) - CRUD COMPLETO
  // ===============================

  static async createPagamentoi(data) {
    try {
      // Verificar se o aluno existe
      const alunoExists = await prisma.aluno.findUnique({
        where: { codigo: data.codigo_Aluno }
      });

      if (!alunoExists) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // Verificar se o utilizador existe (se fornecido)
      if (data.codigoUtilizador) {
        const utilizadorExists = await prisma.tb_utilizadores.findUnique({
          where: { codigo: data.codigoUtilizador }
        });

        if (!utilizadorExists) {
          throw new AppError('Utilizador não encontrado', 404);
        }
      }

      const pagamentoi = await prisma.tb_pagamentoi.create({
        data: {
          data: data.data,
          codigo_Aluno: data.codigo_Aluno,
          status: data.status,
          total: data.total,
          valorEntregue: data.valorEntregue,
          dataBanco: data.dataBanco,
          totalDesconto: data.totalDesconto || 0,
          obs: data.obs,
          borderoux: data.borderoux,
          saldoAnterior: data.saldoAnterior || 0,
          descontoSaldo: data.descontoSaldo || 0,
          saldo: data.saldo || 0,
          codigoPagamento: data.codigoPagamento || 0,
          saldoOperacao: data.saldoOperacao || 0,
          codigoUtilizador: data.codigoUtilizador,
          hash: data.hash,
          tipoDocumento: data.tipoDocumento,
          totalIva: data.totalIva,
          nifCliente: data.nifCliente,
          troco: data.troco
        },
        include: {
          tb_pagamentos: {
            select: {
              codigo: true,
              mes: true,
              totalgeral: true,
              tipoDocumento: true
            }
          },
          tb_nota_credito: {
            select: {
              codigo: true,
              designacao: true
            }
          }
        }
      });

      // Após criar o pagamento, invalidar cache de meses pendentes se for propina
      if (tipoServicoExists && tipoServicoExists.designacao && tipoServicoExists.designacao.toLowerCase().includes('propina')) {
        console.log(`Pagamento de propina criado para aluno ${data.codigo_Aluno}, mês ${data.mes}/${data.ano}`);
        // Cache será invalidado automaticamente na próxima consulta
      }

      return pagamento;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao criar pagamento:', error);
      throw new AppError('Erro ao criar pagamento', 500);
    }
  }

  static async getPagamentois(page = 1, limit = 10, filters = {}) {
    try {
      const { skip, take } = getPagination(page, limit);
      
      let where = {};

      // Aplicar filtros
      if (filters.codigo_Aluno) {
        where.codigo_Aluno = filters.codigo_Aluno;
      }

      if (filters.status !== undefined) {
        where.status = filters.status;
      }

      if (filters.dataInicio && filters.dataFim) {
        where.data = {
          gte: new Date(filters.dataInicio),
          lte: new Date(filters.dataFim)
        };
      } else if (filters.dataInicio) {
        where.data = {
          gte: new Date(filters.dataInicio)
        };
      } else if (filters.dataFim) {
        where.data = {
          lte: new Date(filters.dataFim)
        };
      }

      // Implementação robusta baseada na memória - step-by-step query approach
      let pagamentois, total;

      try {
        [pagamentois, total] = await Promise.all([
          prisma.tb_pagamentoi.findMany({
            where,
            skip,
            take,
            orderBy: { data: 'desc' }
          }),
          prisma.tb_pagamentoi.count({ where })
        ]);

        // Buscar dados relacionados para cada pagamento
        const pagamentoisComDados = await Promise.all(
          pagamentois.map(async (pagamento) => {
            try {
              const [aluno, pagamentosDetalhes] = await Promise.all([
                // Buscar dados do aluno
                prisma.aluno.findUnique({
                  where: { codigo: pagamento.codigo_Aluno },
                  select: {
                    codigo: true,
                    nome: true
                  }
                }).catch(() => null),
                
                // Buscar detalhes dos pagamentos
                prisma.tb_pagamentos.findMany({
                  where: { codigoPagamento: pagamento.codigo },
                  select: {
                    codigo: true,
                    codigo_Tipo_Servico: true,
                    preco: true,
                    quantidade: true,
                    desconto: true,
                    totalgeral: true,
                    tb_tipo_servicos: {
                      select: {
                        codigo: true,
                        designacao: true
                      }
                    }
                  }
                }).catch(() => [])
              ]);

              return {
                ...pagamento,
                aluno,
                detalhes: pagamentosDetalhes
              };
            } catch (error) {
              console.error(`Erro ao buscar dados relacionados para pagamento ${pagamento.codigo}:`, error);
              return pagamento;
            }
          })
        );

        return {
          data: pagamentoisComDados,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit
          }
        };

      } catch (error) {
        console.error('Erro ao buscar pagamentos principais:', error);
        throw new AppError('Erro ao buscar pagamentos principais', 500);
      }
    } catch (error) {
      console.error('Erro geral ao buscar pagamentos principais:', error);
      throw new AppError('Erro ao buscar pagamentos principais', 500);
    }
  }

  static async getPagamentoiById(id) {
    try {
      // Implementação robusta baseada na memória - step-by-step query approach
      let pagamentoi;

      try {
        pagamentoi = await prisma.tb_pagamentoi.findUnique({
          where: { codigo: parseInt(id) }
        });

        if (!pagamentoi) {
          throw new AppError('Pagamento não encontrado', 404);
        }

        // Buscar dados relacionados
        const [aluno, detalhes, notasCredito] = await Promise.all([
          // Dados do aluno
          prisma.aluno.findUnique({
            where: { codigo: pagamentoi.codigo_Aluno },
            select: {
              codigo: true,
              nome: true,
              email: true,
              telefone: true
            }
          }).catch(() => null),

          // Detalhes dos pagamentos
          prisma.tb_pagamentos.findMany({
            where: { codigoPagamento: pagamentoi.codigo },
            include: {
              tb_tipo_servicos: {
                select: {
                  codigo: true,
                  designacao: true,
                  preco: true
                }
              },
              formaPagamento: {
                select: {
                  codigo: true,
                  designacao: true
                }
              },
              utilizador: {
                select: {
                  codigo: true,
                  nome: true
                }
              }
            }
          }).catch(() => []),

          // Notas de crédito associadas (buscar por aluno, já que codigoPagamentoi pode ter constraint)
          prisma.tb_nota_credito.findMany({
            where: { codigo_aluno: pagamentoi.codigo_Aluno }
          }).catch(() => [])
        ]);

        return {
          ...pagamentoi,
          aluno,
          detalhes,
          notasCredito
        };

      } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Erro ao buscar pagamento por ID:', error);
        throw new AppError('Erro ao buscar pagamento', 500);
      }
    } catch (error) {
      console.error('Erro geral ao buscar pagamento por ID:', error);
      throw new AppError('Erro ao buscar pagamento', 500);
    }
  }

  static async updatePagamentoi(id, data) {
    try {
      const existingPagamentoi = await this.getPagamentoiById(id);

      const updatedPagamentoi = await prisma.tb_pagamentoi.update({
        where: { codigo: parseInt(id) },
        data: {
          data: data.data,
          status: data.status,
          total: data.total,
          valorEntregue: data.valorEntregue,
          dataBanco: data.dataBanco,
          totalDesconto: data.totalDesconto,
          obs: data.obs,
          borderoux: data.borderoux,
          saldoAnterior: data.saldoAnterior,
          descontoSaldo: data.descontoSaldo,
          saldo: data.saldo,
          saldoOperacao: data.saldoOperacao,
          codigoUtilizador: data.codigoUtilizador,
          hash: data.hash,
          tipoDocumento: data.tipoDocumento,
          totalIva: data.totalIva,
          nifCliente: data.nifCliente,
          troco: data.troco
        }
      });

      return updatedPagamentoi;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao atualizar pagamento principal:', error);
      throw new AppError('Erro ao atualizar pagamento principal', 500);
    }
  }

  static async deletePagamentoi(id) {
    try {
      const existingPagamentoi = await this.getPagamentoiById(id);

      // Verificar se há detalhes de pagamento associados
      const detalhesCount = await prisma.tb_pagamentos.count({
        where: { codigoPagamento: parseInt(id) }
      });

      if (detalhesCount > 0) {
        throw new AppError('Não é possível excluir pagamento com detalhes associados', 400);
      }

      await prisma.tb_pagamentoi.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Pagamento excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir pagamento principal:', error);
      throw new AppError('Erro ao excluir pagamento principal', 500);
    }
  }

  // ===============================
  // DETALHES DE PAGAMENTO (tb_pagamentos) - CRUD COMPLETO
  // ===============================

  static async createPagamento(data) {
    try {
      // Garantir que existe um registro padrão na tb_pagamentoi
      await prisma.tb_pagamentoi.upsert({
        where: { codigo: 1 },
        update: {},
        create: {
          data: new Date(),
          total: 0,
          codigoUtilizador: data.codigo_Utilizador,
          codigo_Aluno: data.codigo_Aluno,
          status: 1,
          valorEntregue: 0,
          dataBanco: new Date(),
          totalDesconto: 0
        }
      });

      // Verificações de integridade
      const [alunoExists, tipoServicoExists, utilizadorExists, formaPagamentoExists] = await Promise.all([
        prisma.tb_alunos.findUnique({ where: { codigo: data.codigo_Aluno } }),
        data.codigo_Tipo_Servico ? prisma.tb_tipo_servicos.findUnique({ where: { codigo: data.codigo_Tipo_Servico } }) : Promise.resolve(true),
        prisma.tb_utilizadores.findUnique({ where: { codigo: data.codigo_Utilizador } }),
        data.codigo_FormaPagamento ? prisma.tb_forma_pagamento.findUnique({ where: { codigo: data.codigo_FormaPagamento } }) : Promise.resolve(true)
      ]);

      if (!alunoExists) {
        throw new AppError('Aluno não encontrado', 404);
      }

      if (data.codigo_Tipo_Servico && !tipoServicoExists) {
        throw new AppError('Tipo de serviço não encontrado', 404);
      }

      if (!utilizadorExists) {
        throw new AppError('Utilizador não encontrado', 404);
      }

      if (data.codigo_FormaPagamento && !formaPagamentoExists) {
        throw new AppError('Forma de pagamento não encontrada', 404);
      }

      console.log('🔍 Criando pagamento com dados:', JSON.stringify(data, null, 2));
      
      const pagamento = await prisma.tb_pagamentos.create({
        data: {
          codigo_Aluno: data.codigo_Aluno,
          codigo_Tipo_Servico: data.codigo_Tipo_Servico,
          data: data.data || new Date(),
          n_Bordoro: data.n_Bordoro || data.numeroBordero || `${Date.now()}`,
          multa: data.multa || 0,
          mes: data.mes,
          codigo_Utilizador: data.codigo_Utilizador,
          observacao: data.observacao || '',
          ano: data.ano || new Date().getFullYear(),
          contaMovimentada: data.contaMovimentada || `${data.tipoConta || 'BAI'} CONTA: ${data.numeroBordero || '89248669/10/001'}`,
          quantidade: data.quantidade || 1,
          desconto: data.desconto || 0,
          totalgeral: data.totalgeral || data.preco,
          dataBanco: data.dataBanco || new Date(),
          codigo_Estatus: data.codigo_Estatus || 1,
          codigo_Empresa: data.codigo_Empresa || 1,
          codigo_FormaPagamento: data.codigo_FormaPagamento || 1,
          saldo_Anterior: data.saldo_Anterior || 0,
          codigoPagamento: data.codigoPagamento || 1,
          descontoSaldo: data.descontoSaldo || 0,
          tipoDocumento: data.tipoDocumento || 'FATURA',
          next: data.next || 'NEXT',
          codoc: data.codoc || 0,
          fatura: data.fatura || `FAT_${Date.now()}`,
          taxa_iva: data.taxa_iva || 0,
          hash: data.hash || `PAG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          preco: data.preco || 0,
          indice_mes: data.indice_mes || new Date().getMonth() + 1,
          indice_ano: data.indice_ano || data.ano || new Date().getFullYear()
        }
      });

      return pagamento;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('❌ Erro detalhado ao criar pagamento:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack
      });
      throw new AppError(`Erro ao criar detalhe de pagamento: ${error.message}`, 500);
    }
  }

  static async getPagamentos(page = 1, limit = 10, filters = {}) {
    try {
      const { skip, take } = getPagination(page, limit);
      
      let where = {};

      // Busca por texto (nome do aluno, documento, fatura)
      if (filters.search) {
        where.OR = [
          {
            aluno: {
              nome: {
                contains: filters.search
              }
            }
          },
          {
            aluno: {
              n_documento_identificacao: {
                contains: filters.search
              }
            }
          },
          {
            fatura: {
              contains: filters.search
            }
          }
        ];
      }

      // Aplicar filtros similares aos pagamentois
      if (filters.codigo_Aluno) {
        where.codigo_Aluno = filters.codigo_Aluno;
      }

      if (filters.codigo_Tipo_Servico) {
        where.codigo_Tipo_Servico = filters.codigo_Tipo_Servico;
      }

      // Filtro por tipo de serviço (aceita nome como propina, outros)
      if (filters.tipo_servico) {
        const tipoServicoLower = filters.tipo_servico.toLowerCase();
        if (tipoServicoLower === 'propina') {
          where.tipoServico = {
            designacao: {
              contains: 'propina'
            }
          };
        } else if (tipoServicoLower === 'outros') {
          where.tipoServico = {
            designacao: {
              not: {
                contains: 'propina'
              }
            }
          };
        }
      }

      if (filters.codigoPagamento) {
        where.codigoPagamento = parseInt(filters.codigoPagamento);
      }

      if (filters.n_Bordoro) {
        where.n_Bordoro = filters.n_Bordoro;
      }

      if (filters.dataInicio && filters.dataFim) {
        where.data = {
          gte: new Date(filters.dataInicio),
          lte: new Date(filters.dataFim)
        };
      }

      const [pagamentos, total] = await Promise.all([
        prisma.tb_pagamentos.findMany({
          where,
          skip,
          take,
          include: {
            aluno: {
              select: { codigo: true, nome: true, n_documento_identificacao: true }
            },
            tb_tipo_servicos: {
              select: { codigo: true, designacao: true }
            }
          },
          orderBy: { data: 'desc' }
        }),
        prisma.tb_pagamentos.count({ where })
      ]);

      return {
        data: pagamentos,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes de pagamento:', error);
      throw new AppError('Erro ao buscar detalhes de pagamento', 500);
    }
  }

  static async getPagamentoById(id) {
    try {
      const pagamento = await prisma.tb_pagamentos.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          aluno: {
            select: { codigo: true, nome: true, email: true }
          },
          tb_tipo_servicos: {
            select: { codigo: true, designacao: true, preco: true }
          }
        }
      });

      if (!pagamento) {
        throw new AppError('Detalhe de pagamento não encontrado', 404);
      }

      return pagamento;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao buscar detalhe de pagamento:', error);
      throw new AppError('Erro ao buscar detalhe de pagamento', 500);
    }
  }

  static async updatePagamento(id, data) {
    try {
      const existingPagamento = await this.getPagamentoById(id);

      const updatedPagamento = await prisma.tb_pagamentos.update({
        where: { codigo: parseInt(id) },
        data: {
          codigo_Tipo_Servico: data.codigo_Tipo_Servico,
          data: data.data,
          n_Bordoro: data.n_Bordoro,
          multa: data.multa,
          mes: data.mes,
          observacao: data.observacao,
          ano: data.ano,
          contaMovimentada: data.contaMovimentada,
          quantidade: data.quantidade,
          desconto: data.desconto,
          totalgeral: data.totalgeral,
          dataBanco: data.dataBanco,
          codigo_FormaPagamento: data.codigo_FormaPagamento,
          saldo_Anterior: data.saldo_Anterior,
          descontoSaldo: data.descontoSaldo,
          tipoDocumento: data.tipoDocumento,
          next: data.next,
          fatura: data.fatura,
          taxa_iva: data.taxa_iva,
          hash: data.hash,
          preco: data.preco,
          indice_mes: data.indice_mes,
          indice_ano: data.indice_ano
        }
      });

      return updatedPagamento;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao atualizar detalhe de pagamento:', error);
      throw new AppError('Erro ao atualizar detalhe de pagamento', 500);
    }
  }

  static async deletePagamento(id) {
    try {
      const existingPagamento = await this.getPagamentoById(id);

      await prisma.tb_pagamentos.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Detalhe de pagamento excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir detalhe de pagamento:', error);
      throw new AppError('Erro ao excluir detalhe de pagamento', 500);
    }
  }

  // ===============================
  // NOTAS DE CRÉDITO - CRUD COMPLETO
  // ===============================

  static async createNotaCredito(data) {
    try {
      // Verificar se o aluno existe
      const alunoExists = await prisma.tb_alunos.findUnique({
        where: { codigo: data.codigo_aluno }
      });

      if (!alunoExists) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // Verificar se o pagamento existe (se fornecido)
      let pagamento = null;
      if (data.codigoPagamentoi) {
        // Procurar primeiro na tabela tb_pagamentos (que é usada na listagem)
        pagamento = await prisma.tb_pagamentos.findUnique({
          where: { codigo: data.codigoPagamentoi },
          include: {
            aluno: true,
            tb_tipo_servicos: true
          }
        });

        // Se não encontrar, procurar na tb_pagamentoi
        if (!pagamento) {
          pagamento = await prisma.tb_pagamentoi.findUnique({
            where: { codigo: data.codigoPagamentoi }
          });
        }

        if (!pagamento) {
          throw new AppError('Pagamento não encontrado', 404);
        }

        // Verificar se já existe uma nota de crédito para esta fatura
        const existingCreditNote = await prisma.tb_nota_credito.findFirst({
          where: { 
            fatura: data.fatura,
            codigo_aluno: data.codigo_aluno
          }
        });

        if (existingCreditNote) {
          throw new AppError('Já existe uma nota de crédito para esta fatura', 409);
        }
      }

      // Usar transação para garantir consistência
      const result = await prisma.$transaction(async (tx) => {
        // 1. Criar a nota de crédito
        const createData = {
          designacao: data.designacao,
          fatura: data.fatura,
          descricao: data.descricao,
          valor: data.valor,
          codigo_aluno: data.codigo_aluno,
          documento: data.documento,
          next: data.next || '',
          dataOperacao: data.dataOperacao || new Date().toISOString().split('T')[0]
          // NÃO incluir codigo_utilizador temporariamente até a coluna ser criada no banco
          // NÃO incluir codigoPagamentoi para evitar foreign key constraint
        };

        // Adicionar hash apenas se fornecido
        if (data.hash) {
          createData.hash = data.hash;
        }

        console.log('[NOTA CRÉDITO] Dados para criação (sem codigoPagamentoi):', createData);

        let notaCredito;
        try {
          // Tentar criar sem codigoPagamentoi primeiro
          notaCredito = await tx.tb_nota_credito.create({
            data: createData,
            include: {
              aluno: true
            }
          });
          
          console.log('[NOTA CRÉDITO] ✅ Criada com sucesso sem codigoPagamentoi');
          
        } catch (createError) {
          console.log('[NOTA CRÉDITO] ❌ Erro ao criar sem codigoPagamentoi:', createError.message);
          throw createError;
        }

        // 2. Se há um pagamento associado, anular a fatura e reverter o pagamento
        if (pagamento) {
          console.log(`[NOTA CRÉDITO] Anulando pagamento ${pagamento.codigo}`);

          // Determinar qual tabela usar baseado na estrutura do pagamento
          const isFromTbPagamentos = pagamento.hasOwnProperty('preco') || pagamento.hasOwnProperty('totalgeral');
          
          if (isFromTbPagamentos) {
            // 2.1. Reverter o saldo do aluno ANTES de excluir (usar preco ou totalgeral)
            const valorReversao = parseFloat(pagamento.preco) || parseFloat(pagamento.totalgeral) || 0;
            if (valorReversao > 0) {
              await tx.tb_alunos.update({
                where: { codigo: pagamento.codigo_Aluno },
                data: {
                  saldo: {
                    increment: valorReversao
                  }
                }
              });
              console.log(`[NOTA CRÉDITO] Saldo do aluno ${pagamento.codigo_Aluno} incrementado em ${valorReversao}`);
            }

            // 2.2. EXCLUIR o pagamento da tb_pagamentos (para remover da lista e reverter status do mês)
            await tx.tb_pagamentos.delete({
              where: { codigo: pagamento.codigo }
            });
            console.log(`[NOTA CRÉDITO] Pagamento ${pagamento.codigo} EXCLUÍDO da tb_pagamentos`);

          } else {
            // 2.1. Reverter o saldo do aluno ANTES de excluir (usar total ou valorEntregue)
            const valorReversao = parseFloat(pagamento.total) || parseFloat(pagamento.valorEntregue) || 0;
            if (valorReversao > 0) {
              await tx.aluno.update({
                where: { codigo: pagamento.codigo_Aluno },
                data: {
                  saldo: {
                    increment: valorReversao
                  }
                }
              });
              console.log(`[NOTA CRÉDITO] Saldo do aluno ${pagamento.codigo_Aluno} incrementado em ${valorReversao}`);
            }

            // 2.2. EXCLUIR o pagamento da tb_pagamentoi (para remover da lista e reverter status do mês)
            await tx.tb_pagamentoi.delete({
              where: { codigo: pagamento.codigo }
            });
            console.log(`[NOTA CRÉDITO] Pagamento ${pagamento.codigo} EXCLUÍDO da tb_pagamentoi`);
          }

          console.log(`[NOTA CRÉDITO] Pagamento ${pagamento.codigo} anulado com sucesso`);
        }

        return notaCredito;
      });

      console.log(`[NOTA CRÉDITO] Nota de crédito ${result.next} criada com sucesso`);
      return result;

    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao criar nota de crédito:', error);
      throw new AppError('Erro ao criar nota de crédito', 500);
    }
  }

  static async getNotasCredito(page = 1, limit = 10, search = '') {
    try {
      console.log(`[GET NOTAS CRÉDITO] Iniciando busca - Page: ${page}, Limit: ${limit}, Search: "${search}"`);
      const { skip, take } = getPagination(page, limit);
      
      const where = search && search.trim() ? {
        OR: [
          { designacao: { contains: search.trim(), mode: 'insensitive' } },
          { fatura: { contains: search.trim(), mode: 'insensitive' } },
          { documento: { contains: search.trim(), mode: 'insensitive' } },
          { next: { contains: search.trim(), mode: 'insensitive' } },
          { aluno: { 
            nome: { contains: search.trim(), mode: 'insensitive' } 
          }}
        ]
      } : {};

      console.log(`[GET NOTAS CRÉDITO] Filtros aplicados:`, where);

      const [notasCredito, total] = await Promise.all([
        prisma.tb_nota_credito.findMany({
          where,
          skip,
          take,
          include: {
            aluno: {
              select: { 
                codigo: true, 
                nome: true, 
                n_documento_identificacao: true 
              }
            }
          },
          orderBy: { codigo: 'desc' }
        }),
        prisma.tb_nota_credito.count({ where })
      ]);

      console.log(`[GET NOTAS CRÉDITO] Encontradas ${notasCredito.length} notas de crédito, total: ${total}`);

      return {
        data: notasCredito,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      console.error('Erro ao buscar notas de crédito:', error);
      console.error('Stack trace:', error.stack);
      
      // Se for erro de tabela não encontrada, retornar array vazio
      if (error.code === 'P2021' || error.message.includes('does not exist')) {
        console.log('[GET NOTAS CRÉDITO] Tabela não existe, retornando dados vazios');
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
      
      throw new AppError(`Erro ao buscar notas de crédito: ${error.message}`, 500);
    }
  }

  static async getNotaCreditoById(id) {
    try {
      const notaCredito = await prisma.tb_nota_credito.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          aluno: {
            select: { codigo: true, nome: true, email: true }
          },
          tb_pagamentoi: {
            select: { codigo: true, data: true, total: true }
          }
        }
      });

      if (!notaCredito) {
        throw new AppError('Nota de crédito não encontrada', 404);
      }

      return notaCredito;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao buscar nota de crédito:', error);
      throw new AppError('Erro ao buscar nota de crédito', 500);
    }
  }

  static async updateNotaCredito(id, data) {
    try {
      const existingNotaCredito = await this.getNotaCreditoById(id);

      const updatedNotaCredito = await prisma.tb_nota_credito.update({
        where: { codigo: parseInt(id) },
        data: {
          designacao: data.designacao,
          fatura: data.fatura,
          descricao: data.descricao,
          valor: data.valor,
          documento: data.documento,
          next: data.next,
          dataOperacao: data.dataOperacao,
          hash: data.hash,
          codigoPagamentoi: data.codigoPagamentoi
        }
      });

      return updatedNotaCredito;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao atualizar nota de crédito:', error);
      throw new AppError('Erro ao atualizar nota de crédito', 500);
    }
  }

  static async deleteNotaCredito(id) {
    try {
      const existingNotaCredito = await this.getNotaCreditoById(id);

      await prisma.tb_nota_credito.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Nota de crédito excluída com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir nota de crédito:', error);
      throw new AppError('Erro ao excluir nota de crédito', 500);
    }
  }

  // ===============================
  // MOTIVOS DE ANULAÇÃO - CRUD COMPLETO
  // ===============================

  static async createMotivoAnulacao(data) {
    try {
      const motivoAnulacao = await prisma.tb_motivos_anulacao.create({
        data: {
          designacao: data.designacao
        }
      });

      return motivoAnulacao;
    } catch (error) {
      console.error('Erro ao criar motivo de anulação:', error);
      throw new AppError('Erro ao criar motivo de anulação', 500);
    }
  }

  static async getMotivosAnulacao(page = 1, limit = 10, search = '') {
    try {
      const { skip, take } = getPagination(page, limit);
      
      const where = search ? {
        designacao: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};

      const [motivosAnulacao, total] = await Promise.all([
        prisma.tb_motivos_anulacao.findMany({
          where,
          skip,
          take,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_motivos_anulacao.count({ where })
      ]);

      return {
        data: motivosAnulacao,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      console.error('Erro ao buscar motivos de anulação:', error);
      throw new AppError('Erro ao buscar motivos de anulação', 500);
    }
  }

  static async getMotivoAnulacaoById(id) {
    try {
      const motivoAnulacao = await prisma.tb_motivos_anulacao.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!motivoAnulacao) {
        throw new AppError('Motivo de anulação não encontrado', 404);
      }

      return motivoAnulacao;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao buscar motivo de anulação:', error);
      throw new AppError('Erro ao buscar motivo de anulação', 500);
    }
  }

  static async updateMotivoAnulacao(id, data) {
    try {
      const existingMotivoAnulacao = await this.getMotivoAnulacaoById(id);

      const updatedMotivoAnulacao = await prisma.tb_motivos_anulacao.update({
        where: { codigo: parseInt(id) },
        data: {
          designacao: data.designacao
        }
      });

      return updatedMotivoAnulacao;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao atualizar motivo de anulação:', error);
      throw new AppError('Erro ao atualizar motivo de anulação', 500);
    }
  }

  static async deleteMotivoAnulacao(id) {
    try {
      const existingMotivoAnulacao = await this.getMotivoAnulacaoById(id);

      await prisma.tb_motivos_anulacao.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Motivo de anulação excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao excluir motivo de anulação:', error);
      throw new AppError('Erro ao excluir motivo de anulação', 500);
    }
  }

  // ===============================
  // DASHBOARDS E ESTATÍSTICAS
  // ===============================

  static async getDashboardFinanceiro() {
    try {
      const hoje = new Date();
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

      const [
        totalPagamentosHoje,
        totalPagamentosMes,
        valorTotalMes,
        formasPagamentoMaisUsadas,
        servicosMaisPagos
      ] = await Promise.all([
        // Pagamentos de hoje
        prisma.tb_pagamentos.count({
          where: {
            data: {
              gte: new Date(hoje.setHours(0, 0, 0, 0)),
              lte: new Date(hoje.setHours(23, 59, 59, 999))
            }
          }
        }),

        // Pagamentos do mês
        prisma.tb_pagamentos.count({
          where: {
            data: {
              gte: inicioMes,
              lte: fimMes
            }
          }
        }),

        // Valor total do mês
        prisma.tb_pagamentos.aggregate({
          where: {
            data: {
              gte: inicioMes,
              lte: fimMes
            }
          },
          _sum: { totalgeral: true }
        }),

        // Formas de pagamento mais usadas
        prisma.tb_pagamentos.groupBy({
          by: ['codigo_FormaPagamento'],
          where: {
            data: {
              gte: inicioMes,
              lte: fimMes
            }
          },
          _count: { codigo: true },
          orderBy: { _count: { codigo: 'desc' } },
          take: 5
        }),

        // Serviços mais pagos
        prisma.tb_pagamentos.groupBy({
          by: ['codigo_Tipo_Servico'],
          where: {
            data: {
              gte: inicioMes,
              lte: fimMes
            },
            codigo_Tipo_Servico: { not: null }
          },
          _count: { codigo: true },
          _sum: { totalgeral: true },
          orderBy: { _count: { codigo: 'desc' } },
          take: 5
        })
      ]);

      return {
        resumo: {
          totalPagamentosHoje,
          totalPagamentosMes,
          valorTotalMes: valorTotalMes._sum.totalgeral || 0
        },
        formasPagamentoMaisUsadas,
        servicosMaisPagos
      };
    } catch (error) {
      console.error('Erro ao obter dashboard financeiro:', error);
      throw new AppError('Erro ao obter dashboard financeiro', 500);
    }
  }

  static async getEstatisticasPagamentos(periodo = '30') {
    try {
      const dias = parseInt(periodo);
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - dias);

      const estatisticas = await prisma.tb_pagamentos.groupBy({
        by: ['data'],
        where: {
          data: {
            gte: dataInicio
          }
        },
        _count: { codigo: true },
        _sum: { totalgeral: true },
        orderBy: { data: 'asc' }
      });

      return {
        periodo: `${dias} dias`,
        estatisticas: estatisticas.map(stat => ({
          data: stat.data,
          totalPagamentos: stat._count.codigo,
          valorTotal: stat._sum.totalgeral || 0
        }))
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas de pagamentos:', error);
      throw new AppError('Erro ao obter estatísticas de pagamentos', 500);
    }
  }

  // ===============================
  // ALUNOS CONFIRMADOS PARA PAGAMENTOS
  // ===============================

  static async getAlunosConfirmados(page = 1, limit = 50, search = '') {
    try {
      console.log('🔍 getAlunosConfirmados - Iniciando busca...');
      
      // Busca simples sem filtros primeiro
      const confirmacoes = await prisma.tb_confirmacoes.findMany({
        take: limit,
        skip: (page - 1) * limit,
        include: {
          tb_matriculas: {
            include: {
              aluno: true
            }
          },
          tb_turmas: {
            include: {
              tb_classes: true,
              tb_cursos: true
            }
          }
        }
      });

      console.log('✅ Confirmações encontradas:', confirmacoes.length);

      // Mapear dados
      const alunosConfirmados = confirmacoes.map(confirmacao => ({
        codigo: confirmacao.tb_matriculas.aluno.codigo,
        nome: confirmacao.tb_matriculas.aluno.nome,
        n_documento_identificacao: confirmacao.tb_matriculas.aluno.n_documento_identificacao,
        email: confirmacao.tb_matriculas.aluno.email,
        telefone: confirmacao.tb_matriculas.aluno.telefone,
        dadosAcademicos: {
          classe: confirmacao.tb_turmas.tb_classes.designacao,
          curso: confirmacao.tb_turmas.tb_cursos.designacao,
          turma: confirmacao.tb_turmas.designacao,
          codigo_Classe: confirmacao.tb_turmas.tb_classes.codigo,
          codigo_Curso: confirmacao.tb_turmas.tb_cursos.codigo,
          codigo_Turma: confirmacao.tb_turmas.codigo
        }
      }));

      // Filtrar por busca se fornecida
      let filteredAlunos = alunosConfirmados;
      if (search) {
        filteredAlunos = alunosConfirmados.filter(aluno => 
          aluno.nome.toLowerCase().includes(search.toLowerCase()) ||
          aluno.n_documento_identificacao.includes(search)
        );
      }

      console.log('✅ Alunos filtrados:', filteredAlunos.length);

      return {
        data: filteredAlunos,
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalItems: filteredAlunos.length,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    } catch (error) {
      console.error('❌ Erro ao buscar alunos confirmados:', error);
      throw new AppError('Erro ao buscar alunos confirmados', 500);
    }
  }

  // ===============================
  // RELATÓRIOS E DASHBOARDS
  // ===============================

  static async getRelatorioFinanceiro(filters) {
    try {
      const { dataInicio, dataFim, codigo_Aluno, codigo_FormaPagamento, tipoRelatorio } = filters;

      let where = {
        data: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim)
        }
      };

      if (codigo_Aluno) {
        where.codigo_Aluno = codigo_Aluno;
      }

      if (codigo_FormaPagamento) {
        where.codigo_FormaPagamento = codigo_FormaPagamento;
      }

      switch (tipoRelatorio) {
        case 'resumo':
          return await this.getRelatorioResumo(where);
        case 'detalhado':
          return await this.getRelatorioDetalhado(where);
        case 'por_aluno':
          return await this.getRelatorioPorAluno(where);
        case 'por_servico':
          return await this.getRelatorioPorServico(where);
        default:
          return await this.getRelatorioResumo(where);
      }
    } catch (error) {
      console.error('Erro ao gerar relatório financeiro:', error);
      throw new AppError('Erro ao gerar relatório financeiro', 500);
    }
  }

  static async getRelatorioResumo(where) {
    try {
      const [totalPagamentos, totalValor, totalDesconto, totalIva] = await Promise.all([
        prisma.tb_pagamentos.count({ where }),
        prisma.tb_pagamentos.aggregate({
          where,
          _sum: { totalgeral: true }
        }),
        prisma.tb_pagamentos.aggregate({
          where,
          _sum: { desconto: true }
        }),
        prisma.tb_pagamentos.aggregate({
          where,
          _sum: { taxa_iva: true }
        })
      ]);

      return {
        totalPagamentos,
        totalValor: totalValor._sum.totalgeral || 0,
        totalDesconto: totalDesconto._sum.desconto || 0,
        totalIva: totalIva._sum.taxa_iva || 0,
        valorLiquido: (totalValor._sum.totalgeral || 0) - (totalDesconto._sum.desconto || 0)
      };
    } catch (error) {
      console.error('Erro ao gerar relatório resumo:', error);
      throw new AppError('Erro ao gerar relatório resumo', 500);
    }
  }

  static async getRelatorioDetalhado(where) {
    try {
      const pagamentos = await prisma.tb_pagamentos.findMany({
        where,
        include: {
          aluno: {
            select: {
              codigo: true,
              nome: true
            }
          },
          tb_tipo_servicos: {
            select: {
              codigo: true,
              designacao: true
            }
          },
          formaPagamento: {
            select: {
              codigo: true,
              designacao: true
            }
          },
          utilizador: {
            select: {
              codigo: true,
              nome: true
            }
          }
        },
        orderBy: { data: 'desc' }
      });

      return { pagamentos };
    } catch (error) {
      console.error('Erro ao gerar relatório detalhado:', error);
      throw new AppError('Erro ao gerar relatório detalhado', 500);
    }
  }

  static async getRelatorioPorAluno(where) {
    try {
      const pagamentosPorAluno = await prisma.tb_pagamentos.groupBy({
        by: ['codigo_Aluno'],
        where,
        _sum: {
          totalgeral: true,
          desconto: true
        },
        _count: {
          codigo: true
        }
      });

      // Buscar nomes dos alunos
      const alunosIds = pagamentosPorAluno.map(p => p.codigo_Aluno);
      const alunos = await prisma.aluno.findMany({
        where: { codigo: { in: alunosIds } },
        select: { codigo: true, nome: true }
      });

      const alunosMap = alunos.reduce((acc, aluno) => {
        acc[aluno.codigo] = aluno.nome;
        return acc;
      }, {});

      return {
        pagamentosPorAluno: pagamentosPorAluno.map(p => ({
          codigo_Aluno: p.codigo_Aluno,
          nomeAluno: alunosMap[p.codigo_Aluno] || 'Nome não encontrado',
          totalPagamentos: p._count.codigo,
          valorTotal: p._sum.totalgeral || 0,
          totalDesconto: p._sum.desconto || 0,
          valorLiquido: (p._sum.totalgeral || 0) - (p._sum.desconto || 0)
        }))
      };
    } catch (error) {
      console.error('Erro ao gerar relatório por aluno:', error);
      throw new AppError('Erro ao gerar relatório por aluno', 500);
    }
  }

  static async getRelatorioPorServico(where) {
    try {
      const pagamentosPorServico = await prisma.tb_pagamentos.groupBy({
        by: ['codigo_Tipo_Servico'],
        where: {
          ...where,
          codigo_Tipo_Servico: { not: null }
        },
        _sum: {
          totalgeral: true,
          desconto: true
        },
        _count: {
          codigo: true
        }
      });

      // Buscar nomes dos serviços
      const servicosIds = pagamentosPorServico.map(p => p.codigo_Tipo_Servico).filter(Boolean);
      const servicos = await prisma.tb_tipo_servicos.findMany({
        where: { codigo: { in: servicosIds } },
        select: { codigo: true, designacao: true }
      });

      const servicosMap = servicos.reduce((acc, servico) => {
        acc[servico.codigo] = servico.designacao;
        return acc;
      }, {});

      return {
        pagamentosPorServico: pagamentosPorServico.map(p => ({
          codigo_Tipo_Servico: p.codigo_Tipo_Servico,
          nomeServico: servicosMap[p.codigo_Tipo_Servico] || 'Serviço não encontrado',
          totalPagamentos: p._count.codigo,
          valorTotal: p._sum.totalgeral || 0,
          totalDesconto: p._sum.desconto || 0,
          valorLiquido: (p._sum.totalgeral || 0) - (p._sum.desconto || 0)
        }))
      };
    } catch (error) {
      console.error('Erro ao gerar relatório por serviço:', error);
      throw new AppError('Erro ao gerar relatório por serviço', 500);
    }
  }

  // ===============================
  // NOVA GESTÃO FINANCEIRA
  // ===============================

  static async createPagamentoCompleto(data) {
    try {
      // Validar borderô se for depósito
      if (data.numeroBordero) {
        await this.validateBordero(data.numeroBordero);
      }

      // Determinar conta movimentada baseada na forma de pagamento e tipo de conta
      let contaMovimentada = 'CAIXA'; // Padrão
      if (data.tipoConta) {
        switch (data.tipoConta) {
          case 'BAI':
            contaMovimentada = 'BAI CONTA: 89248669/10/001';
            break;
          case 'BFA':
            contaMovimentada = 'BFA CONTA: 180912647/30/001';
            break;
          default:
            contaMovimentada = 'CAIXA';
        }
      }

      // Gerar hash para o pagamento
      const hash = `PAG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Gerar borderô (usar o fornecido ou gerar automaticamente)
      const borderoux = data.numeroBordero || `BOR_${Date.now()}`;
      
      // Criar pagamento principal primeiro
      const pagamentoPrincipal = await prisma.tb_pagamentoi.create({
        data: {
          data: new Date(),
          codigo_Aluno: data.codigo_Aluno,
          status: 1, // Ativo
          total: data.preco,
          valorEntregue: data.preco,
          dataBanco: new Date(),
          totalDesconto: 0,
          obs: data.observacao || '',
          borderoux: borderoux,
          hash: hash
        }
      });

      // Criar registro de pagamento detalhado
      const pagamento = await prisma.tb_pagamentos.create({
        data: {
          codigo_Aluno: data.codigo_Aluno,
          codigo_Tipo_Servico: data.codigo_Tipo_Servico,
          data: new Date(),
          n_Bordoro: borderoux,
          multa: 0,
          mes: data.mes,
          codigo_Utilizador: data.codigo_Utilizador || 1, // Usar o funcionário especificado ou padrão
          observacao: data.observacao || '',
          ano: data.ano,
          contaMovimentada: contaMovimentada,
          quantidade: 1,
          desconto: 0,
          totalgeral: data.preco,
          dataBanco: new Date(),
          codigo_Estatus: 1,
          codigo_Empresa: 1,
          codigo_FormaPagamento: data.codigo_FormaPagamento || 1,
          saldo_Anterior: 0,
          codigoPagamento: pagamentoPrincipal.codigo,
          descontoSaldo: 0,
          tipoDocumento: 'FATURA',
          next: 'NEXT',
          codoc: 0,
          fatura: `FAT_${Date.now()}`,
          taxa_iva: 0,
          hash: hash,
          preco: data.preco,
          indice_mes: this.getIndiceMes(data.mes),
          indice_ano: data.ano
        },
        include: {
          aluno: {
            select: {
              codigo: true,
              nome: true,
              n_documento_identificacao: true
            }
          },
          tb_tipo_servicos: {
            select: {
              codigo: true,
              designacao: true
            }
          },
          formaPagamento: {
            select: {
              codigo: true,
              designacao: true
            }
          }
        }
      });

      // Verificar se o tipo de serviço é propina e atualizar status
      await this.atualizarStatusPropina(data, pagamento);

      // Adicionar dados extras para a fatura
      return {
        ...pagamento,
        contaMovimentada,
        numeroBordero: borderoux,
        tipoConta: data.tipoConta || null
      };
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw new AppError('Erro ao criar pagamento', 500);
    }
  }

  // Método para atualizar status de propina quando pagamento for de propina
  static async atualizarStatusPropina(dadosPagamento, pagamento) {
    try {
      // Verificar se o tipo de serviço é propina
      const tipoServico = pagamento.tb_tipo_servicos;
      if (!tipoServico || !tipoServico.designacao) {
        return; // Não é possível determinar se é propina
      }

      const isPropina = tipoServico.designacao.toLowerCase().includes('propina');
      if (!isPropina) {
        return; // Não é pagamento de propina
      }

      console.log(`Atualizando status de propina para aluno ${dadosPagamento.codigo_Aluno}, mês ${dadosPagamento.mes}, ano ${dadosPagamento.ano}`);

      // Buscar dados do aluno para atualizar saldo
      const aluno = await prisma.aluno.findUnique({
        where: { codigo: dadosPagamento.codigo_Aluno },
        select: { saldo: true }
      });

      if (aluno) {
        // Atualizar saldo do aluno (subtrair o valor pago)
        const novoSaldo = (aluno.saldo || 0) - dadosPagamento.preco;
        await prisma.aluno.update({
          where: { codigo: dadosPagamento.codigo_Aluno },
          data: { saldo: Math.max(0, novoSaldo) } // Não permitir saldo negativo
        });

        console.log(`Saldo do aluno atualizado: ${aluno.saldo} -> ${Math.max(0, novoSaldo)}`);
      }

      // Aqui poderia implementar lógica adicional para marcar o mês como pago
      // em uma tabela de controle de propinas, se existir
      
    } catch (error) {
      console.error('Erro ao atualizar status de propina:', error);
      // Não lançar erro para não interromper o fluxo principal
    }
  }

  static async getAlunosConfirmados(page = 1, limit = 100, filters = {}) {
    try {
      const { skip, take } = getPagination(page, limit);
      
      console.log('🔍 Iniciando busca de alunos confirmados...');
      
      // BUSCA DIRETA NA TABELA DE CONFIRMAÇÕES
      let whereClause = {
        codigo_Status: { in: [1, 2] } // Incluir status 1 e 2 para capturar mais alunos
      };

      console.log(`🔍 Buscando confirmações com filtros:`, filters);

      const confirmacoes = await prisma.tb_confirmacoes.findMany({
        where: whereClause,
        include: {
          tb_matriculas: {
            include: {
              aluno: true,
              tb_cursos: true
            }
          },
          tb_turmas: {
            include: {
              tb_classes: true
            }
          }
        },
        // Sem limite para garantir que todos os alunos sejam carregados
        // ...(filters.search ? {} : { take: 500 }),
        orderBy: {
          data_Confirmacao: 'desc'
        }
      });

      console.log(`📊 Confirmações encontradas: ${confirmacoes.length}`);
      
      // Debug específico para os alunos problemáticos
      if (filters.search) {
        const termoBusca = filters.search.toLowerCase();
        const alunosProblematicos = ['clemente', 'alice', 'alda'];
        
        if (alunosProblematicos.some(nome => termoBusca.includes(nome))) {
          console.log(`🎯 Busca por aluno problemático detectada: "${filters.search}"`);
          console.log(`📋 Primeiras 10 confirmações encontradas:`);
          confirmacoes.slice(0, 10).forEach((conf, index) => {
            const nomeAluno = conf.tb_matriculas?.aluno?.nome || 'SEM NOME';
            console.log(`   ${index + 1}. ${nomeAluno}`);
          });
        }
      }

      // Converter para alunos únicos
      const alunosMap = new Map();
      
      confirmacoes.forEach(confirmacao => {
        if (confirmacao.tb_matriculas?.aluno) {
          const aluno = confirmacao.tb_matriculas.aluno;
          const alunoId = aluno.codigo;
          
          if (!alunosMap.has(alunoId)) {
            alunosMap.set(alunoId, {
              codigo: aluno.codigo,
              nome: aluno.nome,
              n_documento_identificacao: aluno.n_documento_identificacao,
              email: aluno.email,
              telefone: aluno.telefone,
              tb_matriculas: {
                codigo: confirmacao.tb_matriculas.codigo,
                tb_cursos: confirmacao.tb_matriculas.tb_cursos,
                tb_confirmacoes: [{
                  tb_turmas: confirmacao.tb_turmas
                }]
              }
            });
          }
        }
      });

      let todosAlunos = Array.from(alunosMap.values());
      console.log(`📊 Alunos únicos: ${todosAlunos.length}`);
      
      // Debug: verificar se CLEMENTE está na lista inicial
      const clementeInicial = todosAlunos.find(aluno => 
        aluno.nome.toLowerCase().includes('clemente') || 
        aluno.nome.toLowerCase().includes('thamba') ||
        aluno.nome.toLowerCase().includes('mabiala') ||
        aluno.nome.toLowerCase().includes('sibi')
      );
      
      if (clementeInicial) {
        console.log(`🎯 CLEMENTE encontrado na lista inicial: ${clementeInicial.nome}`);
        console.log(`   - Código: ${clementeInicial.codigo}`);
        console.log(`   - Documento: ${clementeInicial.n_documento_identificacao}`);
        console.log(`   - Curso: ${clementeInicial.tb_matriculas?.tb_cursos?.designacao}`);
        console.log(`   - Turma: ${clementeInicial.tb_matriculas?.tb_confirmacoes?.[0]?.tb_turmas?.designacao}`);
      } else {
        console.log(`❌ CLEMENTE NÃO encontrado na lista inicial`);
        console.log(`📋 Verificando se há confirmações para CLEMENTE...`);
        
        // Verificar se há confirmações com esse nome
        const confirmacaoClemente = confirmacoes.find(conf => 
          conf.tb_matriculas?.aluno?.nome?.toLowerCase().includes('clemente') ||
          conf.tb_matriculas?.aluno?.nome?.toLowerCase().includes('thamba')
        );
        
        if (confirmacaoClemente) {
          console.log(`🔍 Confirmação encontrada para: ${confirmacaoClemente.tb_matriculas.aluno.nome}`);
          console.log(`   - Status confirmação: ${confirmacaoClemente.codigo_Status}`);
          console.log(`   - Data confirmação: ${confirmacaoClemente.data_Confirmacao}`);
        } else {
          console.log(`❌ Nenhuma confirmação encontrada para CLEMENTE`);
          
          // Busca alternativa diretamente na tabela de alunos
          console.log(`🔍 Buscando CLEMENTE diretamente na tabela de alunos...`);
          const alunoClemente = await prisma.aluno.findFirst({
            where: {
              OR: [
                { nome: { contains: 'CLEMENTE', mode: 'insensitive' } },
                { nome: { contains: 'THAMBA', mode: 'insensitive' } },
                { nome: { contains: 'MABIALA', mode: 'insensitive' } },
                { nome: { contains: 'SIBI', mode: 'insensitive' } }
              ]
            },
            include: {
              tb_matriculas: {
                include: {
                  tb_cursos: true,
                  tb_confirmacoes: {
                    include: {
                      tb_turmas: {
                        include: {
                          tb_classes: true
                        }
                      }
                    }
                  }
                }
              }
            }
          });
          
          if (alunoClemente) {
            console.log(`✅ CLEMENTE encontrado na tabela de alunos: ${alunoClemente.nome}`);
            console.log(`   - Código: ${alunoClemente.codigo}`);
            console.log(`   - Tem matrícula: ${!!alunoClemente.tb_matriculas}`);
            console.log(`   - Confirmações: ${alunoClemente.tb_matriculas?.tb_confirmacoes?.length || 0}`);
            
            if (alunoClemente.tb_matriculas?.tb_confirmacoes?.length > 0) {
              alunoClemente.tb_matriculas.tb_confirmacoes.forEach((conf, index) => {
                console.log(`   - Confirmação ${index + 1}: Status ${conf.codigo_Status}, Turma: ${conf.tb_turmas?.designacao}`);
              });
            }
          } else {
            console.log(`❌ CLEMENTE não encontrado nem na tabela de alunos`);
          }
        }
      }


      // APLICAR FILTRO DE BUSCA NA LISTA DE ALUNOS CONFIRMADOS
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase().trim();
        console.log(`🔍 Aplicando filtro de busca para: "${searchTerm}"`);
        console.log(`📊 Total de alunos antes do filtro: ${todosAlunos.length}`);
        
        todosAlunos = todosAlunos.filter(aluno => {
          const nome = (aluno.nome || '').toLowerCase();
          const documento = (aluno.n_documento_identificacao || '').toLowerCase();
          
          let match = false;
          
          // BUSCA PROGRESSIVA E INTELIGENTE
          if (searchTerm.includes(' ')) {
            // Se tem espaços, busca progressiva por palavras
            const palavras = searchTerm.split(' ').filter(p => p.length > 0);
            const palavrasNome = nome.split(' ');
            
            // Cada palavra da busca deve ter uma palavra correspondente no nome que COMECE com ela
            match = palavras.every((palavra, index) => {
              // Para a primeira palavra, deve começar com ela
              if (index === 0) {
                return palavrasNome.some(palavraNome => palavraNome.startsWith(palavra));
              }
              // Para palavras seguintes, deve haver uma palavra que comece com ela
              return palavrasNome.some(palavraNome => palavraNome.startsWith(palavra));
            }) || documento.includes(searchTerm);
          } else {
            // Se é uma palavra só, buscar palavra que COMECE com o termo
            const palavrasNome = nome.split(' ');
            match = palavrasNome.some(palavraNome => palavraNome.startsWith(searchTerm)) || 
                   documento.includes(searchTerm);
          }
          
          // Debug específico para busca progressiva
          if ((searchTerm.includes('abel') || searchTerm.includes('c')) && nome.includes('abel')) {
            const palavrasNome = nome.split(' ');
            console.log(`🎯 BUSCA PROGRESSIVA: ${aluno.nome}`);
            console.log(`   - Nome: "${nome}"`);
            console.log(`   - Palavras do nome: [${palavrasNome.join(', ')}]`);
            console.log(`   - Termo busca: "${searchTerm}"`);
            
            if (searchTerm.includes(' ')) {
              const palavras = searchTerm.split(' ').filter(p => p.length > 0);
              console.log(`   - Palavras da busca: [${palavras.join(', ')}]`);
              palavras.forEach((palavra, index) => {
                const encontrou = palavrasNome.some(pn => pn.startsWith(palavra));
                console.log(`   - "${palavra}" encontrada: ${encontrou}`);
              });
            }
            
            console.log(`   - Match final: ${match}`);
          }
          
          return match;
        });
        
        console.log(`📊 Alunos encontrados após filtro: ${todosAlunos.length}`);
        
        // Debug: mostrar resultados se poucos
        if (todosAlunos.length <= 10) {
          console.log('📋 Resultados da busca:', todosAlunos.map(a => a.nome));
        }
      }

      // Aplicar outros filtros
      if (filters.curso) {
        const cursoId = parseInt(filters.curso);
        todosAlunos = todosAlunos.filter(aluno => 
          aluno.tb_matriculas?.tb_cursos?.codigo === cursoId
        );
        console.log(`🎓 Após filtro de curso: ${todosAlunos.length}`);
      }

      if (filters.turma) {
        const turmaId = parseInt(filters.turma);
        todosAlunos = todosAlunos.filter(aluno => 
          aluno.tb_matriculas?.tb_confirmacoes?.some(c => c.tb_turmas?.codigo === turmaId)
        );
        console.log(`🏫 Após filtro de turma: ${todosAlunos.length}`);
      }

      // Aplicar paginação
      const total = todosAlunos.length;
      const alunos = todosAlunos.slice(skip, skip + take);

      console.log(`📄 Página ${page}: ${alunos.length} alunos`);

      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      };

      return {
        data: alunos,
        pagination
      };
    } catch (error) {
      console.error('Erro ao buscar alunos confirmados:', error);
      throw new AppError('Erro ao buscar alunos confirmados', 500);
    }
  }

  static async getDadosFinanceirosAluno(alunoId, anoLectivoId = null) {
    try {
      console.log(`🔍 Buscando dados financeiros do aluno ${alunoId}`);
      
      // Buscar dados completos do aluno
      const aluno = await prisma.aluno.findUnique({
        where: { codigo: alunoId },
        include: {
          tb_matriculas: {
            include: {
              tb_cursos: true,
              tb_confirmacoes: {
                include: {
                  tb_turmas: {
                    include: {
                      tb_classes: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!aluno) {
        console.log(`❌ Aluno ${alunoId} não encontrado`);
        throw new AppError('Aluno não encontrado', 404);
      }

      console.log(`✅ Aluno encontrado: ${aluno.nome}`);

      // Buscar todos os pagamentos do aluno
      const pagamentos = await prisma.tb_pagamentos.findMany({
        where: { 
          codigo_Aluno: alunoId,
          ...(anoLectivoId && { ano: anoLectivoId })
        },
        include: {
          tb_tipo_servicos: true
        },
        orderBy: { data: 'desc' }
      });

      console.log(`💰 Encontrados ${pagamentos.length} pagamentos para o aluno`);

      // Separar pagamentos por tipo
      const pagamentosPropina = pagamentos.filter(p => p.tb_tipo_servicos?.designacao?.toLowerCase().includes('propina'));
      const outrosPagamentos = pagamentos.filter(p => !p.tb_tipo_servicos?.designacao?.toLowerCase().includes('propina'));

      // Calcular total pago APENAS de propinas do ano letivo específico
      const totalPagoPropinas = pagamentosPropina.reduce((sum, pagamento) => sum + (pagamento.preco || 0), 0);
      
      console.log(`📊 Resumo de pagamentos:`, {
        totalPagamentos: pagamentos.length,
        pagamentosPropina: pagamentosPropina.length,
        outrosPagamentos: outrosPagamentos.length,
        totalPagoPropinas,
        anoLectivoId
      });

      // Buscar dados acadêmicos
      const matricula = aluno.tb_matriculas;
      const confirmacao = matricula?.tb_confirmacoes?.[0];
      const curso = matricula?.tb_cursos?.designacao || 'N/A';
      const turma = confirmacao?.tb_turmas?.designacao || 'N/A';
      const classe = confirmacao?.tb_turmas?.tb_classes?.designacao || 'N/A';

      // Preparar histórico financeiro (outros serviços)
      const historicoFinanceiro = outrosPagamentos.map(pagamento => ({
        codigo: pagamento.codigo,
        data: pagamento.data,
        servico: pagamento.tb_tipo_servicos?.designacao || 'Serviço',
        valor: pagamento.preco || 0,
        observacao: pagamento.observacao || '',
        fatura: pagamento.fatura || `FAT_${pagamento.codigo}`
      }));

      return {
        aluno: {
          codigo: aluno.codigo,
          nome: aluno.nome,
          documento: aluno.n_documento_identificacao,
          email: aluno.email,
          telefone: aluno.telefone,
          curso,
          turma,
          classe
        },
        mesesPropina: [], // Será preenchido pelo hook useMesesPendentesAluno
        historicoFinanceiro,
        resumo: {
          totalMeses: 11, // Padrão para ano letivo
          mesesPagos: pagamentosPropina.length,
          mesesPendentes: Math.max(0, 11 - pagamentosPropina.length),
          valorMensal: pagamentosPropina.length > 0 ? (pagamentosPropina[0].preco || 0) : 0,
          totalPago: totalPagoPropinas, // ✅ Apenas propinas do ano letivo
          totalPendente: 0 // Será calculado dinamicamente
        }
      };
    } catch (error) {
      console.error('❌ ERRO COMPLETO:', error);
      console.error('❌ STACK:', error.stack);
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao obter dados financeiros do aluno:', error);
      throw new AppError('Erro ao obter dados financeiros do aluno', 500);
    }
  }


  static async gerarFaturaPDF(pagamentoId) {
    try {
      // Buscar dados do pagamento
      const pagamento = await prisma.tb_pagamentos.findUnique({
        where: { codigo: pagamentoId },
        include: {
          aluno: {
            select: {
              codigo: true,
              nome: true,
              n_documento_identificacao: true,
              email: true,
              telefone: true
            }
          },
          tb_tipo_servicos: {
            select: {
              designacao: true
            }
          },
          formaPagamento: {
            select: {
              designacao: true
            }
          }
        }
      });

      if (!pagamento) {
        throw new AppError('Pagamento não encontrado', 404);
      }

      // Usar dados da configuração da empresa
      const dadosEmpresa = getDadosFatura();
      
      return {
        pagamento,
        instituicao: {
          nome: dadosEmpresa.empresa.nome,
          nif: dadosEmpresa.empresa.nif,
          endereco: dadosEmpresa.empresa.endereco,
          telefones: dadosEmpresa.empresa.telefones.join(', '),
          email: dadosEmpresa.empresa.email,
          regime: dadosEmpresa.fiscal.regime
        },
        configuracao: {
          formato: 'A6', // Tamanho A6 (105 x 148 mm)
          orientacao: 'portrait',
          margens: {
            top: 8,
            right: 8,
            bottom: 8,
            left: 8
          },
          fontSize: {
            titulo: 10,
            cabecalho: 8,
            conteudo: 7,
            rodape: 6
          }
        },
        moeda: dadosEmpresa.moeda
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao gerar fatura PDF:', error);
      throw new AppError('Erro ao gerar fatura PDF', 500);
    }
  }

  // Utilitários
  static getIndiceMes(mes) {
    const meses = {
      'JANEIRO': 1, 'FEVEREIRO': 2, 'MARÇO': 3, 'ABRIL': 4,
      'MAIO': 5, 'JUNHO': 6, 'JULHO': 7, 'AGOSTO': 8,
      'SETEMBRO': 9, 'OUTUBRO': 10, 'NOVEMBRO': 11, 'DEZEMBRO': 12
    };
    return meses[mes.toUpperCase()] || 1;
  }

  // Método para buscar tipos de serviço
  static async getTiposServico() {
    try {
      const tiposServico = await prisma.tb_tipo_servicos.findMany({
        select: {
          codigo: true,
          designacao: true,
          preco: true
        },
        orderBy: {
          designacao: 'asc'
        }
      });

      return tiposServico;
    } catch (error) {
      console.error('Erro ao buscar tipos de serviço:', error);
      throw new Error('Erro ao buscar tipos de serviço');
    }
  }

  // Método para verificar se aluno tem pagamentos no ano letivo (temporariamente desabilitado)
  static async verificarPagamentosNoAno(alunoId, anoLectivo) {
    return false; // Simplificado para debug
  }

  // Método para buscar propina da classe do aluno
  static async getPropinaClasse(alunoId, anoLectivoId) {
    try {
      // Buscar a confirmação ativa do aluno para o ano letivo
      const confirmacao = await prisma.tb_confirmacoes.findFirst({
        where: {
          codigo_Ano_lectivo: parseInt(anoLectivoId),
          tb_matriculas: {
            codigo_Aluno: parseInt(alunoId)
          },
          codigo_Status: 1
        },
        include: {
          tb_turmas: {
            include: {
              tb_classes: {
                select: {
                  codigo: true,
                  designacao: true
                }
              }
            }
          }
        }
      });

      if (!confirmacao || !confirmacao.tb_turmas?.tb_classes) {
        return null;
      }

      // Buscar propina da classe
      const propinaClasse = await prisma.tb_propina_classe.findFirst({
        where: {
          codigo_Classe: confirmacao.tb_turmas.tb_classes.codigo,
          codigo_Ano_lectivo: parseInt(anoLectivoId)
        },
        include: {
          tb_tipo_servicos: {
            select: {
              codigo: true,
              designacao: true,
              preco: true
            }
          }
        }
      });

      return propinaClasse;
    } catch (error) {
      console.error('Erro ao buscar propina da classe:', error);
      return null;
    }
  }

  // Método para buscar anos letivos
  static async getAnosLectivos() {
    try {
      const anosLectivos = await prisma.tb_ano_lectivo.findMany({
        select: {
          codigo: true,
          designacao: true,
          mesInicial: true,
          mesFinal: true,
          anoInicial: true,
          anoFinal: true
        },
        orderBy: {
          designacao: 'desc' // Mais recente primeiro
        }
      });
      return anosLectivos;
    } catch (error) {
      console.error('Erro ao buscar anos letivos:', error);
      throw new AppError('Erro ao buscar anos letivos', 500);
    }
  }

  // Método para validar número de borderô (9 dígitos únicos)
  static async validateBordero(bordero, excludeId = null) {
    try {
      console.log(`🔍 Validando borderô: ${bordero}, excludeId: ${excludeId}`);
      
      // Validar formato (exatamente 9 dígitos)
      if (!/^\d{9}$/.test(bordero)) {
        console.log(`❌ Formato inválido: ${bordero}`);
        throw new AppError('Número de borderô deve conter exatamente 9 dígitos', 400);
      }

      // Verificar duplicatas na tb_pagamentoi com informações detalhadas
      const whereClause = { borderoux: bordero };
      if (excludeId) {
        whereClause.codigo = { not: excludeId };
      }
      
      console.log(`🔍 Buscando borderô com whereClause:`, whereClause);

      const existingBordero = await prisma.tb_pagamentoi.findFirst({
        where: whereClause
      });

      console.log(`🔍 Resultado da busca:`, existingBordero ? `Encontrado: ${existingBordero.codigo}` : 'Não encontrado');

      if (existingBordero) {
        // Buscar apenas o nome do aluno
        let alunoInfo = 'N/A';
        
        try {
          console.log(`🔍 Pagamento encontrado:`, {
            codigo: existingBordero.codigo,
            codigo_Aluno: existingBordero.codigo_Aluno
          });
          
          if (existingBordero.codigo_Aluno) {
            const aluno = await prisma.aluno.findUnique({
              where: { codigo: existingBordero.codigo_Aluno }
            });
            
            if (aluno) {
              alunoInfo = aluno.nome;
              console.log(`👤 Aluno encontrado: ${alunoInfo}`);
            }
          }
        } catch (error) {
          console.log('Erro ao buscar informações do pagamento duplicado:', error.message);
        }
        
        const errorMessage = `Número de borderô já foi usado na fatura #${existingBordero.codigo}. Aluno: ${alunoInfo}`;
        
        console.log(`🚨 Mensagem de erro final: ${errorMessage}`);
        throw new AppError(errorMessage, 400);
      }

      console.log(`✅ Borderô ${bordero} é válido e disponível`);
      return true;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao validar borderô:', error);
      throw new AppError('Erro ao validar número de borderô', 500);
    }
  }

  // Método auxiliar para extrair classe da turma
  static extrairClasseDaTurma(designacaoTurma) {
    try {
      // Padrões comuns: "10ª Classe A", "9ª A", "Classe 11 B", etc.
      const patterns = [
        /(\d+)ª\s*Classe/i,
        /Classe\s*(\d+)/i,
        /(\d+)ª/i,
        /(\d+)/
      ];
      
      for (const pattern of patterns) {
        const match = designacaoTurma.match(pattern);
        if (match) {
          return `${match[1]}ª Classe`;
        }
      }
      
      return designacaoTurma; // Retorna original se não conseguir extrair
    } catch (error) {
      console.error('Erro ao extrair classe da turma:', error);
      return designacaoTurma;
    }
  }

  static async getFormasPagamento() {
    try {
      const formasPagamento = await prisma.tb_forma_pagamento.findMany({
        orderBy: {
          designacao: 'asc'
        }
      });
      return formasPagamento;
    } catch (error) {
      console.error('Erro ao buscar formas de pagamento:', error);
      throw new AppError('Erro ao buscar formas de pagamento', 500);
    }
  }

  // Método para buscar dados completos de um aluno específico
  static async getAlunoCompleto(alunoId) {
    try {
      console.log(`🔍 Buscando dados completos do aluno ${alunoId} (confirmação mais recente)`);

      // Buscar confirmação mais recente do aluno
      const confirmacao = await prisma.tb_confirmacoes.findFirst({
        where: {
          tb_matriculas: {
            codigo_Aluno: parseInt(alunoId)
          }
        },
        include: {
          tb_matriculas: {
            include: {
              tb_alunos: true
            }
          },
          tb_turmas: {
            include: {
              tb_classes: true,
              tb_cursos: true
            }
          }
        },
        orderBy: {
          codigo: 'desc' // Confirmação mais recente
        }
      });

      if (!confirmacao) {
        throw new AppError('Aluno não encontrado ou não confirmado', 404);
      }

      const aluno = confirmacao.tb_matriculas.tb_alunos;

      const turma = confirmacao.tb_turmas;
      const classe = turma.tb_classes;
      const curso = turma.tb_cursos; // Curso da turma (mais atual)

      console.log(`✅ Dados encontrados:`, {
        aluno: aluno.nome,
        classe: classe.designacao,
        curso: curso.designacao,
        turma: turma.designacao
      });

      return {
        aluno: {
          codigo: aluno.codigo,
          nome: aluno.nome,
          documento: aluno.n_documento_identificacao,
          email: aluno.email,
          telefone: aluno.telefone,
          dataNascimento: aluno.data_nascimento,
          sexo: aluno.sexo
        },
        dadosAcademicos: {
          curso: curso.designacao,
          classe: classe.designacao,
          turma: turma.designacao,
          codigoTurma: turma.codigo,
          codigoClasse: classe.codigo,
          codigoCurso: curso.codigo,
          confirmacao_codigo: confirmacao.codigo
        }
      };
    } catch (error) {
      console.error('❌ Erro ao buscar dados completos do aluno:', error);
      throw new AppError('Erro ao buscar dados do aluno', 500);
    }
  }

  // Método para buscar tipo de serviço específico da turma do aluno (propinas)
  static async getTipoServicoTurmaAluno(alunoId) {
    try {
      // Primeiro buscar dados do aluno e sua turma
      const alunoCompleto = await this.getAlunoCompleto(alunoId);
      
      if (!alunoCompleto.dadosAcademicos.codigoTurma) {
        throw new AppError('Aluno não possui turma associada', 400);
      }

      const codigoTurma = alunoCompleto.dadosAcademicos.codigoTurma;
      const codigoClasse = alunoCompleto.dadosAcademicos.codigoClasse;

      // Buscar serviços específicos da turma (tb_servicos_turma)
      let servicoTurma = await prisma.tb_servicos_turma.findFirst({
        where: {
          codigoTurma: codigoTurma,
          codigoClasse: codigoClasse
        }
      });

      let tipoServico = null;
      if (servicoTurma) {
        // Buscar o tipo de serviço relacionado
        tipoServico = await prisma.tb_tipo_servicos.findUnique({
          where: {
            codigo: servicoTurma.codigoServico
          },
          select: {
            codigo: true,
            designacao: true,
            preco: true
          }
        });
      }

      // Se não encontrar na tb_servicos_turma, buscar em tb_servico_aluno
      if (!tipoServico) {
        const servicoAluno = await prisma.tb_servico_aluno.findFirst({
          where: {
            codigo_Aluno: parseInt(alunoId),
            codigo_Turma: codigoTurma,
            status: 1 // Ativo
          }
        });

        if (servicoAluno) {
          // Buscar tipo de serviço separadamente
          const tipoServicoData = await prisma.tb_tipo_servicos.findUnique({
            where: { codigo: servicoAluno.codigo_Servico },
            select: {
              codigo: true,
              designacao: true,
              preco: true
            }
          });
          
          if (tipoServicoData) {
            tipoServico = {
              tb_tipo_servicos: tipoServicoData
            };
          }
        }
      }

      // Se ainda não encontrar, buscar propina genérica da classe
      if (!tipoServico) {
        const propinaClasse = await prisma.tb_propina_classe.findFirst({
          where: {
            codigoClasse: codigoClasse
          },
          include: {
            tb_tipo_servicos: {
              select: {
                codigo: true,
                designacao: true,
                preco: true
              }
            }
          }
        });

        if (propinaClasse) {
          tipoServico = {
            tb_tipo_servicos: propinaClasse.tb_tipo_servicos
          };
        }
      }

      // Se ainda não encontrar, buscar qualquer tipo de serviço que contenha "propina" e a classe
      if (!tipoServico) {
        const classeDesignacao = alunoCompleto.dadosAcademicos.classe;
        const tipoServicoGenerico = await prisma.tb_tipo_servicos.findFirst({
          where: {
            designacao: {
              contains: 'PROPINA'
            },
            OR: [
              {
                designacao: {
                  contains: classeDesignacao
                }
              },
              {
                designacao: {
                  contains: classeDesignacao.replace('ª', '')
                }
              }
            ]
          },
          select: {
            codigo: true,
            designacao: true,
            preco: true
          }
        });

        if (tipoServicoGenerico) {
          tipoServico = {
            tb_tipo_servicos: tipoServicoGenerico
          };
        }
      }

      return tipoServico ? {
        codigo: tipoServico.tb_tipo_servicos.codigo,
        designacao: tipoServico.tb_tipo_servicos.designacao,
        preco: tipoServico.tb_tipo_servicos.preco
      } : null;
    } catch (error) {
      console.error('Erro ao buscar tipo de serviço da turma:', error);
      throw new AppError('Erro ao buscar tipo de serviço da turma', 500);
    }
  }

  // Método para buscar meses pendentes de pagamento de um aluno por ano letivo
  static async getMesesPendentesAluno(alunoId, codigoAnoLectivo = null) {
    try {
      console.log(`Buscando meses pendentes para aluno ${alunoId}, código ano letivo: ${codigoAnoLectivo}`);
      
      // Buscar dados do aluno
      const aluno = await prisma.tb_alunos.findUnique({
        where: { codigo: parseInt(alunoId) },
        include: {
          tb_matriculas: {
            include: {
              tb_confirmacoes: {
                where: { codigo_Status: 1 },
                include: {
                  tb_turmas: {
                    select: {
                      codigo_AnoLectivo: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!aluno) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // Buscar ano letivo específico ou usar o atual do aluno
      let anoLectivoSelecionado;
      if (codigoAnoLectivo) {
        anoLectivoSelecionado = await prisma.tb_ano_lectivo.findUnique({
          where: { codigo: parseInt(codigoAnoLectivo) }
        });
      } else {
        // Buscar o ano letivo atual (pode ser o mais recente ou baseado na data)
        anoLectivoSelecionado = await prisma.tb_ano_lectivo.findFirst({
          orderBy: { codigo: 'desc' }
        });
      }

      if (!anoLectivoSelecionado) {
        throw new AppError('Ano letivo não encontrado', 404);
      }

      console.log(`Ano letivo selecionado: ${anoLectivoSelecionado.designacao}`);

      // VERIFICAR SE O ALUNO ESTAVA REALMENTE MATRICULADO NESTE ANO LETIVO
      const confirmacaoNoAno = await prisma.tb_confirmacoes.findFirst({
        where: {
          codigo_Ano_lectivo: anoLectivoSelecionado.codigo,
          tb_matriculas: {
            codigo_Aluno: parseInt(alunoId)
          },
          codigo_Status: 1 // Apenas confirmações ativas
        },
        include: {
          tb_matriculas: {
            select: {
              data_Matricula: true,
              codigo_Aluno: true
            }
          }
        }
      });

      // Se não há confirmação, verificar se há pagamentos para este ano
      const temPagamentosEspecificos = await prisma.tb_pagamentos.findFirst({
        where: {
          codigo_Aluno: parseInt(alunoId),
          OR: [
            {
              ano: parseInt(anoLectivoSelecionado.anoInicial),
              mes: { in: ['SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'] }
            },
            {
              ano: parseInt(anoLectivoSelecionado.anoFinal),
              mes: { in: ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO'] }
            }
          ]
        }
      });

      // Se não há confirmação E não há pagamentos específicos, retornar mensagem apropriada
      if (!confirmacaoNoAno && !temPagamentosEspecificos) {
        console.log(`Aluno ${alunoId} não estava matriculado no ano ${anoLectivoSelecionado.designacao} e não tem pagamentos específicos`);
        return {
          mesesPendentes: [],
          mesesPagos: [],
          totalMeses: 0,
          mesesPagosCount: 0,
          mesesPendentesCount: 0,
          proximoMes: null,
          anoLectivo: anoLectivoSelecionado,
          dividasAnteriores: [],
          temDividas: false,
          mensagem: `Nenhuma matrícula ou confirmação encontrada para o aluno no ano letivo ${anoLectivoSelecionado.designacao}`
        };
      }

      // Converter designação do ano letivo para anos numéricos
      // Ex: "2024/2025" -> ano inicial: 2024, anoFinal: 2025
      const anoInicial = parseInt(anoLectivoSelecionado.anoInicial);
      const anoFinal = parseInt(anoLectivoSelecionado.anoFinal);

      // Buscar pagamentos de propina do aluno para este ano letivo específico
      // Precisamos buscar TODOS os pagamentos de propina e depois filtrar,
      // pois o campo 'mes' pode estar em dois formatos: "SETEMBRO" ou "SETEMBRO-2025"
      const pagamentos = await prisma.tb_pagamentos.findMany({
        where: {
          codigo_Aluno: parseInt(alunoId),
          tb_tipo_servicos: {
            designacao: {
              contains: 'propina'
            }
          },
          OR: [
            // Formato novo: "SETEMBRO-2025"
            {
              mes: {
                contains: `-${anoInicial}`
              }
            },
            {
              mes: {
                contains: `-${anoFinal}`
              }
            },
            // Formato antigo: mes separado + ano
            {
              AND: [
                { ano: { in: [anoInicial, anoFinal] } },
                { 
                  mes: { 
                    in: ['SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO', 'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO'],
                 
                  } 
                }
              ]
            }
          ]
        },
        include: {
          tb_tipo_servicos: {
            select: {
              designacao: true
            }
          }
        }
      });

      // Filtrar pagamentos que realmente pertencem a este ano letivo
      const todosPagamentos = pagamentos.filter(pagamento => {
        if (!pagamento.mes) return false;
        
        let mesSimples, anoPagamento;
        
        // Extrair mês e ano do pagamento
        if (pagamento.mes.includes('-')) {
          const partes = pagamento.mes.split('-');
          mesSimples = partes[0].toUpperCase().trim();
          anoPagamento = parseInt(partes[1]);
        } else {
          mesSimples = pagamento.mes.toUpperCase().trim();
          anoPagamento = pagamento.ano;
        }
        
        // Verificar se o mês/ano pertencem a este ano letivo
        const mesesPrimeiroAno = ['SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
        const mesesSegundoAno = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO'];
        
        if (mesesPrimeiroAno.includes(mesSimples)) {
          return anoPagamento === anoInicial;
        } else if (mesesSegundoAno.includes(mesSimples)) {
          return anoPagamento === anoFinal;
        }
        
        return false;
      });

      console.log(`Encontrados ${pagamentos.length} pagamentos de propina (antes da filtragem)`);
      console.log(`Após filtrar por ano letivo ${anoLectivoSelecionado.designacao}: ${todosPagamentos.length} pagamentos`);
      console.log(`Critério de busca: ${anoInicial} (SET-DEZ) e ${anoFinal} (JAN-JUL)`);
      
      // Log detalhado dos pagamentos encontrados
      todosPagamentos.forEach(pag => {
        console.log(`- Pagamento válido: ${pag.mes} (ano campo: ${pag.ano}) - ID: ${pag.codigo}`);
      });

      // Todos os meses do ano letivo (setembro a julho)
      const mesesAnoLectivo = [
        'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
        'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO'
      ];

      // Identificar meses já pagos (formato: MÊS-ANO)
      const mesesPagosSet = new Set();
      const mesesPagosDetalhados = [];
      const mesesPagosDetalhadosSet = new Set(); // Para evitar duplicatas
      
      // Mapa para saber qual ano pertence cada mês do ano letivo
      const mesesComAno = new Map();
      mesesAnoLectivo.forEach((mes, index) => {
        // Meses de setembro a dezembro pertencem ao ano inicial
        // Meses de janeiro a julho pertencem ao ano final
        const anoDoPeriodo = index < 4 ? anoInicial : anoFinal;
        mesesComAno.set(mes, anoDoPeriodo);
      });
      
      todosPagamentos.forEach(pagamento => {
        if (pagamento.mes) {
          let mesSimples, anoPagamento;
          
          // Verificar se o mês já vem no formato "MÊS-ANO" ou apenas "MÊS"
          if (pagamento.mes.includes('-')) {
            // Formato: "SETEMBRO-2025"
            const partes = pagamento.mes.split('-');
            mesSimples = partes[0].toUpperCase().trim();
            anoPagamento = parseInt(partes[1]);
          } else {
            // Formato antigo: mês separado do ano
            mesSimples = pagamento.mes.toUpperCase().trim();
            anoPagamento = pagamento.ano;
          }
          
          const mesDetalhado = `${mesSimples}-${anoPagamento}`;
          const anoEsperado = mesesComAno.get(mesSimples);
          
          // Só adicionar ao Set de meses pagos se for do ano correto do ano letivo
          if (anoPagamento === anoEsperado) {
            mesesPagosSet.add(mesSimples);
          }
          
          // Evitar duplicatas nos meses detalhados
          if (!mesesPagosDetalhadosSet.has(mesDetalhado)) {
            mesesPagosDetalhadosSet.add(mesDetalhado);
            mesesPagosDetalhados.push(mesDetalhado);
          }
        }
      });

      const mesesPagos = mesesPagosDetalhados;
      const mesesPendentes = mesesAnoLectivo.filter(mes => !mesesPagosSet.has(mes));

      console.log('📊 Análise de Meses:');
      console.log('  - Meses pagos (detalhados):', mesesPagos);
      console.log('  - Meses pagos (simples):', Array.from(mesesPagosSet));
      console.log('  - Meses pendentes:', mesesPendentes);
      console.log('  - Mapa mês->ano esperado:', Object.fromEntries(mesesComAno));
      console.log('  - Ano letivo:', `${anoInicial}/${anoFinal}`);

      // Determinar próximo mês a pagar
      const proximoMes = mesesPendentes.length > 0 ? mesesPendentes[0] : null;

      // Verificar se há dívidas de anos anteriores (temporariamente desabilitado)
      // const dividasAnteriores = await this.verificarDividasAnteriores(alunoId, anoLectivoSelecionado.codigo);
      const dividasAnteriores = [];

      return {
        mesesPendentes,
        mesesPagos,
        totalMeses: mesesAnoLectivo.length,
        mesesPagosCount: mesesPagos.length,
        mesesPendentesCount: mesesPendentes.length,
        proximoMes,
        anoLectivo: anoLectivoSelecionado,
        dividasAnteriores,
        temDividas: mesesPendentes.length > 0 || dividasAnteriores.length > 0
      };
    } catch (error) {
      console.error('Erro ao buscar meses pendentes:', error);
      throw new AppError('Erro ao buscar meses pendentes do aluno', 500);
    }
  }

  // Método para verificar se aluno estava matriculado em um ano letivo específico
  static async verificarMatriculaNoAno(alunoId, anoLectivo) {
    try {
      // Buscar confirmação do aluno no ano letivo específico
      const confirmacao = await prisma.tb_confirmacoes.findFirst({
        where: {
          codigo_Ano_lectivo: anoLectivo.codigo,
          tb_matriculas: {
            codigo_Aluno: parseInt(alunoId)
          },
          codigo_Status: 1 // Apenas confirmações ativas
        },
        include: {
          tb_matriculas: {
            select: {
              data_Matricula: true,
              codigo_Aluno: true
            }
          }
        }
      });

      return confirmacao !== null;
    } catch (error) {
      console.error('Erro ao verificar matrícula no ano:', error);
      return false;
    }
  }

  // Método para obter período de estudo do aluno no ano letivo
  static async obterPeriodoEstudoAluno(alunoId, anoLectivo) {
    try {
      const confirmacao = await prisma.tb_confirmacoes.findFirst({
        where: {
          codigo_Ano_lectivo: anoLectivo.codigo,
          tb_matriculas: {
            codigo_Aluno: parseInt(alunoId)
          },
          codigo_Status: 1
        },
        select: {
          data_Confirmacao: true,
          mes_Comecar: true
        }
      });

      if (!confirmacao) return null;

      return {
        dataInicio: confirmacao.mes_Comecar || confirmacao.data_Confirmacao,
        dataConfirmacao: confirmacao.data_Confirmacao
      };
    } catch (error) {
      console.error('Erro ao obter período de estudo:', error);
      return null;
    }
  }

  // Método para verificar dívidas de anos letivos anteriores (apenas anos em que o aluno estudou)
  static async verificarDividasAnteriores(alunoId, codigoAnoLectivoAtual) {
    try {
      // Buscar todos os anos letivos anteriores ao atual
      const anosAnteriores = await prisma.tb_ano_lectivo.findMany({
        where: {
          codigo: {
            lt: parseInt(codigoAnoLectivoAtual)
          }
        },
        orderBy: { codigo: 'desc' }
      });

      const dividasAnteriores = [];

      for (const anoAnterior of anosAnteriores) {
        // VERIFICAR SE O ALUNO ESTAVA REALMENTE MATRICULADO NESTE ANO
        const estavMatriculado = await this.verificarMatriculaNoAno(alunoId, anoAnterior);
        
        if (!estavMatriculado) {
          console.log(`Aluno ${alunoId} não estava matriculado no ano ${anoAnterior.designacao}, pulando...`);
          continue; // Pular este ano se o aluno não estava matriculado
        }
        const anoInicial = parseInt(anoAnterior.anoInicial);
        const anoFinal = parseInt(anoAnterior.anoFinal);

        // Buscar pagamentos do aluno neste ano anterior
        const pagamentosAnoAnterior = await prisma.tb_pagamentos.findMany({
          where: {
            codigo_Aluno: parseInt(alunoId),
            OR: [
              { ano: anoInicial },
              { ano: anoFinal }
            ],
            tb_tipo_servicos: {
              designacao: {
                contains: 'propina'
              }
            }
          }
        });

        // Verificar se há meses não pagos
        const mesesAnoLectivo = [
          'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
          'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO'
        ];

        const mesesPagosAnoAnterior = new Set();
        pagamentosAnoAnterior.forEach(pagamento => {
          if (pagamento.mes) {
            mesesPagosAnoAnterior.add(pagamento.mes.toUpperCase());
          }
        });

        const mesesPendentesAnoAnterior = mesesAnoLectivo.filter(mes => !mesesPagosAnoAnterior.has(mes));

        if (mesesPendentesAnoAnterior.length > 0) {
          dividasAnteriores.push({
            anoLectivo: anoAnterior,
            mesesPendentes: mesesPendentesAnoAnterior,
            mesesPagos: Array.from(mesesPagosAnoAnterior),
            totalPendente: mesesPendentesAnoAnterior.length
          });
        }
      }

      return dividasAnteriores;
    } catch (error) {
      console.error('Erro ao verificar dívidas anteriores:', error);
      return [];
    }
  }

  // ===============================
  // FUNCIONÁRIOS
  // ===============================

  static async getAllFuncionarios() {
    try {
      const funcionarios = await prisma.tb_utilizadores.findMany({
        select: {
          codigo: true,
          nome: true,
          user: true,
          estadoActual: true
        },
        where: {
          estadoActual: 'ATIVO' // Apenas funcionários ativos
        },
        orderBy: {
          nome: 'asc'
        }
      });

      return funcionarios;
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      throw new AppError('Erro ao buscar funcionários', 500);
    }
  }

  // ===============================
  // RELATÓRIOS DE VENDAS POR FUNCIONÁRIO
  // ===============================

  static async getRelatorioVendasFuncionarios(periodo = 'diario', dataInicio = null, dataFim = null) {
    try {
      console.log('=== INICIANDO RELATÓRIO DE VENDAS POR FUNCIONÁRIO ===');
      console.log('Parâmetros recebidos:', { periodo, dataInicio, dataFim });
      
      // Definir período se não especificado
      const hoje = new Date();
      let startDate, endDate;

      if (dataInicio && dataFim) {
        startDate = new Date(dataInicio);
        endDate = new Date(dataFim);
      } else {
        switch (periodo) {
          case 'diario':
            startDate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            endDate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
            break;
          case 'semanal':
            const inicioSemana = hoje.getDate() - hoje.getDay();
            startDate = new Date(hoje.getFullYear(), hoje.getMonth(), inicioSemana);
            endDate = new Date(hoje.getFullYear(), hoje.getMonth(), inicioSemana + 7);
            break;
          case 'mensal':
            startDate = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            endDate = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
            break;
          default:
            startDate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            endDate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
        }
      }

      console.log(`Buscando relatório de vendas - Período: ${periodo}, De: ${startDate.toISOString()}, Até: ${endDate.toISOString()}`);

      // Buscar pagamentos no período com dados do funcionário
      const pagamentos = await prisma.tb_pagamentos.findMany({
        where: {
          data: {
            gte: startDate,
            lt: endDate
          }
          // Remover filtro not: null pois causa erro no Prisma
        },
        include: {
          aluno: {
            select: {
              codigo: true,
              nome: true
            }
          },
          tb_tipo_servicos: {
            select: {
              codigo: true,
              designacao: true,
              preco: true
            }
          },
          formaPagamento: {
            select: {
              codigo: true,
              designacao: true
            }
          },
          utilizador: {
            select: {
              codigo: true,
              nome: true,
              user: true,
              estadoActual: true
            }
          }
        },
        orderBy: [
          { data: 'desc' },
          { codigo_Utilizador: 'asc' }
        ]
      });

      console.log(`Encontrados ${pagamentos.length} pagamentos no período`);

      // Buscar todos os funcionários que fizeram pagamentos no período
      const funcionariosUnicos = [...new Set(pagamentos.map(p => p.codigo_Utilizador))];
      console.log(`Funcionários únicos encontrados: ${funcionariosUnicos.join(', ')}`);

      // Buscar dados completos dos funcionários
      const funcionarios = await prisma.tb_utilizadores.findMany({
        where: {
          codigo: {
            in: funcionariosUnicos
          }
        },
        select: {
          codigo: true,
          nome: true,
          user: true
        }
      });

      console.log(`Dados dos funcionários:`, funcionarios);

      // Agrupar por funcionário
      const vendasPorFuncionario = {};
      let totalGeral = 0;

      pagamentos.forEach(pagamento => {
        const funcionarioId = pagamento.codigo_Utilizador;
        
        // Pular pagamentos sem funcionário válido (não deveria acontecer devido ao filtro)
        if (!funcionarioId) {
          console.warn('Pagamento sem código de utilizador encontrado:', pagamento.codigo);
          return;
        }
        
        // Buscar dados do funcionário na lista obtida
        const funcionarioData = funcionarios.find(f => f.codigo === funcionarioId);
        
        // Priorizar sempre o nome da tabela utilizadores
        let funcionarioNome = 'Funcionário Desconhecido';
        let funcionarioUser = 'N/A';
        
        if (funcionarioData) {
          funcionarioNome = funcionarioData.nome;
          funcionarioUser = funcionarioData.user;
        } else if (pagamento.utilizador?.nome) {
          funcionarioNome = pagamento.utilizador.nome;
          funcionarioUser = pagamento.utilizador.user || 'N/A';
        } else {
          funcionarioNome = `Funcionário ${funcionarioId}`;
        }
        
        console.log(`Processando pagamento ${pagamento.codigo} - Funcionário ID ${funcionarioId}: Nome="${funcionarioNome}", User="${funcionarioUser}"`);
        
        // Usar o preço do pagamento ou do tipo de serviço como fallback
        const valor = pagamento.preco || pagamento.tipoServico?.preco || 0;

        if (!vendasPorFuncionario[funcionarioId]) {
          vendasPorFuncionario[funcionarioId] = {
            funcionarioId,
            funcionarioNome,
            funcionarioUser,
            totalVendas: 0,
            quantidadePagamentos: 0,
            pagamentos: []
          };
        }

        vendasPorFuncionario[funcionarioId].totalVendas += valor;
        vendasPorFuncionario[funcionarioId].quantidadePagamentos += 1;
        vendasPorFuncionario[funcionarioId].pagamentos.push({
          codigo: pagamento.codigo,
          aluno: pagamento.aluno?.nome || 'Aluno não identificado',
          tipoServico: pagamento.tb_tipo_servicos?.designacao || 'Serviço',
          valor: valor,
          mes: pagamento.mes,
          ano: pagamento.ano,
          data: pagamento.data,
          formaPagamento: pagamento.formaPagamento?.designacao || 'N/A'
        });

        totalGeral += valor;
      });

      console.log(`Total de funcionários com vendas: ${Object.keys(vendasPorFuncionario).length}`);
      console.log(`Total geral de vendas: ${totalGeral} Kz`);

      // Converter para array e ordenar por total de vendas (decrescente)
      const relatorio = Object.values(vendasPorFuncionario).sort((a, b) => b.totalVendas - a.totalVendas);

      // Log do ranking final
      console.log('=== RANKING DE FUNCIONÁRIOS ===');
      relatorio.forEach((func, index) => {
        console.log(`${index + 1}º - ${func.funcionarioNome} (@${func.funcionarioUser}): ${func.totalVendas} Kz (${func.quantidadePagamentos} pagamentos)`);
      });

      return {
        periodo,
        dataInicio: startDate,
        dataFim: endDate,
        totalGeral,
        totalPagamentos: pagamentos.length,
        funcionarios: relatorio.map(func => ({
          ...func,
          percentualDoTotal: totalGeral > 0 ? ((func.totalVendas / totalGeral) * 100).toFixed(2) : 0
        })),
        resumo: {
          melhorFuncionario: relatorio[0] || null,
          totalFuncionarios: relatorio.length,
          mediaVendasPorFuncionario: relatorio.length > 0 ? (totalGeral / relatorio.length).toFixed(2) : 0
        }
      };

    } catch (error) {
      console.error('Erro ao gerar relatório de vendas por funcionário:', error);
      throw new AppError('Erro ao gerar relatório de vendas por funcionário', 500);
    }
  }

  static async getRelatorioVendasDetalhado(funcionarioId, periodo = 'diario', dataInicio = null, dataFim = null) {
    try {
      // Definir período se não especificado
      const hoje = new Date();
      let startDate, endDate;

      if (dataInicio && dataFim) {
        startDate = new Date(dataInicio);
        endDate = new Date(dataFim);
      } else {
        switch (periodo) {
          case 'diario':
            startDate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            endDate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
            break;
          case 'semanal':
            const inicioSemana = hoje.getDate() - hoje.getDay();
            startDate = new Date(hoje.getFullYear(), hoje.getMonth(), inicioSemana);
            endDate = new Date(hoje.getFullYear(), hoje.getMonth(), inicioSemana + 7);
            break;
          case 'mensal':
            startDate = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            endDate = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
            break;
          default:
            startDate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            endDate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
        }
      }

      // Buscar dados do funcionário
      const funcionario = await prisma.tb_utilizadores.findUnique({
        where: { codigo: parseInt(funcionarioId) },
        select: {
          codigo: true,
          nome: true,
          user: true
        }
      });

      if (!funcionario) {
        throw new AppError('Funcionário não encontrado', 404);
      }

      // Buscar pagamentos do funcionário no período
      const pagamentos = await prisma.tb_pagamentos.findMany({
        where: {
          codigo_Utilizador: parseInt(funcionarioId),
          data: {
            gte: startDate,
            lt: endDate
          }
        },
        include: {
          aluno: {
            select: {
              codigo: true,
              nome: true
            }
          },
          tb_tipo_servicos: {
            select: {
              codigo: true,
              designacao: true
            }
          },
          formaPagamento: {
            select: {
              codigo: true,
              designacao: true
            }
          }
        },
        orderBy: {
          data: 'desc'
        }
      });

      const totalVendas = pagamentos.reduce((total, pag) => total + (pag.preco || 0), 0);

      return {
        funcionario,
        periodo,
        dataInicio: startDate,
        dataFim: endDate,
        totalVendas,
        quantidadePagamentos: pagamentos.length,
        pagamentos: pagamentos.map(pag => ({
          codigo: pag.codigo,
          aluno: pag.aluno?.nome || 'Aluno não identificado',
          tipoServico: pag.tb_tipo_servicos?.designacao || 'Serviço',
          valor: pag.preco || 0,
          mes: pag.mes,
          ano: pag.ano,
          data: pag.data,
          formaPagamento: pag.formaPagamento?.designacao || 'N/A',
          fatura: pag.fatura
        }))
      };

    } catch (error) {
      console.error('Erro ao gerar relatório detalhado do funcionário:', error);
      throw new AppError('Erro ao gerar relatório detalhado do funcionário', 500);
    }
  }

  // Método para listar todos os funcionários (para demonstração)
  static async getAllFuncionarios() {
    try {
      const funcionarios = await prisma.tb_utilizadores.findMany({
        select: {
          codigo: true,
          nome: true,
          user: true
        },
        orderBy: {
          nome: 'asc'
        }
      });

      return funcionarios;
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      throw new AppError('Erro ao buscar funcionários', 500);
    }
  }
}
