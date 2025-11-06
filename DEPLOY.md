# Deploy no Render - JoMorais Backend

## 📋 Análise do Projeto

### Estrutura do Projeto
- **Framework**: Node.js com Express
- **Banco de Dados**: MySQL com Prisma ORM
- **Autenticação**: JWT com bcryptjs
- **Documentação**: Swagger
- **Arquitetura**: MVC com controllers, services, routes e validações

### Endpoints Principais
- Auth: `/api/auth`
- Users: `/api/users`
- Geographic: `/api/geographic`
- Institutional: `/api/institutional`
- Academic Management: `/api/academic-management`
- Student Management: `/api/student-management`
- Payment Management: `/api/payment-management`
- E mais 6 módulos adicionais

## 🚀 Processo de Deploy no Render

### Preparação Concluída
✅ Arquivos de configuração criados:
- `render.yaml` - Configuração automática para Render
- `.env.example` - Template de variáveis de ambiente
- `scripts/render-build.sh` - Script de build personalizado
- Scripts de build e postinstall adicionados ao `package.json`

### 1. Criar Conta no Render
1. Acesse https://render.com
2. Crie uma conta ou faça login
3. Conecte sua conta GitHub

### 2. Deploy Automático com render.yaml
1. No dashboard do Render, clique em "New +"
2. Selecione "Blueprint"
3. Conecte o repositório: `emanuel-malungo/jomorais-backend`
4. O Render detectará automaticamente o arquivo `render.yaml`
5. Clique em "Apply"

### 3. Deploy Manual (Alternativo)
Se preferir configuração manual:

#### Banco de Dados
1. Criar novo PostgreSQL Database:
   - Name: `jomorais-db`
   - Plan: Free (ou Starter para produção)
   - Region: Oregon

#### Web Service
1. Criar novo Web Service:
   - Repository: `emanuel-malungo/jomorais-backend`
   - Branch: `main`
   - Runtime: Node
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`

#### Variáveis de Ambiente
Configure no painel do Render:
```
NODE_ENV=production
PORT=8000
DATABASE_URL=[URL do banco criado automaticamente]
JWT_SECRET=[Gerar senha forte]
BCRYPT_SALT_ROUNDS=12
JWT_EXPIRES_IN=1h
```

### 4. Configuração do Banco
Após o deploy inicial:
1. Acesse o shell do web service no Render
2. Execute: `npx prisma db push --accept-data-loss`

### 5. URLs de Acesso
- **API**: https://your-app-name.onrender.com
- **Health Check**: https://your-app-name.onrender.com/health
- **Swagger Docs**: https://your-app-name.onrender.com/api/docs

## 🔧 Configurações Importantes

### Banco de Dados
- O projeto usa MySQL no desenvolvimento
- Para produção no Render, recomenda-se PostgreSQL (gratuito)
- Ajustar schema.prisma se necessário: `provider = "postgresql"`

### Performance
- Free tier do Render "hiberna" após 15min de inatividade
- Starter plan ($7/mês) mantém sempre ativo
- Para produção, considere upgrading

### Monitoramento
- Use endpoint `/health` para health checks
- Logs disponíveis no dashboard do Render
- Configurar alertas se necessário

## 🛠️ Comandos Úteis

### Localmente
```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma db push

# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

### No Render (Shell do serviço)
```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar migrations
npx prisma db push --accept-data-loss

# Visualizar banco
npx prisma studio
```

## 📊 Status do Deploy
- ✅ Código preparado e commitado
- ✅ Configurações de produção criadas
- ✅ Push para GitHub concluído
- 🔄 Próximo: Configurar no painel do Render

## 🔗 Links Importantes
- **Repositório**: https://github.com/emanuel-malungo/jomorais-backend
- **Render Dashboard**: https://dashboard.render.com
- **Documentação Render**: https://render.com/docs

---
*Deploy configurado em: $(date)*