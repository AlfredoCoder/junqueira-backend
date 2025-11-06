import re

with open('src/services/student-management.services.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar e substituir a parte após criar o aluno
old_pattern = r'        // 3\. Criar aluno SEM includes problemáticos\s*const aluno = await tx\.tb_alunos\.create\(\{\s*data: alunoData\s*\}\);'
new_code = '''        // 3. Criar aluno SEM includes problemáticos
        const aluno = await tx.tb_alunos.create({
          data: alunoData
        });

        // 4. Criar usuário automaticamente para o aluno
        const username = aluno.nome.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\\s]/g, '')
          .trim()
          .split(' ')
          .filter(word => word.length > 0)
          .slice(0, 2)
          .join('.');

        // Verificar se username já existe e tornar único
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

        // Buscar tipo de usuário "Aluno"
        const tipoAluno = await tx.tb_tipos_utilizador.findFirst({
          where: { designacao: 'Aluno' }
        });

        if (!tipoAluno) {
          throw new Error('Tipo de usuário "Aluno" não encontrado');
        }

        // Criar usuário para o aluno
        const usuarioAluno = await tx.tb_utilizadores.create({
          data: {
            nome: aluno.nome,
            user: finalUsername,
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // hash de "123456"
            codigo_Tipo_Utilizador: tipoAluno.codigo,
            estadoActual: 'ACTIVO',
            dataCadastro: new Date(),
            loginStatus: 'OFF',
            codigo_Aluno: aluno.codigo
          }
        });

        console.log(`✅ Usuário criado automaticamente para aluno ${aluno.nome}:`);
        console.log(`   Username: ${finalUsername}`);
        console.log(`   Senha padrão: 123456`);
        console.log(`   Tipo: Aluno`);
        console.log(`   Relacionamento 1:1 estabelecido`);'''

new_content = re.sub(old_pattern, new_code, content, flags=re.MULTILINE | re.DOTALL)

with open('src/services/student-management.services.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('✅ Criação automática de usuário adicionada!')
