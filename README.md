# JoMorais Backend - API de Gestão Escolar

API backend para sistema de gestão escolar desenvolvida com Node.js, Express, Prisma e MySQL.

## 🚀 Início Rápido com Docker

### Pré-requisitos

- Docker
- Docker Compose
- Git

### Configuração Inicial

1. **Clone e navegue para o projeto:**
   ```bash
   git clone https://github.com/emanuel-malungo/jomorais-backend.git
   cd jomorais-backend
   ```

2. **Execute o script de configuração:**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

   Ou use o comando npm:
   ```bash
   npm run docker:setup
   ```

3. **Aguarde a inicialização completa** (aproximadamente 1-2 minutos)

### 🎯 Serviços Disponíveis

Após a inicialização, os seguintes serviços estarão disponíveis:

- **API Principal**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
- **MySQL**: localhost:3306

### 🔐 Credenciais do Banco de Dados

- **Host**: mysql (dentro do Docker) / localhost (externamente)
- **Porto**: 3306
- **Usuário**: jomorais_user
- **Senha**: jomorais_password
- **Base de Dados**: gestao_escolar

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Configuração inicial
npm run docker:setup

# Menu interativo de desenvolvimento
npm run docker:dev

# Comandos básicos
npm run docker:up      # Iniciar serviços
npm run docker:down    # Parar serviços
npm run docker:logs    # Ver logs

# Prisma
npm run prisma:generate  # Gerar cliente Prisma
npm run prisma:push     # Sincronizar schema com BD
npm run prisma:studio   # Abrir Prisma Studio
```

### Menu de Desenvolvimento

Execute o script interativo para facilitar o desenvolvimento:

```bash
./scripts/dev.sh
```

Este menu oferece opções para:
- Iniciar/parar/reiniciar serviços
- Ver logs específicos
- Executar comandos Prisma
- Fazer backup da base de dados
- Acessar shell dos containers

## 📊 Estrutura da Base de Dados

A base de dados `gestao_escolar` é automaticamente importada do arquivo `prisma/database/jomorais_database.sql` durante a inicialização do container MySQL.

### Principais Tabelas

A base de dados inclui tabelas para:
- Gestão de alunos e funcionários
- Sistema de login (admin e pedagógico)
- Controlo de pagamentos e caixa
- Materiais e disciplinas
- Notas e avaliações
- E muito mais...

## 🏗️ Arquitetura do Projeto

```
jomorais-backend/
├── docker-compose.yml          # Configuração dos serviços
├── Dockerfile                  # Imagem da aplicação
├── scripts/                    # Scripts auxiliares
│   ├── setup.sh               # Configuração inicial
│   └── dev.sh                 # Menu de desenvolvimento
├── docker/                    # Configurações Docker
│   └── mysql/
│       └── my.cnf             # Configuração MySQL
├── prisma/
│   ├── schema.prisma          # Schema Prisma
│   └── database/
│       └── jomorais_database.sql  # Dump da BD
├── src/                       # Código da aplicação
│   ├── server.js             # Servidor principal
│   ├── config/               # Configurações
│   ├── controllers/          # Controladores
│   ├── routes/               # Rotas
│   ├── services/             # Serviços
│   └── utils/                # Utilitários
└── package.json              # Dependências e scripts
```

## 🔧 Comandos Docker Úteis

### Verificar Status

```bash
docker-compose ps
```

### Ver Logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas a aplicação
docker-compose logs -f app

# Apenas MySQL
docker-compose logs -f mysql
```

### Acessar Containers

```bash
# Shell da aplicação
docker-compose exec app sh

# MySQL CLI
docker-compose exec mysql mysql -u jomorais_user -p gestao_escolar
```

### Backup da Base de Dados

```bash
# Backup manual
docker-compose exec mysql mysqldump -u jomorais_user -pjomorais_password gestao_escolar > backup.sql

# Usando o menu de desenvolvimento
./scripts/dev.sh
# Escolha opção 10
```

## 🚨 Resolução de Problemas

### Container não inicia

1. Verificar se as portas estão disponíveis:
   ```bash
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :3306
   ```

2. Limpar containers e volumes:
   ```bash
   docker-compose down -v
   docker system prune -f
   ```

### Erro de conexão com MySQL

1. Aguardar mais tempo para MySQL inicializar
2. Verificar se o container MySQL está rodando:
   ```bash
   docker-compose ps mysql
   ```

### Problema com Prisma

```bash
# Regenerar cliente Prisma
docker-compose exec app npx prisma generate

# Sincronizar schema
docker-compose exec app npx prisma db push
```

## 🔐 Segurança

⚠️ **Importante**: Esta configuração é para desenvolvimento. Para produção:

1. Altere todas as senhas padrão
2. Use variáveis de ambiente seguras
3. Configure HTTPS
4. Implemente backup automático
5. Configure monitorização

## 📝 Variáveis de Ambiente

Configuração principal no arquivo `.env`:

```env
# Configuração do servidor
PORT=3000
NODE_ENV=development

# Base de dados
DATABASE_URL="mysql://jomorais_user:jomorais_password@mysql:3306/gestao_escolar"

# JWT
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_EXPIRES_IN="1h"

# Bcrypt
BCRYPT_SALT_ROUNDS=12
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Distribuído sob a licença ISC. Veja `LICENSE` para mais informações.

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Entre em contacto com a equipa de desenvolvimento

---

**Desenvolvido com ❤️ pela equipa JoMorais**