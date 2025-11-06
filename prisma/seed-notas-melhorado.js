import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed melhorado do sistema de notas...');

  // 1. Criar professores adicionais
  console.log('📚 Criando professores...');
  
  // Primeiro, criar os professores
  await prisma.tb_professores.createMany({
    data: [
      {
        nome: 'Ana Cristina Sousa',
        email: 'ana.sousa@complexoabiliojunqueira.ao',
        telefone: '+244 900 456 789',
        formacao: 'Licenciatura em Geografia',
        nivelAcademico: 'Licenciada',
        especialidade: 'Geografia Humana',
        numeroFuncionario: 'PROF004',
        dataAdmissao: new Date('2021-01-10'),
      }
    ],
    skipDuplicates: true
  });

  // Buscar todos os professores existentes
  const professores = await prisma.tb_professores.findMany({
    orderBy: { codigo: 'asc' }
  });

  console.log(`✅ Professores verificados/criados: ${professores.length}`);

  // 2. Criar atribuições de disciplinas aos professores
  console.log('🔗 Criando atribuições de disciplinas...');
  
  // Encontrar professores específicos por nome
  const alberto = professores.find(p => p.nome.includes('Alberto'));
  const maria = professores.find(p => p.nome.includes('Maria'));
  const joao = professores.find(p => p.nome.includes('João'));
  const ana = professores.find(p => p.nome.includes('Ana'));

  const atribuicoesDisciplinas = await prisma.tb_professor_disciplina.createMany({
    data: [
      // Alberto - Matemática e Química
      ...(alberto ? [
        {
          codigo_Professor: alberto.codigo,
          codigo_Disciplina: 1, // Matemática
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        },
        {
          codigo_Professor: alberto.codigo,
          codigo_Disciplina: 4, // Química
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : []),
      
      // Maria - Português e História
      ...(maria ? [
        {
          codigo_Professor: maria.codigo,
          codigo_Disciplina: 2, // Português
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        },
        {
          codigo_Professor: maria.codigo,
          codigo_Disciplina: 6, // História
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : []),
      
      // João - Física e Biologia
      ...(joao ? [
        {
          codigo_Professor: joao.codigo,
          codigo_Disciplina: 3, // Física
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        },
        {
          codigo_Professor: joao.codigo,
          codigo_Disciplina: 5, // Biologia
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : []),
      
      // Ana - Geografia e Inglês
      ...(ana ? [
        {
          codigo_Professor: ana.codigo,
          codigo_Disciplina: 7, // Geografia
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        },
        {
          codigo_Professor: ana.codigo,
          codigo_Disciplina: 8, // Inglês
          codigo_Curso: 1,
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : [])
    ],
    skipDuplicates: true
  });

  console.log(`✅ Atribuições de disciplinas criadas: ${atribuicoesDisciplinas.count}`);

  // 3. Criar atribuições de turmas
  console.log('👥 Criando atribuições de turmas...');
  
  const atribuicoesTurmas = await prisma.tb_professor_turma.createMany({
    data: [
      // Turma 1 - Múltiplas disciplinas
      ...(alberto ? [
        {
          codigo_Professor: alberto.codigo,
          codigo_Turma: 1,
          codigo_Disciplina: 1, // Matemática
          anoLectivo: '2024',
          status: 'Activo'
        },
        {
          codigo_Professor: alberto.codigo,
          codigo_Turma: 1,
          codigo_Disciplina: 4, // Química
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : []),
      ...(maria ? [
        {
          codigo_Professor: maria.codigo,
          codigo_Turma: 1,
          codigo_Disciplina: 2, // Português
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : []),
      ...(joao ? [
        {
          codigo_Professor: joao.codigo,
          codigo_Turma: 1,
          codigo_Disciplina: 3, // Física
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : []),
      
      // Turma 2 - Outras disciplinas
      ...(maria ? [
        {
          codigo_Professor: maria.codigo,
          codigo_Turma: 2,
          codigo_Disciplina: 6, // História
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : []),
      ...(joao ? [
        {
          codigo_Professor: joao.codigo,
          codigo_Turma: 2,
          codigo_Disciplina: 5, // Biologia
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : []),
      ...(ana ? [
        {
          codigo_Professor: ana.codigo,
          codigo_Turma: 2,
          codigo_Disciplina: 7, // Geografia
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : []),
      
      // Turma 3 - Distribuição equilibrada
      ...(alberto ? [
        {
          codigo_Professor: alberto.codigo,
          codigo_Turma: 3,
          codigo_Disciplina: 1, // Matemática
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : []),
      ...(ana ? [
        {
          codigo_Professor: ana.codigo,
          codigo_Turma: 3,
          codigo_Disciplina: 8, // Inglês
          anoLectivo: '2024',
          status: 'Activo'
        }
      ] : [])
    ],
    skipDuplicates: true
  });

  console.log(`✅ Atribuições de turmas criadas: ${atribuicoesTurmas.count}`);

  // 4. Criar períodos de avaliação (se não existirem)
  console.log('📅 Criando períodos de avaliação...');
  
  const periodosAvaliacao = await prisma.tb_periodos_avaliacao.createMany({
    data: [
      // 1º Trimestre
      {
        designacao: 'Período MAC - 1º Trimestre 2024',
        tipoAvaliacao: 'MAC',
        trimestre: 1,
        dataInicio: new Date('2024-02-01'),
        dataFim: new Date('2024-02-29'),
        anoLectivo: '2024',
        status: 'Activo'
      },
      {
        designacao: 'Período PP - 1º Trimestre 2024',
        tipoAvaliacao: 'PP',
        trimestre: 1,
        dataInicio: new Date('2024-03-01'),
        dataFim: new Date('2024-03-15'),
        anoLectivo: '2024',
        status: 'Activo'
      },
      {
        designacao: 'Período PT - 1º Trimestre 2024',
        tipoAvaliacao: 'PT',
        trimestre: 1,
        dataInicio: new Date('2024-03-16'),
        dataFim: new Date('2024-03-31'),
        anoLectivo: '2024',
        status: 'Activo'
      },
      
      // 2º Trimestre
      {
        designacao: 'Período MAC - 2º Trimestre 2024',
        tipoAvaliacao: 'MAC',
        trimestre: 2,
        dataInicio: new Date('2024-05-01'),
        dataFim: new Date('2024-05-31'),
        anoLectivo: '2024',
        status: 'Activo'
      },
      {
        designacao: 'Período PP - 2º Trimestre 2024',
        tipoAvaliacao: 'PP',
        trimestre: 2,
        dataInicio: new Date('2024-06-01'),
        dataFim: new Date('2024-06-15'),
        anoLectivo: '2024',
        status: 'Activo'
      },
      {
        designacao: 'Período PT - 2º Trimestre 2024',
        tipoAvaliacao: 'PT',
        trimestre: 2,
        dataInicio: new Date('2024-06-16'),
        dataFim: new Date('2024-06-30'),
        anoLectivo: '2024',
        status: 'Activo'
      },
      
      // 3º Trimestre
      {
        designacao: 'Período MAC - 3º Trimestre 2024',
        tipoAvaliacao: 'MAC',
        trimestre: 3,
        dataInicio: new Date('2024-08-01'),
        dataFim: new Date('2024-08-31'),
        anoLectivo: '2024',
        status: 'Activo'
      },
      {
        designacao: 'Período PP - 3º Trimestre 2024',
        tipoAvaliacao: 'PP',
        trimestre: 3,
        dataInicio: new Date('2024-09-01'),
        dataFim: new Date('2024-09-15'),
        anoLectivo: '2024',
        status: 'Activo'
      },
      {
        designacao: 'Período PT - 3º Trimestre 2024',
        tipoAvaliacao: 'PT',
        trimestre: 3,
        dataInicio: new Date('2024-09-16'),
        dataFim: new Date('2024-09-30'),
        anoLectivo: '2024',
        status: 'Activo'
      }
    ],
    skipDuplicates: true
  });

  console.log(`✅ Períodos de avaliação criados: ${periodosAvaliacao.count}`);

  // 5. Criar notas de exemplo mais diversificadas
  console.log('📝 Criando notas de exemplo...');
  
  const notasExemplo = await prisma.tb_notas_alunos.createMany({
    data: [
      // Turma 1 - Matemática (Alberto)
      ...(alberto ? [
        {
          codigo_Aluno: 1,
          codigo_Professor: alberto.codigo,
          codigo_Disciplina: 1,
          codigo_Turma: 1,
          codigo_Periodo: 1,
          trimestre: 1,
          anoLectivo: '2024',
          notaMAC: 14.0,
          notaPP: 13.5,
          notaPT: 15.0,
          mediaTrimestre: 14.2,
          classificacao: 'Aprovado',
          lancadoPor: 1
        },
        {
          codigo_Aluno: 2,
          codigo_Professor: alberto.codigo,
          codigo_Disciplina: 1,
          codigo_Turma: 1,
          codigo_Periodo: 1,
          trimestre: 1,
          anoLectivo: '2024',
          notaMAC: 9.5,
          notaPP: 8.0,
          notaPT: 9.0,
          mediaTrimestre: 8.8,
          classificacao: 'Reprovado',
          lancadoPor: 1
        },
        {
          codigo_Aluno: 3,
          codigo_Professor: alberto.codigo,
          codigo_Disciplina: 1,
          codigo_Turma: 1,
          codigo_Periodo: 1,
          trimestre: 1,
          anoLectivo: '2024',
          notaMAC: 16.0,
          notaPP: 17.5,
          notaPT: 18.0,
          mediaTrimestre: 17.2,
          classificacao: 'Aprovado',
          lancadoPor: 1
        }
      ] : []),
      
      // Turma 1 - Português (Maria)
      ...(maria ? [
        {
          codigo_Aluno: 1,
          codigo_Professor: maria.codigo,
          codigo_Disciplina: 2,
          codigo_Turma: 1,
          codigo_Periodo: 1,
          trimestre: 1,
          anoLectivo: '2024',
          notaMAC: 12.0,
          notaPP: 11.5,
          notaPT: 13.0,
          mediaTrimestre: 12.2,
          classificacao: 'Aprovado',
          lancadoPor: 1
        },
        {
          codigo_Aluno: 2,
          codigo_Professor: maria.codigo,
          codigo_Disciplina: 2,
          codigo_Turma: 1,
          codigo_Periodo: 1,
          trimestre: 1,
          anoLectivo: '2024',
          notaMAC: 10.5,
          notaPP: 10.0,
          notaPT: 11.0,
          mediaTrimestre: 10.5,
          classificacao: 'Aprovado',
          lancadoPor: 1
        },
        
        // Turma 2 - História (Maria)
        {
          codigo_Aluno: 4,
          codigo_Professor: maria.codigo,
          codigo_Disciplina: 6,
          codigo_Turma: 2,
          codigo_Periodo: 1,
          trimestre: 1,
          anoLectivo: '2024',
          notaMAC: 15.5,
          notaPP: 14.0,
          notaPT: 16.0,
          mediaTrimestre: 15.2,
          classificacao: 'Aprovado',
          lancadoPor: 1
        },
        {
          codigo_Aluno: 5,
          codigo_Professor: maria.codigo,
          codigo_Disciplina: 6,
          codigo_Turma: 2,
          codigo_Periodo: 1,
          trimestre: 1,
          anoLectivo: '2024',
          notaMAC: 11.0,
          notaPP: 12.5,
          notaPT: 10.5,
          mediaTrimestre: 11.3,
          classificacao: 'Aprovado',
          lancadoPor: 1
        }
      ] : [])
    ],
    skipDuplicates: true
  });

  console.log(`✅ Notas de exemplo criadas: ${notasExemplo.count}`);

  console.log('\n📊 RESUMO DO SEED MELHORADO:');
  console.log(`👨‍🏫 Professores: ${professores.length}`);
  console.log(`📚 Atribuições de Disciplinas: ${atribuicoesDisciplinas.count}`);
  console.log(`👥 Atribuições de Turmas: ${atribuicoesTurmas.count}`);
  console.log(`📅 Períodos de Avaliação: ${periodosAvaliacao.count}`);
  console.log(`📝 Notas Lançadas: ${notasExemplo.count}`);

  console.log('\n🎉 Seed melhorado do sistema de notas concluído com sucesso!');

  console.log('\n📋 PROFESSORES E SUAS ATRIBUIÇÕES:');
  console.log('- Alberto Silva Santos: Matemática e Química (Turmas 1 e 3)');
  console.log('- Maria João Fernandes: Português e História (Turmas 1 e 2)');
  console.log('- João Carlos Mateus: Física e Biologia (Turmas 1 e 2)');
  console.log('- Ana Cristina Sousa: Geografia e Inglês (Turmas 2 e 3)');

  console.log('\n✅ Sistema pronto para lançamento de notas por turmas!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
