// services/status-control.services.js
import prisma from '../config/database.js';
import { AppError } from '../utils/validation.utils.js';

export class StatusControlService {
  // ===============================
  // TIPO STATUS - CRUD COMPLETO
  // ===============================

  static async createTipoStatus(data) {
    try {
      const { designacao } = data;

      const existingTipoStatus = await prisma.tb_tipo_status.findFirst({
        where: {
          designacao: designacao.trim()
        }
      });

      if (existingTipoStatus) {
        throw new AppError('Já existe um tipo de status com esta designação', 409);
      }

      return await prisma.tb_tipo_status.create({
        data: {
          designacao: designacao.trim()
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar tipo de status', 500);
    }
  }

  static async updateTipoStatus(id, data) {
    try {
      const existingTipoStatus = await prisma.tb_tipo_status.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingTipoStatus) {
        throw new AppError('Tipo de status não encontrado', 404);
      }

      if (data.designacao) {
        const duplicateTipoStatus = await prisma.tb_tipo_status.findFirst({
          where: {
            designacao: data.designacao.trim(),
            codigo: { not: parseInt(id) }
          }
        });

        if (duplicateTipoStatus) {
          throw new AppError('Já existe um tipo de status com esta designação', 409);
        }
      }

      const updateData = {};
      if (data.designacao !== undefined) {
        updateData.designacao = data.designacao.trim();
      }

      return await prisma.tb_tipo_status.update({
        where: { codigo: parseInt(id) },
        data: updateData
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar tipo de status', 500);
    }
  }

  static async getTiposStatus(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search,
        }
      } : {};

      const [tiposStatus, total] = await Promise.all([
        prisma.tb_tipo_status.findMany({
          where,
          skip,
          take: limit,
          include: {
            tb_status: {
              select: { codigo: true, designacao: true }
            }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_tipo_status.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: tiposStatus,
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
      throw new AppError('Erro ao buscar tipos de status', 500);
    }
  }

  static async getTipoStatusById(id) {
    try {
      const tipoStatus = await prisma.tb_tipo_status.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_status: {
            select: { codigo: true, designacao: true },
            orderBy: { designacao: 'asc' }
          }
        }
      });

      if (!tipoStatus) {
        throw new AppError('Tipo de status não encontrado', 404);
      }

      return tipoStatus;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar tipo de status', 500);
    }
  }

  static async deleteTipoStatus(id) {
    try {
      const existingTipoStatus = await prisma.tb_tipo_status.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_status: true
        }
      });

      if (!existingTipoStatus) {
        throw new AppError('Tipo de status não encontrado', 404);
      }

      if (existingTipoStatus.tb_status.length > 0) {
        throw new AppError('Não é possível excluir este tipo de status pois possui status associados', 400);
      }

      await prisma.tb_tipo_status.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Tipo de status excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir tipo de status', 500);
    }
  }

  // ===============================
  // STATUS - CRUD COMPLETO
  // ===============================

