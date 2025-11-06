import { PrismaClient } from '@prisma/client';
import { criarUsuarioProfessor, criarUsuarioAluno } from './src/services/userService.js';

const prisma = new PrismaClient();

async function testarSeedCompleto() {
  console.log('🧪 Testando seed completo do sistema de usuários...\n');

  try {
    // 1. Verificar tipos de usuário
    console.log('1️⃣ Verificando tipos de usuário:');
    const tipos = await prisma.tb_tipos_utilizador.findMany();
    tipos.forEach(tipo => {
      console.log(`   ${tipo.codigo} - ${tipo.designacao}`);
    });

    // 2. Criar usuários para professores sem usuário
    console.log('\n2️⃣ Criando usuários para professores sem usuário:');
    const professoresSemUsuario = await prisma.tb_professores.findMany({
      where: {
        usuario: null,
        status: 'Activo'
      }
    });

    console.log(`   📊 Encontrados ${professoresSemUsuario.length} professores sem usuário`);

    for (const professor of professoresSemUsuario) {
      try {
        const dadosUsuario = await criarUsuarioProfessor({
          codigo: professor.codigo,
          nome: professor.nome
        });

        console.log(`   ✅ Usuário criado para professor ${professor.nome}:`);
        console.log(`      Username: ${dadosUsuario.username}`);
        console.log(`      Senha: ${dadosUsuario.senhaTemporaria}`);
      } catch (error) {
        console.log(`   ❌ Erro ao criar usuário para ${professor.nome}: ${error.message}`);
      }
    }

    // 3. Criar usuários para alunos confirmados sem usuário
    console.log('\n3️⃣ Criando usuários para alunos confirmados sem usuário:');
    const alunosConfirmados = await prisma.tb_confirmacoes.findMany({
      where: {
        status: 'Confirmado'
      },
      include: {
        tb_alunos: {
          include: {
            usuario: true
          }
        }
      }
    });

    const alunosSemUsuario = alunosConfirmados.filter(conf => 
      conf.tb_alunos && conf.tb_alunos.nome && !conf.tb_alunos.usuario
    );

    console.log(`   📊 Encontrados ${alunosSemUsuario.length} alunos confirmados sem usuário`);

    for (const confirmacao of alunosSemUsuario) {
      const aluno = confirmacao.tb_alunos;
      
      try {
        const dadosUsuario = await criarUsuarioAluno({
          codigo: aluno.codigo,
          nome: aluno.nome
        });

        console.log(`   ✅ Usuário criado para aluno ${aluno.nome}:`);
        console.log(`      Username: ${dadosUsuario.username}`);
        console.log(`      Senha: ${dadosUsuario.senhaTemporaria}`);
      } catch (error) {
        console.log(`   ❌ Erro ao criar usuário para ${aluno.nome}: ${error.message}`);
      }
    }

    // 4. Estatísticas finais
    console.log('\n4️⃣ Estatísticas finais:');
    
    const totalUsuarios = await prisma.tb_utilizadores.count();
    const usuariosProfessores = await prisma.tb_utilizadores.count({
      where: { codigo_Professor: { not: null } }
    });
    const usuariosAlunos = await prisma.tb_utilizadores.count({
      where: { codigo_Aluno: { not: null } }
    });
    const usuariosAdmin = await prisma.tb_utilizadores.count({
      where: { 
        codigo_Professor: null,
        codigo_Aluno: null
      }
    });

    console.log(`   📈 Total de usuários: ${totalUsuarios}`);
    console.log(`   👨‍🏫 Usuários professores: ${usuariosProfessores}`);
    console.log(`   👨‍🎓 Usuários alunos: ${usuariosAlunos}`);
    console.log(`   👤 Usuários administradores: ${usuariosAdmin}`);

    // 5. Exemplos de login
    console.log('\n5️⃣ Exemplos de login:');
    
    const exemplosProfessores = await prisma.tb_utilizadores.findMany({
      where: { codigo_Professor: { not: null } },
      include: { professor: true },
      take: 3
    });

    if (exemplosProfessores.length > 0) {
      console.log('   👨‍🏫 Professores:');
      exemplosProfessores.forEach(usuario => {
        console.log(`      Username: ${usuario.user} | Senha: 123456 | Nome: ${usuario.professor.nome}`);
      });
    }

    const exemplosAlunos = await prisma.tb_utilizadores.findMany({
      where: { codigo_Aluno: { not: null } },
      include: { aluno: true },
      take: 3
    });

    if (exemplosAlunos.length > 0) {
      console.log('   👨‍🎓 Alunos:');
      exemplosAlunos.forEach(usuario => {
        console.log(`      Username: ${usuario.user} | Senha: 123456 | Nome: ${usuario.aluno.nome}`);
      });
    }

    const admin = await prisma.tb_utilizadores.findFirst({
      where: { user: 'admin' }
    });

    if (admin) {
      console.log('   👤 Administrador:');
      console.log(`      Username: admin | Senha: admin123 | Nome: ${admin.nome}`);
    }

    console.log('\n✅ Seed completo executado com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
testarSeedCompleto();
