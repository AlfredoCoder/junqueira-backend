import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMoedas() {
  console.log('🏦 Iniciando seed das moedas...');

  try {
    // Verificar se já existem moedas
    const existingMoedas = await prisma.tb_moedas.findMany();
    
    if (existingMoedas.length > 0) {
      console.log('✅ Moedas já existem no banco:', existingMoedas.length);
      return;
    }

    // Criar moedas padrão
    const moedas = [
      { codigo: 1, designacao: 'KZ' },
      { codigo: 2, designacao: 'USD' },
      { codigo: 3, designacao: 'EUROS' }
    ];

    for (const moeda of moedas) {
      await prisma.tb_moedas.create({
        data: {
          designacao: moeda.designacao
        }
      });
      console.log(`✅ Moeda criada: ${moeda.designacao}`);
    }

    console.log('🎉 Seed das moedas concluído com sucesso!');
    
    // Verificar moedas criadas
    const moedasCriadas = await prisma.tb_moedas.findMany();
    console.log('📊 Total de moedas no banco:', moedasCriadas.length);
    moedasCriadas.forEach(moeda => {
      console.log(`   - Código ${moeda.codigo}: ${moeda.designacao}`);
    });

  } catch (error) {
    console.error('❌ Erro no seed das moedas:', error);
    throw error;
  }
}

// Executar seed
seedMoedas()
  .then(() => {
    console.log('✅ Seed das moedas finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro fatal no seed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

export { seedMoedas };
