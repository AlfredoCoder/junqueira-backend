// services/academic-evaluation.services.js
import prisma from '../config/database.js';
import { AppError } from '../utils/validation.utils.js';

export class AcademicEvaluationService {
  // ===============================
  // TIPOS DE AVALIAÇÃO - CONSULTAS
  // ===============================

  static async getTiposAvaliacao(page = 1, limit = 10, search = '') {
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
            descricao: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      } : {};

      const [tiposAvaliacao, total] = await Promise.all([
        prisma.tb_tipo_avaliacao.findMany({
          where,
          skip,
          take: limit,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_tipo_avaliacao.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: tiposAvaliacao,
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
      throw new AppError('Erro ao buscar tipos de avaliação', 500);
    }
  }

  static async getTipoAvaliacaoById(id) {
    try {
      const tipoAvaliacao = await prisma.tb_tipo_avaliacao.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!tipoAvaliacao) {
        throw new AppError('Tipo de avaliação não encontrado', 404);
      }

      return tipoAvaliacao;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar tipo de avaliação', 500);
    }
  }

  static async getTiposAvaliacaoPorTipo(tipoAvaliacao) {
    try {
      return await prisma.tb_tipo_avaliacao.findMany({
        where: { tipoAvaliacao: parseInt(tipoAvaliacao) },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar tipos de avaliação por tipo', 500);
    }
  }

  // ===============================
  // TIPOS DE NOTA - CONSULTAS
  // ===============================

  static async getTiposNota(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};

      const [tiposNota, total] = await Promise.all([
        prisma.tb_tipo_nota.findMany({
          where,
          skip,
          take: limit,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_tipo_nota.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: tiposNota,
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
      throw new AppError('Erro ao buscar tipos de nota', 500);
    }
  }

  static async getTipoNotaById(id) {
    try {
      const tipoNota = await prisma.tb_tipo_nota.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!tipoNota) {
        throw new AppError('Tipo de nota não encontrado', 404);
      }

      return tipoNota;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar tipo de nota', 500);
    }
  }

  static async getTiposNotaAtivos() {
    try {
      return await prisma.tb_tipo_nota.findMany({
        where: { status: 1 },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar tipos de nota ativos', 500);
    }
  }

  // ===============================
  // TIPOS DE NOTA VALOR - CONSULTAS
  // ===============================

  static async getTiposNotaValor(page = 1, limit = 10, tipoNotaId = null) {
    try {
      const skip = (page - 1) * limit;
      
      const where = tipoNotaId ? {
        codigoTipoNota: parseInt(tipoNotaId)
      } : {};

      const [tiposNotaValor, total] = await Promise.all([
        prisma.tb_tipo_nota_valor.findMany({
          where,
          skip,
          take: limit,
          orderBy: { valorNumerico: 'asc' }
        }),
        prisma.tb_tipo_nota_valor.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: tiposNotaValor,
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
      throw new AppError('Erro ao buscar tipos de nota valor', 500);
    }
  }

  static async getTipoNotaValorById(id) {
    try {
      const tipoNotaValor = await prisma.tb_tipo_nota_valor.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!tipoNotaValor) {
        throw new AppError('Tipo de nota valor não encontrado', 404);
      }

      return tipoNotaValor;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar tipo de nota valor', 500);
    }
  }

  static async getValoresPorTipoNota(tipoNotaId) {
    try {
      // Verificar se o tipo de nota existe
      const tipoNotaExists = await prisma.tb_tipo_nota.findUnique({
        where: { codigo: parseInt(tipoNotaId) }
      });

      if (!tipoNotaExists) {
        throw new AppError('Tipo de nota não encontrado', 404);
      }

      return await prisma.tb_tipo_nota_valor.findMany({
        where: { codigoTipoNota: parseInt(tipoNotaId) },
        orderBy: { valorNumerico: 'asc' }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar valores por tipo de nota', 500);
    }
  }

  // ===============================
  // TIPOS DE PAUTA - CONSULTAS
  // ===============================

  static async getTiposPauta(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};

      const [tiposPauta, total] = await Promise.all([
        prisma.tb_tipo_pauta.findMany({
          where,
          skip,
          take: limit,
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_tipo_pauta.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: tiposPauta,
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
      throw new AppError('Erro ao buscar tipos de pauta', 500);
    }
  }

  static async getTipoPautaById(id) {
    try {
      const tipoPauta = await prisma.tb_tipo_pauta.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!tipoPauta) {
        throw new AppError('Tipo de pauta não encontrado', 404);
      }

      return tipoPauta;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar tipo de pauta', 500);
    }
  }

  // ===============================
  // TRIMESTRES - CONSULTAS
  // ===============================

  static async getTrimestres(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        designacao: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};

      const [trimestres, total] = await Promise.all([
        prisma.tb_trimestres.findMany({
          where,
          skip,
          take: limit,
          orderBy: { codigo: 'asc' }
        }),
        prisma.tb_trimestres.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: trimestres,
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
      throw new AppError('Erro ao buscar trimestres', 500);
    }
  }

  static async getTrimestreById(id) {
    try {
      const trimestre = await prisma.tb_trimestres.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!trimestre) {
        throw new AppError('Trimestre não encontrado', 404);
      }

      return trimestre;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar trimestre', 500);
    }
  }

  // ===============================
  // RELATÓRIOS E ESTATÍSTICAS
  // ===============================

  static async getRelatorioAvaliacao() {
    try {
      const [
        totalTiposAvaliacao,
        totalTiposNota,
        tiposNotaAtivos,
        totalTiposNotaValor,
        totalTiposPauta,
        totalTrimestres
      ] = await Promise.all([
        prisma.tb_tipo_avaliacao.count(),
        prisma.tb_tipo_nota.count(),
        prisma.tb_tipo_nota.count({ where: { status: 1 } }),
        prisma.tb_tipo_nota_valor.count(),
        prisma.tb_tipo_pauta.count(),
        prisma.tb_trimestres.count()
      ]);

      return {
        resumo: {
          totalTiposAvaliacao,
          totalTiposNota,
          tiposNotaAtivos,
          totalTiposNotaValor,
          totalTiposPauta,
          totalTrimestres
        }
      };
    } catch (error) {
      throw new AppError('Erro ao gerar relatório de avaliação', 500);
    }
  }

  static async getEstatisticasNotas() {
    try {
      // Buscar estatísticas dos tipos de nota
      const tiposNotaComValores = await prisma.tb_tipo_nota.findMany({
        include: {
          _count: {
            select: { 
              // Assumindo que existe relacionamento com tb_tipo_nota_valor
              // Se não existir, remover esta linha
            }
          }
        }
      });

      // Buscar distribuição de valores por tipo
      const distribuicaoValores = await prisma.tb_tipo_nota_valor.groupBy({
        by: ['codigoTipoNota'],
        _count: {
          codigo: true
        },
        _avg: {
          valorNumerico: true
        },
        _min: {
          valorNumerico: true
        },
        _max: {
          valorNumerico: true
        }
      });

      return {
        tiposNotaComValores,
        distribuicaoValores
      };
    } catch (error) {
      throw new AppError('Erro ao gerar estatísticas de notas', 500);
    }
  }
}
