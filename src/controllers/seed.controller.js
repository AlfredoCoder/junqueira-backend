import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seed de períodos
export const seedPeriodos = async (req, res) => {
  try {
    console.log('🕐 Iniciando seed de períodos...');

    // Verificar se já existem períodos
    const existingPeriodos = await prisma.tb_periodos.findMany();
    
    if (existingPeriodos.length > 0) {
      console.log(`✅ Já existem ${existingPeriodos.length} períodos cadastrados`);
      return res.json({
        success: true,
        message: `Já existem ${existingPeriodos.length} períodos cadastrados`,
        data: existingPeriodos
      });
    }

    // Criar períodos padrão
    const periodos = [
      { designacao: 'Manhã' },
      { designacao: 'Tarde' },
      { designacao: 'Noite' }
    ];

    console.log('📝 Criando períodos padrão...');

    const createdPeriodos = [];
    for (const periodo of periodos) {
      const created = await prisma.tb_periodos.create({
        data: periodo
      });
      createdPeriodos.push(created);
      console.log(`✅ Período criado: ${created.designacao} (Código: ${created.codigo})`);
    }

    console.log('🎉 Seed de períodos concluído com sucesso!');

    res.json({
      success: true,
      message: 'Períodos criados com sucesso!',
      data: createdPeriodos
    });

  } catch (error) {
    console.error('❌ Erro ao executar seed de períodos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar períodos',
      error: error.message
    });
  }
};

// Seed de salas de exemplo
export const seedSalas = async (req, res) => {
  try {
    console.log('🏫 Iniciando seed de salas...');

    // Verificar se já existem salas
    const existingSalas = await prisma.tb_salas.findMany();
    
    if (existingSalas.length > 0) {
      console.log(`✅ Já existem ${existingSalas.length} salas cadastradas`);
      return res.json({
        success: true,
        message: `Já existem ${existingSalas.length} salas cadastradas`,
        data: existingSalas
      });
    }

    // Criar salas de exemplo
    const salas = [
      { designacao: 'Sala A1' },
      { designacao: 'Sala A2' },
      { designacao: 'Sala B1' },
      { designacao: 'Sala B2' },
      { designacao: 'Laboratório 1' },
      { designacao: 'Auditório' },
      { designacao: 'Sala C1' },
      { designacao: 'Biblioteca' },
      { designacao: 'Sala D1' },
      { designacao: 'Sala D2' }
    ];

    console.log('📝 Criando salas de exemplo...');

    const createdSalas = [];
    for (const sala of salas) {
      const created = await prisma.tb_salas.create({
        data: sala
      });
      createdSalas.push(created);
      console.log(`✅ Sala criada: ${created.designacao} (Código: ${created.codigo})`);
    }

    console.log('🎉 Seed de salas concluído com sucesso!');

    res.json({
      success: true,
      message: 'Salas criadas com sucesso!',
      data: createdSalas
    });

  } catch (error) {
    console.error('❌ Erro ao executar seed de salas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar salas',
      error: error.message
    });
  }
};

// Seed completo (períodos + salas)
export const seedAcademico = async (req, res) => {
  try {
    console.log('🎓 Iniciando seed acadêmico completo...');

    // Executar seed de períodos
    const periodosResult = await seedPeriodosInternal();
    
    // Executar seed de salas
    const salasResult = await seedSalasInternal();

    res.json({
      success: true,
      message: 'Seed acadêmico concluído com sucesso!',
      data: {
        periodos: periodosResult,
        salas: salasResult
      }
    });

  } catch (error) {
    console.error('❌ Erro ao executar seed acadêmico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no seed acadêmico',
      error: error.message
    });
  }
};

// Funções internas para uso no seed completo
async function seedPeriodosInternal() {
  const existingPeriodos = await prisma.tb_periodos.findMany();
  
  if (existingPeriodos.length > 0) {
    return existingPeriodos;
  }

  const periodos = [
    { designacao: 'Manhã' },
    { designacao: 'Tarde' },
    { designacao: 'Noite' }
  ];

  const createdPeriodos = [];
  for (const periodo of periodos) {
    const created = await prisma.tb_periodos.create({
      data: periodo
    });
    createdPeriodos.push(created);
  }

  return createdPeriodos;
}

async function seedSalasInternal() {
  const existingSalas = await prisma.tb_salas.findMany();
  
  if (existingSalas.length > 0) {
    return existingSalas;
  }

  const salas = [
    { designacao: 'Sala A1' },
    { designacao: 'Sala A2' },
    { designacao: 'Sala B1' },
    { designacao: 'Sala B2' },
    { designacao: 'Laboratório 1' },
    { designacao: 'Auditório' },
    { designacao: 'Sala C1' },
    { designacao: 'Biblioteca' },
    { designacao: 'Sala D1' },
    { designacao: 'Sala D2' }
  ];

  const createdSalas = [];
  for (const sala of salas) {
    const created = await prisma.tb_salas.create({
      data: sala
    });
    createdSalas.push(created);
  }

  return createdSalas;
}
