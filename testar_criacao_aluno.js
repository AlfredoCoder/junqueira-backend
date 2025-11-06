import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testarCriacaoAluno() {
  console.log('🧪 Testando criação de aluno...\n');

  try {
    // Dados de teste similares aos do frontend
    const dadosAluno = {
      nome: "João Silva Santos",
      pai: "António Silva",
      mae: "Maria Santos",
      sexo: "M",
      dataNascimento: new Date("2005-06-15"),
      telefone: "923456789",
      email: "joao.silva@email.com",
      morada: "Rua da Paz, 123",
      codigo_Nacionalidade: 1,    // Angolana
      codigo_Estado_Civil: 1,     // Solteiro(a)
      codigo_Comuna: 1,           // Ingombota
      codigoTipoDocumento: 1,     // Bilhete de Identidade
      codigo_Status: 1,           // Ativo
      saldo: 0,
      n_documento_identificacao: "123456789LA041",
      encarregado: {
        nome: "Maria Santos Silva",
        telefone: "912345678",
        email: "maria.santos@email.com",
        codigo_Profissao: 28,     // Funcionário(a) Público(a)
        local_Trabalho: "Ministério da Educação",
        status: 1
      }
    };

    console.log('📤 Dados do aluno:');
    console.log(JSON.stringify(dadosAluno, null, 2));

    // Verificar se as referências existem
    console.log('\n🔍 Verificando referências...');
    
    const nacionalidade = await prisma.tb_nacionalidades.findUnique({
      where: { codigo: dadosAluno.codigo_Nacionalidade }
    });
    console.log(`   Nacionalidade: ${nacionalidade ? nacionalidade.designacao : 'NÃO ENCONTRADA'}`);

    const estadoCivil = await prisma.tb_estado_civil.findUnique({
      where: { codigo: dadosAluno.codigo_Estado_Civil }
    });
    console.log(`   Estado Civil: ${estadoCivil ? estadoCivil.designacao : 'NÃO ENCONTRADO'}`);

    const comuna = await prisma.tb_comunas.findUnique({
      where: { codigo: dadosAluno.codigo_Comuna }
    });
    console.log(`   Comuna: ${comuna ? comuna.designacao : 'NÃO ENCONTRADA'}`);

    const tipoDoc = await prisma.tb_tipo_documento.findUnique({
      where: { codigo: dadosAluno.codigoTipoDocumento }
    });
    console.log(`   Tipo Documento: ${tipoDoc ? tipoDoc.designacao : 'NÃO ENCONTRADO'}`);

    const profissao = await prisma.tb_profissao.findUnique({
      where: { codigo: dadosAluno.encarregado.codigo_Profissao }
    });
    console.log(`   Profissão: ${profissao ? profissao.designacao : 'NÃO ENCONTRADA'}`);

    const status = await prisma.tb_status.findUnique({
      where: { codigo: dadosAluno.codigo_Status }
    });
    console.log(`   Status: ${status ? status.designacao : 'NÃO ENCONTRADO'}`);

    console.log('\n✅ Todas as referências verificadas!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
testarCriacaoAluno();
