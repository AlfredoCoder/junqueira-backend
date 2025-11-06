import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategorias() {
  console.log('📚 Iniciando seed das categorias de serviços...');

  try {
    // Verificar se já existem categorias
    const existingCategorias = await prisma.tb_categoria_servicos.findMany();
    
    if (existingCategorias.length > 0) {
      console.log('✅ Categorias já existem no banco:', existingCategorias.length);
      return;
    }

    // Criar categorias de serviços do sistema
    const categorias = [
      { codigo: 1, designacao: 'Propina' },
      { codigo: 2, designacao: 'Matricula' },
      { codigo: 3, designacao: 'Confirmacao' },
      { codigo: 4, designacao: 'Uniformes' },
      { codigo: 5, designacao: 'Folhas de prova' },
      { codigo: 6, designacao: 'Declaracao' },
      { codigo: 7, designacao: 'Certificado' },
      { codigo: 8, designacao: 'Diploma' },
      { codigo: 9, designacao: 'Cartao de escola' },
      { codigo: 10, designacao: 'Justifivo' },
      { codigo: 11, designacao: 'Boletim de notas' },
      { codigo: 12, designacao: 'Saidas extra escolares' }
    ];

    for (const categoria of categorias) {
      await prisma.tb_categoria_servicos.create({
        data: {
          designacao: categoria.designacao
        }
      });
      console.log(`✅ Categoria criada: ${categoria.designacao}`);
    }

    console.log('🎉 Seed das categorias concluído com sucesso!');
    
    // Verificar categorias criadas
    const categoriasCriadas = await prisma.tb_categoria_servicos.findMany();
    console.log('📊 Total de categorias no banco:', categoriasCriadas.length);
    categoriasCriadas.forEach(categoria => {
      console.log(`   - Código ${categoria.codigo}: ${categoria.designacao}`);
    });

  } catch (error) {
    console.error('❌ Erro no seed das categorias:', error);
    throw error;
  }
}

// Executar seed
seedCategorias()
  .then(() => {
    console.log('✅ Seed das categorias finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro fatal no seed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

export { seedCategorias };
