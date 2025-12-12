# Inicio Rápido - Empower

## 🚀 Ejecutar la aplicación en 3 pasos

### 1️⃣ Asegúrate de tener Docker instalado

Verifica que Docker esté corriendo:
```bash
docker --version
docker-compose --version
```

### 2️⃣ Construir y ejecutar

Desde la carpeta del proyecto, ejecuta:
```bash
docker-compose up --build
```

**⏱️ Tiempo estimado**: 3-5 minutos la primera vez

### 3️⃣ Acceder a la aplicación

Abre tu navegador en: **http://localhost:3000**

---

## 🎯 Crear tu primer usuario

**IMPORTANTE**: La aplicación NO incluye usuarios de prueba. Debes crear tu propia cuenta:

1. Haz clic en **"Registrarse"**
2. Completa el formulario con:
   - **Nombre** y **apellidos** (solo letras, mínimo 2 caracteres)
   - **Institución educativa** (mínimo 2 caracteres)
   - **Correo** (debe ser `@gmail.com` o `@queretaro.tecnm.mx`)
   - **Contraseña** (6-10 caracteres, con mayúscula, minúscula y número)
3. Haz clic en **"Registrar"**
4. Inicia sesión con tus credenciales

**Nota**: Los nuevos usuarios comienzan con **0 puntos** en todas las categorías.

---

## 📱 Pantallas disponibles

1. **Login** - Iniciar sesión
2. **Registro** - Crear cuenta nueva
3. **Home** - Ver tus puntos de reciclaje
4. **Perfil** - Ver información de usuario
5. **Configuración** - Ajustes de la app

---

## 🛑 Detener la aplicación

Presiona `Ctrl + C` en la terminal donde está corriendo, luego:

```bash
docker-compose down
```

---

## 🔧 URLs de los servicios

- **Frontend (React)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **Base de Datos**: localhost:5432
- **Adminer (GUI Base de Datos)**: http://localhost:8080

---

## 🗄️ Administrar Base de Datos

### Interfaz Gráfica (Adminer)

Para ver y editar los datos directamente:

1. Entra a **http://localhost:8080**
2. Usa estas credenciales:
   - **Sistema**: `PostgreSQL`
   - **Servidor**: `postgres`
   - **Usuario**: `empower_user`
   - **Contraseña**: `empower_secure_password_2025`
   - **Base de datos**: `empower_db`

### Línea de Comandos (psql)

Para acceder directamente a PostgreSQL:

```bash
docker exec -it empower-db psql -U empower_user -d empower_db
```

### Limpiar usuarios de prueba

Si necesitas eliminar usuarios de prueba:

**Opción 1: Usando Adminer**
1. Accede a http://localhost:8080
2. Inicia sesión con las credenciales de arriba
3. Ve a la tabla `usuarios`
4. Selecciona y elimina los usuarios que desees

**Opción 2: Usando psql**
```bash
# Acceder a la base de datos
docker exec -it empower-db psql -U empower_user -d empower_db

# Eliminar un usuario específico (también elimina sus puntos automáticamente)
DELETE FROM usuarios WHERE correo = 'usuario@ejemplo.com';

# Ver todos los usuarios
SELECT id, nombre, apellidos, correo FROM usuarios;

# Salir
\q
```

**Nota**: Al eliminar un usuario, sus puntos se eliminan automáticamente gracias a la relación CASCADE.

## ❓ Problemas comunes

### "Port already in use"

Si el puerto 3000 o 5000 ya está en uso, puedes cambiarlos en `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Cambia 3001 por el puerto que quieras
```

### "Cannot connect to database"

Espera unos segundos más. PostgreSQL tarda en iniciar la primera vez.

---

## 📦 Estructura de carpetas

```
empower3/
├── frontend/        # React App
├── backend/         # Express API
├── database/        # PostgreSQL scripts
└── docker-compose.yml
```

---

## 🎓 Ejemplos de uso de la API

### Registrar usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellidos": "Pérez",
    "escuela": "Instituto Tecnológico",
    "correo": "juan.perez@gmail.com",
    "contrasena": "Pass123"
  }'
```

### Iniciar sesión
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "juan.perez@gmail.com",
    "contrasena": "Pass123"
  }'
```

### Obtener puntos
```bash
curl http://localhost:5000/api/points/user/juan.perez@gmail.com
```

---

## 📚 Más información

Lee el [README.md](README.md) completo para:
- Documentación detallada de la API
- Reglas de validación
- Configuración avanzada
- Desarrollo local
- Troubleshooting

---

**¡Listo! Ahora puedes usar Empower 🌱♻️**
