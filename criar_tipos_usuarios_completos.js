import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function criarTiposUsuariosCompletos() {
  console.log('🏷️  Criando tipos de usuários completos...\n');

  try {
    const tiposUsuario = [
      { designacao: 'Administrador' },
      { designacao: 'Professor' },
      { designacao: 'Aluno' },
      { designacao: 'Secretaria' },      // Secretária Administrativa
      { designacao: 'Diretor' },         // Diretor Pedagógico
      { designacao: 'Operador' }
    ];

    for (const tipo of tiposUsuario) {
      const tipoExistente = await prisma.tb_tipos_utilizador.findFirst({
        where: { designacao: tipo.designacao }
      });

      if (!tipoExistente) {
        const novoTipo = await prisma.tb_tipos_utilizador.create({
          data: tipo
        });
        console.log(`   ✅ Tipo criado: ${tipo.designacao} (ID: ${novoTipo.codigo})`);
      } else {
        console.log(`   ⚪ Tipo já existe: ${tipo.designacao} (ID: ${tipoExistente.codigo})`);
      }
    }

    // Verificar tipos criados
    console.log('\n📋 Tipos de usuário disponíveis:');
    const todosOsTipos = await prisma.tb_tipos_utilizador.findMany({
      orderBy: { codigo: 'asc' }
    });

    todosOsTipos.forEach(tipo => {
      console.log(`   ${tipo.codigo} - ${tipo.designacao}`);
    });

    console.log('\n✅ Tipos de usuário configurados com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
criarTiposUsuariosCompletos();
