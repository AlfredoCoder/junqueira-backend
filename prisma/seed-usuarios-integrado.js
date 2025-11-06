import { PrismaClient } from '@prisma/client';
import { criarUsuarioProfessor, criarUsuarioAluno, gerarHashSenha } from '../src/services/userService.js';

const prisma = new PrismaClient();

async function seedUsuariosIntegrado() {
  console.log('🚀 Iniciando seed do sistema de usuários integrado...');

  try {
    // ===============================================================
    // 1. CRIAR TIPOS DE USUÁRIO
    // ===============================================================
    console.log('\n📋 Criando tipos de usuário...');

    const tiposUsuario = [
      { designacao: 'Administrador' },
      { designacao: 'Professor' },
      { designacao: 'Aluno' },
      { designacao: 'Operador' },
      { designacao: 'Secretaria' },
      { designacao: 'Diretor' }
    ];

    for (const tipo of tiposUsuario) {
      const tipoExistente = await prisma.tb_tipos_utilizador.findFirst({
        where: { designacao: tipo.designacao }
      });

      if (!tipoExistente) {
        const novoTipo = await prisma.tb_tipos_utilizador.create({
          data: tipo
        });
        console.log(`   ✅ Tipo criado: ${tipo.designacao} (ID: ${novoTipo.codigo})`);
      } else {
        console.log(`   ⚪ Tipo já existe: ${tipo.designacao} (ID: ${tipoExistente.codigo})`);
      }
    }

    // ===============================================================
    // 2. CRIAR USUÁRIO ADMINISTRADOR PADRÃO
    // ===============================================================
    console.log('\n👤 Criando usuário administrador...');

    const tipoAdmin = await prisma.tb_tipos_utilizador.findFirst({
      where: { designacao: 'Administrador' }
    });

    const adminExistente = await prisma.tb_utilizadores.findFirst({
      where: { user: 'admin' }
    });

    if (!adminExistente) {
      const senhaHashAdmin = await gerarHashSenha('admin123');
      
      const admin = await prisma.tb_utilizadores.create({
        data: {
          nome: 'Administrador do Sistema',
          user: 'admin',
          passe: senhaHashAdmin,
          codigo_Tipo_Utilizador: tipoAdmin.codigo,
          estadoActual: 'Activo',
          dataCadastro: new Date(),
          loginStatus: 'OFF'
        }
      });

      console.log(`   ✅ Administrador criado:`);
      console.log(`      Username: admin`);
      console.log(`      Senha: admin123`);
      console.log(`      ID: ${admin.codigo}`);
    } else {
      console.log(`   ⚪ Administrador já existe (ID: ${adminExistente.codigo})`);
    }

    // ===============================================================
    // 3. CRIAR USUÁRIOS PARA PROFESSORES EXISTENTES
    // ===============================================================
    console.log('\n👨‍🏫 Criando usuários para professores existentes...');

    const professores = await prisma.tb_professores.findMany({
      where: {
        status: 'Activo'
      }
    });

    console.log(`   📊 Encontrados ${professores.length} professores ativos`);

    for (const professor of professores) {
      try {
        // Verificar se já tem usuário
        const usuarioExistente = await prisma.tb_utilizadores.findFirst({
          where: { codigo_Professor: professor.codigo }
        });

        if (!usuarioExistente) {
          const dadosUsuario = await criarUsuarioProfessor({
            codigo: professor.codigo,
            nome: professor.nome
          });

          console.log(`   ✅ Usuário criado para professor ${professor.nome}:`);
          console.log(`      Username: ${dadosUsuario.username}`);
          console.log(`      Senha: ${dadosUsuario.senhaTemporaria}`);
        } else {
          console.log(`   ⚪ Professor ${professor.nome} já tem usuário`);
        }
      } catch (error) {
        console.log(`   ❌ Erro ao criar usuário para ${professor.nome}: ${error.message}`);
      }
    }

    // ===============================================================
    // 4. CRIAR USUÁRIOS PARA ALUNOS CONFIRMADOS
    // ===============================================================
    console.log('\n👨‍🎓 Criando usuários para alunos confirmados...');

    const alunosConfirmados = await prisma.tb_confirmacoes.findMany({
      where: {
        status: 'Confirmado'
      },
      include: {
        tb_alunos: true
      }
    });

    console.log(`   📊 Encontrados ${alunosConfirmados.length} alunos confirmados`);

    for (const confirmacao of alunosConfirmados) {
      const aluno = confirmacao.tb_alunos;
      
      if (!aluno || !aluno.nome) {
        console.log(`   ⚠️  Aluno sem dados válidos (ID: ${confirmacao.codigo_Aluno})`);
        continue;
      }

      try {
        // Verificar se já tem usuário
        const usuarioExistente = await prisma.tb_utilizadores.findFirst({
          where: { codigo_Aluno: aluno.codigo }
        });

        if (!usuarioExistente) {
          const dadosUsuario = await criarUsuarioAluno({
            codigo: aluno.codigo,
            nome: aluno.nome
          });

          console.log(`   ✅ Usuário criado para aluno ${aluno.nome}:`);
          console.log(`      Username: ${dadosUsuario.username}`);
          console.log(`      Senha: ${dadosUsuario.senhaTemporaria}`);
        } else {
          console.log(`   ⚪ Aluno ${aluno.nome} já tem usuário`);
        }
      } catch (error) {
        console.log(`   ❌ Erro ao criar usuário para ${aluno.nome}: ${error.message}`);
      }
    }

    // ===============================================================
    // 5. ESTATÍSTICAS FINAIS
    // ===============================================================
    console.log('\n📊 Estatísticas do sistema de usuários:');

    const estatisticas = await prisma.tb_utilizadores.groupBy({
      by: ['codigo_Tipo_Utilizador'],
      _count: {
        codigo: true
      }
    });

    for (const stat of estatisticas) {
      const tipo = await prisma.tb_tipos_utilizador.findUnique({
        where: { codigo: stat.codigo_Tipo_Utilizador }
      });
      console.log(`   ${tipo.designacao}: ${stat._count.codigo} usuários`);
    }

    const totalUsuarios = await prisma.tb_utilizadores.count();
    const usuariosAtivos = await prisma.tb_utilizadores.count({
      where: { estadoActual: 'Activo' }
    });

    console.log(`\n   📈 Total de usuários: ${totalUsuarios}`);
    console.log(`   ✅ Usuários ativos: ${usuariosAtivos}`);

    // ===============================================================
    // 6. EXEMPLOS DE LOGIN
    // ===============================================================
    console.log('\n🔐 Exemplos de login:');
    console.log('   👤 Administrador:');
    console.log('      Username: admin');
    console.log('      Senha: admin123');
    
    const exemplosProfessores = await prisma.tb_utilizadores.findMany({
      where: {
        codigo_Professor: { not: null }
      },
      include: {
        professor: true
      },
      take: 2
    });

    if (exemplosProfessores.length > 0) {
      console.log('   👨‍🏫 Professores:');
      exemplosProfessores.forEach(usuario => {
        console.log(`      Username: ${usuario.user}`);
        console.log(`      Senha: 123456 (padrão)`);
        console.log(`      Nome: ${usuario.professor.nome}`);
      });
    }

    const exemplosAlunos = await prisma.tb_utilizadores.findMany({
      where: {
        codigo_Aluno: { not: null }
      },
      include: {
        aluno: true
      },
      take: 2
    });

    if (exemplosAlunos.length > 0) {
      console.log('   👨‍🎓 Alunos:');
      exemplosAlunos.forEach(usuario => {
        console.log(`      Username: ${usuario.user}`);
        console.log(`      Senha: 123456 (padrão)`);
        console.log(`      Nome: ${usuario.aluno.nome}`);
      });
    }

    console.log('\n✅ Seed do sistema de usuários integrado concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsuariosIntegrado()
    .then(() => {
      console.log('\n🎉 Seed executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Erro na execução do seed:', error);
      process.exit(1);
    });
}

export { seedUsuariosIntegrado };
