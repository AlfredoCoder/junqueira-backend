import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificarEstrutura() {
  console.log('🔍 Verificando estrutura real da tabela tb_alunos...\n');

  try {
    // Consultar estrutura da tabela diretamente no MySQL
    const estrutura = await prisma.$queryRaw`DESCRIBE tb_alunos`;
    
    console.log('📋 Estrutura da tabela tb_alunos:');
    console.log('Field | Type | Null | Key | Default | Extra');
    console.log('------|------|------|-----|---------|------');
    
    estrutura.forEach(campo => {
      console.log(`${campo.Field} | ${campo.Type} | ${campo.Null} | ${campo.Key || ''} | ${campo.Default || ''} | ${campo.Extra || ''}`);
    });

    // Verificar se existe campo Codigo_Utilizador
    const campoUtilizador = estrutura.find(campo => 
      campo.Field === 'Codigo_Utilizador' || 
      campo.Field === 'codigo_Utilizador'
    );

    if (campoUtilizador) {
      console.log('\n⚠️  ENCONTRADO campo Codigo_Utilizador:');
      console.log(`   Nome: ${campoUtilizador.Field}`);
      console.log(`   Tipo: ${campoUtilizador.Type}`);
      console.log(`   Null: ${campoUtilizador.Null}`);
      console.log(`   Default: ${campoUtilizador.Default}`);
    } else {
      console.log('\n✅ Campo Codigo_Utilizador NÃO encontrado na tabela');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar estrutura:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
verificarEstrutura();
