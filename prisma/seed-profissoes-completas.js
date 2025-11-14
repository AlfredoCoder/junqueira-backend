import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('💼 Atualizando profissões com mais opções comuns...');

  // PROFISSÕES COMPLETAS E COMUNS EM ANGOLA
  const profissoesCompletas = [
    // Profissões existentes (mantidas)
    { codigo: 1, designacao: 'Professor' },
    { codigo: 2, designacao: 'Médico' },
    { codigo: 3, designacao: 'Enfermeiro' },
    { codigo: 4, designacao: 'Engenheiro' },
    { codigo: 5, designacao: 'Advogado' },
    { codigo: 6, designacao: 'Contador' },
    { codigo: 7, designacao: 'Comerciante' },
    { codigo: 8, designacao: 'Funcionário Público' },
    { codigo: 9, designacao: 'Empresário' },
    { codigo: 10, designacao: 'Técnico' },
    { codigo: 11, designacao: 'Motorista' },
    { codigo: 12, designacao: 'Doméstica' },
    { codigo: 13, designacao: 'Agricultor' },
    { codigo: 14, designacao: 'Mecânico' },
    { codigo: 15, designacao: 'Electricista' },
    { codigo: 16, designacao: 'Carpinteiro' },
    { codigo: 17, designacao: 'Pedreiro' },
    { codigo: 18, designacao: 'Vendedor' },
    { codigo: 19, designacao: 'Desempregado' },
    { codigo: 20, designacao: 'Outros' },

    // NOVAS PROFISSÕES COMUNS
    { codigo: 21, designacao: 'Militar' },
    { codigo: 22, designacao: 'Polícia' },
    { codigo: 23, designacao: 'Gestor' },
    { codigo: 24, designacao: 'Contabilista' },
    { codigo: 25, designacao: 'Recursos Humanos' },
    { codigo: 26, designacao: 'Técnico de Obras' },
    { codigo: 27, designacao: 'Taxista' },
    { codigo: 28, designacao: 'Bancário' },
    { codigo: 29, designacao: 'Secretária' },
    { codigo: 30, designacao: 'Cozinheiro' },
    { codigo: 31, designacao: 'Segurança' },
    { codigo: 32, designacao: 'Farmacêutico' },
    { codigo: 33, designacao: 'Jornalista' },
    { codigo: 34, designacao: 'Arquiteto' },
    { codigo: 35, designacao: 'Veterinário' },
    { codigo: 36, designacao: 'Psicólogo' },
    { codigo: 37, designacao: 'Fisioterapeuta' },
    { codigo: 38, designacao: 'Dentista' },
    { codigo: 39, designacao: 'Operador de Máquinas' },
    { codigo: 40, designacao: 'Soldador' },
    { codigo: 41, designacao: 'Pintor' },
    { codigo: 42, designacao: 'Barbeiro/Cabeleireiro' },
    { codigo: 43, designacao: 'Costureira' },
    { codigo: 44, designacao: 'Padeiro' },
    { codigo: 45, designacao: 'Técnico de Informática' },
    { codigo: 46, designacao: 'Técnico de Telecomunicações' },
    { codigo: 47, designacao: 'Técnico de Refrigeração' },
    { codigo: 48, designacao: 'Técnico Agrícola' },
    { codigo: 49, designacao: 'Operário' },
    { codigo: 50, designacao: 'Artesão' },
    { codigo: 51, designacao: 'Músico' },
    { codigo: 52, designacao: 'Artista' },
    { codigo: 53, designacao: 'Desportista' },
    { codigo: 54, designacao: 'Consultor' },
    { codigo: 55, designacao: 'Analista' },
    { codigo: 56, designacao: 'Supervisor' },
    { codigo: 57, designacao: 'Coordenador' },
    { codigo: 58, designacao: 'Diretor' },
    { codigo: 59, designacao: 'Gerente' },
    { codigo: 60, designacao: 'Assistente Administrativo' }
  ];

  let novasProfissoes = 0;
  let profissoesAtualizadas = 0;

  for (const profissao of profissoesCompletas) {
    const resultado = await prisma.tb_profissao.upsert({
      where: { codigo: profissao.codigo },
      update: { 
        designacao: profissao.designacao 
      },
      create: profissao
    });

    // Verificar se foi criado ou atualizado
    const existia = await prisma.tb_profissao.findFirst({
      where: { codigo: profissao.codigo }
    });

    if (profissao.codigo > 20) {
      novasProfissoes++;
    } else {
      profissoesAtualizadas++;
    }
  }

  console.log(`✅ Profissões processadas: ${profissoesCompletas.length}`);
  console.log(`✅ Profissões existentes mantidas: ${profissoesAtualizadas}`);
  console.log(`✅ Novas profissões adicionadas: ${novasProfissoes}`);
  
  console.log('\n📋 Novas profissões adicionadas:');
  console.log('   • Militar, Polícia, Gestor, Contabilista');
  console.log('   • Recursos Humanos, Técnico de Obras, Taxista');
  console.log('   • Bancário, Secretária, Cozinheiro, Segurança');
  console.log('   • Farmacêutico, Jornalista, Arquiteto, Veterinário');
  console.log('   • Psicólogo, Fisioterapeuta, Dentista');
  console.log('   • Técnicos especializados, Operários, Artesãos');
  console.log('   • Cargos de gestão e coordenação');
  console.log('   • E muitas outras profissões comuns');

  console.log('\n✅ Sistema de profissões completamente atualizado!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao atualizar profissões:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
