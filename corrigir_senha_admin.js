import { PrismaClient } from '@prisma/client';
import { gerarHashSenha } from './src/services/userService.js';

const prisma = new PrismaClient();

async function corrigirSenhaAdmin() {
  console.log('🔧 Corrigindo senha do administrador...\n');

  try {
    // Buscar admin
    const admin = await prisma.tb_utilizadores.findFirst({
      where: { user: 'admin' }
    });

    if (!admin) {
      console.log('❌ Administrador não encontrado');
      return;
    }

    console.log(`📋 Admin encontrado: ${admin.nome} (ID: ${admin.codigo})`);
    console.log(`🔐 Hash atual: ${admin.passe.substring(0, 20)}...`);

    // Gerar novo hash para admin123
    const novoHash = await gerarHashSenha('admin123');
    console.log(`🔐 Novo hash: ${novoHash.substring(0, 20)}...`);

    // Atualizar senha
    await prisma.tb_utilizadores.update({
      where: { codigo: admin.codigo },
      data: { passe: novoHash }
    });

    console.log('✅ Senha do administrador atualizada com sucesso!');
    console.log('   Username: admin');
    console.log('   Senha: admin123');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
corrigirSenhaAdmin();
