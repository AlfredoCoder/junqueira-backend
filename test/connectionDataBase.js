import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const connectionDataBase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso! 🚀');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexão fechada após verificação.');
  }
};

// Executa a verificação
connectionDataBase();
