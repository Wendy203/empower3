# Arquitectura del Sistema - Empower

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIO                              │
│                      (Navegador Web)                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTP/HTTPS
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    FRONTEND (Puerto 3000)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Application                        │   │
│  │                                                        │   │
│  │  • Login/Register Pages                              │   │
│  │  • Home (Points Display)                             │   │
│  │  • Profile & Config Pages                            │   │
│  │  • API Service Layer (Axios)                         │   │
│  │  • JWT Token Management                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                   Docker Container (Node:18)                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ REST API (JSON)
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    BACKEND (Puerto 5000)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express.js API Server                    │   │
│  │                                                        │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │   │
│  │  │   Routes    │  │  Middleware  │  │   Config    │ │   │
│  │  │             │  │              │  │             │ │   │
│  │  │ • /auth     │  │ • Validation │  │ • Database  │ │   │
│  │  │ • /points   │  │ • Auth JWT   │  │ • Env Vars  │ │   │
│  │  └─────────────┘  └──────────────┘  └─────────────┘ │   │
│  │                                                        │   │
│  │  Business Logic:                                      │   │
│  │  • User Registration & Login                         │   │
│  │  • Password Hashing (bcrypt)                         │   │
│  │  • JWT Token Generation                              │   │
│  │  • Points Retrieval                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                   Docker Container (Node:18)                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ SQL Queries (pg)
                 │
┌────────────────▼────────────────────────────────────────────┐
│                  DATABASE (Puerto 5432)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL 15                            │   │
│  │                                                        │   │
│  │  ┌────────────────┐        ┌────────────────┐        │   │
│  │  │ usuarios       │        │ puntos         │        │   │
│  │  ├────────────────┤        ├────────────────┤        │   │
│  │  │ id (PK)        │        │ id (PK)        │        │   │
│  │  │ nombre         │        │ usuario_id (FK)│◄───┐   │   │
│  │  │ apellidos      │        │ plastico       │    │   │   │
│  │  │ escuela        │        │ carton         │    │   │   │
│  │  │ correo (UNIQUE)│        │ aluminio       │    │   │   │
│  │  │ contrasena     │        │ total          │    │   │   │
│  │  │ fecha_registro │        │ ultima_actual  │    │   │   │
│  │  └────────────────┘        └────────────────┘    │   │   │
│  │         │                                         │   │   │
│  │         └─────────────────────────────────────────┘   │   │
│  │                   One-to-One Relationship             │   │
│  │                                                        │   │
│  │  Features:                                            │   │
│  │  • Trigger para calcular total automáticamente       │   │
│  │  • Índices para optimizar búsquedas                  │   │
│  │  • Cascade delete de puntos al eliminar usuario      │   │
│  └──────────────────────────────────────────────────────┘   │
│                Docker Container (Postgres:15-alpine)         │
│                Volume: postgres_data (persistente)           │
└─────────────────────────────────────────────────────────────┘
```

## Comunicación entre Servicios

### Red Docker: `empower-network`

Todos los contenedores están conectados a una red bridge privada:

```
frontend ──► backend ──► postgres
  :3000      :5000        :5432
```

## Flujo de Datos

### 1. Registro de Usuario

```
Usuario → Frontend → Backend → Database
                      │
                      ├─ Validar datos
                      ├─ Hash contraseña (bcrypt)
                      ├─ Insertar usuario
                      └─ Crear puntos iniciales (0,0,0)
```

### 2. Inicio de Sesión

```
Usuario → Frontend → Backend → Database
                      │
                      ├─ Buscar usuario por email
                      ├─ Verificar contraseña
                      ├─ Generar JWT token
                      └─ Retornar token + user data
                              │
Frontend ◄────────────────────┘
  │
  └─ Guardar token en localStorage
```

### 3. Consulta de Puntos

```
Usuario → Frontend → Backend → Database
           (JWT)       │
                      ├─ Verificar JWT token
                      ├─ Extraer user_id del token
                      ├─ Consultar puntos
                      └─ Retornar datos
                              │
Frontend ◄────────────────────┘
  │
  └─ Mostrar puntos en UI
