# 🧪 Guía de Pruebas - Empower

Esta guía te ayudará a probar todas las funcionalidades del sistema paso a paso.

---

## ✅ Pre-requisitos

Asegúrate de que la aplicación esté corriendo:

```bash
docker-compose up
```

Espera a ver estos mensajes:
```
✅ Conectado a PostgreSQL
🚀 Servidor corriendo en puerto 5000
webpack compiled successfully
```

---

## 🎯 Test 1: Verificar que todos los servicios estén corriendo

### Paso 1: Verificar Frontend
Abre tu navegador en: http://localhost:3000

**Resultado esperado**: Deberías ver la pantalla de login con el logo "EMPOWER"

### Paso 2: Verificar Backend
Abre tu navegador en: http://localhost:5000/health

**Resultado esperado**:
```json
{
  "status": "OK",
  "message": "Empower API is running",
  "timestamp": "2025-12-11T..."
}
```

### Paso 3: Verificar Base de Datos
```bash
docker exec -it empower-db psql -U empower_user -d empower_db -c "SELECT COUNT(*) FROM usuarios;"
```

**Resultado esperado**: Debería mostrar al menos 1 usuario (el de ejemplo)

---

## 🔐 Test 2: Probar Login con Usuario de Ejemplo

### Paso 1: Abrir aplicación
Ve a: http://localhost:3000

### Paso 2: Iniciar sesión
- **Email**: `maria.gonzalez@queretaro.tecnm.mx`
- **Contraseña**: `Test123`
- Clic en "Acceder"

**Resultado esperado**:
- ✅ Redirección a pantalla principal (/home)
- ✅ Ver tres tarjetas con puntos:
  - Plástico: 150 puntos
  - Cartón: 220 puntos
  - Aluminio: 80 puntos
- ✅ Total: 450 puntos

---

## 📝 Test 3: Registrar un Nuevo Usuario

### Paso 1: Ir a Registro
- Desde el login, clic en "¿No tienes cuenta? Regístrate aquí"

### Paso 2: Llenar formulario con datos válidos
```
Nombre: Juan
Apellidos: Pérez López
Institución: Tecnológico de Monterrey
Email: juan.perez@gmail.com
Contraseña: Test123
Confirmar contraseña: Test123
```

### Paso 3: Registrar
- Clic en "Registrar"

**Resultado esperado**:
- ✅ Mensaje: "Registro exitoso. Redirigiendo al inicio de sesión..."
- ✅ Redirección automática a login después de 2 segundos

### Paso 4: Iniciar sesión con nuevo usuario
- Email: `juan.perez@gmail.com`
- Contraseña: `Test123`

**Resultado esperado**:
- ✅ Login exitoso
- ✅ Puntos en 0 (porque es nuevo usuario):
  - Plástico: 0
  - Cartón: 0
  - Aluminio: 0
  - Total: 0

---

## ❌ Test 4: Probar Validaciones de Registro

### Test 4.1: Email Inválido (dominio no permitido)
```
Email: test@hotmail.com
```
**Resultado esperado**: Error "Solo se permiten correos de gmail.com o queretaro.tecnm.mx"

### Test 4.2: Contraseña Débil
```
Contraseña: abc123  (sin mayúscula)
```
**Resultado esperado**: Error sobre requisitos de contraseña

### Test 4.3: Contraseña Demasiado Corta
```
Contraseña: Ab1
```
**Resultado esperado**: Error "La contraseña debe tener entre 6 y 10 caracteres"

### Test 4.4: Contraseñas No Coinciden
```
Contraseña: Test123
Confirmar contraseña: Test456
```
**Resultado esperado**: Error "Las contraseñas no coinciden"

### Test 4.5: Email Duplicado
```
Email: maria.gonzalez@queretaro.tecnm.mx  (ya existe)
```
**Resultado esperado**: Error "Ya existe una cuenta con este correo electrónico"

### Test 4.6: Nombre Solo con Letras
```
Nombre: Juan123
```
**Resultado esperado**: Error "El nombre debe contener solo letras"

---

## 🔒 Test 5: Probar Autenticación

### Test 5.1: Login con credenciales incorrectas
```
Email: test@gmail.com
Contraseña: WrongPassword
```
**Resultado esperado**: Error "Credenciales incorrectas"

### Test 5.2: Acceder a ruta protegida sin autenticación
1. Cierra sesión
2. Intenta acceder directamente a: http://localhost:3000/home

