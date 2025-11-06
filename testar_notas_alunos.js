import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testarNotasAlunos() {
  console.log('📊 Testando tabela tb_notas_alunos...\n');

  try {
    // Testar se a tabela existe
    const totalNotas = await prisma.tb_notas_alunos.count();
    console.log(`✅ Total de notas: ${totalNotas}`);

    if (totalNotas > 0) {
      // Buscar algumas notas
      const notas = await prisma.tb_notas_alunos.findMany({
        take: 5,
        select: {
          codigo: true,
          notaFinal: true,
          codigo_Aluno: true,
          codigo_Professor: true
        }
      });
      
      console.log('\n📋 Primeiras 5 notas:');
      notas.forEach(nota => {
        console.log(`   Nota ${nota.codigo}: ${nota.notaFinal} (Aluno: ${nota.codigo_Aluno}, Professor: ${nota.codigo_Professor})`);
      });
    }

    console.log('\n✅ Teste da tabela tb_notas_alunos concluído!');

  } catch (error) {
    console.error('❌ Erro ao testar tb_notas_alunos:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
testarNotasAlunos();
