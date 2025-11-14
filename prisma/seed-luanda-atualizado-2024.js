import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Atualizando dados geográficos de Luanda (2024)...');

  // MUNICÍPIOS DE LUANDA ATUALIZADOS (2024)
  // Baseado na Lei n.º 14/24 - Nova Divisão Político-Administrativa
  console.log('🏘️ Atualizando municípios de Luanda...');
  const municipiosLuanda = [
    { codigo: 1, designacao: 'Belas', codigo_Provincia: 1 },
    { codigo: 2, designacao: 'Cacuaco', codigo_Provincia: 1 },
    { codigo: 3, designacao: 'Camama', codigo_Provincia: 1 },
    { codigo: 4, designacao: 'Cazenga', codigo_Provincia: 1 },
    { codigo: 5, designacao: 'Hoji-ya-Henda', codigo_Provincia: 1 },
    { codigo: 6, designacao: 'Ingombota', codigo_Provincia: 1 },
    { codigo: 7, designacao: 'Kilamba', codigo_Provincia: 1 },
    { codigo: 8, designacao: 'Kilamba Kiaxi', codigo_Provincia: 1 },
    { codigo: 9, designacao: 'Maianga', codigo_Provincia: 1 },
    { codigo: 10, designacao: 'Mulenvos', codigo_Provincia: 1 },
    { codigo: 11, designacao: 'Mussulo', codigo_Provincia: 1 },
    { codigo: 12, designacao: 'Rangel', codigo_Provincia: 1 },
    { codigo: 13, designacao: 'Samba', codigo_Provincia: 1 },
    { codigo: 14, designacao: 'Sambizanga', codigo_Provincia: 1 },
    { codigo: 15, designacao: 'Talatona', codigo_Provincia: 1 },
    { codigo: 16, designacao: 'Viana', codigo_Provincia: 1 }
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
  console.log(`✅ Municípios de Luanda atualizados: ${municipiosLuanda.length}`);

  // COMUNAS DE LUANDA ATUALIZADAS (2024)
  console.log('🏠 Atualizando comunas de Luanda...');
  const comunasLuanda = [
    // Município de Belas
    { codigo: 1, designacao: 'Belas', codigo_Municipio: 1 },
    { codigo: 2, designacao: 'Benfica', codigo_Municipio: 1 },
    { codigo: 3, designacao: 'Ramiros', codigo_Municipio: 1 },
    { codigo: 4, designacao: 'Lar do Patriota', codigo_Municipio: 1 },

    // Município de Cacuaco
    { codigo: 5, designacao: 'Cacuaco', codigo_Municipio: 2 },
    { codigo: 6, designacao: 'Funda', codigo_Municipio: 2 },
    { codigo: 7, designacao: 'Sequele', codigo_Municipio: 2 },

    // Município de Camama
    { codigo: 8, designacao: 'Camama', codigo_Municipio: 3 },
    { codigo: 9, designacao: 'Estalagem', codigo_Municipio: 3 },

    // Município de Cazenga
    { codigo: 10, designacao: 'Cazenga', codigo_Municipio: 4 },
    { codigo: 11, designacao: 'Tala Hady', codigo_Municipio: 4 },
    { codigo: 12, designacao: 'Hoji-ya-Henda', codigo_Municipio: 4 },

    // Município de Hoji-ya-Henda
    { codigo: 13, designacao: 'Hoji-ya-Henda', codigo_Municipio: 5 },

    // Município de Ingombota
    { codigo: 14, designacao: 'Ingombota', codigo_Municipio: 6 },
    { codigo: 15, designacao: 'Patrice Lumumba', codigo_Municipio: 6 },

    // Município de Kilamba
    { codigo: 16, designacao: 'Kilamba', codigo_Municipio: 7 },

    // Município de Kilamba Kiaxi
    { codigo: 17, designacao: 'Kilamba Kiaxi', codigo_Municipio: 8 },
    { codigo: 18, designacao: 'Golf', codigo_Municipio: 8 },

    // Município de Maianga
    { codigo: 19, designacao: 'Maianga', codigo_Municipio: 9 },
    { codigo: 20, designacao: 'Alvalade', codigo_Municipio: 9 },

    // Município de Mulenvos
    { codigo: 21, designacao: 'Mulenvos', codigo_Municipio: 10 },

    // Município de Mussulo
    { codigo: 22, designacao: 'Mussulo', codigo_Municipio: 11 },

    // Município de Rangel
    { codigo: 23, designacao: 'Rangel', codigo_Municipio: 12 },
    { codigo: 24, designacao: 'Nelito Soares', codigo_Municipio: 12 },

    // Município de Samba
    { codigo: 25, designacao: 'Samba', codigo_Municipio: 13 },
    { codigo: 26, designacao: 'Corimba', codigo_Municipio: 13 },

    // Município de Sambizanga
    { codigo: 27, designacao: 'Sambizanga', codigo_Municipio: 14 },
    { codigo: 28, designacao: 'Ngola Kiluanje', codigo_Municipio: 14 },

    // Município de Talatona
    { codigo: 29, designacao: 'Talatona', codigo_Municipio: 15 },
    { codigo: 30, designacao: 'Bengo', codigo_Municipio: 15 },

    // Município de Viana
    { codigo: 31, designacao: 'Viana', codigo_Municipio: 16 },
    { codigo: 32, designacao: 'Calumbo', codigo_Municipio: 16 },
    { codigo: 33, designacao: 'Zango', codigo_Municipio: 16 }
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
  console.log(`✅ Comunas de Luanda atualizadas: ${comunasLuanda.length}`);

  console.log('✅ Atualização dos dados geográficos de Luanda concluída!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao atualizar dados geográficos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
