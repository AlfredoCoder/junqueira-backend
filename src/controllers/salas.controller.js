import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Listar salas com paginação
export const getSalas = async (req, res) => {
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

    // Buscar salas com paginação
    const [salas, total] = await Promise.all([
      prisma.tb_salas.findMany({
        where,
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy: {
          codigo: 'desc'
        }
      }),
      prisma.tb_salas.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      message: 'Salas encontradas',
      data: salas,
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
    console.error('Erro ao buscar salas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Buscar sala por ID
export const getSalaById = async (req, res) => {
  try {
    const { id } = req.params;

    const sala = await prisma.tb_salas.findUnique({
      where: {
        codigo: parseInt(id)
      }
    });

    if (!sala) {
      return res.status(404).json({
        success: false,
        message: 'Sala não encontrada'
      });
    }

    res.json({
      success: true,
      data: sala
    });
  } catch (error) {
    console.error('Erro ao buscar sala:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Criar sala
export const createSala = async (req, res) => {
  try {
    console.log('=== DEBUG CREATE SALA ===');
    console.log('req.body:', req.body);
    
    const { designacao } = req.body;
    console.log('designacao extraída:', designacao);

    // Validações
    if (!designacao) {
      console.log('Erro: designação não fornecida');
      return res.status(400).json({
        success: false,
        message: 'Designação é obrigatória'
      });
    }

    // Verificar se já existe uma sala com a mesma designação
    const existingSala = await prisma.tb_salas.findFirst({
      where: {
        designacao: designacao
      }
    });

    if (existingSala) {
      return res.status(400).json({
        success: false,
        message: 'Já existe uma sala com esta designação'
      });
    }

    // Criar sala
    const sala = await prisma.tb_salas.create({
      data: {
        designacao
      }
    });

    res.status(201).json({
      success: true,
      message: 'Sala criada com sucesso',
      data: sala
    });
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Atualizar sala
export const updateSala = async (req, res) => {
  try {
    const { id } = req.params;
    const { designacao } = req.body;

    // Verificar se a sala existe
    const existingSala = await prisma.tb_salas.findUnique({
      where: {
        codigo: parseInt(id)
      }
    });

    if (!existingSala) {
      return res.status(404).json({
        success: false,
        message: 'Sala não encontrada'
      });
    }

    // Verificar se já existe outra sala com a mesma designação
    if (designacao && designacao !== existingSala.designacao) {
      const duplicateSala = await prisma.tb_salas.findFirst({
        where: {
          designacao: designacao,
          codigo: {
            not: parseInt(id)
          }
        }
      });

      if (duplicateSala) {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma sala com esta designação'
        });
      }
    }

    // Atualizar sala
    const sala = await prisma.tb_salas.update({
      where: {
        codigo: parseInt(id)
      },
      data: {
        ...(designacao && { designacao })
      }
    });

    res.json({
      success: true,
      message: 'Sala atualizada com sucesso',
      data: sala
    });
  } catch (error) {
    console.error('Erro ao atualizar sala:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Excluir sala
export const deleteSala = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se a sala existe
    const existingSala = await prisma.tb_salas.findUnique({
      where: {
        codigo: parseInt(id)
      }
    });

    if (!existingSala) {
      return res.status(404).json({
        success: false,
        message: 'Sala não encontrada'
      });
    }

    // Verificar se há dependências (turmas usando esta sala)
    const turmasUsandoSala = await prisma.tb_turmas.findMany({
      where: {
        codigo_Sala: parseInt(id)
      }
    });

    if (turmasUsandoSala.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Não é possível excluir esta sala pois existem ${turmasUsandoSala.length} turma(s) utilizando-a`
      });
    }

    // Excluir sala
    await prisma.tb_salas.delete({
      where: {
        codigo: parseInt(id)
      }
    });

    res.json({
      success: true,
      message: 'Sala excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir sala:', error);
    
    // Verificar se é erro de constraint de chave estrangeira
    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir esta sala pois existem registros relacionados'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Buscar todas as salas (para selects)
export const getAllSalas = async (req, res) => {
  try {
    const salas = await prisma.tb_salas.findMany({
      orderBy: {
        designacao: 'asc'
      }
    });

    res.json({
      success: true,
      data: salas
    });
  } catch (error) {
    console.error('Erro ao buscar todas as salas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};
