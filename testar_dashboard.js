import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testarDashboard() {
  console.log('🔍 Testando dados do dashboard...\n');

  try {
    // 1. Testar contagem de alunos
    console.log('1️⃣ Testando contagem de alunos...');
    const totalAlunos = await prisma.tb_alunos.count();
    const alunosAtivos = await prisma.tb_alunos.count({
      where: { codigo_Status: 1 }
    });
    console.log(`   Total de alunos: ${totalAlunos}`);
    console.log(`   Alunos ativos: ${alunosAtivos}`);

    // 2. Testar contagem de professores
    console.log('\n2️⃣ Testando contagem de professores...');
    const totalProfessores = await prisma.tb_professores.count();
    console.log(`   Total de professores: ${totalProfessores}`);

    // 3. Testar contagem de docentes
    console.log('\n3️⃣ Testando contagem de docentes...');
    try {
      const totalDocentes = await prisma.tb_docente.count();
      console.log(`   Total de docentes: ${totalDocentes}`);
    } catch (error) {
      console.log(`   ❌ Erro na tabela tb_docente: ${error.message}`);
    }

    // 4. Testar pagamentos
    console.log('\n4️⃣ Testando pagamentos...');
    try {
      const pagamentos = await prisma.tb_pagamentos.aggregate({
        _sum: {
          totalgeral: true,
        },
        _count: {
          codigo: true
        }
      });
      console.log(`   Total de pagamentos: ${pagamentos._count.codigo || 0}`);
      console.log(`   Receita total: ${pagamentos._sum.totalgeral || 0}`);
    } catch (error) {
      console.log(`   ❌ Erro na tabela tb_pagamentos: ${error.message}`);
    }

    // 5. Testar notas
    console.log('\n5️⃣ Testando notas...');
    try {
      const totalNotas = await prisma.tb_notas.count();
      console.log(`   Total de notas: ${totalNotas}`);
    } catch (error) {
      console.log(`   ❌ Erro na tabela tb_notas: ${error.message}`);
    }

    // 6. Listar algumas tabelas disponíveis
    console.log('\n6️⃣ Verificando estrutura do banco...');
    
    // Verificar se as tabelas existem
    const tabelas = [
      'tb_alunos',
      'tb_professores', 
      'tb_docente',
      'tb_pagamentos',
      'tb_notas',
      'tb_utilizadores'
    ];

    for (const tabela of tabelas) {
      try {
        const count = await prisma[tabela].count();
        console.log(`   ✅ ${tabela}: ${count} registros`);
      } catch (error) {
        console.log(`   ❌ ${tabela}: Não existe ou erro - ${error.message}`);
      }
    }

    console.log('\n✅ Teste concluído!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
testarDashboard();
