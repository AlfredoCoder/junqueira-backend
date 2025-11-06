import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificarUsuarioAluno() {
  console.log('🔍 Verificando usuário criado para aluno...\n');

  try {
    // Buscar o aluno Ana Maria Fernandes
    const aluno = await prisma.tb_alunos.findFirst({
      where: { nome: 'Ana Maria Fernandes' },
      include: {
        tb_utilizadores: {
          select: {
            codigo: true,
            nome: true,
            user: true,
            codigo_Tipo_Utilizador: true,
            codigo_Aluno: true,
            estadoActual: true
          }
        }
      }
    });

    if (aluno) {
      console.log('✅ Aluno encontrado:');
      console.log(`   Código: ${aluno.codigo}`);
      console.log(`   Nome: ${aluno.nome}`);
      console.log(`   Código Utilizador: ${aluno.codigo_Utilizador}`);
      
      if (aluno.tb_utilizadores) {
        console.log('\n✅ Usuário associado encontrado:');
        console.log(`   Código: ${aluno.tb_utilizadores.codigo}`);
        console.log(`   Nome: ${aluno.tb_utilizadores.nome}`);
        console.log(`   Username: ${aluno.tb_utilizadores.user}`);
        console.log(`   Tipo: ${aluno.tb_utilizadores.codigo_Tipo_Utilizador}`);
        console.log(`   Código Aluno: ${aluno.tb_utilizadores.codigo_Aluno}`);
        console.log(`   Estado: ${aluno.tb_utilizadores.estadoActual}`);
      } else {
        console.log('\n❌ Usuário associado NÃO encontrado');
      }

      // Verificar relacionamento inverso
      const usuario = await prisma.tb_utilizadores.findUnique({
        where: { codigo: aluno.codigo_Utilizador },
        include: {
          aluno: {
            select: {
              codigo: true,
              nome: true
            }
          }
        }
      });

      if (usuario && usuario.aluno) {
        console.log('\n✅ Relacionamento 1:1 confirmado:');
        console.log(`   Usuário ${usuario.user} → Aluno ${usuario.aluno.nome}`);
      } else {
        console.log('\n⚠️  Relacionamento 1:1 não encontrado');
      }

    } else {
      console.log('❌ Aluno não encontrado');
    }

    console.log('\n✅ Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
verificarUsuarioAluno();
