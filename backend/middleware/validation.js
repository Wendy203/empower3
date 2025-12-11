const { body, validationResult } = require('express-validator');

// Validación de registro
const validateRegister = [
  body('nombre')
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras'),

  body('apellidos')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Los apellidos deben tener al menos 2 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('Los apellidos solo pueden contener letras'),

  body('escuela')
    .trim()
    .isLength({ min: 2 })
    .withMessage('La institución educativa es requerida'),

  body('correo')
    .trim()
    .isEmail()
    .withMessage('Correo electrónico inválido')
    .custom((value) => {
      const allowedDomains = ['gmail.com', 'queretaro.tecnm.mx'];
      const domain = value.split('@')[1];
      if (!allowedDomains.includes(domain)) {
        throw new Error('Solo se permiten correos de gmail.com o queretaro.tecnm.mx');
      }
      return true;
    }),

  body('contrasena')
    .isLength({ min: 6, max: 10 })
    .withMessage('La contraseña debe tener entre 6 y 10 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
];

// Validación de login
const validateLogin = [
  body('correo')
    .trim()
    .isEmail()
    .withMessage('Correo electrónico inválido'),

  body('contrasena')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

// Middleware para verificar errores de validación
const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Errores de validación',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  checkValidationErrors
};
