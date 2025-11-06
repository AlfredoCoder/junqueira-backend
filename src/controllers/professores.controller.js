import { PrismaClient } from '@prisma/client';
import { criarUsuarioProfessor } from '../services/userService.js';
const prisma = new PrismaClient();

// ===============================================================
// CONTROLADOR DE PROFESSORES
// ===============================================================

/**
 * Listar todos os professores
 */
const listarProfessores = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'Activo' } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      status,
      ...(search && {
        OR: [
          { nome: { contains: search } },
          { email: { contains: search } },
          { formacao: { contains: search } },
          { especialidade: { contains: search } }
        ]
      })
    };

    const professores = await prisma.tb_professores.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        tb_professor_disciplina: true,
        tb_professor_turma: true,
        tb_notas_alunos: true
      },
      orderBy: { nome: 'asc' }
    });

    const total = await prisma.tb_professores.count({ where });

    res.json({
      success: true,
      data: professores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Buscar professor por ID
 */
const buscarProfessor = async (req, res) => {
  try {
    const { id } = req.params;

    const professor = await prisma.tb_professores.findUnique({
      where: { codigo: parseInt(id) },
      include: {
        tb_professor_disciplina: true,
        tb_professor_turma: true,
        tb_notas_alunos: true
      }
    });

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: 'Professor não encontrado'
      });
    }

    res.json({
      success: true,
      data: professor
    });
  } catch (error) {
    console.error('Erro ao buscar professor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Criar novo professor
 */
const criarProfessor = async (req, res) => {
  try {
    const {
      nome,
      email,
      telefone,
      formacao,
      nivelAcademico,
      especialidade,
      numeroFuncionario,
      dataAdmissao,
      criarUsuario = true // Por padrão, criar usuário automaticamente
    } = req.body;

    // Validações básicas
    if (!nome || !email || !formacao || !nivelAcademico) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email, formação e nível acadêmico são obrigatórios'
      });
    }

    // Verificar se email já existe
    const emailExiste = await prisma.tb_professores.findFirst({
      where: { email }
    });

    if (emailExiste) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Criar professor
    const professor = await prisma.tb_professores.create({
      data: {
        nome,
        email,
        telefone,
        formacao,
        nivelAcademico,
        especialidade,
        numeroFuncionario,
        dataAdmissao: dataAdmissao ? new Date(dataAdmissao) : null
      },
      include: {
        tb_professor_disciplina: true,
        tb_professor_turma: true
      }
    });

    let dadosUsuario = null;

    // Criar usuário automaticamente se solicitado
    if (criarUsuario) {
      try {
        dadosUsuario = await criarUsuarioProfessor({
          codigo: professor.codigo,
          nome: professor.nome
        });
        
        console.log(`✅ Professor ${nome} criado com usuário automático:`);
        console.log(`   ID Professor: ${professor.codigo}`);
        console.log(`   Username: ${dadosUsuario.username}`);
        console.log(`   Senha temporária: ${dadosUsuario.senhaTemporaria}`);
        
      } catch (userError) {
        console.error('⚠️  Erro ao criar usuário para professor:', userError);
        // Não falha a criação do professor se houver erro na criação do usuário
      }
    }

    res.status(201).json({
      success: true,
      message: 'Professor criado com sucesso',
      data: {
        professor,
        usuario: dadosUsuario ? {
          username: dadosUsuario.username,
          senhaTemporaria: dadosUsuario.senhaTemporaria,
          tipo: dadosUsuario.tipo,
          observacao: 'Usuário criado automaticamente. Altere a senha no primeiro login.'
        } : null
      }
    });
  } catch (error) {
    console.error('Erro ao criar professor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Atualizar professor
 */
const atualizarProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      email,
      telefone,
      formacao,
      nivelAcademico,
      especialidade,
      numeroFuncionario,
      dataAdmissao,
      status
    } = req.body;

    // Verificar se professor existe
    const professorExiste = await prisma.tb_professores.findUnique({
      where: { codigo: parseInt(id) }
    });

    if (!professorExiste) {
      return res.status(404).json({
        success: false,
        message: 'Professor não encontrado'
      });
    }

    // Verificar se email já existe (exceto o próprio professor)
    if (email && email !== professorExiste.email) {
      const emailExiste = await prisma.tb_professores.findFirst({
        where: { 
          email,
          codigo: { not: parseInt(id) }
        }
      });

      if (emailExiste) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }
    }

    const professor = await prisma.tb_professores.update({
      where: { codigo: parseInt(id) },
      data: {
        ...(nome && { nome }),
        ...(email && { email }),
        ...(telefone !== undefined && { telefone }),
        ...(formacao && { formacao }),
        ...(nivelAcademico && { nivelAcademico }),
        ...(especialidade !== undefined && { especialidade }),
        ...(numeroFuncionario !== undefined && { numeroFuncionario }),
        ...(dataAdmissao && { dataAdmissao: new Date(dataAdmissao) }),
        ...(status && { status })
      },
      include: {
        tb_professor_disciplina: true,
        tb_professor_turma: true
      }
    });

    res.json({
      success: true,
      message: 'Professor atualizado com sucesso',
      data: professor
    });
  } catch (error) {
    console.error('Erro ao atualizar professor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Excluir professor
 */
const excluirProfessor = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se professor existe
    const professorExiste = await prisma.tb_professores.findUnique({
      where: { codigo: parseInt(id) },
      include: {
        tb_professor_disciplina: true,
        tb_professor_turma: true,
        tb_notas_alunos: true
      }
    });

    if (!professorExiste) {
      return res.status(404).json({
        success: false,
        message: 'Professor não encontrado'
      });
    }

    // Verificar se professor tem relacionamentos ativos
    const temAtribuicoes = professorExiste.tb_professor_disciplina.length > 0 || 
                          professorExiste.tb_professor_turma.length > 0;
    const temNotas = professorExiste.tb_notas_alunos.length > 0;

    if (temNotas) {
      // Se tem notas, apenas inativar
      await prisma.tb_professores.update({
        where: { codigo: parseInt(id) },
        data: { status: 'Inactivo' }
      });

      return res.json({
        success: true,
        message: 'Professor inativado com sucesso (possui notas lançadas)',
        type: 'soft_delete'
      });
    }

    if (temAtribuicoes) {
      // Se tem atribuições mas não tem notas, remover atribuições e depois excluir
      await prisma.$transaction(async (tx) => {
        // Remover atribuições de disciplinas
        await tx.tb_professor_disciplina.deleteMany({
          where: { codigo_Professor: parseInt(id) }
        });

        // Remover atribuições de turmas
        await tx.tb_professor_turma.deleteMany({
          where: { codigo_Professor: parseInt(id) }
        });

        // Excluir professor
        await tx.tb_professores.delete({
          where: { codigo: parseInt(id) }
        });
      });

      return res.json({
        success: true,
        message: 'Professor e suas atribuições excluídos com sucesso',
        type: 'cascade_delete'
      });
    }

    // Se não tem relacionamentos, excluir diretamente
    await prisma.tb_professores.delete({
      where: { codigo: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Professor excluído com sucesso',
      type: 'hard_delete'
    });

  } catch (error) {
    console.error('Erro ao excluir professor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Buscar turmas do professor
 */
const buscarTurmasProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const { anoLectivo } = req.query;

    const turmas = await prisma.tb_professor_turma.findMany({
      where: {
        codigo_Professor: parseInt(id),
        status: 'Activo',
        ...(anoLectivo && { anoLectivo })
      },
      // Relacionamentos simplificados - apenas IDs
      select: {
        codigo: true,
        codigo_Turma: true,
        codigo_Disciplina: true,
        anoLectivo: true,
        status: true
      }
    });

    res.json({
      success: true,
      data: turmas
    });
  } catch (error) {
    console.error('Erro ao buscar turmas do professor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Atribuir disciplina ao professor
 */
const atribuirDisciplina = async (req, res) => {
  try {
    const { professorId } = req.params;
    const { disciplinaId, cursoId, anoLectivo } = req.body;

    // Verificar se já existe a atribuição
    const atribuicaoExiste = await prisma.tb_professor_disciplina.findFirst({
      where: {
        codigo_Professor: parseInt(professorId),
        codigo_Disciplina: parseInt(disciplinaId),
        codigo_Curso: parseInt(cursoId),
        anoLectivo,
        status: 'Activo'
      }
    });

    if (atribuicaoExiste) {
      return res.status(400).json({
        success: false,
        message: 'Professor já possui esta disciplina atribuída'
      });
    }

    const atribuicao = await prisma.tb_professor_disciplina.create({
      data: {
        codigo_Professor: parseInt(professorId),
        codigo_Disciplina: parseInt(disciplinaId),
        codigo_Curso: parseInt(cursoId),
        anoLectivo
      },
      select: {
        codigo: true,
        codigo_Professor: true,
        codigo_Disciplina: true,
        codigo_Curso: true,
        anoLectivo: true,
        status: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Disciplina atribuída com sucesso',
      data: atribuicao
    });
  } catch (error) {
    console.error('Erro ao atribuir disciplina:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Atribuir turma ao professor
 */
const atribuirTurma = async (req, res) => {
  try {
    const { professorId } = req.params;
    const { turmaId, disciplinaId, anoLectivo } = req.body;

    // Verificar se já existe a atribuição
    const atribuicaoExiste = await prisma.tb_professor_turma.findFirst({
      where: {
        codigo_Professor: parseInt(professorId),
        codigo_Turma: parseInt(turmaId),
        codigo_Disciplina: parseInt(disciplinaId),
        anoLectivo,
        status: 'Activo'
      }
    });

    if (atribuicaoExiste) {
      return res.status(400).json({
        success: false,
        message: 'Professor já possui esta turma atribuída para esta disciplina'
      });
    }

    const atribuicao = await prisma.tb_professor_turma.create({
      data: {
        codigo_Professor: parseInt(professorId),
        codigo_Turma: parseInt(turmaId),
        codigo_Disciplina: parseInt(disciplinaId),
        anoLectivo
      },
      select: {
        codigo: true,
        codigo_Professor: true,
        codigo_Turma: true,
        codigo_Disciplina: true,
        anoLectivo: true,
        status: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Turma atribuída com sucesso',
      data: atribuicao
    });
  } catch (error) {
    console.error('Erro ao atribuir turma:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

export default {
  listarProfessores,
  buscarProfessor,
  criarProfessor,
  atualizarProfessor,
  excluirProfessor,
  buscarTurmasProfessor,
  atribuirDisciplina,
  atribuirTurma
};
