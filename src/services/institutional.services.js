// services/institutional.services.js
import prisma from '../config/database.js';
import { AppError } from '../utils/validation.utils.js';

export class InstitutionalService {
  // ===============================
  // PROFISSÕES
  // ===============================

  static async getAllProfissoes() {
    try {
      return await prisma.tb_profissao.findMany({
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar profissões', 500);
    }
  }

  static async getProfissaoById(id) {
    try {
      const profissao = await prisma.tb_profissao.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!profissao) {
        throw new AppError('Profissão não encontrada', 404);
      }

      return profissao;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar profissão', 500);
    }
  }

  // ===============================
  // TIPOS DE DOCUMENTO
  // ===============================

  static async getAllTiposDocumento() {
    try {
      return await prisma.tb_tipo_documento.findMany({
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar tipos de documento', 500);
    }
  }

  static async getTipoDocumentoById(id) {
    try {
      const tipoDocumento = await prisma.tb_tipo_documento.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!tipoDocumento) {
        throw new AppError('Tipo de documento não encontrado', 404);
      }

      return tipoDocumento;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar tipo de documento', 500);
    }
  }

  // ===============================
  // REGIME IVA
  // ===============================

  static async getAllRegimesIva() {
    try {
      return await prisma.tb_regime_iva.findMany({
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar regimes de IVA', 500);
    }
  }

  static async getRegimeIvaById(id) {
    try {
      const regimeIva = await prisma.tb_regime_iva.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!regimeIva) {
        throw new AppError('Regime de IVA não encontrado', 404);
      }

      return regimeIva;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar regime de IVA', 500);
    }
  }

  // ===============================
  // DADOS DA INSTITUIÇÃO
  // ===============================

  static async getAllDadosInstituicao() {
    try {
      return await prisma.tb_dados_instituicao.findMany({
        include: {
          tb_regime_iva: {
            select: {
              codigo: true,
              designacao: true
            }
          }
        },
        orderBy: { nome: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar dados da instituição', 500);
    }
  }

  static async getDadosInstituicaoById(id) {
    try {
      const dadosInstituicao = await prisma.tb_dados_instituicao.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_regime_iva: {
            select: {
              codigo: true,
              designacao: true
            }
          }
        }
      });

      if (!dadosInstituicao) {
        throw new AppError('Dados da instituição não encontrados', 404);
      }

      return dadosInstituicao;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar dados da instituição', 500);
    }
  }

  static async getDadosInstituicaoPrincipal() {
    try {
      // Busca o primeiro registro ou o principal (pode ser customizado conforme regra de negócio)
      const dadosInstituicao = await prisma.tb_dados_instituicao.findFirst({
        include: {
          tb_regime_iva: {
            select: {
              codigo: true,
              designacao: true
            }
          }
        },
        orderBy: { codigo: 'asc' }
      });

      if (!dadosInstituicao) {
        throw new AppError('Dados da instituição não configurados', 404);
      }

      return dadosInstituicao;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar dados principais da instituição', 500);
    }
  }

  // ===============================
  // PARÂMETROS
  // ===============================

  static async getAllParametros() {
    try {
      return await prisma.tb_parametros.findMany({
        orderBy: { descricao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar parâmetros', 500);
    }
  }

  static async getParametroById(id) {
    try {
      const parametro = await prisma.tb_parametros.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!parametro) {
        throw new AppError('Parâmetro não encontrado', 404);
      }

      return parametro;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar parâmetro', 500);
    }
  }

  static async getParametroByDescricao(descricao) {
    try {
      const parametro = await prisma.tb_parametros.findFirst({
        where: {
          descricao: {
            contains: descricao,
            mode: 'insensitive'
          }
        }
      });

      if (!parametro) {
        throw new AppError('Parâmetro não encontrado', 404);
      }

      return parametro;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar parâmetro', 500);
    }
  }

  // ===============================
  // STATUS ESCOLA
  // ===============================

  static async getAllStatusEscola() {
    try {
      return await prisma.statusescola.findMany({
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar status da escola', 500);
    }
  }

  static async getStatusEscolaById(id) {
    try {
      const statusEscola = await prisma.statusescola.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!statusEscola) {
        throw new AppError('Status da escola não encontrado', 404);
      }

      return statusEscola;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar status da escola', 500);
    }
  }

  // ===============================
  // NUMERAÇÃO DE DOCUMENTOS
  // ===============================

  static async getAllNumeracaoDocumentos() {
    try {
      return await prisma.tb_numeracao_documentos.findMany({
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar numeração de documentos', 500);
    }
  }

  static async getNumeracaoDocumentoById(id) {
    try {
      const numeracaoDocumento = await prisma.tb_numeracao_documentos.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!numeracaoDocumento) {
        throw new AppError('Numeração de documento não encontrada', 404);
      }

      return numeracaoDocumento;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar numeração de documento', 500);
    }
  }

  // ===============================
  // ITENS GUIA
  // ===============================

  static async getAllItensGuia() {
    try {
      return await prisma.tb_itens_guia.findMany({
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar itens da guia', 500);
    }
  }

  static async getItemGuiaById(id) {
    try {
      const itemGuia = await prisma.tb_itens_guia.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!itemGuia) {
        throw new AppError('Item da guia não encontrado', 404);
      }

      return itemGuia;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar item da guia', 500);
    }
  }

  // ===============================
  // OPERAÇÕES COMBINADAS
  // ===============================

  static async getInstitutionalData() {
    try {
      const [
        profissoes,
        tiposDocumento,
        regimesIva,
        dadosInstituicao,
        parametros,
        statusEscola,
        numeracaoDocumentos,
        itensGuia
      ] = await Promise.all([
        this.getAllProfissoes(),
        this.getAllTiposDocumento(),
        this.getAllRegimesIva(),
        this.getAllDadosInstituicao(),
        this.getAllParametros(),
        this.getAllStatusEscola(),
        this.getAllNumeracaoDocumentos(),
        this.getAllItensGuia()
      ]);

      return {
        profissoes,
        tiposDocumento,
        regimesIva,
        dadosInstituicao,
        parametros,
        statusEscola,
        numeracaoDocumentos,
        itensGuia
      };
    } catch (error) {
      throw new AppError('Erro ao buscar dados institucionais', 500);
    }
  }

  static async searchInstitutional(searchTerm) {
    try {
      const [profissoes, tiposDocumento, parametros] = await Promise.all([
        prisma.tb_profissao.findMany({
          where: {
            designacao: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_tipo_documento.findMany({
          where: {
            designacao: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_parametros.findMany({
          where: {
            OR: [
              {
                designacao: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                descricao: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ]
          },
          orderBy: { descricao: 'asc' }
        })
      ]);

      return {
        profissoes,
        tiposDocumento,
        parametros
      };
    } catch (error) {
      throw new AppError('Erro ao realizar busca institucional', 500);
    }
  }
}
