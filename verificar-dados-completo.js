import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificarDados() {
  try {
    console.log('=== VERIFICANDO DADOS DAS TABELAS ===\n');
    
    // Anos Letivos
    const anosLetivos = await prisma.tb_anos_lectivos.findMany();
    console.log('📅 ANOS LETIVOS:', anosLetivos.length, 'registros');
    anosLetivos.forEach(ano => console.log('  -', ano.designacao));
    
    // Professores
    const professores = await prisma.tb_professores.findMany();
    console.log('\n👨‍🏫 PROFESSORES:', professores.length, 'registros');
    professores.slice(0, 3).forEach(prof => console.log('  -', prof.nome));
    
    // Turmas
    const turmas = await prisma.tb_turmas.findMany();
    console.log('\n🏫 TURMAS:', turmas.length, 'registros');
    turmas.slice(0, 3).forEach(turma => console.log('  -', turma.designacao));
    
    // Diretores de Turma
    const diretoresTurma = await prisma.tb_diretores_turma.findMany({
      include: {
        tb_professores: { select: { nome: true } },
        tb_turmas: { select: { designacao: true } },
        tb_anos_lectivos: { select: { designacao: true } }
      }
    });
    console.log('\n👨‍💼 DIRETORES DE TURMA:', diretoresTurma.length, 'registros');
    diretoresTurma.forEach(diretor => {
      console.log('  -', diretor.tb_professores?.nome, '→', diretor.tb_turmas?.designacao, '(', diretor.tb_anos_lectivos?.designacao, ')');
    });
    
    // Atribuições Professor-Disciplina
    const atribuicoesDisciplinas = await prisma.tb_professor_disciplina.findMany();
    console.log('\n📚 ATRIBUIÇÕES DISCIPLINAS:', atribuicoesDisciplinas.length, 'registros');
    
    // Atribuições Professor-Turma
    const atribuicoesTurmas = await prisma.tb_professor_turma.findMany();
    console.log('👥 ATRIBUIÇÕES TURMAS:', atribuicoesTurmas.length, 'registros');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verificarDados();
