#!/bin/bash

# Script para configurar e executar o projeto JoMorais Backend

echo "🚀 Configurando ambiente JoMorais Backend..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose (V2) está disponível
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose (V2) não está disponível. Por favor, instale/atualize o Docker."
    exit 1
fi

# Copiar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Por favor, configure as variáveis necessárias."
fi

# Parar containers existentes (aplica-se apenas aos serviços definidos no compose)
echo "🛑 Parando containers existentes..."
docker compose down

# Remover volumes antigos (opcional - descomente se quiser resetar o banco)
# echo "🗑️  Removendo volumes antigos..."
# docker compose down -v

# Observação: o serviço da API (`jomorais_api`) foi removido do docker-compose para
# evitar tentativas de pull/build automáticas. Este script não irá construir nem iniciar
# o backend Node.js no container. Execute o backend localmente com `npm run dev` ou
# construa/tagueie a imagem manualmente antes de usar o compose:
#   docker build -t jomorais_api:latest .
#   docker compose up -d

echo "ℹ️  Iniciando apenas os serviços gerenciados pelo docker-compose (sem a API)..."
docker compose up -d

# Aguardar o MySQL estar pronto
echo "⏳ Aguardando MySQL estar pronto..."
sleep 30

# Verificar status dos containers
echo "📊 Status dos containers:"
docker compose ps

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "🌐 Serviços disponíveis:"
echo "   - API: http://localhost:3000"
echo "   - phpMyAdmin: http://localhost:8080"
echo "   - MySQL: localhost:3306"
echo ""
echo "📝 Credenciais do banco:"
echo "   - Usuário: jomorais_user"
echo "   - Senha: jomorais_password"
echo "   - Base de dados: gestao_escolar"
echo ""
echo "🛠️  Comandos úteis:"
echo "   - Ver logs: docker compose logs -f"
echo "   - Parar: docker compose down"
echo "   - Reiniciar: docker compose restart"
echo ""
