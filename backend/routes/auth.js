const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { validateRegister, validateLogin, checkValidationErrors } = require('../middleware/validation');

// Registro de usuario
router.post('/register', validateRegister, checkValidationErrors, async (req, res) => {
  const client = await pool.connect();

  try {
    const { nombre, apellidos, escuela, correo, contrasena } = req.body;

    await client.query('BEGIN');

    // Verificar si el usuario ya existe
    const userCheck = await client.query(
      'SELECT id FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (userCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Ya existe una cuenta con este correo electrónico' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar nuevo usuario
    const userResult = await client.query(
      `INSERT INTO usuarios (nombre, apellidos, escuela, correo, contrasena)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, apellidos, escuela, correo, fecha_registro`,
      [nombre, apellidos, escuela, correo, hashedPassword]
    );

    const newUser = userResult.rows[0];

    // Crear registro de puntos iniciales (0 en todos)
    await client.query(
      `INSERT INTO puntos (usuario_id, plastico, carton, aluminio, total)
       VALUES ($1, 0, 0, 0, 0)`,
      [newUser.id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        apellidos: newUser.apellidos,
        escuela: newUser.escuela,
        correo: newUser.correo,
        fecha_registro: newUser.fecha_registro
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  } finally {
    client.release();
  }
});

// Inicio de sesión
router.post('/login', validateLogin, checkValidationErrors, async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Buscar usuario por correo
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(contrasena, user.contrasena);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        correo: user.correo
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        escuela: user.escuela,
        correo: user.correo
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
