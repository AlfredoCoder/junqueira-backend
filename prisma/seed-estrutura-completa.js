import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed da estrutura completa...');

  // 1. TIPOS DE UTILIZADOR
  console.log('👥 Criando tipos de utilizador...');
  const tiposUtilizador = [
    { codigo: 1, designacao: 'Administrador' },
    { codigo: 2, designacao: 'Professor' },
    { codigo: 3, designacao: 'Aluno' },
    { codigo: 4, designacao: 'Operador' },
    { codigo: 5, designacao: 'Secretaria' },
    { codigo: 6, designacao: 'Diretor' }
  ];

  for (const tipo of tiposUtilizador) {
    await prisma.tb_tipos_utilizador.upsert({
      where: { codigo: tipo.codigo },
      update: {},
      create: tipo
    });
  }
  console.log(`✅ Tipos de utilizador criados: ${tiposUtilizador.length}`);

  // 2. STATUS
  console.log('📊 Criando status...');
  const statusList = [
    { codigo: 1, designacao: 'Activo', tipoStatus: 1 },
    { codigo: 2, designacao: 'Inactivo', tipoStatus: 1 },
    { codigo: 3, designacao: 'Pendente', tipoStatus: 1 },
    { codigo: 4, designacao: 'Suspenso', tipoStatus: 1 },
    { codigo: 5, designacao: 'Cancelado', tipoStatus: 1 }
  ];

  for (const status of statusList) {
    await prisma.tb_status.upsert({
      where: { codigo: status.codigo },
      update: {},
      create: status
    });
  }
  console.log(`✅ Status criados: ${statusList.length}`);

  // 3. NACIONALIDADES
  console.log('🌍 Criando nacionalidades...');
  const nacionalidades = [
    { codigo: 1, designacao: 'Angolana' },
    { codigo: 2, designacao: 'Portuguesa' },
    { codigo: 3, designacao: 'Brasileira' },
    { codigo: 4, designacao: 'Cabo-verdiana' },
    { codigo: 5, designacao: 'São-tomense' },
    { codigo: 6, designacao: 'Moçambicana' },
    { codigo: 7, designacao: 'Congolesa' },
    { codigo: 8, designacao: 'Outra' }
  ];

  for (const nacionalidade of nacionalidades) {
    await prisma.tb_nacionalidades.upsert({
      where: { codigo: nacionalidade.codigo },
      update: {},
      create: nacionalidade
    });
  }
  console.log(`✅ Nacionalidades criadas: ${nacionalidades.length}`);

  // 4. PROVÍNCIAS
  console.log('🏛️ Criando províncias...');
  const provincias = [
    { codigo: 1, designacao: 'Luanda' },
    { codigo: 2, designacao: 'Bengo' },
    { codigo: 3, designacao: 'Benguela' },
    { codigo: 4, designacao: 'Bié' },
    { codigo: 5, designacao: 'Cabinda' },
    { codigo: 6, designacao: 'Cuando Cubango' },
    { codigo: 7, designacao: 'Cuanza Norte' },
    { codigo: 8, designacao: 'Cuanza Sul' },
    { codigo: 9, designacao: 'Cunene' },
    { codigo: 10, designacao: 'Huambo' },
    { codigo: 11, designacao: 'Huíla' },
    { codigo: 12, designacao: 'Lunda Norte' },
    { codigo: 13, designacao: 'Lunda Sul' },
    { codigo: 14, designacao: 'Malanje' },
    { codigo: 15, designacao: 'Moxico' },
    { codigo: 16, designacao: 'Namibe' },
    { codigo: 17, designacao: 'Uíge' },
    { codigo: 18, designacao: 'Zaire' }
  ];

  for (const provincia of provincias) {
    await prisma.tb_provincias.upsert({
      where: { codigo: provincia.codigo },
      update: {},
      create: provincia
    });
  }
  console.log(`✅ Províncias criadas: ${provincias.length}`);

  // 5. MUNICÍPIOS DE LUANDA
  console.log('🏘️ Criando municípios de Luanda...');
  const municipios = [
    { codigo: 1, designacao: 'Luanda', codigo_Provincia: 1 },
    { codigo: 2, designacao: 'Belas', codigo_Provincia: 1 },
    { codigo: 3, designacao: 'Cacuaco', codigo_Provincia: 1 },
    { codigo: 4, designacao: 'Cazenga', codigo_Provincia: 1 },
    { codigo: 5, designacao: 'Icolo e Bengo', codigo_Provincia: 1 },
    { codigo: 6, designacao: 'Kilamba Kiaxi', codigo_Provincia: 1 },
    { codigo: 7, designacao: 'Quiçama', codigo_Provincia: 1 },
    { codigo: 8, designacao: 'Talatona', codigo_Provincia: 1 },
    { codigo: 9, designacao: 'Viana', codigo_Provincia: 1 }
  ];

  for (const municipio of municipios) {
    await prisma.tb_municipios.upsert({
      where: { codigo: municipio.codigo },
      update: {},
      create: municipio
    });
  }
  console.log(`✅ Municípios criados: ${municipios.length}`);

  // 6. COMUNAS DE LUANDA
  console.log('🏠 Criando comunas de Luanda...');
  const comunas = [
    // Município de Luanda
    { codigo: 1, designacao: 'Ingombota', codigo_Municipio: 1 },
    { codigo: 2, designacao: 'Maianga', codigo_Municipio: 1 },
    { codigo: 3, designacao: 'Rangel', codigo_Municipio: 1 },
    { codigo: 4, designacao: 'Samba', codigo_Municipio: 1 },
    { codigo: 5, designacao: 'Sambizanga', codigo_Municipio: 1 },
    // Município de Belas
    { codigo: 6, designacao: 'Belas', codigo_Municipio: 2 },
    { codigo: 7, designacao: 'Ramiros', codigo_Municipio: 2 },
    // Município de Cacuaco
    { codigo: 8, designacao: 'Cacuaco', codigo_Municipio: 3 },
    { codigo: 9, designacao: 'Funda', codigo_Municipio: 3 },
    // Município de Cazenga
    { codigo: 10, designacao: 'Cazenga', codigo_Municipio: 4 },
    // Município de Viana
    { codigo: 11, designacao: 'Viana', codigo_Municipio: 9 },
    { codigo: 12, designacao: 'Calumbo', codigo_Municipio: 9 }
  ];

  for (const comuna of comunas) {
    await prisma.tb_comunas.upsert({
      where: { codigo: comuna.codigo },
      update: {},
      create: comuna
    });
  }
  console.log(`✅ Comunas criadas: ${comunas.length}`);

  // 7. PROFISSÕES
  console.log('💼 Criando profissões...');
  const profissoes = [
    { codigo: 1, designacao: 'Professor' },
    { codigo: 2, designacao: 'Médico' },
    { codigo: 3, designacao: 'Enfermeiro' },
    { codigo: 4, designacao: 'Engenheiro' },
    { codigo: 5, designacao: 'Advogado' },
    { codigo: 6, designacao: 'Contador' },
    { codigo: 7, designacao: 'Comerciante' },
    { codigo: 8, designacao: 'Funcionário Público' },
    { codigo: 9, designacao: 'Empresário' },
    { codigo: 10, designacao: 'Técnico' },
    { codigo: 11, designacao: 'Motorista' },
    { codigo: 12, designacao: 'Doméstica' },
    { codigo: 13, designacao: 'Agricultor' },
    { codigo: 14, designacao: 'Mecânico' },
    { codigo: 15, designacao: 'Electricista' },
    { codigo: 16, designacao: 'Carpinteiro' },
    { codigo: 17, designacao: 'Pedreiro' },
    { codigo: 18, designacao: 'Vendedor' },
    { codigo: 19, designacao: 'Desempregado' },
    { codigo: 20, designacao: 'Outros' }
  ];

  for (const profissao of profissoes) {
    await prisma.tb_profissao.upsert({
      where: { codigo: profissao.codigo },
      update: {},
      create: profissao
    });
  }
  console.log(`✅ Profissões criadas: ${profissoes.length}`);

  // 8. ESTADO CIVIL
  console.log('💑 Criando estados civis...');
  const estadosCivis = [
    { codigo: 1, designacao: 'Solteiro(a)' },
    { codigo: 2, designacao: 'Casado(a)' },
    { codigo: 3, designacao: 'Divorciado(a)' },
    { codigo: 4, designacao: 'Viúvo(a)' },
    { codigo: 5, designacao: 'União de Facto' }
  ];

  for (const estado of estadosCivis) {
    await prisma.tb_estado_civil.upsert({
      where: { codigo: estado.codigo },
      update: {},
      create: estado
    });
  }
  console.log(`✅ Estados civis criados: ${estadosCivis.length}`);

  // 9. TIPOS DE DOCUMENTO
  console.log('📄 Criando tipos de documento...');
  const tiposDocumento = [
    { codigo: 1, designacao: 'Bilhete de Identidade' },
    { codigo: 2, designacao: 'Passaporte' },
    { codigo: 3, designacao: 'Certidão de Nascimento' },
    { codigo: 4, designacao: 'Cartão de Eleitor' },
    { codigo: 5, designacao: 'Outros' }
  ];

  for (const tipo of tiposDocumento) {
    await prisma.tb_tipo_documento.upsert({
      where: { codigo: tipo.codigo },
      update: {},
      create: tipo
    });
  }
  console.log(`✅ Tipos de documento criados: ${tiposDocumento.length}`);

  console.log('\n🎉 ESTRUTURA COMPLETA CRIADA COM SUCESSO!');
  console.log('\n📊 RESUMO:');
  console.log(`👥 Tipos de Utilizador: ${tiposUtilizador.length}`);
  console.log(`📊 Status: ${statusList.length}`);
  console.log(`🌍 Nacionalidades: ${nacionalidades.length}`);
  console.log(`🏛️ Províncias: ${provincias.length}`);
  console.log(`🏘️ Municípios: ${municipios.length}`);
  console.log(`🏠 Comunas: ${comunas.length}`);
  console.log(`💼 Profissões: ${profissoes.length}`);
  console.log(`💑 Estados Civis: ${estadosCivis.length}`);
  console.log(`📄 Tipos de Documento: ${tiposDocumento.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
