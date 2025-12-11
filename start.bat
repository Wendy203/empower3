@echo off
echo ========================================
echo   EMPOWER - Sistema de Reciclaje
echo   Iniciando aplicacion...
echo ========================================
echo.

:: Verificar si Docker esta instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta instalado
    echo Por favor instala Docker Desktop desde: https://www.docker.com/get-started
    pause
    exit /b 1
)

:: Verificar si Docker esta corriendo
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta corriendo
    echo Por favor inicia Docker Desktop
    pause
    exit /b 1
)

echo Docker encontrado y corriendo correctamente
echo.
echo Construyendo e iniciando servicios...
echo Esto puede tardar varios minutos la primera vez...
echo.

docker-compose up --build

pause
