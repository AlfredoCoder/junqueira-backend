import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testarDashboardCorrigido() {
  console.log('🔍 Testando dashboard corrigido...\n');

  try {
    // 1. Testar contagem de professores com status correto
    console.log('1️⃣ Testando contagem de professores...');
    const totalProfessores = await prisma.tb_professores.count();
    const professoresAtivos = await prisma.tb_professores.count({
      where: { status: "Activo" }
    });
    console.log(`   Total de professores: ${totalProfessores}`);
    console.log(`   Professores ativos: ${professoresAtivos}`);

    // 2. Verificar valores de status existentes
    console.log('\n2️⃣ Verificando valores de status...');
    const professores = await prisma.tb_professores.findMany({
      select: {
        codigo: true,
        nome: true,
        status: true
      }
    });
    
    professores.forEach(prof => {
      console.log(`   Professor ${prof.codigo}: ${prof.nome} - Status: "${prof.status}"`);
    });

    // 3. Testar alunos
    console.log('\n3️⃣ Testando alunos...');
    const totalAlunos = await prisma.tb_alunos.count();
    const alunosAtivos = await prisma.tb_alunos.count({
      where: { codigo_Status: 1 }
    });
    console.log(`   Total de alunos: ${totalAlunos}`);
    console.log(`   Alunos ativos: ${alunosAtivos}`);

    console.log('\n✅ Teste concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
testarDashboardCorrigido();
