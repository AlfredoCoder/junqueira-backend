import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Criando usuários de teste...');

  try {
    // 1. Verificar se já existem tipos de usuário
    let tipoAdmin = await prisma.tb_tipos_utilizador.findFirst({
      where: { designacao: 'Administrador' }
    });

    let tipoProfessor = await prisma.tb_tipos_utilizador.findFirst({
      where: { designacao: 'Professor' }
    });

    // Criar tipos de usuário se não existirem
    if (!tipoAdmin) {
      tipoAdmin = await prisma.tb_tipos_utilizador.create({
        data: {
          designacao: 'Administrador'
        }
      });
      console.log('✅ Tipo de usuário "Administrador" criado');
    }

    if (!tipoProfessor) {
      tipoProfessor = await prisma.tb_tipos_utilizador.create({
        data: {
          designacao: 'Professor'
        }
      });
      console.log('✅ Tipo de usuário "Professor" criado');
    }

    // 2. Criar usuário Administrador
    const adminExiste = await prisma.tb_utilizadores.findFirst({
      where: { user: 'admin' }
    });

    if (!adminExiste) {
      const admin = await prisma.tb_utilizadores.create({
        data: {
          nome: 'Administrador do Sistema',
          user: 'admin',
          passe: 'admin123', // Em produção, usar hash
          codigo_Tipo_Utilizador: tipoAdmin.codigo,
          estadoActual: 'Activo',
          dataCadastro: new Date(),
          loginStatus: 'OFF'
        }
      });
      console.log('✅ Usuário Administrador criado:', {
        codigo: admin.codigo,
        nome: admin.nome,
        user: admin.user,
        senha: 'admin123'
      });
    } else {
      console.log('ℹ️ Usuário Administrador já existe');
    }

    // 3. Criar usuário Professor (vinculado ao professor Alberto Silva Santos)
    const professorExiste = await prisma.tb_utilizadores.findFirst({
      where: { user: 'alberto.santos' }
    });

    if (!professorExiste) {
      const professorUser = await prisma.tb_utilizadores.create({
        data: {
          nome: 'Alberto Silva Santos',
          user: 'alberto.santos',
          passe: 'prof123', // Em produção, usar hash
          codigo_Tipo_Utilizador: tipoProfessor.codigo,
          estadoActual: 'Activo',
          dataCadastro: new Date(),
          loginStatus: 'OFF'
        }
      });

      // Atualizar o professor para vincular ao usuário
      const professorAlberto = await prisma.tb_professores.findFirst({
        where: { nome: 'Alberto Silva Santos' }
      });

      if (professorAlberto) {
        await prisma.tb_professores.update({
          where: { codigo: professorAlberto.codigo },
          data: { codigo_Utilizador: professorUser.codigo }
        });
        console.log('✅ Usuário Professor criado e vinculado:', {
          codigo: professorUser.codigo,
          nome: professorUser.nome,
          user: professorUser.user,
          senha: 'prof123',
          professorVinculado: professorAlberto.codigo
        });
      } else {
        console.log('✅ Usuário Professor criado:', {
          codigo: professorUser.codigo,
          nome: professorUser.nome,
          user: professorUser.user,
          senha: 'prof123'
        });
      }
    } else {
      console.log('ℹ️ Usuário Professor já existe');
    }

    // 4. Criar mais um professor para teste
    const professorMariaExiste = await prisma.tb_utilizadores.findFirst({
      where: { user: 'maria.fernandes' }
    });

    if (!professorMariaExiste) {
      const professorMariaUser = await prisma.tb_utilizadores.create({
        data: {
          nome: 'Maria João Fernandes',
          user: 'maria.fernandes',
          passe: 'prof123',
          codigo_Tipo_Utilizador: tipoProfessor.codigo,
          estadoActual: 'Activo',
          dataCadastro: new Date(),
          loginStatus: 'OFF'
        }
      });

      // Atualizar o professor para vincular ao usuário
      const professorMaria = await prisma.tb_professores.findFirst({
        where: { nome: 'Maria João Fernandes' }
      });

      if (professorMaria) {
        await prisma.tb_professores.update({
          where: { codigo: professorMaria.codigo },
          data: { codigo_Utilizador: professorMariaUser.codigo }
        });
        console.log('✅ Usuário Professor Maria criado e vinculado:', {
          codigo: professorMariaUser.codigo,
          nome: professorMariaUser.nome,
          user: professorMariaUser.user,
          senha: 'prof123',
          professorVinculado: professorMaria.codigo
        });
      }
    } else {
      console.log('ℹ️ Usuário Professor Maria já existe');
    }

    console.log('\n🎉 USUÁRIOS DE TESTE CRIADOS COM SUCESSO!');
    console.log('\n📋 CREDENCIAIS PARA LOGIN:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│ 👨‍💼 ADMINISTRADOR                        │');
    console.log('│ Usuário: admin                          │');
    console.log('│ Senha: admin123                        │');
    console.log('│ Tipo: Administrador                     │');
    console.log('├─────────────────────────────────────────┤');
    console.log('│ 👨‍🏫 PROFESSOR - Alberto Silva Santos    │');
    console.log('│ Usuário: alberto.santos                 │');
    console.log('│ Senha: prof123                         │');
    console.log('│ Tipo: Professor                         │');
    console.log('│ Disciplina: Matemática                  │');
    console.log('├─────────────────────────────────────────┤');
    console.log('│ 👩‍🏫 PROFESSOR - Maria João Fernandes    │');
    console.log('│ Usuário: maria.fernandes                │');
    console.log('│ Senha: prof123                         │');
    console.log('│ Tipo: Professor                         │');
    console.log('│ Disciplina: Português                   │');
    console.log('└─────────────────────────────────────────┘');

    // 5. Mostrar resumo dos dados
    const totalUsuarios = await prisma.tb_utilizadores.count();
    const totalProfessores = await prisma.tb_professores.count();
    const totalTiposUsuario = await prisma.tb_tipos_utilizador.count();

    console.log('\n📊 RESUMO DO SISTEMA:');
    console.log(`👥 Total de Usuários: ${totalUsuarios}`);
    console.log(`👨‍🏫 Total de Professores: ${totalProfessores}`);
    console.log(`🏷️ Tipos de Usuário: ${totalTiposUsuario}`);

  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error);
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
