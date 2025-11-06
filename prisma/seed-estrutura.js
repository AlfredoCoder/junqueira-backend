import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏗️ Criando estrutura acadêmica básica...');

  // 1. Criar cursos
  console.log('📚 Criando cursos...');
  const cursos = await prisma.tb_cursos.createMany({
    data: [
      { designacao: 'Ensino Geral', codigo_Status: 1 },
      { designacao: 'Ensino Técnico', codigo_Status: 1 },
      { designacao: 'Ensino Médio', codigo_Status: 1 }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Criados ${cursos.count} cursos`);

  // 2. Criar classes
  console.log('🎓 Criando classes...');
  const classes = await prisma.tb_classes.createMany({
    data: [
      { designacao: '10ª Classe', status: 1 },
      { designacao: '11ª Classe', status: 1 },
      { designacao: '12ª Classe', status: 1 },
      { designacao: '13ª Classe', status: 1 }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Criadas ${classes.count} classes`);

  // 3. Criar disciplinas
  console.log('📖 Criando disciplinas...');
  const disciplinas = await prisma.tb_disciplinas.createMany({
    data: [
      { designacao: 'Matemática', codigo_Curso: 1, status: 1 },
      { designacao: 'Português', codigo_Curso: 1, status: 1 },
      { designacao: 'Física', codigo_Curso: 1, status: 1 },
      { designacao: 'Química', codigo_Curso: 1, status: 1 },
      { designacao: 'Biologia', codigo_Curso: 1, status: 1 },
      { designacao: 'História', codigo_Curso: 1, status: 1 },
      { designacao: 'Geografia', codigo_Curso: 1, status: 1 },
      { designacao: 'Inglês', codigo_Curso: 1, status: 1 }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Criadas ${disciplinas.count} disciplinas`);

  // 4. Criar salas
  console.log('🏫 Criando salas...');
  const salas = await prisma.tb_salas.createMany({
    data: [
      { designacao: 'Sala A1' },
      { designacao: 'Sala A2' },
      { designacao: 'Sala B1' },
      { designacao: 'Sala B2' },
      { designacao: 'Laboratório de Física' },
      { designacao: 'Laboratório de Química' }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Criadas ${salas.count} salas`);

  // 5. Criar períodos
  console.log('⏰ Criando períodos...');
  const periodos = await prisma.tb_periodos.createMany({
    data: [
      { designacao: 'Manhã' },
      { designacao: 'Tarde' },
      { designacao: 'Noite' }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Criados ${periodos.count} períodos`);

  // 6. Criar ano letivo
  console.log('📅 Criando ano letivo...');
  const anoLectivo = await prisma.tb_ano_lectivo.createMany({
    data: [
      { 
        designacao: '2024', 
        mesInicial: 'Fevereiro',
        mesFinal: 'Novembro',
        anoInicial: '2024',
        anoFinal: '2024'
      }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Criado ${anoLectivo.count} ano letivo`);

  // 7. Criar turmas
  console.log('👥 Criando turmas...');
  const turmas = await prisma.tb_turmas.createMany({
    data: [
      { 
        designacao: 'Turma A - 10ª Classe', 
        codigo_Classe: 1, 
        codigo_Sala: 1, 
        codigo_Periodo: 1,
        codigo_Curso: 1,
        codigo_AnoLectivo: 1,
        status: 'Activo'
      },
      { 
        designacao: 'Turma B - 10ª Classe', 
        codigo_Classe: 1, 
        codigo_Sala: 2, 
        codigo_Periodo: 1,
        codigo_Curso: 1,
        codigo_AnoLectivo: 1,
        status: 'Activo'
      },
      { 
        designacao: 'Turma A - 11ª Classe', 
        codigo_Classe: 2, 
        codigo_Sala: 3, 
        codigo_Periodo: 2,
        codigo_Curso: 1,
        codigo_AnoLectivo: 1,
        status: 'Activo'
      }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Criadas ${turmas.count} turmas`);

  // 8. Criar alunos fictícios
  console.log('👨‍🎓 Criando alunos fictícios...');
  
  // Primeiro criar dados geográficos necessários
  await prisma.tb_nacionalidades.createMany({
    data: [{ designacao: 'Angolana' }],
    skipDuplicates: true
  });

  await prisma.tb_estado_civil.createMany({
    data: [{ designacao: 'Solteiro' }],
    skipDuplicates: true
  });

  await prisma.tb_provincias.createMany({
    data: [{ designacao: 'Luanda' }],
    skipDuplicates: true
  });

  await prisma.tb_municipios.createMany({
    data: [{ designacao: 'Luanda', codigo_Provincia: 1 }],
    skipDuplicates: true
  });

  await prisma.tb_comunas.createMany({
    data: [{ designacao: 'Ingombota', codigo_Municipio: 1 }],
    skipDuplicates: true
  });

  await prisma.tb_profissao.createMany({
    data: [{ designacao: 'Funcionário Público' }],
    skipDuplicates: true
  });

  await prisma.tb_tipo_documento.createMany({
    data: [{ designacao: 'Bilhete de Identidade' }],
    skipDuplicates: true
  });

  // Criar encarregados
  const encarregados = await prisma.tb_encarregados.createMany({
    data: [
      {
        nome: 'João Silva',
        telefone: '+244 900 000 001',
        email: 'joao.silva@email.com',
        codigo_Profissao: 1,
        local_Trabalho: 'Ministério da Educação',
        codigo_Utilizador: 1,
        dataCadastro: new Date(),
        status: 1
      },
      {
        nome: 'Maria Santos',
        telefone: '+244 900 000 002',
        email: 'maria.santos@email.com',
        codigo_Profissao: 1,
        local_Trabalho: 'Hospital Central',
        codigo_Utilizador: 1,
        dataCadastro: new Date(),
        status: 1
      }
    ],
    skipDuplicates: true
  });

  // Criar alunos
  const alunos = await prisma.tb_alunos.createMany({
    data: [
      {
        nome: 'Pedro Silva Santos',
        pai: 'João Silva',
        mae: 'Ana Silva',
        codigo_Nacionalidade: 1,
        codigo_Estado_Civil: 1,
        dataNascimento: new Date('2006-03-15'),
        email: 'pedro.silva@estudante.com',
        telefone: '+244 900 111 001',
        codigo_Status: 1,
        codigo_Comuna: 1,
        codigo_Encarregado: 1,
        codigo_Utilizador: 1,
        sexo: 'M',
        n_documento_identificacao: '123456789LA001',
        dataCadastro: new Date(),
        saldo: 0,
        codigoTipoDocumento: 1
      },
      {
        nome: 'Maria João Fernandes',
        pai: 'Carlos Fernandes',
        mae: 'Isabel Fernandes',
        codigo_Nacionalidade: 1,
        codigo_Estado_Civil: 1,
        dataNascimento: new Date('2006-07-22'),
        email: 'maria.fernandes@estudante.com',
        telefone: '+244 900 111 002',
        codigo_Status: 1,
        codigo_Comuna: 1,
        codigo_Encarregado: 2,
        codigo_Utilizador: 1,
        sexo: 'F',
        n_documento_identificacao: '123456789LA002',
        dataCadastro: new Date(),
        saldo: 0,
        codigoTipoDocumento: 1
      },
      {
        nome: 'João Carlos Mateus',
        pai: 'António Mateus',
        mae: 'Rosa Mateus',
        codigo_Nacionalidade: 1,
        codigo_Estado_Civil: 1,
        dataNascimento: new Date('2006-11-10'),
        email: 'joao.mateus@estudante.com',
        telefone: '+244 900 111 003',
        codigo_Status: 1,
        codigo_Comuna: 1,
        codigo_Encarregado: 1,
        codigo_Utilizador: 1,
        sexo: 'M',
        n_documento_identificacao: '123456789LA003',
        dataCadastro: new Date(),
        saldo: 0,
        codigoTipoDocumento: 1
      },
      {
        nome: 'Ana Beatriz Costa',
        pai: 'Manuel Costa',
        mae: 'Fernanda Costa',
        codigo_Nacionalidade: 1,
        codigo_Estado_Civil: 1,
        dataNascimento: new Date('2006-05-18'),
        email: 'ana.costa@estudante.com',
        telefone: '+244 900 111 004',
        codigo_Status: 1,
        codigo_Comuna: 1,
        codigo_Encarregado: 2,
        codigo_Utilizador: 1,
        sexo: 'F',
        n_documento_identificacao: '123456789LA004',
        dataCadastro: new Date(),
        saldo: 0,
        codigoTipoDocumento: 1
      },
      {
        nome: 'Carlos Eduardo Lima',
        pai: 'Eduardo Lima',
        mae: 'Cristina Lima',
        codigo_Nacionalidade: 1,
        codigo_Estado_Civil: 1,
        dataNascimento: new Date('2006-09-03'),
        email: 'carlos.lima@estudante.com',
        telefone: '+244 900 111 005',
        codigo_Status: 1,
        codigo_Comuna: 1,
        codigo_Encarregado: 1,
        codigo_Utilizador: 1,
        sexo: 'M',
        n_documento_identificacao: '123456789LA005',
        dataCadastro: new Date(),
        saldo: 0,
        codigoTipoDocumento: 1
      }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Criados ${alunos.count} alunos`);

  // 9. Criar matrículas dos alunos
  console.log('📋 Criando matrículas dos alunos...');
  const matriculas = await prisma.tb_matriculas.createMany({
    data: [
      {
        codigo_Aluno: 1,
        data_Matricula: new Date('2024-02-01'),
        codigo_Curso: 1,
        codigo_Utilizador: 1,
        codigoStatus: 1
      },
      {
        codigo_Aluno: 2,
        data_Matricula: new Date('2024-02-01'),
        codigo_Curso: 1,
        codigo_Utilizador: 1,
        codigoStatus: 1
      },
      {
        codigo_Aluno: 3,
        data_Matricula: new Date('2024-02-01'),
        codigo_Curso: 1,
        codigo_Utilizador: 1,
        codigoStatus: 1
      },
      {
        codigo_Aluno: 4,
        data_Matricula: new Date('2024-02-01'),
        codigo_Curso: 1,
        codigo_Utilizador: 1,
        codigoStatus: 1
      },
      {
        codigo_Aluno: 5,
        data_Matricula: new Date('2024-02-01'),
        codigo_Curso: 1,
        codigo_Utilizador: 1,
        codigoStatus: 1
      }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Criadas ${matriculas.count} matrículas`);

  // 10. Criar confirmações dos alunos nas turmas
  console.log('✅ Criando confirmações dos alunos...');
  const confirmacoes = await prisma.tb_confirmacoes.createMany({
    data: [
      {
        codigo_Matricula: 1,
        data_Confirmacao: new Date('2024-02-15'),
        codigo_Turma: 1,
        codigo_Ano_lectivo: 1,
        codigo_Utilizador: 1,
        codigo_Status: 1,
        classificacao: 'Confirmado'
      },
      {
        codigo_Matricula: 2,
        data_Confirmacao: new Date('2024-02-15'),
        codigo_Turma: 1,
        codigo_Ano_lectivo: 1,
        codigo_Utilizador: 1,
        codigo_Status: 1,
        classificacao: 'Confirmado'
      },
      {
        codigo_Matricula: 3,
        data_Confirmacao: new Date('2024-02-15'),
        codigo_Turma: 1,
        codigo_Ano_lectivo: 1,
        codigo_Utilizador: 1,
        codigo_Status: 1,
        classificacao: 'Confirmado'
      },
      {
        codigo_Matricula: 4,
        data_Confirmacao: new Date('2024-02-15'),
        codigo_Turma: 2,
        codigo_Ano_lectivo: 1,
        codigo_Utilizador: 1,
        codigo_Status: 1,
        classificacao: 'Confirmado'
      },
      {
        codigo_Matricula: 5,
        data_Confirmacao: new Date('2024-02-15'),
        codigo_Turma: 2,
        codigo_Ano_lectivo: 1,
        codigo_Utilizador: 1,
        codigo_Status: 1,
        classificacao: 'Confirmado'
      }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Criadas ${confirmacoes.count} confirmações`);

  console.log('\n🎉 ESTRUTURA ACADÊMICA CRIADA COM SUCESSO!');
  console.log('\n📊 RESUMO:');
  console.log(`📚 Cursos: ${cursos.count}`);
  console.log(`🎓 Classes: ${classes.count}`);
  console.log(`📖 Disciplinas: ${disciplinas.count}`);
  console.log(`🏫 Salas: ${salas.count}`);
  console.log(`⏰ Períodos: ${periodos.count}`);
  console.log(`👥 Turmas: ${turmas.count}`);
  console.log(`👨‍🎓 Alunos: ${alunos.count}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
