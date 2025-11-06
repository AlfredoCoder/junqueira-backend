import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Listar trimestres
export const getTrimestres = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    // Construir filtros
    const where = {};
    if (search) {
      where.designacao = {
        contains: search
      };
    }

    // Buscar trimestres com paginação
    const [trimestres, total] = await Promise.all([
      prisma.tb_trimestres.findMany({
        where,
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy: {
          codigo: 'desc'
        }
      }),
      prisma.tb_trimestres.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: trimestres,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao buscar trimestres:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Buscar trimestre por ID
export const getTrimestreById = async (req, res) => {
  try {
    const { id } = req.params;

    const trimestre = await prisma.tb_trimestres.findUnique({
      where: {
        codigo: parseInt(id)
      }
    });

    if (!trimestre) {
      return res.status(404).json({
        success: false,
        message: 'Trimestre não encontrado'
      });
    }

    res.json({
      success: true,
      data: trimestre
    });
  } catch (error) {
    console.error('Erro ao buscar trimestre:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Criar trimestre
export const createTrimestre = async (req, res) => {
  try {
    const { designacao } = req.body;

    // Validações
    if (!designacao) {
      return res.status(400).json({
        success: false,
        message: 'Designação é obrigatória'
      });
    }

    // Verificar se já existe um trimestre com a mesma designação
    const existingTrimestre = await prisma.tb_trimestres.findFirst({
      where: {
        designacao: designacao
      }
    });

    if (existingTrimestre) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um trimestre com esta designação'
      });
    }

    // Criar trimestre
    const trimestre = await prisma.tb_trimestres.create({
      data: {
        designacao
      }
    });

    res.status(201).json({
      success: true,
      message: 'Trimestre criado com sucesso',
      data: trimestre
    });
  } catch (error) {
    console.error('Erro ao criar trimestre:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Atualizar trimestre
export const updateTrimestre = async (req, res) => {
  try {
    const { id } = req.params;
    const { designacao } = req.body;

    // Verificar se o trimestre existe
    const existingTrimestre = await prisma.tb_trimestres.findUnique({
      where: {
        codigo: parseInt(id)
      }
    });

    if (!existingTrimestre) {
      return res.status(404).json({
        success: false,
        message: 'Trimestre não encontrado'
      });
    }

    // Verificar se já existe outro trimestre com a mesma designação
    if (designacao && designacao !== existingTrimestre.designacao) {
      const duplicateTrimestre = await prisma.tb_trimestres.findFirst({
        where: {
          designacao: designacao,
          codigo: {
            not: parseInt(id)
          }
        }
      });

      if (duplicateTrimestre) {
        return res.status(400).json({
          success: false,
          message: 'Já existe um trimestre com esta designação'
        });
      }
    }

    // Atualizar trimestre
    const trimestre = await prisma.tb_trimestres.update({
      where: {
        codigo: parseInt(id)
      },
      data: {
        ...(designacao && { designacao })
      }
    });

    res.json({
      success: true,
      message: 'Trimestre atualizado com sucesso',
      data: trimestre
    });
  } catch (error) {
    console.error('Erro ao atualizar trimestre:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Excluir trimestre
export const deleteTrimestre = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o trimestre existe
    const existingTrimestre = await prisma.tb_trimestres.findUnique({
      where: {
        codigo: parseInt(id)
      }
    });

    if (!existingTrimestre) {
      return res.status(404).json({
        success: false,
        message: 'Trimestre não encontrado'
      });
    }

    // Verificar se há dependências (notas, avaliações, etc.)
    // Aqui você pode adicionar verificações de integridade referencial se necessário

    // Excluir trimestre
    await prisma.tb_trimestres.delete({
      where: {
        codigo: parseInt(id)
      }
    });

    res.json({
      success: true,
      message: 'Trimestre excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir trimestre:', error);
    
    // Verificar se é erro de constraint de chave estrangeira
    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir este trimestre pois existem registros relacionados'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};
