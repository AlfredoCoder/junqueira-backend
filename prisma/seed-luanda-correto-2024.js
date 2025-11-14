import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Corrigindo dados geográficos de Luanda (estrutura correta)...');

  // MUNICÍPIOS DE LUANDA CORRETOS
  console.log('🏘️ Criando municípios corretos de Luanda...');
  const municipiosLuanda = [
    { codigo: 1, designacao: 'Luanda', codigo_Provincia: 1 },
    { codigo: 2, designacao: 'Belas', codigo_Provincia: 1 },
    { codigo: 3, designacao: 'Cazenga', codigo_Provincia: 1 },
    { codigo: 4, designacao: 'Viana', codigo_Provincia: 1 },
    { codigo: 5, designacao: 'Cacuaco', codigo_Provincia: 1 },
    { codigo: 6, designacao: 'Icolo e Bengo', codigo_Provincia: 1 },
    { codigo: 7, designacao: 'Quissama', codigo_Provincia: 1 },
    { codigo: 8, designacao: 'Talatona', codigo_Provincia: 1 }
  ];

  for (const municipio of municipiosLuanda) {
    await prisma.tb_municipios.upsert({
      where: { codigo: municipio.codigo },
      update: { 
        designacao: municipio.designacao,
        codigo_Provincia: municipio.codigo_Provincia 
      },
      create: municipio
    });
  }
  console.log(`✅ Municípios de Luanda criados: ${municipiosLuanda.length}`);

  // COMUNAS DE LUANDA CORRETAS
  console.log('🏠 Criando comunas corretas de Luanda...');
  
  const comunasLuanda = [
    // Município de Luanda (codigo: 1)
    { codigo: 1, designacao: 'Mutamba', codigo_Municipio: 1 },
    { codigo: 2, designacao: 'Maianga', codigo_Municipio: 1 },
    { codigo: 3, designacao: 'Ingombota', codigo_Municipio: 1 },
    { codigo: 4, designacao: 'Samba', codigo_Municipio: 1 },
    { codigo: 5, designacao: 'Neves Bendinha', codigo_Municipio: 1 },
    { codigo: 6, designacao: 'Ngola Kiluange', codigo_Municipio: 1 },

    // Município de Belas (codigo: 2)
    { codigo: 7, designacao: 'Camama', codigo_Municipio: 2 },
    { codigo: 8, designacao: 'Talatona', codigo_Municipio: 2 },
    { codigo: 9, designacao: 'Kilamba', codigo_Municipio: 2 },
    { codigo: 10, designacao: 'Benfica', codigo_Municipio: 2 },
    { codigo: 11, designacao: 'Ramiro', codigo_Municipio: 2 },
    { codigo: 12, designacao: 'Mussulo', codigo_Municipio: 2 },

    // Município de Cazenga (codigo: 3)
    { codigo: 13, designacao: 'Cuca', codigo_Municipio: 3 },
    { codigo: 14, designacao: 'Cazenga', codigo_Municipio: 3 },
    { codigo: 15, designacao: 'Kalawenda', codigo_Municipio: 3 },
    { codigo: 16, designacao: 'Hoji-yha-henda', codigo_Municipio: 3 },
    { codigo: 17, designacao: 'Kima-kienda', codigo_Municipio: 3 },

    // Município de Viana (codigo: 4)
    { codigo: 18, designacao: 'Grafanil', codigo_Municipio: 4 },
    { codigo: 19, designacao: 'Estagem', codigo_Municipio: 4 },
    { codigo: 20, designacao: 'Zango', codigo_Municipio: 4 },
    { codigo: 21, designacao: 'Kikuxi', codigo_Municipio: 4 },

    // Município de Cacuaco (codigo: 5)
    { codigo: 22, designacao: 'Mercado do Quicolo', codigo_Municipio: 5 },
    { codigo: 23, designacao: 'Centralidade do Sequele', codigo_Municipio: 5 },

    // Município de Icolo e Bengo (codigo: 6)
    { codigo: 24, designacao: 'Lagoa da Quiminha', codigo_Municipio: 6 },
    { codigo: 25, designacao: 'Distrito urbano Bom Jesus do Kwanza', codigo_Municipio: 6 },
    { codigo: 26, designacao: 'Centralidade do Km 44', codigo_Municipio: 6 },
    { codigo: 27, designacao: 'Caculo', codigo_Municipio: 6 },
    { codigo: 28, designacao: 'Cahango', codigo_Municipio: 6 },

    // Município de Quissama (codigo: 7)
    { codigo: 29, designacao: 'Parque Nacional da Quissama', codigo_Municipio: 7 },
    { codigo: 30, designacao: 'Comuna da Múxima', codigo_Municipio: 7 },
    { codigo: 31, designacao: 'Cabo Ledo', codigo_Municipio: 7 },
    { codigo: 32, designacao: 'Demba Chio', codigo_Municipio: 7 },
    { codigo: 33, designacao: 'Quixinge', codigo_Municipio: 7 },

    // Município de Talatona (codigo: 8)
    { codigo: 34, designacao: 'Benfica', codigo_Municipio: 8 },
    { codigo: 35, designacao: 'Futungo de Belas', codigo_Municipio: 8 },
    { codigo: 36, designacao: 'Lar do Patriota', codigo_Municipio: 8 },
    { codigo: 37, designacao: 'Talatona', codigo_Municipio: 8 },
    { codigo: 38, designacao: 'Camama', codigo_Municipio: 8 },
    { codigo: 39, designacao: 'Cidade Universitária', codigo_Municipio: 8 }
  ];

  for (const comuna of comunasLuanda) {
    await prisma.tb_comunas.upsert({
      where: { codigo: comuna.codigo },
      update: { 
        designacao: comuna.designacao,
        codigo_Municipio: comuna.codigo_Municipio 
      },
      create: comuna
    });
  }
  console.log(`✅ Comunas de Luanda criadas: ${comunasLuanda.length}`);

  console.log('✅ Correção dos dados geográficos de Luanda concluída!');
  console.log('📊 Resumo:');
  console.log(`   • 8 Municípios: Luanda, Belas, Cazenga, Viana, Cacuaco, Icolo e Bengo, Quissama, Talatona`);
  console.log(`   • 39 Comunas distribuídas pelos municípios`);
  console.log(`   • Mussulo corrigido como comuna de Belas (não município)`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao corrigir dados geográficos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
