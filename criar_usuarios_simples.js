import { PrismaClient } from '@prisma/client';
import { criarUsuarioProfessor, gerarHashSenha } from './src/services/userService.js';

const prisma = new PrismaClient();

async function criarUsuariosSimples() {
  console.log('🚀 Criando usuários para o sistema integrado...\n');

  try {
    // 1. Criar tipos de usuário se não existirem
    console.log('1️⃣ Verificando tipos de usuário...');
    
    const tipoAluno = await prisma.tb_tipos_utilizador.findFirst({
      where: { designacao: 'Aluno' }
    });
    
    if (!tipoAluno) {
      await prisma.tb_tipos_utilizador.create({
        data: { designacao: 'Aluno' }
      });
      console.log('   ✅ Tipo "Aluno" criado');
    } else {
      console.log('   ⚪ Tipo "Aluno" já existe');
    }

    // 2. Criar usuário administrador se não existir
    console.log('\n2️⃣ Verificando usuário administrador...');
    
    const adminExistente = await prisma.tb_utilizadores.findFirst({
      where: { user: 'admin' }
    });

    if (!adminExistente) {
      const tipoAdmin = await prisma.tb_tipos_utilizador.findFirst({
        where: { designacao: 'Administrador' }
      });

      const senhaHashAdmin = await gerarHashSenha('admin123');
      
      await prisma.tb_utilizadores.create({
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
      console.log('   ✅ Administrador criado (admin/admin123)');
    } else {
      console.log('   ⚪ Administrador já existe');
    }

    // 3. Criar usuários para professores
    console.log('\n3️⃣ Criando usuários para professores...');
    
    const professores = await prisma.tb_professores.findMany({
      where: { status: 'Activo' }
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

          console.log(`   ✅ ${professor.nome} → ${dadosUsuario.username} (123456)`);
        } else {
          console.log(`   ⚪ ${professor.nome} já tem usuário`);
        }
      } catch (error) {
        console.log(`   ❌ Erro para ${professor.nome}: ${error.message}`);
      }
    }

    // 4. Estatísticas finais
    console.log('\n4️⃣ Estatísticas finais:');
    
    const totalUsuarios = await prisma.tb_utilizadores.count();
    const usuariosProfessores = await prisma.tb_utilizadores.count({
      where: { codigo_Professor: { not: null } }
    });
    const usuariosAdmin = await prisma.tb_utilizadores.count({
      where: { 
        codigo_Professor: null,
        codigo_Aluno: null
      }
    });

    console.log(`   📈 Total de usuários: ${totalUsuarios}`);
    console.log(`   👨‍🏫 Usuários professores: ${usuariosProfessores}`);
    console.log(`   👤 Usuários administradores: ${usuariosAdmin}`);

    // 5. Exemplos de login
    console.log('\n5️⃣ Exemplos de login:');
    
    console.log('   👤 Administrador:');
    console.log('      Username: admin | Senha: admin123');
    
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

    console.log('\n✅ Sistema de usuários integrado configurado com sucesso!');
    console.log('\n🔐 Para testar o login, use as rotas:');
    console.log('   POST /api/auth/integrated/login');
    console.log('   { "username": "admin", "password": "admin123" }');

  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
criarUsuariosSimples();
