import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificarStatus() {
  console.log('🔍 Verificando tabelas de status...\n');

  try {
    // Verificar estrutura da tabela tb_status
    console.log('1️⃣ Verificando tb_status...');
    try {
      const status = await prisma.tb_status.findMany();
      console.log(`   Total: ${status.length}`);
      status.forEach(s => console.log(`   - ${s.codigo}: ${s.designacao}`));
      
      // Se estiver vazia, popular
      if (status.length === 0) {
        console.log('   Populando tb_status...');
        const statusList = [
          'Ativo',
          'Inativo',
          'Suspenso',
          'Transferido',
          'Desistente',
          'Formado'
        ];
        
        for (const statusNome of statusList) {
          await prisma.tb_status.create({
            data: { designacao: statusNome }
          });
        }
        console.log(`   ✅ ${statusList.length} status inseridos`);
      }
    } catch (error) {
      console.log('   ❌ Erro com tb_status:', error.message);
    }

    // Verificar tb_tipo_status
    console.log('\n2️⃣ Verificando tb_tipo_status...');
    try {
      const tipoStatus = await prisma.tb_tipo_status.findMany();
      console.log(`   Total: ${tipoStatus.length}`);
      tipoStatus.forEach(ts => console.log(`   - ${ts.codigo}: ${ts.designacao}`));
    } catch (error) {
      console.log('   ❌ Erro com tb_tipo_status:', error.message);
    }

    console.log('\n✅ Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
verificarStatus();