**Resultado esperado**: Redirección automática a /login

### Test 5.3: Token JWT válido
1. Inicia sesión
2. Abre las DevTools del navegador (F12)
3. Ve a: Application > Local Storage > http://localhost:3000
4. Busca la clave `empowerToken`

**Resultado esperado**: Deberías ver un token JWT (formato: xxx.yyy.zzz)

---

## 🧭 Test 6: Navegación entre Pantallas

### Flujo completo de navegación:

1. **Login** → Inicia sesión
   - ✅ Redirección a Home

2. **Home** → Clic en ícono de perfil (👤)
   - ✅ Navegación a Perfil
   - ✅ Ver tu email

3. **Perfil** → Clic en "Configuración"
   - ✅ Navegación a Configuración
   - ✅ Ver email, versión (1.0.0)

4. **Configuración** → Clic en "Volver"
   - ✅ Regreso a Perfil

5. **Perfil** → Clic en "Volver"
   - ✅ Regreso a Home

6. **Home** → Clic en "Cerrar sesión"
   - ✅ Redirección a Login
   - ✅ Token eliminado de localStorage

---

## 🔌 Test 7: API Endpoints con curl/Postman

### Test 7.1: Registrar usuario (API directa)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pedro",
    "apellidos": "Martínez",
    "escuela": "Universidad Nacional",
    "correo": "pedro.martinez@gmail.com",
    "contrasena": "Pass123"
  }'
```

**Resultado esperado**:
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 3,
    "nombre": "Pedro",
    "apellidos": "Martínez",
    "escuela": "Universidad Nacional",
    "correo": "pedro.martinez@gmail.com",
    "fecha_registro": "..."
  }
}
```

### Test 7.2: Login (API directa)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "maria.gonzalez@queretaro.tecnm.mx",
    "contrasena": "Test123"
  }'
```

**Resultado esperado**:
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Test 7.3: Obtener puntos (sin autenticación)
```bash
curl http://localhost:5000/api/points/user/maria.gonzalez@queretaro.tecnm.mx
```

**Resultado esperado**:
```json
{
  "puntos": {
    "plastico": 150,
    "carton": 220,
    "aluminio": 80,
    "total": 450,
    "ultima_actualizacion": "..."
  }
}
```

### Test 7.4: Obtener puntos (con autenticación)
```bash
# Primero obtén el token del login anterior
TOKEN="tu_token_aqui"

curl http://localhost:5000/api/points/me \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado**: Mismo formato que Test 7.3

---

## 💾 Test 8: Persistencia de Datos

### Test 8.1: Verificar persistencia de sesión
1. Inicia sesión
2. Cierra el navegador completamente
3. Vuelve a abrir y ve a http://localhost:3000

**Resultado esperado**: Deberías estar todavía autenticado (ver Home directamente)

### Test 8.2: Verificar persistencia de datos en BD
1. Registra un nuevo usuario
2. Detén Docker: `docker-compose down`
3. Vuelve a iniciar: `docker-compose up`
4. Inicia sesión con el usuario creado

**Resultado esperado**: El usuario existe y puede iniciar sesión

---

## 🗄️ Test 9: Base de Datos Directa

### Test 9.1: Consultar todos los usuarios
```bash
docker exec -it empower-db psql -U empower_user -d empower_db
```

Luego ejecuta:
```sql
SELECT id, nombre, correo FROM usuarios;
```

**Resultado esperado**: Lista de todos los usuarios registrados

### Test 9.2: Ver puntos de todos los usuarios
```sql
SELECT u.nombre, u.correo, p.plastico, p.carton, p.aluminio, p.total
FROM usuarios u
JOIN puntos p ON u.id = p.usuario_id;
```

**Resultado esperado**: Tabla con todos los usuarios y sus puntos

### Test 9.3: Verificar trigger de total automático
```sql
-- Actualizar puntos de plástico
UPDATE puntos SET plastico = 200 WHERE usuario_id = 1;

-- Verificar que total se actualizó automáticamente
SELECT plastico, carton, aluminio, total FROM puntos WHERE usuario_id = 1;
```

**Resultado esperado**: El campo `total` se calculó automáticamente (debería ser 200 + carton + aluminio)

---

## 📊 Test 10: Rendimiento y Carga

### Test 10.1: Crear múltiples usuarios rápidamente
Ejecuta este script en Bash:

