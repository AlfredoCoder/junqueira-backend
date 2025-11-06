// services/geographic.services.js
import prisma from '../config/database.js';
import { AppError } from '../utils/validation.utils.js';

export class GeographicService {
  // ===============================
  // NACIONALIDADES
  // ===============================

  static async getAllNacionalidades() {
    try {
      return await prisma.tb_nacionalidades.findMany({
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar nacionalidades', 500);
    }
  }

  static async getNacionalidadeById(id) {
    try {
      const nacionalidade = await prisma.tb_nacionalidades.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!nacionalidade) {
        throw new AppError('Nacionalidade não encontrada', 404);
      }

      return nacionalidade;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar nacionalidade', 500);
    }
  }

  // ===============================
  // ESTADO CIVIL
  // ===============================

  static async getAllEstadoCivil() {
    try {
      return await prisma.tb_estado_civil.findMany({
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar estados civis', 500);
    }
  }

  static async getEstadoCivilById(id) {
    try {
      const estadoCivil = await prisma.tb_estado_civil.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!estadoCivil) {
        throw new AppError('Estado civil não encontrado', 404);
      }

      return estadoCivil;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar estado civil', 500);
    }
  }

  // ===============================
  // PROVÍNCIAS
  // ===============================

  static async getAllProvincias() {
    try {
      return await prisma.tb_provincias.findMany({
        orderBy: { designacao: 'asc' },
        include: {
          tb_municipios: {
            orderBy: { designacao: 'asc' },
            include: {
              tb_comunas: {
                orderBy: { designacao: 'asc' }
              }
            }
          }
        }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar províncias', 500);
    }
  }

  static async getProvinciaById(id) {
    try {
      const provincia = await prisma.tb_provincias.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_municipios: {
            orderBy: { designacao: 'asc' },
            include: {
              tb_comunas: {
                orderBy: { designacao: 'asc' }
              }
            }
          }
        }
      });

      if (!provincia) {
        throw new AppError('Província não encontrada', 404);
      }

      return provincia;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar província', 500);
    }
  }

  // ===============================
  // MUNICÍPIOS
  // ===============================

  static async getAllMunicipios() {
    try {
      return await prisma.tb_municipios.findMany({
        orderBy: { designacao: 'asc' },
        include: {
          tb_provincias: {
            select: {
              codigo: true,
              designacao: true
            }
          },
          tb_comunas: {
            orderBy: { designacao: 'asc' }
          }
        }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar municípios', 500);
    }
  }

  static async getMunicipioById(id) {
    try {
      const municipio = await prisma.tb_municipios.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_provincias: {
            select: {
              codigo: true,
              designacao: true
            }
          },
          tb_comunas: {
            orderBy: { designacao: 'asc' }
          }
        }
      });

      if (!municipio) {
        throw new AppError('Município não encontrado', 404);
      }

      return municipio;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar município', 500);
    }
  }

  static async getMunicipiosByProvincia(provinciaId) {
    try {
      return await prisma.tb_municipios.findMany({
        where: { codigo_Provincia: parseInt(provinciaId) },
        orderBy: { designacao: 'asc' },
        include: {
          tb_comunas: {
            orderBy: { designacao: 'asc' }
          }
        }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar municípios da província', 500);
    }
  }

  // ===============================
  // COMUNAS
  // ===============================

  static async getAllComunas() {
    try {
      return await prisma.tb_comunas.findMany({
        orderBy: { designacao: 'asc' },
        include: {
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
      });
    } catch (error) {
      throw new AppError('Erro ao buscar comunas', 500);
    }
  }

  static async getComunaById(id) {
    try {
      const comuna = await prisma.tb_comunas.findUnique({
        where: { codigo: parseInt(id) },
        include: {
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
      });

      if (!comuna) {
        throw new AppError('Comuna não encontrada', 404);
      }

      return comuna;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar comuna', 500);
    }
  }

  static async getComunasByMunicipio(municipioId) {
    try {
      return await prisma.tb_comunas.findMany({
        where: { codigo_Municipio: parseInt(municipioId) },
        orderBy: { designacao: 'asc' }
      });
    } catch (error) {
      throw new AppError('Erro ao buscar comunas do município', 500);
    }
  }

  // ===============================
  // OPERAÇÕES COMBINADAS
  // ===============================

  static async getGeographicHierarchy() {
    try {
      const provincias = await this.getAllProvincias();
      const nacionalidades = await this.getAllNacionalidades();
      const estadosCivis = await this.getAllEstadoCivil();

      return {
        nacionalidades,
        estadosCivis,
        provincias
      };
    } catch (error) {
      throw new AppError('Erro ao buscar hierarquia geográfica', 500);
    }
  }

  static async searchByName(searchTerm) {
    try {
      const term = `%${searchTerm}%`;
      
      const [provincias, municipios, comunas, nacionalidades] = await Promise.all([
        prisma.tb_provincias.findMany({
          where: {
            designacao: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_municipios.findMany({
          where: {
            designacao: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          include: {
            tb_provincias: {
              select: { designacao: true }
            }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_comunas.findMany({
          where: {
            designacao: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          include: {
            tb_municipios: {
              select: {
                designacao: true,
                tb_provincias: {
                  select: { designacao: true }
                }
              }
            }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_nacionalidades.findMany({
          where: {
            designacao: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          orderBy: { designacao: 'asc' }
        })
      ]);

      return {
        provincias,
        municipios,
        comunas,
        nacionalidades
      };
    } catch (error) {
      throw new AppError('Erro ao realizar busca geográfica', 500);
    }
  }
}
