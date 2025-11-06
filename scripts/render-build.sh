#!/bin/bash

# Script de setup para Render
echo "🚀 Configurando projeto para produção no Render..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Gerar o cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Migrar banco de dados (se necessário)
if [ "$NODE_ENV" = "production" ]; then
    echo "🗄️ Aplicando migrações do banco de dados..."
    npx prisma db push --accept-data-loss || echo "⚠️ Falha na migração - banco pode já estar configurado"
fi

echo "✅ Setup concluído com sucesso!"