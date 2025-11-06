import { StudentManagementService } from './src/services/student-management.services.js';

async function testarServicoAluno() {
  console.log('🧪 Testando serviço de criação de aluno...\n');

  try {
    // Dados de teste com documento diferente
    const dadosAluno = {
      nome: "Ana Maria Fernandes",
      pai: "Carlos Fernandes",
      mae: "Luisa Maria",
      sexo: "F",
      dataNascimento: new Date("2006-03-20"),
      telefone: "924567890",
      email: "ana.fernandes@email.com",
      morada: "Rua das Flores, 456",
      codigo_Nacionalidade: 1,
      codigo_Estado_Civil: 1,
      codigo_Comuna: 2,
      codigoTipoDocumento: 1,
      codigo_Status: 1,
      saldo: 0,
      n_documento_identificacao: "987654321LA042",
      encarregado: {
        nome: "Luisa Maria Fernandes",
        telefone: "913456789",
        email: "luisa.fernandes@email.com",
        codigo_Profissao: 53, // Outro
        local_Trabalho: "Comerciante",
        status: 1
      }
    };

    console.log('📤 Chamando StudentManagementService.createAlunoComEncarregado...');
    
    const resultado = await StudentManagementService.createAlunoComEncarregado(
      dadosAluno, 
      2 // codigo_Utilizador = 2 (admin)
    );

    console.log('\n✅ Aluno criado com sucesso!');
    console.log('📋 Dados retornados:');
    console.log(`   Código do aluno: ${resultado.codigo}`);
    console.log(`   Nome: ${resultado.nome}`);
    console.log(`   Encarregado: ${resultado.tb_encarregados?.nome}`);
    console.log(`   Tipo de documento: ${resultado.tb_tipo_documento?.designacao}`);

  } catch (error) {
    console.error('\n❌ Erro ao criar aluno:');
    console.error('Tipo:', error.constructor.name);
    console.error('Mensagem:', error.message);
    
    if (error.code) {
      console.error('Código:', error.code);
    }
    
    if (error.meta) {
      console.error('Meta:', JSON.stringify(error.meta, null, 2));
    }
    
    console.error('\nStack trace:');
    console.error(error.stack);
  }
}

// Executar
testarServicoAluno();
