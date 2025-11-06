const fs = require('fs');

// Ler arquivo atual
let content = fs.readFileSync('src/services/student-management.services.js', 'utf8');

// Encontrar e substituir o método createAlunoComEncarregado
const oldMethodStart = content.indexOf('static async createAlunoComEncarregado(data, codigo_Utilizador) {');
const oldMethodEnd = content.indexOf('  }', oldMethodStart + 1000) + 3; // +3 para incluir "  }"

const newMethod = `static async createAlunoComEncarregado(data, codigo_Utilizador) {
    try {
      // Verificar se o utilizador existe
      const utilizadorExists = await prisma.tb_utilizadores.findUnique({
        where: { codigo: codigo_Utilizador }
      });

      if (!utilizadorExists) {
        throw new AppError('Utilizador não encontrado', 404);
      }

      // 1. Gerar username ANTES da transação
      const baseUsername = data.nome.toLowerCase()
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .replace(/[^a-z0-9\\s]/g, '')
        .trim()
        .split(' ')
        .filter(word => word.length > 0)
        .slice(0, 2)
        .join('.');

      let finalUsername = baseUsername;
      let counter = 1;
      while (true) {
        const existingUser = await prisma.tb_utilizadores.findUnique({
          where: { user: finalUsername }
        });
        if (!existingUser) break;
        finalUsername = \`\${baseUsername}\${counter}\`;
        counter++;
      }

      // 2. Buscar tipo Aluno ANTES da transação
      const tipoAluno = await prisma.tb_tipos_utilizador.findFirst({
        where: { designacao: 'Aluno' }
      });

      if (!tipoAluno) {
        throw new AppError('Tipo de usuário Aluno não encontrado', 404);
      }

      // 3. Executar transação
      return await prisma.$transaction(async (tx) => {
        // Criar encarregado
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

        // Preparar dados do aluno
        const alunoData = { ...data };
        delete alunoData.encarregado;
        alunoData.codigo_Encarregado = encarregado.codigo;
        alunoData.codigo_Utilizador = codigo_Utilizador;
        alunoData.dataCadastro = new Date();

        // Criar aluno
        const aluno = await tx.tb_alunos.create({
          data: alunoData
        });

        // Criar usuário
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

        console.log(\`✅ Usuário criado: \${finalUsername} (senha: 123456)\`);

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
  }`;

// Substituir método
const newContent = content.substring(0, oldMethodStart) + newMethod + content.substring(oldMethodEnd);

// Escrever arquivo
fs.writeFileSync('src/services/student-management.services.js', newContent);

console.log('✅ Método corrigido - transação otimizada!');
