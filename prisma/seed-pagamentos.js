import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('💰 Iniciando seed de pagamentos...');

  // Verificar se já existem pagamentos
  const existingPagamentos = await prisma.tb_pagamentos.findMany();
  if (existingPagamentos.length > 0) {
    console.log('✅ Pagamentos já existem no banco:', existingPagamentos.length);
    return;
  }

  // Buscar alunos e serviços existentes
  const alunos = await prisma.tb_alunos.findMany();
  const servicos = await prisma.tb_tipo_servicos.findMany();
  
  if (alunos.length === 0) {
    console.log('❌ Nenhum aluno encontrado. Execute o seed de usuários primeiro.');
    return;
  }

  // Criar alguns pagamentos de exemplo
  const pagamentos = [
    {
      codigo_Aluno: alunos[0].codigo,
      codigo_Tipo_Servico: servicos.length > 0 ? servicos[0].codigo : null,
      data: new Date('2024-10-01'),
      n_Bordoro: 'PAG001',
      multa: 0,
      mes: 'Outubro',
      codigo_Utilizador: 1,
      observacao: 'Pagamento de propina',
      ano: 2024,
      contaMovimentada: 'CAIXA',
      quantidade: 1,
      desconto: 0,
      totalgeral: 15000,
      dataBanco: new Date('2024-10-01'),
      codigo_Estatus: 1,
      codigo_Empresa: 1,
      codigo_FormaPagamento: 1,
      saldo_Anterior: 0,
      codigoPagamento: 1,
      descontoSaldo: 0,
      tipoDocumento: 'RECIBO',
      next: 'PAG002',
      codoc: 1,
      fatura: 'FAT001',
      taxa_iva: 0,
      hash: 'hash001',
      preco: 15000,
      indice_mes: 10,
      indice_ano: 2024
    },
    {
      codigo_Aluno: alunos[1]?.codigo || alunos[0].codigo,
      codigo_Tipo_Servico: servicos.length > 0 ? servicos[0].codigo : null,
      data: new Date('2024-10-15'),
      n_Bordoro: 'PAG002',
      multa: 0,
      mes: 'Outubro',
      codigo_Utilizador: 1,
      observacao: 'Pagamento de propina',
      ano: 2024,
      contaMovimentada: 'CAIXA',
      quantidade: 1,
      desconto: 0,
      totalgeral: 15000,
      dataBanco: new Date('2024-10-15'),
      codigo_Estatus: 1,
      codigo_Empresa: 1,
      codigo_FormaPagamento: 1,
      saldo_Anterior: 0,
      codigoPagamento: 2,
      descontoSaldo: 0,
      tipoDocumento: 'RECIBO',
      next: 'PAG003',
      codoc: 2,
      fatura: 'FAT002',
      taxa_iva: 0,
      hash: 'hash002',
      preco: 15000,
      indice_mes: 10,
      indice_ano: 2024
    },
    {
      codigo_Aluno: alunos[2]?.codigo || alunos[0].codigo,
      codigo_Tipo_Servico: servicos.length > 0 ? servicos[0].codigo : null,
      data: new Date('2024-11-01'),
      n_Bordoro: 'PAG003',
      multa: 0,
      mes: 'Novembro',
      codigo_Utilizador: 1,
      observacao: 'Pagamento de propina',
      ano: 2024,
      contaMovimentada: 'CAIXA',
      quantidade: 1,
      desconto: 0,
      totalgeral: 15000,
      dataBanco: new Date('2024-11-01'),
      codigo_Estatus: 1,
      codigo_Empresa: 1,
      codigo_FormaPagamento: 1,
      saldo_Anterior: 0,
      codigoPagamento: 3,
      descontoSaldo: 0,
      tipoDocumento: 'RECIBO',
      next: 'PAG004',
      codoc: 3,
      fatura: 'FAT003',
      taxa_iva: 0,
      hash: 'hash003',
      preco: 15000,
      indice_mes: 11,
      indice_ano: 2024
    }
  ];

  let pagamentosCriados = 0;
  for (const pagamento of pagamentos) {
    try {
      await prisma.tb_pagamentos.create({
        data: pagamento
      });
      pagamentosCriados++;
    } catch (error) {
      console.log('⚠️ Erro ao criar pagamento:', error.message);
    }
  }

  console.log(`✅ Pagamentos criados: ${pagamentosCriados}`);
  console.log('🎉 Seed de pagamentos concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
