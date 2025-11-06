import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Função para gerar username a partir do nome
function gerarUsername(nome) {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z\s]/g, '') // Remove caracteres especiais
    .trim()
    .split(' ')
    .filter(part => part.length > 0)
    .slice(0, 2) // Pega apenas primeiro e último nome
    .join('.');
}

async function main() {
  console.log('👥 Iniciando seed de usuários integrado...');

  // 1. CRIAR USUÁRIO ADMINISTRADOR
  console.log('🔐 Criando usuário administrador...');
  const senhaAdmin = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.tb_utilizadores.upsert({
    where: { user: 'admin' },
    update: {},
    create: {
      nome: 'Administrador do Sistema',
      user: 'admin',
      passe: senhaAdmin,
      codigo_Tipo_Utilizador: 1, // Administrador
      estadoActual: 'Activo',
      dataCadastro: new Date(),
      loginStatus: 'OFF'
    }
  });
  console.log('✅ Administrador criado:', admin.nome);

  // 2. CRIAR ENCARREGADOS PRIMEIRO
  console.log('👨‍👩‍👧‍👦 Criando encarregados...');
  const encarregados = [
    {
      nome: 'João Silva Santos',
      telefone: '923456789',
      email: 'joao.santos@email.com',
      codigo_Profissao: 8, // Funcionário Público
      local_Trabalho: 'Ministério da Educação',
      codigo_Utilizador: admin.codigo,
      dataCadastro: new Date(),
      status: 1
    },
    {
      nome: 'Maria Fernandes Costa',
      telefone: '924567890',
      email: 'maria.costa@email.com',
      codigo_Profissao: 2, // Médico
      local_Trabalho: 'Hospital Américo Boavida',
      codigo_Utilizador: admin.codigo,
      dataCadastro: new Date(),
      status: 1
    },
    {
      nome: 'Carlos Mateus Silva',
      telefone: '925678901',
      email: 'carlos.silva@email.com',
      codigo_Profissao: 4, // Engenheiro
      local_Trabalho: 'Empresa de Construção',
      codigo_Utilizador: admin.codigo,
      dataCadastro: new Date(),
      status: 1
    },
    {
      nome: 'Ana Sousa Fernandes',
      telefone: '926789012',
      email: 'ana.fernandes@email.com',
      codigo_Profissao: 1, // Professor
      local_Trabalho: 'Escola Secundária',
      codigo_Utilizador: admin.codigo,
      dataCadastro: new Date(),
      status: 1
    },
    {
      nome: 'Pedro Costa Mateus',
      telefone: '927890123',
      email: 'pedro.mateus@email.com',
      codigo_Profissao: 7, // Comerciante
      local_Trabalho: 'Loja Própria',
      codigo_Utilizador: admin.codigo,
      dataCadastro: new Date(),
      status: 1
    }
  ];

  const encarregadosCriados = [];
  for (const encarregado of encarregados) {
    const created = await prisma.tb_encarregados.create({
      data: encarregado
    });
    encarregadosCriados.push(created);
  }
  console.log(`✅ Encarregados criados: ${encarregadosCriados.length}`);

  // 3. CRIAR PROFESSORES COM USUÁRIOS
  console.log('👨‍🏫 Criando professores com usuários...');
  const professoresData = [
    {
      nome: 'Alberto Silva Santos',
      email: 'alberto.santos@escola.ao',
      telefone: '923111111',
      formacao: 'Licenciatura em Matemática',
      nivelAcademico: 'Licenciado',
      especialidade: 'Matemática e Física',
      numeroFuncionario: 'PROF001'
    },
    {
      nome: 'Maria João Fernandes',
      email: 'maria.fernandes@escola.ao',
      telefone: '923222222',
      formacao: 'Licenciatura em Português',
      nivelAcademico: 'Licenciado',
      especialidade: 'Língua Portuguesa',
      numeroFuncionario: 'PROF002'
    },
    {
      nome: 'João Carlos Mateus',
      email: 'joao.mateus@escola.ao',
      telefone: '923333333',
      formacao: 'Licenciatura em Biologia',
      nivelAcademico: 'Licenciado',
      especialidade: 'Ciências Naturais',
      numeroFuncionario: 'PROF003'
    },
    {
      nome: 'Ana Cristina Sousa',
      email: 'ana.sousa@escola.ao',
      telefone: '923444444',
      formacao: 'Licenciatura em Geografia',
      nivelAcademico: 'Licenciado',
      especialidade: 'Geografia e História',
      numeroFuncionario: 'PROF004'
    }
  ];

  const professoresCriados = [];
  for (const profData of professoresData) {
    // Criar professor
    const professor = await prisma.tb_professores.create({
      data: {
        ...profData,
        status: 'Activo',
        dataAdmissao: new Date(),
        dataCadastro: new Date(),
        dataActualizacao: new Date()
      }
    });

    // Criar usuário para o professor
    const username = gerarUsername(professor.nome);
    const senhaHash = await bcrypt.hash('123456', 10);

    const usuario = await prisma.tb_utilizadores.create({
      data: {
        nome: professor.nome,
        user: username,
        passe: senhaHash,
        codigo_Tipo_Utilizador: 2, // Professor
        estadoActual: 'Activo',
        dataCadastro: new Date(),
        loginStatus: 'OFF',
        codigo_Professor: professor.codigo
      }
    });

    professoresCriados.push({ professor, usuario });
    console.log(`✅ Professor criado: ${professor.nome} (${username})`);
  }

  // 4. CRIAR ALUNOS COM USUÁRIOS
  console.log('👨‍🎓 Criando alunos com usuários...');
  const alunosData = [
    {
      nome: 'Alfredo Leonildo Santos',
      pai: 'João Silva Santos',
      mae: 'Maria Silva Santos',
      email: 'alfredo.santos@email.com',
      telefone: '923555555',
      sexo: 'Masculino',
      dataNascimento: new Date('2005-03-15'),
      n_documento_identificacao: '123456789LA041',
      morada: 'Rua da Paz, Maianga',
      encarregadoIndex: 0
    },
    {
      nome: 'Ana Maria Fernandes',
      pai: 'Carlos Fernandes Costa',
      mae: 'Maria Fernandes Costa',
      email: 'ana.fernandes@email.com',
      telefone: '923666666',
      sexo: 'Feminino',
      dataNascimento: new Date('2006-07-22'),
      n_documento_identificacao: '987654321LA041',
      morada: 'Rua das Flores, Ingombota',
      encarregadoIndex: 1
    },
    {
      nome: 'Carlos Mateus Silva',
      pai: 'Carlos Mateus Silva',
      mae: 'Ana Mateus Silva',
      email: 'carlos.silva@email.com',
      telefone: '923777777',
      sexo: 'Masculino',
      dataNascimento: new Date('2005-11-10'),
      n_documento_identificacao: '456789123LA041',
      morada: 'Rua do Sol, Rangel',
      encarregadoIndex: 2
    },
    {
      nome: 'Beatriz Sousa Costa',
      pai: 'Pedro Sousa Fernandes',
      mae: 'Ana Sousa Fernandes',
      email: 'beatriz.costa@email.com',
      telefone: '923888888',
      sexo: 'Feminino',
      dataNascimento: new Date('2006-01-18'),
      n_documento_identificacao: '789123456LA041',
      morada: 'Rua da Esperança, Samba',
      encarregadoIndex: 3
    },
    {
      nome: 'Miguel Costa Santos',
      pai: 'Pedro Costa Mateus',
      mae: 'Joana Costa Mateus',
      email: 'miguel.santos@email.com',
      telefone: '923999999',
      sexo: 'Masculino',
      dataNascimento: new Date('2005-09-05'),
      n_documento_identificacao: '321654987LA041',
      morada: 'Rua da Liberdade, Sambizanga',
      encarregadoIndex: 4
    }
  ];

  const alunosCriados = [];
  for (const alunoData of alunosData) {
    const { encarregadoIndex, ...dadosAluno } = alunoData;
    
    // Criar aluno
    const aluno = await prisma.tb_alunos.create({
      data: {
        ...dadosAluno,
        codigo_Nacionalidade: 1, // Angolana
        codigo_Estado_Civil: 1, // Solteiro
        codigo_Comuna: 1, // Ingombota
        codigo_Encarregado: encarregadosCriados[encarregadoIndex].codigo,
        codigo_Utilizador: admin.codigo,
        codigo_Status: 1, // Ativo
        codigoTipoDocumento: 1, // BI
        dataCadastro: new Date(),
        saldo: 0,
        provinciaEmissao: 'LUANDA'
      }
    });

    // Criar usuário para o aluno
    const username = gerarUsername(aluno.nome);
    const senhaHash = await bcrypt.hash('123456', 10);

    const usuario = await prisma.tb_utilizadores.create({
      data: {
        nome: aluno.nome,
        user: username,
        passe: senhaHash,
        codigo_Tipo_Utilizador: 3, // Aluno
        estadoActual: 'Activo',
        dataCadastro: new Date(),
        loginStatus: 'OFF',
        codigo_Aluno: aluno.codigo
      }
    });

    alunosCriados.push({ aluno, usuario });
    console.log(`✅ Aluno criado: ${aluno.nome} (${username})`);
  }

  console.log('\n🎉 USUÁRIOS INTEGRADOS CRIADOS COM SUCESSO!');
  console.log('\n📊 RESUMO:');
  console.log(`🔐 Administrador: 1`);
  console.log(`👨‍👩‍👧‍👦 Encarregados: ${encarregadosCriados.length}`);
  console.log(`👨‍🏫 Professores: ${professoresCriados.length}`);
  console.log(`👨‍🎓 Alunos: ${alunosCriados.length}`);
  console.log(`👥 Total de Usuários: ${1 + professoresCriados.length + alunosCriados.length}`);

  console.log('\n🔑 CREDENCIAIS DE ACESSO:');
  console.log('👑 Admin: admin / admin123');
  console.log('👨‍🏫 Professores: [nome.sobrenome] / 123456');
  console.log('👨‍🎓 Alunos: [nome.sobrenome] / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