```

## Seguridad

### Capas de Seguridad Implementadas

1. **Frontend**:
   - Validación de formularios
   - Protección de rutas (requiere autenticación)
   - Tokens almacenados en localStorage
   - Auto-logout en token expirado

2. **Backend**:
   - Validación de datos con `express-validator`
   - Contraseñas hasheadas con `bcrypt` (salt rounds: 10)
   - Autenticación JWT
   - CORS habilitado
   - Prepared statements (prevención SQL injection)

3. **Base de Datos**:
   - Constraints (UNIQUE, CHECK)
   - Foreign Keys con CASCADE
   - Índices para performance
   - Triggers para lógica de negocio

### Flujo de Autenticación JWT

```
┌─────────┐                 ┌─────────┐                ┌──────────┐
│Frontend │                 │ Backend │                │ Database │
└────┬────┘                 └────┬────┘                └────┬─────┘
     │                           │                          │
     │ POST /auth/login          │                          │
     ├──────────────────────────►│                          │
     │ {email, password}         │                          │
     │                           │ SELECT * FROM usuarios   │
     │                           ├─────────────────────────►│
     │                           │                          │
     │                           │◄─────────────────────────┤
     │                           │ user_data                │
     │                           │                          │
     │                           │ bcrypt.compare()         │
     │                           │                          │
     │                           │ jwt.sign()               │
     │                           │                          │
     │◄──────────────────────────┤                          │
     │ {token, user}             │                          │
     │                           │                          │
     │ localStorage.setItem()    │                          │
     │                           │                          │
     │ GET /points/me            │                          │
     │ Header: Bearer {token}    │                          │
     ├──────────────────────────►│                          │
     │                           │ jwt.verify()             │
     │                           │                          │
     │                           │ SELECT * FROM puntos     │
     │                           ├─────────────────────────►│
     │                           │                          │
     │◄──────────────────────────┤◄─────────────────────────┤
     │ {puntos}                  │                          │
     │                           │                          │
```

## Escalabilidad

### Escalamiento Horizontal Potencial

```
               ┌──── Load Balancer ────┐
               │                        │
        ┌──────▼──────┐         ┌──────▼──────┐
        │  Frontend 1 │         │  Frontend 2 │
        └─────────────┘         └─────────────┘
               │                        │
               └────────┬───────────────┘
                        │
               ┌────────▼────────┐
               │  Load Balancer  │
               └────────┬────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
   │Backend 1│    │Backend 2│    │Backend 3│
   └────┬────┘    └────┬────┘    └────┬────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
              ┌─────────▼─────────┐
              │   PostgreSQL      │
              │   (Primary)       │
              │                   │
              │  ┌─────────────┐  │
              │  │ Read Replica│  │
              │  └─────────────┘  │
              └───────────────────┘
```

## Tecnologías y Versiones

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| Frontend | React | 18.2.0 |
| Frontend Runtime | Node.js | 18-alpine |
| Backend | Express | 4.18.2 |
| Backend Runtime | Node.js | 18-alpine |
| Database | PostgreSQL | 15-alpine |
| Containerización | Docker | 20.10+ |
| Orquestación | Docker Compose | 2.0+ |
| Autenticación | JWT | 9.0.2 |
| Password Hashing | bcrypt | 2.4.3 |
| Database Client | pg (node-postgres) | 8.11.3 |
| HTTP Client | Axios | 1.6.2 |
| Router | React Router | 6.20.0 |
| Validación | express-validator | 7.0.1 |

## Variables de Entorno

### Frontend
- `REACT_APP_API_URL`: URL del backend API

### Backend
- `DB_HOST`: Host de PostgreSQL
- `DB_PORT`: Puerto de PostgreSQL
- `DB_NAME`: Nombre de la base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `PORT`: Puerto del servidor Express
- `NODE_ENV`: Ambiente (development/production)
- `JWT_SECRET`: Clave secreta para firmar JWT
- `JWT_EXPIRES_IN`: Tiempo de expiración del token

### Database
- `POSTGRES_DB`: Nombre de la base de datos
- `POSTGRES_USER`: Usuario administrador
- `POSTGRES_PASSWORD`: Contraseña administrador

## Volúmenes Docker

- `postgres_data`: Almacena datos persistentes de PostgreSQL
- `node_modules` (bind mounts): Optimización para desarrollo

## Puertos Expuestos

| Servicio | Puerto Interno | Puerto Externo |
|----------|---------------|----------------|
| Frontend | 3000 | 3000 |
| Backend | 5000 | 5000 |
| PostgreSQL | 5432 | 5432 |

## Health Checks

- **PostgreSQL**: `pg_isready` cada 10 segundos
- **Backend**: GET `/health` endpoint
- **Frontend**: React build verification

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0.0
