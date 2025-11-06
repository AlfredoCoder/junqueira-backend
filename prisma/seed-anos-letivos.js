import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗓️ Criando anos letivos...');

  try {
    // Verificar se já existem anos letivos
    const anosExistentes = await prisma.tb_ano_lectivo.findMany();
    console.log('Anos letivos existentes:', anosExistentes.length);

    if (anosExistentes.length === 0) {
      // Criar anos letivos
      const anosLetivos = [
        { designacao: '2022/2023', mesInicial: 'Setembro', mesFinal: 'Julho', anoInicial: '2022', anoFinal: '2023' },
        { designacao: '2023/2024', mesInicial: 'Setembro', mesFinal: 'Julho', anoInicial: '2023', anoFinal: '2024' },
        { designacao: '2024/2025', mesInicial: 'Setembro', mesFinal: 'Julho', anoInicial: '2024', anoFinal: '2025' },
        { designacao: '2025/2026', mesInicial: 'Setembro', mesFinal: 'Julho', anoInicial: '2025', anoFinal: '2026' }
      ];

      for (const ano of anosLetivos) {
        const anoCreated = await prisma.tb_ano_lectivo.create({
          data: ano
        });
        console.log('✅ Ano letivo criado:', anoCreated.designacao);
      }
    } else {
      console.log('ℹ️ Anos letivos já existem');
      anosExistentes.forEach(ano => console.log('  -', ano.designacao));
    }

    // Verificar professores
    const professores = await prisma.tb_professores.findMany();
    console.log('\n👨‍🏫 Professores disponíveis:', professores.length);

    // Verificar turmas
    const turmas = await prisma.tb_turmas.findMany();
    console.log('🏫 Turmas disponíveis:', turmas.length);

    // Verificar diretores de turma
    const diretoresTurma = await prisma.tb_directores_turmas.findMany({
      include: {
        tb_turmas: { select: { designacao: true } },
        tb_docente: { select: { nome: true } }
      }
    });
    console.log('👨‍💼 Diretores de turma:', diretoresTurma.length);

    console.log('\n🎉 SEED DE ANOS LETIVOS CONCLUÍDO!');

  } catch (error) {
    console.error('❌ Erro ao criar anos letivos:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
