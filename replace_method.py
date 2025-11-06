import re

with open('src/services/student-management.services.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar e substituir método completo
old_method_pattern = r'static async createAlunoComEncarregado\([^{]*\{.*?catch[^}]*\{[^}]*\}[^}]*\}'

new_method = '''static async createAlunoComEncarregado(data, codigo_Utilizador) {
    try {
      const utilizadorExists = await prisma.tb_utilizadores.findUnique({
        where: { codigo: codigo_Utilizador }
      });

      if (!utilizadorExists) {
        throw new AppError('Utilizador não encontrado', 404);
      }

      return await prisma.$transaction(async (tx) => {
        // 1. Criar encarregado
        const encarregado = await tx.tb_encarregados.create({
          data: {
            nome: data.encarregado.nome,
            telefone: data.encarregado.telefone,
            email: data.encarregado.email,
            codigo_Profissao: data.encarregado.codigo_Profissao,
            local_Trabalho: data.encarregado.local_Trabalho,
            codigo_Utilizador: codigo_Utilizador,
            dataCadastro: new Date(),
            status: data.encarregado.status ?? 1
          }
        });

        // 2. Preparar dados do aluno
        const alunoData = { ...data };
        delete alunoData.encarregado;
        alunoData.codigo_Encarregado = encarregado.codigo;
        alunoData.codigo_Utilizador = codigo_Utilizador;
        alunoData.dataCadastro = new Date();

        // 3. Criar aluno
        const aluno = await tx.tb_alunos.create({
          data: alunoData
        });

        // 4. Criar usuário automaticamente
        const username = aluno.nome.toLowerCase()
          .normalize('NFD')
          .replace(/[\\u0300-\\u036f]/g, '')
          .replace(/[^a-z0-9\\s]/g, '')
          .trim()
          .split(' ')
          .filter(word => word.length > 0)
          .slice(0, 2)
          .join('.');

        let finalUsername = username;
        let counter = 1;
        while (true) {
          const existingUser = await tx.tb_utilizadores.findUnique({
            where: { user: finalUsername }
          });
          if (!existingUser) break;
          finalUsername = `${username}${counter}`;
          counter++;
        }

        const tipoAluno = await tx.tb_tipos_utilizador.findFirst({
          where: { designacao: 'Aluno' }
        });

        if (tipoAluno) {
          await tx.tb_utilizadores.create({
            data: {
              nome: aluno.nome,
              user: finalUsername,
              passe: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
              codigo_Tipo_Utilizador: tipoAluno.codigo,
              estadoActual: 'ACTIVO',
              dataCadastro: new Date(),
              loginStatus: 'OFF',
              codigo_Aluno: aluno.codigo
            }
          });
          console.log(`✅ Usuário criado: ${finalUsername} (senha: 123456)`);
        }

        return {
          success: true,
          data: {
            aluno: aluno,
            encarregado: encarregado
          },
          message: 'Aluno criado com sucesso'
        };
      });
    } catch (error) {
      console.error('Erro ao criar aluno com encarregado:', error);
      throw new AppError('Erro ao criar aluno com encarregado', 500);
    }
  }'''

# Substituir método
new_content = re.sub(old_method_pattern, new_method, content, flags=re.DOTALL)

with open('src/services/student-management.services.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('✅ Método substituído completamente!')
