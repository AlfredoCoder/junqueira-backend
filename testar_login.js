import { autenticarUsuario } from './src/services/userService.js';

async function testarLogin() {
  console.log('🔐 Testando sistema de login integrado...\n');

  const testesLogin = [
    { username: 'admin', password: 'admin123', tipo: 'Administrador' },
    { username: 'ana.sousa', password: '123456', tipo: 'Professor' },
    { username: 'usuario.inexistente', password: '123456', tipo: 'Erro esperado' }
  ];

  for (const teste of testesLogin) {
    console.log(`🧪 Testando login: ${teste.username} (${teste.tipo})`);
    
    try {
      const resultado = await autenticarUsuario(teste.username, teste.password);
      
      console.log('   ✅ Login realizado com sucesso!');
      console.log(`   👤 Nome: ${resultado.nome}`);
      console.log(`   🏷️  Tipo: ${resultado.tipo}`);
      console.log(`   📊 Dados específicos: ${resultado.tipoDados}`);
      
      if (resultado.dados) {
        console.log(`   📋 Dados adicionais: ${Object.keys(resultado.dados).join(', ')}`);
      }
      
    } catch (error) {
      if (teste.tipo === 'Erro esperado') {
        console.log('   ⚪ Erro esperado:', error.message);
      } else {
        console.log('   ❌ Erro inesperado:', error.message);
      }
    }
    
    console.log('');
  }

  console.log('✅ Teste de login concluído!');
}

// Executar
testarLogin();
