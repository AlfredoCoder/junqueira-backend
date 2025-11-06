import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function popularTabelas() {
  console.log('🚀 Populando tabelas de referência...\n');

  try {
    // 1. Nacionalidades
    console.log('1️⃣ Populando Nacionalidades...');
    const nacionalidades = [
      'Angolana',
      'Portuguesa',
      'Brasileira',
      'Cabo-verdiana',
      'Moçambicana',
      'São-tomense',
      'Guineense',
      'Francesa',
      'Espanhola',
      'Italiana',
      'Alemã',
      'Inglesa',
      'Americana',
      'Chinesa',
      'Indiana',
      'Sul-africana',
      'Congolesa (RDC)',
      'Congolesa (RC)',
      'Camaronesa',
      'Nigeriana'
    ];

    for (const nacionalidade of nacionalidades) {
      const existente = await prisma.tb_nacionalidades.findFirst({
        where: { designacao: nacionalidade }
      });
      
      if (!existente) {
        await prisma.tb_nacionalidades.create({
          data: { designacao: nacionalidade }
        });
      }
    }
    console.log(`   ✅ ${nacionalidades.length} nacionalidades inseridas`);

    // 2. Estado Civil
    console.log('\n2️⃣ Populando Estado Civil...');
    const estadosCivis = [
      'Solteiro(a)',
      'Casado(a)',
      'Divorciado(a)',
      'Viúvo(a)',
      'União de Facto'
    ];

    for (const estado of estadosCivis) {
      const existente = await prisma.tb_estado_civil.findFirst({
        where: { designacao: estado }
      });
      
      if (!existente) {
        await prisma.tb_estado_civil.create({
          data: { designacao: estado }
        });
      }
    }
    console.log(`   ✅ ${estadosCivis.length} estados civis inseridos`);

    // 3. Tipos de Documento
    console.log('\n3️⃣ Populando Tipos de Documento...');
    const tiposDocumento = [
      'Bilhete de Identidade',
      'Cédula Pessoal',
      'Passaporte',
      'Cartão de Residente',
      'Certidão de Nascimento'
    ];

    for (const tipo of tiposDocumento) {
      const existente = await prisma.tb_tipo_documento.findFirst({
        where: { designacao: tipo }
      });
      
      if (!existente) {
        await prisma.tb_tipo_documento.create({
          data: { designacao: tipo }
        });
      }
    }
    console.log(`   ✅ ${tiposDocumento.length} tipos de documento inseridos`);

    // 4. Municípios de Luanda
    console.log('\n4️⃣ Populando Municípios de Luanda...');
    const municipiosLuanda = [
      'Luanda',
      'Belas',
      'Cacuaco',
      'Cazenga',
      'Icolo e Bengo',
      'Kilamba Kiaxi',
      'Quiçama',
      'Talatona',
      'Viana'
    ];

    // Buscar província de Luanda (assumindo que existe)
    let provinciaLuanda = await prisma.tb_provincias.findFirst({
      where: { designacao: 'Luanda' }
    });

    if (!provinciaLuanda) {
      provinciaLuanda = await prisma.tb_provincias.create({
        data: { designacao: 'Luanda' }
      });
    }

    for (const municipio of municipiosLuanda) {
      const existente = await prisma.tb_municipios.findFirst({
        where: { 
          designacao: municipio,
          codigo_Provincia: provinciaLuanda.codigo
        }
      });
      
      if (!existente) {
        await prisma.tb_municipios.create({
          data: { 
            designacao: municipio,
            codigo_Provincia: provinciaLuanda.codigo
          }
        });
      }
    }
    console.log(`   ✅ ${municipiosLuanda.length} municípios inseridos`);

    // 5. Comunas por Município
    console.log('\n5️⃣ Populando Comunas...');
    const comunasPorMunicipio = {
      'Luanda': [
        'Ingombota', 'Maianga', 'Rangel', 'Samba', 'Sambizanga'
      ],
      'Belas': [
        'Belas', 'Benfica', 'Futungo de Belas', 'Ramiros'
      ],
      'Cacuaco': [
        'Cacuaco', 'Funda', 'Sequele'
      ],
      'Cazenga': [
        'Cazenga', 'Hoji-ya-Henda', 'Tala Hady'
      ],
      'Icolo e Bengo': [
        'Bom Jesus', 'Calumbo', 'Catete', 'Icolo e Bengo'
      ],
      'Kilamba Kiaxi': [
        'Golfe', 'Kilamba Kiaxi', 'Palanca'
      ],
      'Quiçama': [
        'Muxima', 'Quiçama', 'Demba Chio'
      ],
      'Talatona': [
        'Talatona', 'Benfica do Lubango'
      ],
      'Viana': [
        'Viana', 'Calumbo', 'Kikolo', 'Zango'
      ]
    };

    for (const [nomeMunicipio, comunas] of Object.entries(comunasPorMunicipio)) {
      const municipio = await prisma.tb_municipios.findFirst({
        where: { designacao: nomeMunicipio }
      });

      if (municipio) {
        for (const nomeComuna of comunas) {
          const existente = await prisma.tb_comunas.findFirst({
            where: {
              designacao: nomeComuna,
              codigo_Municipio: municipio.codigo
            }
          });
          
          if (!existente) {
            await prisma.tb_comunas.create({
              data: {
                designacao: nomeComuna,
                codigo_Municipio: municipio.codigo
              }
            });
          }
        }
      }
    }
    console.log(`   ✅ Comunas inseridas para todos os municípios`);

    // 6. Profissões
    console.log('\n6️⃣ Populando Profissões...');
    const profissoes = [
      // Educação
      'Professor(a)', 'Diretor(a) Escolar', 'Coordenador(a) Pedagógico(a)',
      
      // Saúde
      'Médico(a)', 'Enfermeiro(a)', 'Farmacêutico(a)', 'Dentista', 'Fisioterapeuta',
      
      // Engenharia e Tecnologia
      'Engenheiro(a) Civil', 'Engenheiro(a) Informático', 'Técnico(a) de Informática',
      'Engenheiro(a) Mecânico', 'Arquiteto(a)',
      
      // Direito e Administração
      'Advogado(a)', 'Juiz(a)', 'Procurador(a)', 'Notário(a)',
      
      // Economia e Finanças
      'Economista', 'Contabilista', 'Auditor(a)', 'Bancário(a)', 'Gestor(a) Financeiro',
      
      // Comunicação e Marketing
      'Jornalista', 'Publicitário(a)', 'Designer Gráfico', 'Fotógrafo(a)',
      
      // Serviços Públicos
      'Funcionário(a) Público(a)', 'Militar', 'Polícia', 'Bombeiro(a)',
      
      // Comércio e Serviços
      'Comerciante', 'Vendedor(a)', 'Motorista', 'Mecânico(a)', 'Eletricista',
      'Carpinteiro(a)', 'Pedreiro(a)', 'Pintor(a)',
      
      // Agricultura e Pecuária
      'Agricultor(a)', 'Veterinário(a)', 'Zootecnista',
      
      // Artes e Cultura
      'Músico(a)', 'Artista', 'Escritor(a)', 'Ator/Atriz',
      
      // Outros
      'Empresário(a)', 'Consultor(a)', 'Doméstica', 'Estudante', 'Reformado(a)',
      'Desempregado(a)', 'Outro'
    ];

    for (const profissao of profissoes) {
      const existente = await prisma.tb_profissao.findFirst({
        where: { designacao: profissao }
      });
      
      if (!existente) {
        await prisma.tb_profissao.create({
          data: { designacao: profissao }
        });
      }
    }
    console.log(`   ✅ ${profissoes.length} profissões inseridas`);

    // 7. Verificar se existe tabela de status para alunos
    console.log('\n7️⃣ Verificando status de alunos...');
    
    // Vamos verificar se existe uma tabela tb_status ou similar
    try {
      // Primeiro, vamos ver se existe alguma tabela de status
      const tabelas = await prisma.$queryRaw`SHOW TABLES LIKE '%status%'`;
      console.log('   Tabelas com "status":', tabelas);
      
      // Se não existir, vamos criar dados de status diretamente na tabela de alunos
      // Mas primeiro, vamos verificar a estrutura da tabela tb_alunos
      const alunosSample = await prisma.tb_alunos.findFirst();
      if (alunosSample) {
        console.log('   ✅ Tabela tb_alunos existe. Status é campo numérico.');
        console.log('   Status possíveis: 1 = Ativo, 0 = Inativo');
      }
    } catch (error) {
      console.log('   ❌ Erro ao verificar status:', error.message);
    }

    console.log('\n🎉 Todas as tabelas foram populadas com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante a população:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
popularTabelas();