  static async createStatus(data) {
    try {
      const { designacao, tipoStatus } = data;

      // Verificar se o tipo de status existe (se fornecido)
      if (tipoStatus) {
        const tipoStatusExists = await prisma.tb_tipo_status.findUnique({
          where: { codigo: parseInt(tipoStatus) }
        });

        if (!tipoStatusExists) {
          throw new AppError('Tipo de status não encontrado', 404);
        }
      }

      const existingStatus = await prisma.tb_status.findFirst({
        where: {
          designacao: designacao.trim()
        }
      });

      if (existingStatus) {
        throw new AppError('Já existe um status com esta designação', 409);
      }

      return await prisma.tb_status.create({
        data: {
          designacao: designacao.trim(),
          tipoStatus: tipoStatus ? parseInt(tipoStatus) : null
        },
        include: {
          tb_tipo_status: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar status', 500);
    }
  }

  static async updateStatus(id, data) {
    try {
      const existingStatus = await prisma.tb_status.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingStatus) {
        throw new AppError('Status não encontrado', 404);
      }

      // Verificar se o tipo de status existe (se fornecido)
      if (data.tipoStatus) {
        const tipoStatusExists = await prisma.tb_tipo_status.findUnique({
          where: { codigo: parseInt(data.tipoStatus) }
        });
        if (!tipoStatusExists) throw new AppError('Tipo de status não encontrado', 404);
      }

      if (data.designacao) {
        const duplicateStatus = await prisma.tb_status.findFirst({
          where: {
            designacao: data.designacao.trim(),
            codigo: { not: parseInt(id) }
          }
        });

        if (duplicateStatus) {
          throw new AppError('Já existe um status com esta designação', 409);
        }
      }

      const updateData = {};
      if (data.designacao !== undefined) updateData.designacao = data.designacao.trim();
      if (data.tipoStatus !== undefined) updateData.tipoStatus = data.tipoStatus ? parseInt(data.tipoStatus) : null;

      return await prisma.tb_status.update({
        where: { codigo: parseInt(id) },
        data: updateData,
        include: {
          tb_tipo_status: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar status', 500);
    }
  }

  static async getStatus(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search,
        }
      } : {};

      const [status, total] = await Promise.all([
        prisma.tb_status.findMany({
          where,
          skip,
          take: limit,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_status.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: status,
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
      throw new AppError('Erro ao buscar status', 500);
    }
  }

  static async getStatusById(id) {
    try {
      const status = await prisma.tb_status.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_tipo_status: { select: { codigo: true, designacao: true } }
        }
      });

      if (!status) {
        throw new AppError('Status não encontrado', 404);
      }

      return status;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar status', 500);
    }
  }

  static async deleteStatus(id) {
    try {
      const existingStatus = await prisma.tb_status.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!existingStatus) {
        throw new AppError('Status não encontrado', 404);
      }

      // Verificar se o status está sendo usado em outras tabelas
      // Aqui você pode adicionar verificações específicas baseadas no seu modelo de dados
      // Por exemplo, verificar se está sendo usado em tb_cursos, tb_alunos, etc.
      
      await prisma.tb_status.delete({
        where: { codigo: parseInt(id) }
      });

      return { message: 'Status excluído com sucesso' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao excluir status', 500);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getStatusByTipo(tipoStatusId) {
    try {
      const tipoStatusExists = await prisma.tb_tipo_status.findUnique({
        where: { codigo: parseInt(tipoStatusId) }
      });

      if (!tipoStatusExists) {
        throw new AppError('Tipo de status não encontrado', 404);
      }

      return await prisma.tb_status.findMany({
        where: { tipoStatus: parseInt(tipoStatusId) },
        include: {
          tb_tipo_status: { select: { codigo: true, designacao: true } }
        },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar status por tipo', 500);
    }
  }

  static async getStatusSemTipo() {
    try {
      return await prisma.tb_status.findMany({
        where: { tipoStatus: null },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar status sem tipo', 500);
    }
  }

  static async getTiposStatusComContagem() {
    try {
      return await prisma.tb_tipo_status.findMany({
        include: {
          _count: {
            select: { tb_status: true }
          },
          tb_status: {
            select: { codigo: true, designacao: true },
            orderBy: { designacao: 'asc' }
          }
        },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar tipos de status com contagem', 500);
    }
  }

  static async buscarStatusPorDesignacao(designacao) {
    try {
      return await prisma.tb_status.findMany({
        where: {
          designacao: {
            contains: designacao,
          }
        },
        include: {
          tb_tipo_status: { select: { codigo: true, designacao: true } }
        },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar status por designação', 500);
    }
  }

  static async associarStatusAoTipo(statusId, tipoStatusId) {
    try {
      const [statusExists, tipoStatusExists] = await Promise.all([
        prisma.tb_status.findUnique({ where: { codigo: parseInt(statusId) } }),
        prisma.tb_tipo_status.findUnique({ where: { codigo: parseInt(tipoStatusId) } })
      ]);

      if (!statusExists) {
        throw new AppError('Status não encontrado', 404);
      }

      if (!tipoStatusExists) {
        throw new AppError('Tipo de status não encontrado', 404);
      }

      return await prisma.tb_status.update({
        where: { codigo: parseInt(statusId) },
        data: { tipoStatus: parseInt(tipoStatusId) },
        include: {
          tb_tipo_status: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao associar status ao tipo', 500);
    }
  }

  static async desassociarStatusDoTipo(statusId) {
    try {
      const statusExists = await prisma.tb_status.findUnique({
        where: { codigo: parseInt(statusId) }
      });

      if (!statusExists) {
        throw new AppError('Status não encontrado', 404);
      }

      return await prisma.tb_status.update({
        where: { codigo: parseInt(statusId) },
        data: { tipoStatus: null },
        include: {
          tb_tipo_status: { select: { codigo: true, designacao: true } }
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao desassociar status do tipo', 500);
    }
  }
}
