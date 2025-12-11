#!/bin/bash

echo "========================================"
echo "  EMPOWER - Sistema de Reciclaje"
echo "  Iniciando aplicación..."
echo "========================================"
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ ERROR: Docker no está instalado"
    echo "Por favor instala Docker desde: https://www.docker.com/get-started"
    exit 1
fi

# Verificar si Docker está corriendo
if ! docker ps &> /dev/null; then
    echo "❌ ERROR: Docker no está corriendo"
    echo "Por favor inicia Docker"
    exit 1
fi

echo "✅ Docker encontrado y corriendo correctamente"
echo ""
echo "🔨 Construyendo e iniciando servicios..."
echo "⏱️  Esto puede tardar varios minutos la primera vez..."
echo ""

docker-compose up --build
