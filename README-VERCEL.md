# 🚀 Deploy do Backend Junqueira na Vercel

## 📋 Pré-requisitos

1. **Conta na Vercel**: https://vercel.com
2. **Banco de dados MySQL**: PlanetScale, Railway, ou outro provedor
3. **Repositório Git**: GitHub, GitLab, ou Bitbucket

## 🔧 Passos para Deploy

### 1. **Preparar o Banco de Dados**
```bash
# Opção 1: PlanetScale (Recomendado)
# - Criar conta em https://planetscale.com
# - Criar database "junqueira-db"
# - Copiar CONNECTION_STRING

# Opção 2: Railway
# - Criar conta em https://railway.app
# - Criar MySQL database
# - Copiar CONNECTION_STRING
```

### 2. **Configurar Variáveis de Ambiente na Vercel**
```bash
# No painel da Vercel, adicionar:
DATABASE_URL="mysql://user:pass@host:port/database"
JWT_SECRET="seu_jwt_secret_super_seguro_aqui"
NODE_ENV="production"
BCRYPT_SALT_ROUNDS="12"
JWT_EXPIRES_IN="1h"
```

### 3. **Deploy Automático**
```bash
# 1. Conectar repositório à Vercel
# 2. Vercel detectará automaticamente as configurações
# 3. Deploy será feito automaticamente
```

### 4. **Executar Migrações**
```bash
# Após primeiro deploy, executar no terminal da Vercel:
npx prisma db push
```

## 🔗 URLs Importantes

- **Backend**: https://seu-backend.vercel.app
- **Swagger**: https://seu-backend.vercel.app/docs
- **Health Check**: https://seu-backend.vercel.app/api/health

## ⚙️ Configurações Importantes

### Timeout
- Vercel Free: 10s por função
- Vercel Pro: 30s por função (configurado)

### Banco de Dados
- Usar connection pooling
- Configurar timeout adequado
- Usar SSL em produção

## 🐛 Troubleshooting

### Erro de Timeout
```bash
# Aumentar timeout no vercel.json
"functions": {
  "src/server.js": {
    "maxDuration": 30
  }
}
```

### Erro de Prisma
```bash
# Executar no terminal da Vercel:
npx prisma generate
npx prisma db push
```

### Erro de CORS
```bash
# Verificar se frontend URL está nas configurações de CORS
# Atualizar em src/server.js se necessário
```
