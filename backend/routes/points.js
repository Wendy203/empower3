const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Obtener puntos del usuario autenticado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT p.plastico, p.carton, p.aluminio, p.total, p.ultima_actualizacion
       FROM puntos p
       WHERE p.usuario_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron puntos para este usuario' });
    }

    res.json({
      puntos: {
        plastico: result.rows[0].plastico,
        carton: result.rows[0].carton,
        aluminio: result.rows[0].aluminio,
        total: result.rows[0].total,
        ultima_actualizacion: result.rows[0].ultima_actualizacion
      }
    });

  } catch (error) {
    console.error('Error al obtener puntos:', error);
    res.status(500).json({ error: 'Error al obtener puntos' });
  }
});

// Obtener puntos por correo (para compatibilidad con el prototipo)
router.get('/user/:correo', async (req, res) => {
  try {
    const { correo } = req.params;

    const result = await pool.query(
      `SELECT p.plastico, p.carton, p.aluminio, p.total, p.ultima_actualizacion
       FROM puntos p
       INNER JOIN usuarios u ON p.usuario_id = u.id
       WHERE u.correo = $1`,
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron puntos para este usuario' });
    }

    res.json({
      puntos: {
        plastico: result.rows[0].plastico,
        carton: result.rows[0].carton,
        aluminio: result.rows[0].aluminio,
        total: result.rows[0].total,
        ultima_actualizacion: result.rows[0].ultima_actualizacion
      }
    });

  } catch (error) {
    console.error('Error al obtener puntos:', error);
    res.status(500).json({ error: 'Error al obtener puntos' });
  }
});

module.exports = router;
