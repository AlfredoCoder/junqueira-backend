#!/bin/bash

# Script para desenvolver com o projeto JoMorais Backend

echo "🔧 JoMorais Backend - Menu de Desenvolvimento"
echo ""

# Função para mostrar o menu
show_menu() {
    echo "Escolha uma opção:"
    echo "1) Iniciar todos os serviços"
    echo "2) Parar todos os serviços"
    echo "3) Reiniciar todos os serviços"
    echo "4) Ver logs da aplicação"
    echo "5) Ver logs do MySQL"
    echo "6) Ver logs de todos os serviços"
    echo "7) Executar migrations do Prisma"
    echo "8) Gerar cliente Prisma"
    echo "9) Sincronizar schema Prisma com BD (db pull)"
    echo "10) Acessar shell do container da aplicação"
    echo "11) Backup da base de dados"
    echo "12) Limpar tudo (containers, volumes, imagens)"
    echo "13) Status dos containers"
    echo "0) Sair"
    echo ""
}

# Função para executar backup
backup_db() {
    echo "💾 Fazendo backup da base de dados..."
    timestamp=$(date +"%Y%m%d_%H%M%S")
    docker-compose exec mysql mysqldump -u jomorais_user -pjomorais_password gestao_escolar > "prisma/database/backup/backup_${timestamp}.sql"
    echo "✅ Backup criado: prisma/database/backup/backup_${timestamp}.sql"
}

# Loop principal
while true; do
    show_menu
    read -p "Digite sua escolha: " choice
    echo ""
    
    case $choice in
        1)
            echo "🚀 Iniciando todos os serviços..."
            docker-compose up -d
            echo "✅ Serviços iniciados!"
            ;;
        2)
            echo "🛑 Parando todos os serviços..."
            docker-compose down
            echo "✅ Serviços parados!"
            ;;
        3)
            echo "🔄 Reiniciando todos os serviços..."
            docker-compose restart
            echo "✅ Serviços reiniciados!"
            ;;
        4)
            echo "📋 Logs da aplicação:"
            docker-compose logs -f app
            ;;
        5)
            echo "📋 Logs do MySQL:"
            docker-compose logs -f mysql
            ;;
        6)
            echo "📋 Logs de todos os serviços:"
            docker-compose logs -f
            ;;
        7)
            echo "🔧 Executando migrations do Prisma..."
            docker-compose exec app npx prisma db push
            echo "✅ Migrations executadas!"
            ;;
        8)
            echo "🔧 Gerando cliente Prisma..."
            docker-compose exec app npx prisma generate
            echo "✅ Cliente Prisma gerado!"
            ;;
        9)
            echo "� Sincronizando schema Prisma com base de dados..."
            docker-compose exec app npx prisma db pull
            docker-compose exec app npx prisma generate
            echo "✅ Schema sincronizado!"
            ;;
        10)
            echo "�🐚 Acessando shell do container da aplicação..."
            docker-compose exec app sh
            ;;
        11)
            backup_db
            ;;
        12)
            echo "⚠️  Isso irá remover TODOS os containers, volumes e imagens!"
            read -p "Tem certeza? (y/N): " confirm
            if [[ $confirm =~ ^[Yy]$ ]]; then
                echo "🗑️  Limpando tudo..."
                docker-compose down -v --rmi all
                docker system prune -f
                echo "✅ Limpeza concluída!"
            else
                echo "❌ Operação cancelada."
            fi
            ;;
        13)
            echo "📊 Status dos containers:"
            docker-compose ps
            ;;
        0)
            echo "👋 Saindo..."
            exit 0
            ;;
        *)
            echo "❌ Opção inválida. Tente novamente."
            ;;
    esac
    echo ""
    read -p "Pressione Enter para continuar..."
    clear
done