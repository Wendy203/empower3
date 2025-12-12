# Actualización de Documentación - Empower

## Cambios Realizados

### Fecha: 2025-12-11

### Resumen
Se actualizó la documentación del proyecto para eliminar referencias a usuarios de prueba inexistentes y proporcionar instrucciones claras sobre cómo crear usuarios y gestionar la base de datos.

---

## Archivos Modificados

### 1. README.md

**Cambios:**
- ❌ **Eliminada** sección "Credenciales de Prueba" que mencionaba usuario `maria.gonzalez@queretaro.tecnm.mx`
- ✅ **Agregada** sección "Primeros Pasos" con instrucciones para:
  - Crear el primer usuario desde la aplicación
  - Limpiar datos de prueba usando psql
  - Gestionar datos usando Adminer (interfaz gráfica)

**Nuevas instrucciones incluyen:**
```bash
# Eliminar usuarios de prueba
docker exec -it empower-db psql -U empower_user -d empower_db
DELETE FROM usuarios WHERE correo = 'usuario@ejemplo.com';
\q
```

### 2. QUICK_START.md

**Cambios:**
- ❌ **Eliminada** sección "Opción 1: Usar cuenta de prueba"
- ✅ **Actualizada** sección "Crear tu primer usuario" con instrucciones claras
- ✅ **Expandida** sección "Administrar Base de Datos" con:
  - Subsección para Adminer (interfaz gráfica)
  - Subsección para psql (línea de comandos)
  - Nueva subsección "Limpiar usuarios de prueba" con dos opciones
- ✅ **Actualizados** ejemplos de API para usar usuario consistente

**Ejemplos de API actualizados:**
- Antes: `maria.gonzalez@queretaro.tecnm.mx` (usuario inexistente)
- Ahora: `juan.perez@gmail.com` (usuario del ejemplo de registro)

### 3. database/init.sql

**Estado:**
- ✅ Los datos de ejemplo ya estaban comentados
- ✅ No requirió cambios

---

## Instrucciones para Usuarios

### Para crear el primer usuario:

1. Accede a http://localhost:3000
2. Haz clic en "Registrarse"
3. Completa el formulario con tus datos
4. Inicia sesión con las credenciales creadas

**Nota:** Los nuevos usuarios comienzan con 0 puntos.

### Para limpiar usuarios de prueba:

**Opción A - Interfaz Gráfica (Adminer):**
1. Accede a http://localhost:8080
2. Inicia sesión:
   - Sistema: PostgreSQL
   - Servidor: postgres
   - Usuario: empower_user
   - Contraseña: empower_secure_password_2025
   - Base de datos: empower_db
3. Ve a la tabla `usuarios`
4. Elimina los usuarios deseados

**Opción B - Línea de Comandos:**
```bash
docker exec -it empower-db psql -U empower_user -d empower_db
DELETE FROM usuarios WHERE correo = 'usuario@ejemplo.com';
SELECT id, nombre, apellidos, correo FROM usuarios;
\q
```

---

## Validaciones Importantes

### Reglas de Registro:
- **Nombre/Apellidos:** Solo letras, mínimo 2 caracteres
- **Institución:** Mínimo 2 caracteres
- **Correo:** Formato válido, dominios: `@gmail.com` o `@queretaro.tecnm.mx`
- **Contraseña:** 6-10 caracteres, con mayúscula, minúscula y número

### Relación CASCADE:
Al eliminar un usuario, sus puntos se eliminan automáticamente gracias a la relación `ON DELETE CASCADE` en la base de datos.

---

## Beneficios de los Cambios

1. ✅ **Claridad:** Los usuarios saben exactamente cómo empezar
2. ✅ **Precisión:** No hay referencias a usuarios inexistentes
3. ✅ **Flexibilidad:** Instrucciones para gestionar datos de prueba
4. ✅ **Opciones:** Tanto interfaz gráfica como línea de comandos
5. ✅ **Consistencia:** Ejemplos de API usan el mismo usuario

---

## Próximos Pasos Recomendados

1. Probar el flujo completo de registro desde la aplicación
2. Verificar que las validaciones funcionen correctamente
3. Documentar cualquier caso de uso adicional que surja
4. Considerar agregar scripts de utilidad para tareas comunes

---

**Documentación actualizada por:** Sistema Antigravity
**Fecha:** 2025-12-11
**Versión:** 1.0.1
