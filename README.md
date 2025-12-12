# Empower - Sistema de Gamificación para Reciclaje

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Docker](https://img.shields.io/badge/docker-compose-blue.svg)

Sistema web de gamificación que incentiva el reciclaje en instituciones educativas mediante un sistema de puntos.

## Stack Tecnológico

- **Frontend**: React 18
- **Backend**: Node.js + Express
- **Base de Datos**: PostgreSQL 15
- **Containerización**: Docker + Docker Compose
- **Autenticación**: JWT (JSON Web Tokens)

## Estructura del Proyecto

```
empower3/
├── frontend/               # Aplicación React
│   ├── public/
│   ├── src/
│   │   ├── pages/         # Componentes de pantallas
│   │   ├── services/      # API services
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── backend/               # API REST con Express
│   ├── config/           # Configuración de BD
│   ├── middleware/       # Validaciones y auth
│   ├── routes/          # Endpoints de la API
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── database/             # Scripts de base de datos
│   └── init.sql         # Schema inicial
├── docker-compose.yml    # Orquestación de servicios
├── .env.example         # Variables de entorno ejemplo
└── README.md
```

## Requisitos Previos

- [Docker](https://www.docker.com/get-started) (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versión 2.0 o superior)
- Git (opcional, para clonar el repositorio)

## Instalación y Ejecución

### 1. Preparar el entorno

Copia el archivo de variables de entorno:

```bash
cp .env.example .env
```

**IMPORTANTE**: Edita el archivo `.env` y cambia las credenciales por defecto, especialmente en producción:

```env
DB_PASSWORD=tu_password_seguro
JWT_SECRET=tu_clave_jwt_super_secreta
```

### 2. Construir y ejecutar con Docker Compose

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up --build
```

Este comando:
- Construye las imágenes Docker para frontend, backend y base de datos
- Crea y conecta los contenedores
- Ejecuta las migraciones de base de datos
- Inicia todos los servicios

### 3. Acceder a la aplicación

Una vez que todos los servicios estén corriendo:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

### 4. Detener los servicios

Para detener todos los contenedores:

```bash
docker-compose down
```

Para detener y eliminar volúmenes (⚠️ **esto borrará todos los datos**):

```bash
docker-compose down -v
```

## Primeros Pasos

### Crear tu primer usuario

La aplicación **NO incluye usuarios de prueba** pre-cargados. Para comenzar a usar Empower:

1. Accede a **http://localhost:3000**
2. Haz clic en **"Registrarse"**
3. Completa el formulario de registro con tus datos
4. Inicia sesión con las credenciales que creaste

**Nota**: Los nuevos usuarios comienzan con 0 puntos en todas las categorías.

### Limpiar datos de prueba (opcional)

Si necesitas eliminar usuarios de prueba de la base de datos:

```bash
# Acceder a la base de datos
docker exec -it empower-db psql -U empower_user -d empower_db

# Eliminar un usuario específico (esto también elimina sus puntos automáticamente)
DELETE FROM usuarios WHERE correo = 'usuario@ejemplo.com';

# Salir de PostgreSQL
\q
```

O usa **Adminer** (interfaz gráfica) en **http://localhost:8080** para gestionar los datos visualmente.

## API Endpoints

### Autenticación

#### Registro de usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "María",
  "apellidos": "González López",
  "escuela": "Tecnológico de Querétaro",
  "correo": "maria@queretaro.tecnm.mx",
  "contrasena": "Test123"
}
```

#### Inicio de sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "maria@queretaro.tecnm.mx",
  "contrasena": "Test123"
}
```

**Respuesta exitosa**:
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "nombre": "María",
    "apellidos": "González López",
    "escuela": "Tecnológico de Querétaro",
    "correo": "maria@queretaro.tecnm.mx"
  }
}
```

### Puntos

#### Obtener puntos del usuario autenticado
```http
GET /api/points/me
Authorization: Bearer {token}
```

#### Obtener puntos por correo electrónico
```http
GET /api/points/user/:correo
```

**Respuesta**:
```json
{
  "puntos": {
    "plastico": 150,
    "carton": 220,
    "aluminio": 80,
    "total": 450,
    "ultima_actualizacion": "2025-12-11T10:30:00.000Z"
  }
}
```

## Reglas de Validación

### Registro de Usuarios

- **Nombre y Apellidos**: Solo letras, mínimo 2 caracteres
- **Institución Educativa**: Mínimo 2 caracteres
- **Correo Electrónico**:
  - Formato válido de email
  - Dominios permitidos: `gmail.com`, `queretaro.tecnm.mx`
  - Debe ser único en el sistema
- **Contraseña**:
  - Longitud: 6-10 caracteres
  - Debe contener al menos: 1 mayúscula, 1 minúscula, 1 número

## Desarrollo

### Ejecutar en modo desarrollo

#### Backend con auto-reload
```bash
cd backend
npm install
npm run dev
```

#### Frontend con auto-reload
```bash
cd frontend
npm install
npm start
```

#### Base de datos (PostgreSQL)
```bash
docker run --name empower-db \
  -e POSTGRES_DB=empower_db \
  -e POSTGRES_USER=empower_user \
  -e POSTGRES_PASSWORD=empower_password \
  -p 5432:5432 \
  -v $(pwd)/database/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -d postgres:15-alpine
```

### Ejecutar comandos dentro de contenedores

```bash
# Acceder al contenedor del backend
docker exec -it empower-backend sh

# Acceder a PostgreSQL
docker exec -it empower-db psql -U empower_user -d empower_db

# Ver logs de un servicio
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Comandos Útiles

```bash
# Ver estado de los contenedores
docker-compose ps

# Reiniciar un servicio específico
docker-compose restart backend

# Reconstruir solo un servicio
docker-compose up --build backend

# Ver logs en tiempo real
docker-compose logs -f

# Limpiar todo (contenedores, imágenes, volúmenes)
docker-compose down -v --rmi all
```

## Troubleshooting

### El frontend no se conecta al backend

Verifica que la variable `REACT_APP_API_URL` en `.env` apunte correctamente al backend:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Error de conexión a PostgreSQL

1. Verifica que el contenedor de PostgreSQL esté corriendo:
```bash
docker-compose ps postgres
```

2. Espera a que PostgreSQL esté completamente iniciado (verifica los logs):
```bash
docker-compose logs postgres
```

### El puerto 3000, 5000 o 5432 ya está en uso

Edita el `docker-compose.yml` para cambiar los puertos:
```yaml
ports:
  - "3001:3000"  # Cambia el primer número
```

### Resetear la base de datos

```bash
# Detener y eliminar volúmenes
docker-compose down -v

# Volver a iniciar (ejecutará init.sql nuevamente)
docker-compose up --build
```

## Funcionalidades Implementadas (v1.0)

- ✅ Registro de usuarios con validaciones
- ✅ Inicio de sesión con JWT
- ✅ Visualización de puntos por categoría (Plástico, Cartón, Aluminio)
- ✅ Pantalla de perfil de usuario
- ✅ Pantalla de configuración
- ✅ Cierre de sesión
- ✅ Persistencia de datos entre sesiones

## Roadmap (Versiones Futuras)

### v1.1 - Registro de Reciclaje
- Agregar actividades de reciclaje
- Suma de puntos por material reciclado
- Historial de transacciones

### v1.2 - Sistema de Recompensas
- Catálogo de recompensas
- Canje de puntos
- Niveles y logros

### v1.3 - Funcionalidades Sociales
- Ranking de usuarios
- Competencias entre instituciones
- Compartir logros

## Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Validaciones en backend y frontend
- ✅ Variables de entorno para credenciales
- ✅ Protección contra inyección SQL (prepared statements)
- ✅ CORS configurado

**Recomendaciones de seguridad**:
- Cambia el `JWT_SECRET` en producción
- Usa contraseñas fuertes para la base de datos
- Habilita HTTPS en producción
- Implementa rate limiting para prevenir ataques de fuerza bruta

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Soporte

Para reportar problemas o solicitar funcionalidades, por favor abre un issue en el repositorio del proyecto.

---

**Desarrollado con ❤️ para fomentar el reciclaje en instituciones educativas**
