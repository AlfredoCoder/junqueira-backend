// services/institutional-management.services.js
import prisma from '../config/database.js';
import { AppError } from '../utils/validation.utils.js';

export class InstitutionalManagementService {
  // ===============================
  // REGIME IVA - CRUD COMPLETO
  // ===============================

  static async createRegimeIva(data) {
    try {
      const { designacao } = data;

      // Verificar se já existe um regime com a mesma designação
      const existingRegime = await prisma.tb_regime_iva.findFirst({
        where: {
          designacao: {
            equals: designacao.trim(),
            mode: 'insensitive'
          }
        }
      });

      if (existingRegime) {
        throw new AppError('Já existe um regime de IVA com esta designação', 409);
      }

      return await prisma.tb_regime_iva.create({
        data: {
          designacao: designacao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar regime de IVA', 500);
    }
  }

  static async updateRegimeIva(id, data) {
    try {
      const { designacao } = data;

      // Verificar se o regime existe
      const existingRegime = await prisma.tb_regime_iva.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingRegime) {
        throw new AppError('Regime de IVA não encontrado', 404);
      }

      // Verificar se já existe outro regime com a mesma designação
      const duplicateRegime = await prisma.tb_regime_iva.findFirst({
        where: {
          designacao: {
            equals: designacao.trim(),
            mode: 'insensitive'
          },
          codigo: {
            not: parseInt(id)
          }
        }
      });

      if (duplicateRegime) {
        throw new AppError('Já existe um regime de IVA com esta designação', 409);
      }

      return await prisma.tb_regime_iva.update({
        where: { codigo: parseInt(id) },
        data: {
          designacao: designacao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar regime de IVA', 500);
    }
  }

  static async deleteRegimeIva(id) {
    try {
      // Verificar se o regime existe
      const existingRegime = await prisma.tb_regime_iva.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_dados_instituicao: true
        }
      });

      if (!existingRegime) {
        throw new AppError('Regime de IVA não encontrado', 404);
      }

      // Verificar se há dados de instituição usando este regime
      if (existingRegime.tb_dados_instituicao.length > 0) {
        throw new AppError('Não é possível excluir este regime de IVA pois está sendo usado por dados da instituição', 400);
      }

      await prisma.tb_regime_iva.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Regime de IVA excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir regime de IVA', 500);
    }
  }

  // ===============================
  // DADOS INSTITUIÇÃO - CRUD COMPLETO
  // ===============================

  static async createDadosInstituicao(data) {
    try {
      const {
        n_Escola,
        nome,
        director,
        subDirector,
        telefone_Fixo,
        telefone_Movel,
        email,
        site,
        localidade,
        contribuinte,
        nif,
        contaBancaria1,
        contaBancaria2,
        contaBancaria3,
        contaBancaria4,
        contaBancaria5,
        contaBancaria6,
        regime_Iva,
        logotipo,
        provincia,
        municipio,
        nescola,
        taxaIva
      } = data;

      // Verificar se o regime de IVA existe (se fornecido)
      if (taxaIva) {
        const regimeExists = await prisma.tb_regime_iva.findUnique({
          where: { codigo: parseInt(taxaIva) }
        });

        if (!regimeExists) {
          throw new AppError('Regime de IVA não encontrado', 404);
        }
      }

      return await prisma.tb_dados_instituicao.create({
        data: {
          n_Escola: n_Escola?.trim() || "0",
          nome: nome?.trim() || "nenhum",
          director: director?.trim() || "nenhum",
          subDirector: subDirector?.trim() || "nenhum",
          telefone_Fixo: telefone_Fixo?.trim() || "0",
          telefone_Movel: telefone_Movel?.trim() || "0",
          email: email?.trim() || "nenhum",
          site: site?.trim() || "nenhum",
          localidade: localidade?.trim() || "0",
          contribuinte: contribuinte?.trim() || "0",
          nif: nif?.trim() || "nenhum",
          contaBancaria1: contaBancaria1?.trim() || "0",
          contaBancaria2: contaBancaria2?.trim() || "0",
          contaBancaria3: contaBancaria3?.trim() || "0",
          contaBancaria4: contaBancaria4?.trim() || "0",
          contaBancaria5: contaBancaria5?.trim() || "0",
          contaBancaria6: contaBancaria6?.trim() || "0",
          regime_Iva: regime_Iva?.trim() || "0",
          logotipo: logotipo?.trim() || "0",
          provincia: provincia?.trim() || "0",
          municipio: municipio?.trim() || "0",
          nescola: nescola?.trim() || "0",
          taxaIva: taxaIva ? parseInt(taxaIva) : 1
        },
        include: {
          tb_regime_iva: {
            select: {
              codigo: true,
              designacao: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar dados da instituição', 500);
    }
  }

  static async updateDadosInstituicao(id, data) {
    try {
      // Verificar se os dados da instituição existem
      const existingData = await prisma.tb_dados_instituicao.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingData) {
        throw new AppError('Dados da instituição não encontrados', 404);
      }

      // Verificar se o regime de IVA existe (se fornecido)
      if (data.taxaIva) {
        const regimeExists = await prisma.tb_regime_iva.findUnique({
          where: { codigo: parseInt(data.taxaIva) }
        });

        if (!regimeExists) {
          throw new AppError('Regime de IVA não encontrado', 404);
        }
      }

      const updateData = {};
      
      // Apenas atualizar campos fornecidos
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (key === 'taxaIva') {
            updateData[key] = parseInt(data[key]);
          } else if (typeof data[key] === 'string') {
            updateData[key] = data[key].trim();
          } else {
            updateData[key] = data[key];
          }
        }
      });

      return await prisma.tb_dados_instituicao.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_regime_iva: {
            select: {
              codigo: true,
              designacao: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar dados da instituição', 500);
    }
  }

  static async deleteDadosInstituicao(id) {
    try {
      // Verificar se os dados da instituição existem
      const existingData = await prisma.tb_dados_instituicao.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingData) {
        throw new AppError('Dados da instituição não encontrados', 404);
      }

      await prisma.tb_dados_instituicao.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Dados da instituição excluídos com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir dados da instituição', 500);
    }
  }

  // ===============================
  // PARÂMETROS - CRUD COMPLETO
  // ===============================

  static async createParametro(data) {
    try {
      const { designacao, valor, descricao } = data;

      // Verificar se já existe um parâmetro com a mesma descrição
      const existingParam = await prisma.tb_parametros.findFirst({
        where: {
          descricao: {
            equals: descricao.trim(),
            mode: 'insensitive'
          }
        }
      });

      if (existingParam) {
        throw new AppError('Já existe um parâmetro com esta descrição', 409);
      }

      return await prisma.tb_parametros.create({
        data: {
          designacao: designacao?.trim() || null,
          valor: valor ? parseFloat(valor) : null,
          descricao: descricao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar parâmetro', 500);
    }
  }

  static async updateParametro(id, data) {
    try {
      // Verificar se o parâmetro existe
      const existingParam = await prisma.tb_parametros.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingParam) {
        throw new AppError('Parâmetro não encontrado', 404);
      }

      // Verificar se já existe outro parâmetro com a mesma descrição
      if (data.descricao) {
        const duplicateParam = await prisma.tb_parametros.findFirst({
          where: {
            descricao: {
              equals: data.descricao.trim(),
              mode: 'insensitive'
            },
            codigo: {
              not: parseInt(id)
            }
          }
        });

        if (duplicateParam) {
          throw new AppError('Já existe um parâmetro com esta descrição', 409);
        }
      }

      const updateData = {};
      
      if (data.designacao !== undefined) {
        updateData.designacao = data.designacao?.trim() || null;
      }
      if (data.valor !== undefined) {
        updateData.valor = data.valor ? parseFloat(data.valor) : null;
      }
      if (data.descricao !== undefined) {
        updateData.descricao = data.descricao.trim();
      }

      return await prisma.tb_parametros.update({
        where: { codigo: parseInt(id) },
        data: updateData
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar parâmetro', 500);
    }
  }

  static async deleteParametro(id) {
    try {
      // Verificar se o parâmetro existe
      const existingParam = await prisma.tb_parametros.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingParam) {
        throw new AppError('Parâmetro não encontrado', 404);
      }

      await prisma.tb_parametros.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Parâmetro excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir parâmetro', 500);
    }
  }

  // ===============================
  // STATUS ESCOLA - CRUD COMPLETO
  // ===============================

  static async createStatusEscola(data) {
    try {
      const { designacao } = data;

      // Verificar se já existe um status com a mesma designação
      const existingStatus = await prisma.statusescola.findFirst({
        where: {
          designacao: {
            equals: designacao.trim(),
            mode: 'insensitive'
          }
        }
      });

      if (existingStatus) {
        throw new AppError('Já existe um status com esta designação', 409);
      }

      return await prisma.statusescola.create({
        data: {
          designacao: designacao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar status da escola', 500);
    }
  }

  static async updateStatusEscola(id, data) {
    try {
      const { designacao } = data;

      // Verificar se o status existe
      const existingStatus = await prisma.statusescola.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingStatus) {
        throw new AppError('Status da escola não encontrado', 404);
      }

      // Verificar se já existe outro status com a mesma designação
      const duplicateStatus = await prisma.statusescola.findFirst({
        where: {
          designacao: {
            equals: designacao.trim(),
            mode: 'insensitive'
          },
          codigo: {
            not: parseInt(id)
          }
        }
      });

      if (duplicateStatus) {
        throw new AppError('Já existe um status com esta designação', 409);
      }

      return await prisma.statusescola.update({
        where: { codigo: parseInt(id) },
        data: {
          designacao: designacao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar status da escola', 500);
    }
  }

  static async deleteStatusEscola(id) {
    try {
      // Verificar se o status existe
      const existingStatus = await prisma.statusescola.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingStatus) {
        throw new AppError('Status da escola não encontrado', 404);
      }

      await prisma.statusescola.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Status da escola excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir status da escola', 500);
    }
  }

  // ===============================
  // NUMERAÇÃO DOCUMENTOS - CRUD COMPLETO
  // ===============================

  static async createNumeracaoDocumento(data) {
    try {
      const { designacao, next } = data;

      // Verificar se já existe uma numeração com a mesma designação
      if (designacao) {
        const existingNumeracao = await prisma.tb_numeracao_documentos.findFirst({
          where: {
            designacao: {
              equals: designacao.trim(),
              mode: 'insensitive'
            }
          }
        });

        if (existingNumeracao) {
          throw new AppError('Já existe uma numeração com esta designação', 409);
        }
      }

      return await prisma.tb_numeracao_documentos.create({
        data: {
          designacao: designacao?.trim() || null,
          next: next ? parseInt(next) : null
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar numeração de documento', 500);
    }
  }

  static async updateNumeracaoDocumento(id, data) {
    try {
      // Verificar se a numeração existe
      const existingNumeracao = await prisma.tb_numeracao_documentos.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingNumeracao) {
        throw new AppError('Numeração de documento não encontrada', 404);
      }

      // Verificar se já existe outra numeração com a mesma designação
      if (data.designacao) {
        const duplicateNumeracao = await prisma.tb_numeracao_documentos.findFirst({
          where: {
            designacao: {
              equals: data.designacao.trim(),
              mode: 'insensitive'
            },
            codigo: {
              not: parseInt(id)
            }
          }
        });

        if (duplicateNumeracao) {
          throw new AppError('Já existe uma numeração com esta designação', 409);
        }
      }

      const updateData = {};
      
      if (data.designacao !== undefined) {
        updateData.designacao = data.designacao?.trim() || null;
      }
      if (data.next !== undefined) {
        updateData.next = data.next ? parseInt(data.next) : null;
      }

      return await prisma.tb_numeracao_documentos.update({
        where: { codigo: parseInt(id) },
        data: updateData
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar numeração de documento', 500);
    }
  }

  static async deleteNumeracaoDocumento(id) {
    try {
      // Verificar se a numeração existe
      const existingNumeracao = await prisma.tb_numeracao_documentos.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingNumeracao) {
        throw new AppError('Numeração de documento não encontrada', 404);
      }

      await prisma.tb_numeracao_documentos.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Numeração de documento excluída com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir numeração de documento', 500);
    }
  }

  // ===============================
  // ITENS GUIA - CRUD COMPLETO
  // ===============================

  static async createItemGuia(data) {
    try {
      const { designacao } = data;

      // Verificar se já existe um item com a mesma designação
      const existingItem = await prisma.tb_itens_guia.findFirst({
        where: {
          designacao: {
            equals: designacao.trim(),
            mode: 'insensitive'
          }
        }
      });

      if (existingItem) {
        throw new AppError('Já existe um item da guia com esta designação', 409);
      }

      return await prisma.tb_itens_guia.create({
        data: {
          designacao: designacao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar item da guia', 500);
    }
  }

  static async updateItemGuia(id, data) {
    try {
      const { designacao } = data;

      // Verificar se o item existe
      const existingItem = await prisma.tb_itens_guia.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingItem) {
        throw new AppError('Item da guia não encontrado', 404);
      }

      // Verificar se já existe outro item com a mesma designação
      const duplicateItem = await prisma.tb_itens_guia.findFirst({
        where: {
          designacao: {
            equals: designacao.trim(),
            mode: 'insensitive'
          },
          codigo: {
            not: parseInt(id)
          }
        }
      });

      if (duplicateItem) {
        throw new AppError('Já existe um item da guia com esta designação', 409);
      }

      return await prisma.tb_itens_guia.update({
        where: { codigo: parseInt(id) },
        data: {
          designacao: designacao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar item da guia', 500);
    }
  }

  static async deleteItemGuia(id) {
    try {
      // Verificar se o item existe
      const existingItem = await prisma.tb_itens_guia.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingItem) {
        throw new AppError('Item da guia não encontrado', 404);
      }

      await prisma.tb_itens_guia.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Item da guia excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir item da guia', 500);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getNextDocumentNumber(designacao) {
    try {
      const numeracao = await prisma.tb_numeracao_documentos.findFirst({
        where: {
          designacao: {
            equals: designacao,
            mode: 'insensitive'
          }
        }
      });

      if (!numeracao) {
        throw new AppError('Numeração de documento não encontrada', 404);
      }

      const nextNumber = (numeracao.next || 0) + 1;

      // Atualizar o próximo número
      await prisma.tb_numeracao_documentos.update({
        where: { codigo: numeracao.codigo },
        data: { next: nextNumber }
      });

      return {
        designacao: numeracao.designacao,
        numeroAtual: nextNumber,
        proximoNumero: nextNumber + 1
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao obter próximo número do documento', 500);
    }
  }
}
