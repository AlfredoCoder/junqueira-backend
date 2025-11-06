import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Gera um username único baseado no nome completo
 * @param {string} nomeCompleto - Nome completo da pessoa
 * @returns {Promise<string>} - Username único gerado
 */
async function gerarUsername(nomeCompleto) {
  if (!nomeCompleto || typeof nomeCompleto !== 'string') {
    throw new Error('Nome completo é obrigatório para gerar username');
  }

  // Limpar e normalizar o nome
  const nomeNormalizado = nomeCompleto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z\s]/g, '') // Remove caracteres especiais
    .trim();

  if (!nomeNormalizado) {
    throw new Error('Nome inválido para gerar username');
  }

  const partesNome = nomeNormalizado.split(/\s+/).filter(parte => parte.length > 0);
  
  if (partesNome.length === 0) {
    throw new Error('Nome deve conter pelo menos uma palavra válida');
  }

  let baseUsername;
  
  if (partesNome.length === 1) {
    // Se só tem um nome, usa ele
    baseUsername = partesNome[0];
  } else if (partesNome.length === 2) {
    // Se tem 2 nomes, usa primeiro.ultimo
    baseUsername = `${partesNome[0]}.${partesNome[partesNome.length - 1]}`;
  } else {
    // Se tem mais de 2 nomes, usa primeiro.ultimo
    baseUsername = `${partesNome[0]}.${partesNome[partesNome.length - 1]}`;
  }

  // Verificar se o username já existe e gerar variações se necessário
  let username = baseUsername;
  let contador = 1;
  
  while (await verificarUsernameExiste(username)) {
    username = `${baseUsername}${contador}`;
    contador++;
    
    // Evitar loop infinito
    if (contador > 999) {
      username = `${baseUsername}${Date.now()}`;
      break;
    }
  }

  return username;
}

/**
 * Verifica se um username já existe
 * @param {string} username - Username para verificar
 * @returns {Promise<boolean>} - True se existe, false caso contrário
 */
async function verificarUsernameExiste(username) {
  try {
    const usuario = await prisma.tb_utilizadores.findFirst({
      where: {
        user: username
      }
    });
    return !!usuario;
  } catch (error) {
    console.error('Erro ao verificar username:', error);
    return false;
  }
}

/**
 * Gera hash da senha padrão
 * @param {string} senha - Senha para fazer hash (padrão: "123456")
 * @returns {Promise<string>} - Hash da senha
 */
async function gerarHashSenha(senha = '123456') {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(senha, saltRounds);
  } catch (error) {
    console.error('Erro ao gerar hash da senha:', error);
    throw new Error('Erro ao processar senha');
  }
}

/**
 * Cria usuário automaticamente para professor
 * @param {Object} professorData - Dados do professor criado
 * @returns {Promise<Object>} - Dados do usuário criado
 */
async function criarUsuarioProfessor(professorData) {
  try {
    const { codigo, nome } = professorData;
    
    if (!codigo || !nome) {
      throw new Error('Código e nome do professor são obrigatórios');
    }

    // Gerar username único
    const username = await gerarUsername(nome);
    
    // Gerar hash da senha padrão
    const senhaHash = await gerarHashSenha();
    
    // Buscar tipo de usuário "Professor" (assumindo código 2)
    let tipoUsuarioProfessor = await prisma.tb_tipos_utilizador.findFirst({
      where: {
        designacao: 'Professor'
      }
    });

    // Se não existir, criar o tipo
    if (!tipoUsuarioProfessor) {
      tipoUsuarioProfessor = await prisma.tb_tipos_utilizador.create({
        data: {
          designacao: 'Professor'
        }
      });
    }

    // Criar usuário
    const novoUsuario = await prisma.tb_utilizadores.create({
      data: {
        nome: nome,
        user: username,
        passe: senhaHash,
        codigo_Tipo_Utilizador: tipoUsuarioProfessor.codigo,
        codigo_Professor: codigo,
        estadoActual: 'ACTIVO',
        dataCadastro: new Date(),
        loginStatus: 'OFF'
      }
    });

    console.log(`✅ Usuário criado automaticamente para professor ${nome}:`);
    console.log(`   Username: ${username}`);
    console.log(`   Senha padrão: 123456`);
    console.log(`   Tipo: Professor`);

    return {
      codigo: novoUsuario.codigo,
      username: username,
      senhaTemporaria: '123456',
      tipo: 'Professor'
    };

  } catch (error) {
    console.error('Erro ao criar usuário para professor:', error);
    throw error;
  }
}

/**
 * Cria usuário automaticamente para aluno
 * @param {Object} alunoData - Dados do aluno criado
 * @returns {Promise<Object>} - Dados do usuário criado
 */
