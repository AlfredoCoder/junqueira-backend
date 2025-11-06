import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificarDados() {
  console.log('🔍 Verificando dados das tabelas de referência...\n');

  try {
    // 1. Nacionalidades
    console.log('1️⃣ Nacionalidades:');
    const nacionalidades = await prisma.tb_nacionalidades.findMany();
    console.log(`   Total: ${nacionalidades.length}`);
    nacionalidades.forEach(n => console.log(`   - ${n.codigo}: ${n.designacao}`));

    // 2. Municípios
    console.log('\n2️⃣ Municípios:');
    const municipios = await prisma.tb_municipios.findMany();
    console.log(`   Total: ${municipios.length}`);
    municipios.forEach(m => console.log(`   - ${m.codigo}: ${m.designacao}`));

    // 3. Comunas
    console.log('\n3️⃣ Comunas:');
    const comunas = await prisma.tb_comunas.findMany();
    console.log(`   Total: ${comunas.length}`);
    comunas.forEach(c => console.log(`   - ${c.codigo}: ${c.designacao} (Município: ${c.codigo_Municipio})`));

    // 4. Tipo de Documento
    console.log('\n4️⃣ Tipos de Documento:');
    const tiposDoc = await prisma.tb_tipo_documento.findMany();
    console.log(`   Total: ${tiposDoc.length}`);
    tiposDoc.forEach(t => console.log(`   - ${t.codigo}: ${t.designacao}`));

    // 5. Profissões
    console.log('\n5️⃣ Profissões:');
    const profissoes = await prisma.tb_profissao.findMany();
    console.log(`   Total: ${profissoes.length}`);
    profissoes.forEach(p => console.log(`   - ${p.codigo}: ${p.designacao}`));

    // 6. Estado Civil
    console.log('\n6️⃣ Estado Civil:');
    const estadoCivil = await prisma.tb_estado_civil.findMany();
    console.log(`   Total: ${estadoCivil.length}`);
    estadoCivil.forEach(e => console.log(`   - ${e.codigo}: ${e.designacao}`));

    // 7. Status (verificar se existe tabela de status)
    console.log('\n7️⃣ Verificando tabela de Status...');
    try {
      const status = await prisma.tb_status.findMany();
      console.log(`   Total: ${status.length}`);
      status.forEach(s => console.log(`   - ${s.codigo}: ${s.designacao}`));
    } catch (error) {
      console.log('   ❌ Tabela tb_status não existe');
    }

    console.log('\n✅ Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
verificarDados();
