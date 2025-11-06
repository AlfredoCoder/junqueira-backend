import { PrismaClient } from '@prisma/client';
import { gerarUsername, gerarHashSenha } from './src/services/userService.js';

const prisma = new PrismaClient();

async function testarSistemaUsuarios() {
  console.log('🧪 Testando sistema de usuários integrado...\n');

  try {
    // 1. Testar geração de username
    console.log('1️⃣ Testando geração de username:');
    const username1 = await gerarUsername('João Silva Santos');
    const username2 = await gerarUsername('Maria Fernanda Costa');
    console.log(`   "João Silva Santos" → "${username1}"`);
    console.log(`   "Maria Fernanda Costa" → "${username2}"`);

    // 2. Verificar tipos de usuário
    console.log('\n2️⃣ Verificando tipos de usuário:');
    const tipos = await prisma.tb_tipos_utilizador.findMany();
    tipos.forEach(tipo => {
      console.log(`   ${tipo.codigo} - ${tipo.designacao}`);
    });

    // 3. Verificar estrutura da tabela tb_utilizadores
    console.log('\n3️⃣ Verificando estrutura da tabela tb_utilizadores:');
    const usuarios = await prisma.tb_utilizadores.findMany({
      take: 3,
      include: {
        tb_tipos_utilizador: true,
        professor: true,
        aluno: true
      }
    });

    console.log(`   Total de usuários: ${usuarios.length}`);
    usuarios.forEach(usuario => {
      console.log(`   - ${usuario.nome} (${usuario.user}) - Tipo: ${usuario.tb_tipos_utilizador.designacao}`);
    });

    // 4. Verificar professores
    console.log('\n4️⃣ Verificando professores:');
    const professores = await prisma.tb_professores.findMany({
      take: 3,
      include: {
        usuario: true
      }
    });

    console.log(`   Total de professores: ${professores.length}`);
    professores.forEach(professor => {
      const temUsuario = professor.usuario ? `✅ Username: ${professor.usuario.user}` : '❌ Sem usuário';
      console.log(`   - ${professor.nome} - ${temUsuario}`);
    });

    // 5. Verificar alunos
    console.log('\n5️⃣ Verificando alunos:');
    const alunos = await prisma.tb_alunos.findMany({
      take: 3,
      include: {
        usuario: true
      }
    });

    console.log(`   Total de alunos: ${alunos.length}`);
    alunos.forEach(aluno => {
      const temUsuario = aluno.usuario ? `✅ Username: ${aluno.usuario.user}` : '❌ Sem usuário';
      console.log(`   - ${aluno.nome || 'Nome não definido'} - ${temUsuario}`);
    });

    console.log('\n✅ Teste concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar teste
testarSistemaUsuarios();