async function criarUsuarioAluno(alunoData) {
  try {
    const { codigo, nome } = alunoData;
    
    if (!codigo || !nome) {
      throw new Error('Código e nome do aluno são obrigatórios');
    }

    // Gerar username único
    const username = await gerarUsername(nome);
    
    // Gerar hash da senha padrão
    const senhaHash = await gerarHashSenha();
    
    // Buscar tipo de usuário "Aluno" (assumindo código 3)
    let tipoUsuarioAluno = await prisma.tb_tipos_utilizador.findFirst({
      where: {
        designacao: 'Aluno'
      }
    });

    // Se não existir, criar o tipo
    if (!tipoUsuarioAluno) {
      tipoUsuarioAluno = await prisma.tb_tipos_utilizador.create({
        data: {
          designacao: 'Aluno'
        }
      });
    }

    // Criar usuário
    const novoUsuario = await prisma.tb_utilizadores.create({
      data: {
        nome: nome,
        user: username,
        passe: senhaHash,
        codigo_Tipo_Utilizador: tipoUsuarioAluno.codigo,
        codigo_Aluno: codigo,
        estadoActual: 'ACTIVO',
        dataCadastro: new Date(),
        loginStatus: 'OFF'
      }
    });

    console.log(`✅ Usuário criado automaticamente para aluno ${nome}:`);
    console.log(`   Username: ${username}`);
    console.log(`   Senha padrão: 123456`);
    console.log(`   Tipo: Aluno`);

    return {
      codigo: novoUsuario.codigo,
      username: username,
      senhaTemporaria: '123456',
      tipo: 'Aluno'
    };

  } catch (error) {
    console.error('Erro ao criar usuário para aluno:', error);
    throw error;
  }
}

/**
 * Verifica credenciais de login e retorna dados do usuário
 * @param {string} username - Username do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<Object>} - Dados do usuário autenticado
 */
async function autenticarUsuario(username, senha) {
  try {
    // Buscar usuário
    const usuario = await prisma.tb_utilizadores.findFirst({
      where: {
        user: username,
        estadoActual: 'ACTIVO'
      },
      include: {
        tb_tipos_utilizador: true,
        professor: true,
        aluno: true
      }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado ou inativo');
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.passe);
    if (!senhaValida) {
      throw new Error('Senha incorreta');
    }

    // Atualizar status de login
    await prisma.tb_utilizadores.update({
      where: { codigo: usuario.codigo },
      data: { loginStatus: 'ON' }
    });

    // Preparar dados de retorno baseado no tipo de usuário
    let dadosEspecificos = {};
    
    if (usuario.professor) {
      dadosEspecificos = {
        tipoDados: 'professor',
        dados: usuario.professor
      };
    } else if (usuario.aluno) {
      dadosEspecificos = {
        tipoDados: 'aluno',
        dados: usuario.aluno
      };
    } else {
      dadosEspecificos = {
        tipoDados: 'admin',
        dados: null
      };
    }

    return {
      codigo: usuario.codigo,
      nome: usuario.nome,
      username: usuario.user,
      tipo: usuario.tb_tipos_utilizador.designacao,
      ...dadosEspecificos
    };

  } catch (error) {
    console.error('Erro na autenticação:', error);
    throw error;
  }
}

/**
 * Faz logout do usuário
 * @param {number} codigoUsuario - Código do usuário
 */
async function logout(codigoUsuario) {
  try {
    await prisma.tb_utilizadores.update({
      where: { codigo: codigoUsuario },
      data: { loginStatus: 'OFF' }
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    throw error;
  }
}

/**
 * Cria usuário para aluno dentro de uma transação
 * @param {Object} alunoData - Dados do aluno criado
 * @param {Object} tx - Transação do Prisma
 * @returns {Promise<Object>} - Dados do usuário criado
 */
async function criarUsuarioParaAluno(alunoData, tx) {
  try {
    const { codigo, nome } = alunoData;
    
    if (!codigo || !nome) {
      throw new Error('Código e nome do aluno são obrigatórios');
    }

    // Gerar username único
    const username = await gerarUsername(nome);
    
    // Gerar hash da senha padrão
    const senhaHash = await gerarHashSenha();
    
    // Buscar tipo de usuário "Aluno"
    let tipoUsuarioAluno = await tx.tb_tipos_utilizador.findFirst({
      where: {
        designacao: 'Aluno'
      }
    });

    // Se não existir, criar o tipo
    if (!tipoUsuarioAluno) {
      tipoUsuarioAluno = await tx.tb_tipos_utilizador.create({
        data: {
          designacao: 'Aluno'
        }
      });
    }

    // Criar usuário
    const novoUsuario = await tx.tb_utilizadores.create({
      data: {
        nome: nome,
        user: username,
        passe: senhaHash,
        codigo_Tipo_Utilizador: tipoUsuarioAluno.codigo,
        codigo_Aluno: codigo,
        estadoActual: 'ACTIVO',
        dataCadastro: new Date(),
        loginStatus: 'OFF'
      }
    });

    // Atualizar o aluno com o código do usuário criado
    await tx.tb_alunos.update({
      where: { codigo: codigo },
      data: { codigo_Utilizador: novoUsuario.codigo }
    });

    console.log(`✅ Usuário criado automaticamente para aluno ${nome}:`);
    console.log(`   Username: ${username}`);
    console.log(`   Senha padrão: 123456`);
    console.log(`   Tipo: Aluno`);
    console.log(`   Relacionamento 1:1 estabelecido`);

    return {
      codigo: novoUsuario.codigo,
      nome: novoUsuario.nome,
      username: novoUsuario.user,
      tipo: 'Aluno',
      codigoAluno: codigo
    };

  } catch (error) {
    console.error('Erro ao criar usuário para aluno:', error);
    throw error;
  }
}

export const UserService = {
  gerarUsername,
  verificarUsernameExiste,
  gerarHashSenha,
  criarUsuarioProfessor,
  criarUsuarioAluno,
  criarUsuarioParaAluno,
  autenticarUsuario,
  logout
};

export {
  gerarUsername,
  verificarUsernameExiste,
  gerarHashSenha,
  criarUsuarioProfessor,
  criarUsuarioAluno,
  criarUsuarioParaAluno,
  autenticarUsuario,
  logout
};