```bash
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{
      \"nombre\": \"Usuario\",
      \"apellidos\": \"Test $i\",
      \"escuela\": \"Instituto\",
      \"correo\": \"user$i@gmail.com\",
      \"contrasena\": \"Pass123\"
    }"
  echo ""
done
```

**Resultado esperado**: 10 usuarios creados exitosamente

### Test 10.2: Verificar logs del servidor
```bash
docker-compose logs backend --tail=50
```

**Resultado esperado**: Ver todas las peticiones registradas sin errores

---

## 🐛 Test 11: Manejo de Errores

### Test 11.1: Backend caído
1. Detén el backend: `docker-compose stop backend`
2. Intenta hacer login en el frontend

**Resultado esperado**: Error visible en la UI

3. Reinicia backend: `docker-compose start backend`

### Test 11.2: Base de datos caída
1. Detén PostgreSQL: `docker-compose stop postgres`
2. Intenta registrar un usuario

**Resultado esperado**: Error 500 del servidor

3. Reinicia PostgreSQL: `docker-compose start postgres`

---

## ✅ Checklist de Funcionalidades

Marca cada funcionalidad probada:

### Autenticación
- [ ] Registro de usuario válido
- [ ] Login exitoso
- [ ] Logout
- [ ] Validación de email único
- [ ] Validación de dominio de email
- [ ] Validación de contraseña fuerte
- [ ] Validación de nombres solo letras
- [ ] Token JWT guardado en localStorage
- [ ] Redirección en login exitoso
- [ ] Protección de rutas privadas

### Puntos
- [ ] Visualizar puntos de plástico
- [ ] Visualizar puntos de cartón
- [ ] Visualizar puntos de aluminio
- [ ] Visualizar total calculado
- [ ] Puntos en 0 para nuevos usuarios
- [ ] Puntos persistentes entre sesiones

### Navegación
- [ ] Login → Home
- [ ] Home → Perfil
- [ ] Perfil → Configuración
- [ ] Botones de "Volver" funcionan
- [ ] Cerrar sesión funciona

### API
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] GET /api/points/me (con auth)
- [ ] GET /api/points/user/:correo
- [ ] Health check endpoint

### Base de Datos
- [ ] Usuarios se guardan correctamente
- [ ] Puntos se crean automáticamente
- [ ] Trigger de total funciona
- [ ] Relación usuario-puntos funciona
- [ ] Datos persisten al reiniciar

---

## 🎯 Casos de Uso Completos

### Caso 1: Usuario Nuevo (Flujo Completo)
1. ✅ Abrir app → Ver login
2. ✅ Ir a registro
3. ✅ Completar formulario
4. ✅ Registrarse exitosamente
5. ✅ Redirigido a login
6. ✅ Iniciar sesión
7. ✅ Ver home con 0 puntos
8. ✅ Ver perfil
9. ✅ Ver configuración
10. ✅ Cerrar sesión

### Caso 2: Usuario Existente
1. ✅ Abrir app → Ver login
2. ✅ Iniciar sesión con credenciales existentes
3. ✅ Ver home con puntos actuales
4. ✅ Navegar entre pantallas
5. ✅ Cerrar sesión

### Caso 3: Sesión Persistente
1. ✅ Iniciar sesión
2. ✅ Cerrar navegador
3. ✅ Reabrir navegador
4. ✅ Ir a localhost:3000
5. ✅ Seguir autenticado

---

## 📝 Reporte de Pruebas

Al finalizar todas las pruebas, completa este reporte:

```
=== REPORTE DE PRUEBAS EMPOWER v1.0 ===
Fecha: __________
Tester: __________

Frontend:
- Login: [PASS / FAIL]
- Registro: [PASS / FAIL]
- Home: [PASS / FAIL]
- Perfil: [PASS / FAIL]
- Configuración: [PASS / FAIL]

Backend:
- Auth endpoints: [PASS / FAIL]
- Points endpoints: [PASS / FAIL]
- Validaciones: [PASS / FAIL]

Base de Datos:
- Persistencia: [PASS / FAIL]
- Triggers: [PASS / FAIL]
- Relaciones: [PASS / FAIL]

Seguridad:
- JWT: [PASS / FAIL]
- Contraseñas hasheadas: [PASS / FAIL]
- Rutas protegidas: [PASS / FAIL]

Notas adicionales:
_________________________________
_________________________________

Conclusión: [APROBADO / REQUIERE CORRECCIONES]
```

---

**¡Buena suerte con las pruebas!** 🚀

Si encuentras algún bug, revisa los logs con: `docker-compose logs`
