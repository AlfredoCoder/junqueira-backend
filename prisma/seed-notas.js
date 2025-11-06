import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do sistema de notas...');

  try {
    // 1. Criar professores de exemplo
    console.log('📚 Criando professores...');
    
    const professorMatematica = await prisma.tb_professores.create({
      data: {
        nome: 'Alberto Silva Santos',
        email: 'alberto.santos@complexoabiliojunqueira.ao',
        telefone: '+244 900 123 456',
        formacao: 'Licenciatura em Matemática',
        nivelAcademico: 'Licenciado',
        especialidade: 'Matemática Aplicada',
        numeroFuncionario: 'PROF001',
        dataAdmissao: new Date('2020-02-01'),
        status: 'Activo'
      }
    });

    const professorPortugues = await prisma.tb_professores.create({
      data: {
        nome: 'Maria João Fernandes',
        email: 'maria.fernandes@complexoabiliojunqueira.ao',
        telefone: '+244 900 234 567',
        formacao: 'Licenciatura em Língua Portuguesa',
        nivelAcademico: 'Mestre',
        especialidade: 'Literatura Angolana',
        numeroFuncionario: 'PROF002',
        dataAdmissao: new Date('2019-03-15'),
        status: 'Activo'
      }
    });

    const professorFisica = await prisma.tb_professores.create({
      data: {
        nome: 'João Carlos Mateus',
        email: 'joao.mateus@complexoabiliojunqueira.ao',
        telefone: '+244 900 345 678',
        formacao: 'Licenciatura em Física',
        nivelAcademico: 'Doutor',
        especialidade: 'Física Experimental',
        numeroFuncionario: 'PROF003',
        dataAdmissao: new Date('2018-08-20'),
      }
    });

    console.log(`✅ Criados ${3} professores`);

    // 2. Criar atribuições de disciplinas (usando IDs fictícios das disciplinas existentes)
    console.log('🔗 Criando atribuições de disciplinas...');
    
    const atribuicoesDisciplinas = await prisma.tb_professor_disciplina.createMany({
      data: [
        // Alberto - Matemática
        {
          codigo_Professor: professorsAlberto.codigo,
          codigo_Disciplina: 1, // Matemática
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        },
        // Maria - Português
        {
          codigo_Professor: professorMaria.codigo,
          codigo_Disciplina: 2, // Português
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        },
        // João - Física
        {
          codigo_Professor: professorJoao.codigo,
          codigo_Disciplina: 3, // Física
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        },
        // Atribuições adicionais - professores podem lecionar múltiplas disciplinas
        {
          codigo_Professor: professorsAlberto.codigo,
          codigo_Disciplina: 4, // Química (Alberto também ensina Química)
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        },
        {
          codigo_Professor: professorMaria.codigo,
          codigo_Disciplina: 6, // História (Maria também ensina História)
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        },
        {
          codigo_Professor: professorJoao.codigo,
          codigo_Disciplina: 5, // Biologia (João também ensina Biologia)
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        }
      ],
      skipDuplicates: true
    });

    // 3. Criar atribuições de turmas
    console.log('👥 Criando atribuições de turmas...');
      data: [
        {
          codigo_Professor: professorMatematica.codigo,
          codigo_Turma: 1, // 7A Matinal
          codigo_Disciplina: 1, // Matemática
          anoLectivo: '2024'
        },
        {
          codigo_Professor: professorPortugues.codigo,
          codigo_Turma: 1, // 7A Matinal
          codigo_Disciplina: 2, // Português
          anoLectivo: '2024'
        },
        {
          codigo_Professor: professorFisica.codigo,
          codigo_Turma: 1, // 7A Matinal
          codigo_Disciplina: 3, // Física
          anoLectivo: '2024'
        }
      ]
    });

    // 4. Criar períodos de avaliação para 2024
    console.log('📅 Criando períodos de avaliação...');
    
    const periodos = [
      // 1º Trimestre
      {
        designacao: 'Período MAC - 1º Trimestre 2024',
        tipoAvaliacao: 'MAC',
        trimestre: 1,
        dataInicio: new Date('2024-02-01'),
        dataFim: new Date('2024-02-29'),
        anoLectivo: '2024'
      },
      {
        designacao: 'Período PP - 1º Trimestre 2024',
        tipoAvaliacao: 'PP',
        trimestre: 1,
        dataInicio: new Date('2024-03-01'),
        dataFim: new Date('2024-03-15'),
        anoLectivo: '2024'
      },
      {
        designacao: 'Período PT - 1º Trimestre 2024',
        tipoAvaliacao: 'PT',
        trimestre: 1,
        dataInicio: new Date('2024-03-16'),
        dataFim: new Date('2024-03-31'),
        anoLectivo: '2024'
      },
      // 2º Trimestre
      {
        designacao: 'Período MAC - 2º Trimestre 2024',
        tipoAvaliacao: 'MAC',
        trimestre: 2,
        dataInicio: new Date('2024-05-01'),
        dataFim: new Date('2024-05-31'),
        anoLectivo: '2024'
      },
      {
        designacao: 'Período PP - 2º Trimestre 2024',
        tipoAvaliacao: 'PP',
        trimestre: 2,
        dataInicio: new Date('2024-06-01'),
        dataFim: new Date('2024-06-15'),
        anoLectivo: '2024'
      },
      {
        designacao: 'Período PT - 2º Trimestre 2024',
        tipoAvaliacao: 'PT',
        trimestre: 2,
        dataInicio: new Date('2024-06-16'),
        dataFim: new Date('2024-06-30'),
        anoLectivo: '2024'
      },
      // 3º Trimestre
      {
        designacao: 'Período MAC - 3º Trimestre 2024',
        tipoAvaliacao: 'MAC',
        trimestre: 3,
        dataInicio: new Date('2024-08-01'),
        dataFim: new Date('2024-08-31'),
        anoLectivo: '2024'
      },
      {
        designacao: 'Período PP - 3º Trimestre 2024',
        tipoAvaliacao: 'PP',
        trimestre: 3,
        dataInicio: new Date('2024-09-01'),
        dataFim: new Date('2024-09-15'),
        anoLectivo: '2024'
      },
      {
        designacao: 'Período PT - 3º Trimestre 2024',
        tipoAvaliacao: 'PT',
        trimestre: 3,
        dataInicio: new Date('2024-09-16'),
        dataFim: new Date('2024-09-30'),
        anoLectivo: '2024'
      }
    ];

    await prisma.tb_periodos_avaliacao.createMany({
      data: periodos
    });

    console.log(`✅ Criados ${periodos.length} períodos de avaliação`);

    // 5. Criar algumas notas de exemplo (assumindo que existem alunos com IDs 1, 2, 3)
    console.log('📝 Criando notas de exemplo...');
    
    const periodo1MAC = await prisma.tb_periodos_avaliacao.findFirst({
      where: { tipoAvaliacao: 'MAC', trimestre: 1, anoLectivo: '2024' }
    });

    if (periodo1MAC) {
      const notasExemplo = [
        // Aluno 1 - Pedro Sebastião Paulo
        {
          codigo_Aluno: 1,
          codigo_Professor: professorMatematica.codigo,
          codigo_Disciplina: 1,
          codigo_Turma: 1,
          codigo_Periodo: periodo1MAC.codigo,
          trimestre: 1,
          anoLectivo: '2024',
          notaMAC: 11.0,
          notaPP: 10.0,
          notaPT: 12.0,
          mediaTrimestre: 11.0,
          classificacao: 'Aprovado',
          lancadoPor: 1
        },
        // Aluno 2
        {
          codigo_Aluno: 2,
          codigo_Professor: professorMatematica.codigo,
          codigo_Disciplina: 1,
          codigo_Turma: 1,
          codigo_Periodo: periodo1MAC.codigo,
          trimestre: 1,
          anoLectivo: '2024',
          notaMAC: 8.5,
          notaPP: 9.0,
          notaPT: 8.0,
          mediaTrimestre: 8.5,
          classificacao: 'Reprovado',
          lancadoPor: 1
        },
        // Aluno 3
        {
          codigo_Aluno: 3,
          codigo_Professor: professorMatematica.codigo,
          codigo_Disciplina: 1,
          codigo_Turma: 1,
          codigo_Periodo: periodo1MAC.codigo,
          trimestre: 1,
          anoLectivo: '2024',
          notaMAC: 15.0,
          notaPP: 14.5,
          notaPT: 16.0,
          mediaTrimestre: 15.2,
          classificacao: 'Aprovado',
          lancadoPor: 1
        }
      ];

      await prisma.tb_notas_alunos.createMany({
        data: notasExemplo
      });

      console.log(`✅ Criadas ${notasExemplo.length} notas de exemplo`);
    }

    // 6. Mostrar resumo
    console.log('\n📊 RESUMO DO SEED:');
    
    const totalProfessores = await prisma.tb_professores.count();
    const totalAtribuicoesDisciplinas = await prisma.tb_professor_disciplina.count();
    const totalAtribuicoesTurmas = await prisma.tb_professor_turma.count();
    const totalPeriodos = await prisma.tb_periodos_avaliacao.count();
    const totalNotas = await prisma.tb_notas_alunos.count();

    console.log(`👨‍🏫 Professores: ${totalProfessores}`);
    console.log(`📚 Atribuições de Disciplinas: ${totalAtribuicoesDisciplinas}`);
    console.log(`👥 Atribuições de Turmas: ${totalAtribuicoesTurmas}`);
    console.log(`📅 Períodos de Avaliação: ${totalPeriodos}`);
    console.log(`📝 Notas Lançadas: ${totalNotas}`);

    console.log('\n🎉 Seed do sistema de notas concluído com sucesso!');
    console.log('\n📋 DADOS CRIADOS:');
    console.log('- Professor Alberto Silva Santos (Matemática)');
    console.log('- Professor Maria João Fernandes (Português)');
    console.log('- Professor João Carlos Mateus (Física)');
    console.log('- 9 períodos de avaliação (3 trimestres × 3 tipos)');
    console.log('- Notas de exemplo para 3 alunos em Matemática');
    console.log('\n✅ Sistema pronto para uso!');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
