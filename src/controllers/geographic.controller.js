import prisma from '../config/database.js';

export class GeographicController {
  // ========== NACIONALIDADES ==========
  
  static async getAllNacionalidades(req, res) {
    try {
      const nacionalidades = await prisma.tb_nacionalidades.findMany({
        orderBy: { designacao: 'asc' }
      });

      res.json({
        success: true,
        data: nacionalidades
      });
    } catch (error) {
      console.error('Erro ao buscar nacionalidades:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  static async getNacionalidadeById(req, res) {
    try {
      const { id } = req.params;
      
      const nacionalidade = await prisma.tb_nacionalidades.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!nacionalidade) {
        return res.status(404).json({
          success: false,
          message: 'Nacionalidade não encontrada'
        });
      }

      res.json({
        success: true,
        data: nacionalidade
      });
    } catch (error) {
      console.error('Erro ao buscar nacionalidade:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // ========== ESTADO CIVIL ==========
  
  static async getAllEstadoCivil(req, res) {
    try {
      const estadosCivis = await prisma.tb_estado_civil.findMany({
        orderBy: { designacao: 'asc' }
      });

      res.json({
        success: true,
        data: estadosCivis
      });
    } catch (error) {
      console.error('Erro ao buscar estados civis:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  static async getEstadoCivilById(req, res) {
    try {
      const { id } = req.params;
      
      const estadoCivil = await prisma.tb_estado_civil.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!estadoCivil) {
        return res.status(404).json({
          success: false,
          message: 'Estado civil não encontrado'
        });
      }

      res.json({
        success: true,
        data: estadoCivil
      });
    } catch (error) {
      console.error('Erro ao buscar estado civil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // ========== PROVÍNCIAS ==========
  
  static async getAllProvincias(req, res) {
    try {
      const provincias = await prisma.tb_provincias.findMany({
        orderBy: { designacao: 'asc' }
      });

      res.json({
        success: true,
        data: provincias
      });
    } catch (error) {
      console.error('Erro ao buscar províncias:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  static async getProvinciaById(req, res) {
    try {
      const { id } = req.params;
      
      const provincia = await prisma.tb_provincias.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!provincia) {
        return res.status(404).json({
          success: false,
          message: 'Província não encontrada'
        });
      }

      res.json({
        success: true,
        data: provincia
      });
    } catch (error) {
      console.error('Erro ao buscar província:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // ========== MUNICÍPIOS ==========
  
  static async getAllMunicipios(req, res) {
    try {
      const municipios = await prisma.tb_municipios.findMany({
        include: {
          tb_provincias: {
            select: {
              codigo: true,
              designacao: true
            }
          }
        },
        orderBy: { designacao: 'asc' }
      });

      res.json({
        success: true,
        data: municipios
      });
    } catch (error) {
      console.error('Erro ao buscar municípios:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  static async getMunicipioById(req, res) {
    try {
      const { id } = req.params;
      
      const municipio = await prisma.tb_municipios.findUnique({
        where: { codigo: parseInt(id) },
        include: {
          tb_provincias: {
            select: {
              codigo: true,
              designacao: true
            }
          }
        }
      });

      if (!municipio) {
        return res.status(404).json({
          success: false,
          message: 'Município não encontrado'
        });
      }

      res.json({
        success: true,
        data: municipio
      });
    } catch (error) {
      console.error('Erro ao buscar município:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  static async getMunicipiosByProvincia(req, res) {
    try {
      const { provinciaId } = req.params;
      
      const municipios = await prisma.tb_municipios.findMany({
        where: { codigo_Provincia: parseInt(provinciaId) },
        orderBy: { designacao: 'asc' }
      });

      res.json({
        success: true,
        data: municipios
      });
    } catch (error) {
      console.error('Erro ao buscar municípios por província:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // ========== COMUNAS ==========
  
  static async getAllComunas(req, res) {
    try {
      const comunas = await prisma.tb_comunas.findMany({
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
        },
        orderBy: { designacao: 'asc' }
      });

      res.json({
        success: true,
        data: comunas
      });
    } catch (error) {
      console.error('Erro ao buscar comunas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  static async getComunaById(req, res) {
    try {
      const { id } = req.params;
      
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
        return res.status(404).json({
          success: false,
          message: 'Comuna não encontrada'
        });
      }

      res.json({
        success: true,
        data: comuna
      });
    } catch (error) {
      console.error('Erro ao buscar comuna:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  static async getComunasByMunicipio(req, res) {
    try {
      const { municipioId } = req.params;
      
      const comunas = await prisma.tb_comunas.findMany({
        where: { codigo_Municipio: parseInt(municipioId) },
        orderBy: { designacao: 'asc' }
      });

      res.json({
        success: true,
        data: comunas
      });
    } catch (error) {
      console.error('Erro ao buscar comunas por município:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // ========== DADOS COMPLETOS ==========
  
  static async getAllGeographicData(req, res) {
    try {
      const [provincias, nacionalidades, estadosCivis, profissoes, tiposDocumento] = await Promise.all([
        prisma.tb_provincias.findMany({
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_nacionalidades.findMany({
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_estado_civil.findMany({
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_profissoes.findMany({
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_tipo_documento.findMany({
          orderBy: { designacao: 'asc' }
        })
      ]);

      res.json({
        success: true,
        data: {
          provincias,
          nacionalidades,
          estadosCivis,
          profissoes,
          tiposDocumento
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dados geográficos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  static async getFormData(req, res) {
    try {
      const [provincias] = await Promise.all([
        prisma.tb_provincias.findMany({
          orderBy: { designacao: 'asc' }
        })
      ]);

      res.json({
        success: true,
        data: {
          provincias
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dados do formulário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  static async getGeographicHierarchy(req, res) {
    try {
      const [provincias, nacionalidades, estadosCivis] = await Promise.all([
        prisma.tb_provincias.findMany({
          include: {
            tb_municipios: {
              include: {
                tb_comunas: true
              }
            }
          },
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_nacionalidades.findMany({
          orderBy: { designacao: 'asc' }
        }),
        prisma.tb_estado_civil.findMany({
          orderBy: { designacao: 'asc' }
        })
      ]);

      res.json({
        success: true,
        data: {
          provincias,
          nacionalidades,
          estadosCivis
        }
      });
    } catch (error) {
      console.error('Erro ao buscar hierarquia geográfica:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  static async searchGeographic(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Termo de busca deve ter pelo menos 2 caracteres'
        });
      }

      const searchTerm = q.trim();
      
      const [provincias, municipios, comunas, nacionalidades] = await Promise.all([
        prisma.tb_provincias.findMany({
          where: {
            designacao: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        }),
        prisma.tb_municipios.findMany({
          where: {
            designacao: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          include: {
            tb_provincias: true
          }
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
              include: {
                tb_provincias: true
              }
            }
          }
        }),
        prisma.tb_nacionalidades.findMany({
          where: {
            designacao: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          provincias,
          municipios,
          comunas,
          nacionalidades
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dados geográficos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}
