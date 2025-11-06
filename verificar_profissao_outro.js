import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificarProfissaoOutro() {
  console.log('🔍 Verificando profissão "Outro"...\n');

  try {
    // Verificar se existe profissão "Outro"
    const profissaoOutro = await prisma.tb_profissao.findFirst({
      where: { designacao: 'Outro' }
    });

    if (profissaoOutro) {
      console.log('✅ Profissão "Outro" encontrada:');
      console.log(`   Código: ${profissaoOutro.codigo}`);
      console.log(`   Designação: ${profissaoOutro.designacao}`);
    } else {
      console.log('❌ Profissão "Outro" NÃO encontrada');
      console.log('   Adicionando...');
      
      const novaProfissao = await prisma.tb_profissao.create({
        data: { designacao: 'Outro' }
      });
      
      console.log('✅ Profissão "Outro" criada:');
      console.log(`   Código: ${novaProfissao.codigo}`);
      console.log(`   Designação: ${novaProfissao.designacao}`);
    }

    // Listar todas as profissões para verificar
    const todasProfissoes = await prisma.tb_profissao.findMany({
      orderBy: { designacao: 'asc' }
    });

    console.log(`\n📋 Total de profissões: ${todasProfissoes.length}`);
    console.log('   Últimas 10 profissões:');
    todasProfissoes.slice(-10).forEach(p => {
      console.log(`   ${p.codigo}: ${p.designacao}`);
    });

    console.log('\n✅ Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
verificarProfissaoOutro();
