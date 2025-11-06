import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function aplicarMudancasSchema() {
  console.log('🔧 Aplicando mudanças no schema do banco de dados...\n');

  try {
    // 1. Adicionar colunas para relacionamento 1:1
    console.log('1️⃣ Adicionando colunas Codigo_Professor e Codigo_Aluno...');
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE tb_utilizadores 
        ADD COLUMN Codigo_Professor INT UNSIGNED NULL UNIQUE COMMENT 'FK para tb_professores'
      `;
      console.log('   ✅ Coluna Codigo_Professor adicionada');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('   ⚪ Coluna Codigo_Professor já existe');
      } else {
        throw error;
      }
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE tb_utilizadores 
        ADD COLUMN Codigo_Aluno INT UNSIGNED NULL UNIQUE COMMENT 'FK para tb_alunos'
      `;
      console.log('   ✅ Coluna Codigo_Aluno adicionada');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('   ⚪ Coluna Codigo_Aluno já existe');
      } else {
        throw error;
      }
    }

    // 2. Modificar colunas existentes
    console.log('2️⃣ Modificando colunas existentes...');
    
    await prisma.$executeRaw`
      ALTER TABLE tb_utilizadores 
      MODIFY COLUMN Nome VARCHAR(200) NOT NULL COMMENT 'Nome completo do usuário'
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE tb_utilizadores 
      MODIFY COLUMN Passe VARCHAR(255) NOT NULL COMMENT 'Hash da senha'
    `;
    
    console.log('   ✅ Colunas modificadas');

    // 3. Adicionar constraint UNIQUE no User (se não existir)
    console.log('3️⃣ Adicionando constraint UNIQUE no campo User...');
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE tb_utilizadores 
        ADD CONSTRAINT unique_user UNIQUE (User)
      `;
      console.log('   ✅ Constraint UNIQUE adicionada');
    } catch (error) {
      if (error.message.includes('Duplicate key name')) {
        console.log('   ⚪ Constraint UNIQUE já existe');
      } else {
        throw error;
      }
    }

    // 4. Adicionar índices
    console.log('4️⃣ Adicionando índices...');
    
    try {
      await prisma.$executeRaw`
        CREATE INDEX idx_tb_utilizadores_professor ON tb_utilizadores(Codigo_Professor)
      `;
      console.log('   ✅ Índice para Codigo_Professor criado');
    } catch (error) {
      if (error.message.includes('Duplicate key name')) {
        console.log('   ⚪ Índice para Codigo_Professor já existe');
      } else {
        console.log('   ⚠️  Erro ao criar índice para Codigo_Professor:', error.message);
      }
    }
    
    try {
      await prisma.$executeRaw`
        CREATE INDEX idx_tb_utilizadores_aluno ON tb_utilizadores(Codigo_Aluno)
      `;
      console.log('   ✅ Índice para Codigo_Aluno criado');
    } catch (error) {
      if (error.message.includes('Duplicate key name')) {
        console.log('   ⚪ Índice para Codigo_Aluno já existe');
      } else {
        console.log('   ⚠️  Erro ao criar índice para Codigo_Aluno:', error.message);
      }
    }

    // 5. Verificar estrutura final
    console.log('5️⃣ Verificando estrutura final...');
    
    const result = await prisma.$queryRaw`DESCRIBE tb_utilizadores`;
    console.log('   📋 Estrutura da tabela tb_utilizadores:');
    result.forEach(column => {
      console.log(`      ${column.Field} - ${column.Type} - ${column.Null} - ${column.Key}`);
    });

    console.log('\n✅ Schema atualizado com sucesso!');
    console.log('\n🔄 Agora execute: npx prisma generate');

  } catch (error) {
    console.error('❌ Erro ao aplicar mudanças:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
aplicarMudancasSchema();
