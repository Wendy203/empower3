# Comandos Útiles - Empower

Referencia rápida de comandos para trabajar con el proyecto.

## 🚀 Comandos Principales

### Iniciar la aplicación
```bash
# Primera vez (construye las imágenes)
docker-compose up --build

# Ejecuciones posteriores
docker-compose up

# En segundo plano (detached mode)
docker-compose up -d
```

### Detener la aplicación
```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA DATOS)
docker-compose down -v

# Detener, eliminar volúmenes e imágenes
docker-compose down -v --rmi all
```

## 📊 Monitoreo y Logs

### Ver logs
```bash
# Todos los servicios
docker-compose logs

# Logs en tiempo real
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Últimas 100 líneas
docker-compose logs --tail=100
```

### Ver estado de contenedores
```bash
# Estado de servicios
docker-compose ps

# Procesos corriendo
docker ps

# Todos los contenedores (incluyendo detenidos)
docker ps -a
```

## 🔧 Desarrollo y Debugging

### Acceder a contenedores
```bash
# Shell en el backend
docker exec -it empower-backend sh

# Shell en el frontend
docker exec -it empower-frontend sh

# PostgreSQL CLI
docker exec -it empower-db psql -U empower_user -d empower_db
```

### Reiniciar servicios
```bash
# Reiniciar un servicio específico
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres

# Reiniciar todos
docker-compose restart
```

### Reconstruir servicios
```bash
# Reconstruir un servicio
docker-compose build backend

# Reconstruir sin cache
docker-compose build --no-cache backend

# Reconstruir y arrancar
docker-compose up --build backend
```

## 🗄️ Base de Datos

### Acceder a PostgreSQL
```bash
# Conectar a PostgreSQL
docker exec -it empower-db psql -U empower_user -d empower_db
```

### Comandos SQL útiles
```sql
-- Listar tablas
\dt

-- Describir tabla
\d usuarios
\d puntos

-- Ver todos los usuarios
SELECT * FROM usuarios;

-- Ver puntos de todos los usuarios
SELECT u.nombre, u.correo, p.plastico, p.carton, p.aluminio, p.total
FROM usuarios u
JOIN puntos p ON u.id = p.usuario_id;

-- Agregar puntos manualmente (ejemplo)
UPDATE puntos
SET plastico = plastico + 100
WHERE usuario_id = 1;

-- Salir
\q
```

### Backup de base de datos
```bash
# Crear backup
docker exec empower-db pg_dump -U empower_user empower_db > backup.sql

# Restaurar backup
docker exec -i empower-db psql -U empower_user -d empower_db < backup.sql
```

### Resetear base de datos
```bash
# Detener y eliminar volumen
docker-compose down -v

# Volver a iniciar (ejecuta init.sql nuevamente)
docker-compose up
```

## 🧪 Testing y Verificación

### Probar endpoints con curl

#### Health Check
```bash
curl http://localhost:5000/health
```

#### Registrar usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellidos": "Usuario",
    "escuela": "Instituto Test",
    "correo": "test@gmail.com",
    "contrasena": "Test123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "maria.gonzalez@queretaro.tecnm.mx",
    "contrasena": "Test123"
  }'
```

#### Obtener puntos (sin autenticación)
```bash
curl http://localhost:5000/api/points/user/maria.gonzalez@queretaro.tecnm.mx
```

#### Obtener puntos (con autenticación)
```bash
# Primero obtén el token del login
TOKEN="tu_token_aqui"

curl http://localhost:5000/api/points/me \
  -H "Authorization: Bearer $TOKEN"
```

## 🧹 Limpieza

### Limpiar contenedores detenidos
```bash
docker container prune
```

### Limpiar imágenes no usadas
```bash
docker image prune

# Limpiar todas las imágenes no usadas
docker image prune -a
```

### Limpiar volúmenes no usados
```bash
docker volume prune
```

### Limpiar todo (⚠️ CUIDADO)
```bash
docker system prune -a --volumes
```

## 📦 Gestión de Dependencias

### Instalar nueva dependencia en backend
```bash
# Acceder al contenedor
docker exec -it empower-backend sh

# Instalar paquete
npm install nombre-paquete

# Salir
exit

# Reconstruir imagen
docker-compose build backend
```

### Instalar nueva dependencia en frontend
```bash
# Acceder al contenedor
docker exec -it empower-frontend sh

# Instalar paquete
npm install nombre-paquete

# Salir
exit

# Reconstruir imagen
docker-compose build frontend
```

## 🔍 Inspección y Análisis

### Ver uso de recursos
```bash
docker stats
```

### Inspeccionar contenedor
```bash
docker inspect empower-backend
docker inspect empower-frontend
docker inspect empower-db
```

### Ver redes Docker
```bash
docker network ls
docker network inspect empower_empower-network
```

### Ver volúmenes
```bash
docker volume ls
docker volume inspect empower_postgres_data
```

## 🐛 Troubleshooting

### Ver errores de compilación
```bash
# Forzar reconstrucción sin cache
docker-compose build --no-cache

# Ver logs de construcción
docker-compose build --progress=plain
```

### Resolver problemas de permisos (Linux/Mac)
```bash
# Dar permisos al script de inicio
chmod +x start.sh

# Cambiar propietario de node_modules
sudo chown -R $USER:$USER frontend/node_modules backend/node_modules
```

### Verificar conectividad entre servicios
```bash
# Desde el backend, hacer ping a postgres
docker exec empower-backend ping postgres

# Verificar variables de entorno
docker exec empower-backend env
```

### Reiniciar Docker (si algo falla)
```bash
# Windows/Mac
# Reinicia Docker Desktop desde la interfaz

# Linux
sudo systemctl restart docker
```

## 📱 Desarrollo Local (Sin Docker)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### PostgreSQL Local
```bash
# Instalar PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Crear base de datos
createdb empower_db

# Ejecutar script inicial
psql -d empower_db -f database/init.sql
```

## 🚢 Producción

### Build de producción del frontend
```bash
cd frontend
npm run build
```

### Variables de entorno para producción
```bash
# Crear archivo .env.production
cp .env.example .env.production

# Editar con credenciales seguras
nano .env.production
```

### Ejecutar en modo producción
```bash
# Cambiar NODE_ENV en .env
NODE_ENV=production

# Reconstruir
docker-compose build

# Ejecutar
docker-compose up -d
```

---

## ⌨️ Atajos de Teclado Recomendados

| Comando | Atajo | Descripción |
|---------|-------|-------------|
| `docker-compose up` | `dcu` | Iniciar servicios |
| `docker-compose down` | `dcd` | Detener servicios |
| `docker-compose logs -f` | `dcl` | Ver logs en tiempo real |
| `docker ps` | `dps` | Ver contenedores |

### Crear alias (Bash/Zsh)
```bash
# Agregar a ~/.bashrc o ~/.zshrc
alias dcu='docker-compose up'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dps='docker ps'
alias dcb='docker-compose build'
alias dcr='docker-compose restart'
```

---

**💡 Tip**: Guarda este archivo en tus favoritos para referencia rápida durante el desarrollo.
