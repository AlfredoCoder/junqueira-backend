import { login } from './src/controllers/auth.controller.js';
import { obterPermissoes } from './src/controllers/auth.controller.js';

// Mock do request e response
const createMockReq = (body = {}, headers = {}) => ({
  body,
  headers,
  user: null
});

const createMockRes = () => {
  const res = {
    status: (code) => {
      res.statusCode = code;
      return res;
    },
    json: (data) => {
      res.data = data;
      return res;
    },
    statusCode: 200,
    data: null
  };
  return res;
};

async function testarPermissoes() {
  console.log('🔐 Testando sistema de permissões...\n');

  try {
    // 1. Fazer login como admin
    console.log('1️⃣ Fazendo login como administrador...');
    const loginReq = createMockReq({
      username: 'admin',
      password: 'admin123'
    });
    const loginRes = createMockRes();

    await login(loginReq, loginRes);

    if (!loginRes.data?.success) {
      console.log('❌ Erro no login:', loginRes.data?.message);
      return;
    }

    const token = loginRes.data.data.token;
    console.log('   ✅ Login realizado com sucesso');
    console.log(`   🎫 Token: ${token.substring(0, 20)}...`);

    // 2. Obter permissões
    console.log('\n2️⃣ Obtendo permissões do administrador...');
    const permReq = createMockReq({}, {
      authorization: `Bearer ${token}`
    });
    const permRes = createMockRes();

    await obterPermissoes(permReq, permRes);

    if (!permRes.data?.success) {
      console.log('❌ Erro ao obter permissões:', permRes.data?.message);
      return;
    }

    const permissoes = permRes.data.data.permissoes;
    console.log('   ✅ Permissões obtidas com sucesso');
    console.log('   📋 Permissões do Administrador:');
    
    Object.entries(permissoes).forEach(([modulo, acoes]) => {
      console.log(`      ${modulo}: [${acoes.join(', ')}]`);
    });

    // 3. Testar diferentes tipos de usuário
    console.log('\n3️⃣ Testando permissões por tipo de usuário:');
    
    const { getUserPermissions } = await import('./src/middleware/permissions.middleware.js');
    
    const tiposUsuario = ['Administrador', 'Professor', 'Aluno', 'Secretaria', 'Diretor'];
    
    tiposUsuario.forEach(tipo => {
      console.log(`\n   👤 ${tipo}:`);
      const perms = getUserPermissions(tipo);
      
      Object.entries(perms).forEach(([modulo, acoes]) => {
        if (acoes.length > 0) {
          console.log(`      ✅ ${modulo}: [${acoes.join(', ')}]`);
        } else {
          console.log(`      ❌ ${modulo}: [sem acesso]`);
        }
      });
    });

    console.log('\n✅ Teste de permissões concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    throw error;
  }
}

// Executar
testarPermissoes();
