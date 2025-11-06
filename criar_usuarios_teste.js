import { PrismaClient } from '@prisma/client';
import { gerarHashSenha } from './src/services/userService.js';

const prisma = new PrismaClient();

async function criarUsuariosTeste() {
  console.log('👥 Criando usuários de teste para cada tipo...\n');

  try {
    // Buscar tipos de usuário
    const tipos = await prisma.tb_tipos_utilizador.findMany();
    console.log('📋 Tipos disponíveis:');
    tipos.forEach(tipo => {
      console.log(`   ${tipo.codigo} - ${tipo.designacao}`);
    });

    // Usuários de teste para criar
    const usuariosTeste = [
      {
        nome: 'Secretária Administrativa',
        user: 'secretaria',
        senha: '123456',
        tipo: 'Secretaria'
      },
      {
        nome: 'Diretor Pedagógico',
        user: 'diretor',
        senha: '123456',
        tipo: 'Diretor'
      },
      {
        nome: 'Operador do Sistema',
        user: 'operador',
        senha: '123456',
        tipo: 'Operador'
      }
    ];

    console.log('\n🔧 Criando usuários de teste...');

    for (const usuarioTeste of usuariosTeste) {
      // Verificar se já existe
      const existente = await prisma.tb_utilizadores.findFirst({
        where: { user: usuarioTeste.user }
      });

      if (existente) {
        console.log(`   ⚪ ${usuarioTeste.nome} (${usuarioTeste.user}) já existe`);
        continue;
      }

      // Buscar tipo
      const tipo = await prisma.tb_tipos_utilizador.findFirst({
        where: { designacao: usuarioTeste.tipo }
      });

      if (!tipo) {
        console.log(`   ❌ Tipo ${usuarioTeste.tipo} não encontrado`);
        continue;
      }

      // Gerar hash da senha
      const senhaHash = await gerarHashSenha(usuarioTeste.senha);

      // Criar usuário
      const novoUsuario = await prisma.tb_utilizadores.create({
        data: {
          nome: usuarioTeste.nome,
          user: usuarioTeste.user,
          passe: senhaHash,
          codigo_Tipo_Utilizador: tipo.codigo,
          estadoActual: 'Activo',
          dataCadastro: new Date(),
          loginStatus: 'OFF'
        }
      });

      console.log(`   ✅ ${usuarioTeste.nome} criado:`);
      console.log(`      Username: ${usuarioTeste.user}`);
      console.log(`      Senha: ${usuarioTeste.senha}`);
      console.log(`      Tipo: ${usuarioTeste.tipo}`);
    }

    // Listar todos os usuários
    console.log('\n📊 Usuários disponíveis para teste:');
    const todosUsuarios = await prisma.tb_utilizadores.findMany({
      include: {
        tb_tipos_utilizador: true
      },
      orderBy: { codigo: 'asc' }
    });

    todosUsuarios.forEach(usuario => {
      const senha = usuario.user === 'admin' ? 'admin123' : '123456';
      console.log(`   👤 ${usuario.nome}`);
      console.log(`      Username: ${usuario.user} | Senha: ${senha} | Tipo: ${usuario.tb_tipos_utilizador.designacao}`);
    });

    console.log('\n✅ Usuários de teste criados com sucesso!');
    console.log('\n🔐 Para testar permissões, faça login com:');
    console.log('   • admin/admin123 (Administrador - acesso total)');
    console.log('   • secretaria/123456 (Secretária - dashboard + gestão + pagamentos)');
    console.log('   • diretor/123456 (Diretor - dashboard + gestão completa + professores + pagamentos)');
    console.log('   • ana.sousa/123456 (Professor - apenas lançamento de notas)');

  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
criarUsuariosTeste();
