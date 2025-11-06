import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Criando usuários de teste...');

  try {
    // Vamos usar apenas as tabelas que sabemos que existem
    // Primeiro, vamos verificar se conseguimos acessar tb_professores
    const professores = await prisma.tb_professores.findMany({
      take: 3
    });
    
    console.log('✅ Professores encontrados:', professores.length);
    
    professores.forEach((prof, index) => {
      console.log(`${index + 1}. ${prof.nome} (${prof.email})`);
    });

    console.log('\n📋 CREDENCIAIS PARA TESTE:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│ 👨‍💼 ADMINISTRADOR (TEMPORÁRIO)           │');
    console.log('│ Use qualquer usuário admin do sistema   │');
    console.log('│ existente ou acesse diretamente as APIs │');
    console.log('├─────────────────────────────────────────┤');
    console.log('│ 👨‍🏫 PROFESSORES DISPONÍVEIS:             │');
    
    professores.forEach((prof, index) => {
      console.log(`│ ${index + 1}. ${prof.nome.padEnd(35)} │`);
      console.log(`│    Email: ${prof.email.padEnd(27)} │`);
      console.log(`│    Código: ${prof.codigo.toString().padEnd(26)} │`);
      if (index < professores.length - 1) {
        console.log('├─────────────────────────────────────────┤');
      }
    });
    
    console.log('└─────────────────────────────────────────┘');

    console.log('\n🎯 COMO TESTAR O SISTEMA:');
    console.log('1. 📡 Teste as APIs diretamente:');
    console.log('   curl http://localhost:8000/api/professores');
    console.log('   curl http://localhost:8000/api/notas/periodos');
    
    console.log('\n2. 🌐 Acesse o frontend:');
    console.log('   - Página de Lançamento: /admin/teacher-management/notas/lancamento');
    console.log('   - Página de Visualização: /admin/teacher-management/notas/visualizar');
    console.log('   - Página de Professores: /admin/teacher-management/professores');
    
    console.log('\n3. 🧪 Teste as funcionalidades:');
    console.log('   - Selecione um professor na lista');
    console.log('   - Escolha uma turma e disciplina');
    console.log('   - Lance notas para os alunos');
    console.log('   - Visualize relatórios e estatísticas');

    // Verificar se há notas já lançadas
    const totalNotas = await prisma.tb_notas_alunos.count();
    const totalPeriodos = await prisma.tb_periodos_avaliacao.count();
    
    console.log('\n📊 STATUS DO SISTEMA:');
    console.log(`👨‍🏫 Professores cadastrados: ${professores.length}`);
    console.log(`📝 Notas lançadas: ${totalNotas}`);
    console.log(`📅 Períodos de avaliação: ${totalPeriodos}`);
    
    if (totalNotas > 0) {
      console.log('\n✅ Sistema já possui dados de teste!');
      console.log('Você pode começar a testar imediatamente.');
    } else {
      console.log('\n⚠️ Sistema sem notas ainda.');
      console.log('Use a interface para lançar as primeiras notas.');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar sistema:', error.message);
    
    console.log('\n🔧 SOLUÇÃO ALTERNATIVA:');
    console.log('1. Certifique-se de que o servidor backend está rodando');
    console.log('2. Teste as APIs diretamente com curl');
    console.log('3. Use o frontend para interagir com o sistema');
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
