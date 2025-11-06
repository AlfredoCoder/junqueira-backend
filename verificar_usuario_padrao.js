import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificarUsuario() {
  console.log('🔍 Verificando usuário padrão...\n');

  try {
    // Verificar se existe usuário com código 1
    const usuario1 = await prisma.tb_utilizadores.findUnique({
      where: { codigo: 1 }
    });

    if (usuario1) {
      console.log('✅ Usuário código 1 encontrado:');
      console.log(`   Nome: ${usuario1.nome}`);
      console.log(`   Username: ${usuario1.user}`);
      console.log(`   Tipo: ${usuario1.codigo_Tipo_Utilizador}`);
    } else {
      console.log('❌ Usuário código 1 NÃO encontrado');
      
      // Listar todos os usuários
      const usuarios = await prisma.tb_utilizadores.findMany({
        take: 10,
        select: {
          codigo: true,
          nome: true,
          user: true,
          codigo_Tipo_Utilizador: true
        }
      });
      
      console.log('\n📋 Usuários existentes:');
      usuarios.forEach(u => {
        console.log(`   ${u.codigo}: ${u.nome} (${u.user}) - Tipo: ${u.codigo_Tipo_Utilizador}`);
      });
    }

    console.log('\n✅ Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
verificarUsuario();
