import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPeriodos() {
  console.log('🕐 Iniciando seed de períodos...');

  try {
    // Verificar se já existem períodos
    const existingPeriodos = await prisma.tb_periodos.findMany();
    
    if (existingPeriodos.length > 0) {
      console.log(`✅ Já existem ${existingPeriodos.length} períodos cadastrados:`);
      existingPeriodos.forEach(periodo => {
        console.log(`   - ${periodo.designacao} (Código: ${periodo.codigo})`);
      });
      return;
    }

    // Criar períodos padrão
    const periodos = [
      { designacao: 'Manhã' },
      { designacao: 'Tarde' },
      { designacao: 'Noite' }
    ];

    console.log('📝 Criando períodos padrão...');

    for (const periodo of periodos) {
      const created = await prisma.tb_periodos.create({
        data: periodo
      });
      console.log(`✅ Período criado: ${created.designacao} (Código: ${created.codigo})`);
    }

    console.log('🎉 Seed de períodos concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao executar seed de períodos:', error);
    throw error;
  }
}

// Executar seed se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPeriodos()
    .catch((e) => {
      console.error('❌ Erro fatal no seed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { seedPeriodos };
