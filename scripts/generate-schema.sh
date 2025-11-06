#!/bin/bash

# Script para gerar schema Prisma a partir da base de dados existente

echo "🔄 Sincronizando schema Prisma com a base de dados..."

# Verificar se os containers estão rodando
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Containers não estão rodando. Iniciando..."
    docker-compose up -d
    echo "⏳ Aguardando MySQL estar pronto..."
    sleep 30
fi

# Fazer introspection da base de dados para gerar o schema Prisma
echo "🔍 Fazendo introspection da base de dados..."
docker-compose exec app npx prisma db pull

# Gerar o cliente Prisma
echo "🔧 Gerando cliente Prisma..."
docker-compose exec app npx prisma generate

echo "✅ Schema Prisma sincronizado com sucesso!"
echo ""
echo "📝 O schema foi atualizado em: prisma/schema.prisma"
echo "🎯 Próximos passos:"
echo "   1. Revisar o schema gerado"
echo "   2. Ajustar tipos e relações conforme necessário"
echo "   3. Executar 'npx prisma db push' se fizer alterações"
echo ""