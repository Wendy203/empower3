import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    escuela: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre) || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe contener solo letras y tener al menos 2 caracteres';
    }

    // Validar apellidos
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellidos) || formData.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Los apellidos deben contener solo letras y tener al menos 2 caracteres';
    }

    // Validar institución
    if (formData.escuela.trim().length < 2) {
      newErrors.escuela = 'La institución educativa es requerida';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      newErrors.correo = 'Correo electrónico inválido';
    } else {
      const domain = formData.correo.split('@')[1];
      if (!['gmail.com', 'queretaro.tecnm.mx'].includes(domain)) {
        newErrors.correo = 'Solo se permiten correos de gmail.com o queretaro.tecnm.mx';
      }
    }

    // Validar contraseña
    if (formData.contrasena.length < 6 || formData.contrasena.length > 10) {
      newErrors.contrasena = 'La contraseña debe tener entre 6 y 10 caracteres';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.contrasena)) {
      newErrors.contrasena = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    // Validar confirmación
    if (formData.contrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmarContrasena, ...registerData } = formData;
      await authService.register(registerData);
      setSuccess('Registro exitoso. Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response?.data?.details) {
        const newErrors = {};
        err.response.data.details.forEach((detail) => {
          newErrors[detail.path] = detail.msg;
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: err.response?.data?.error || 'Error al registrar usuario' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="screen">
        <div className="logo">
          <h1>EMPOWER</h1>
          <p>Crear nueva cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            {errors.nombre && <div className="error">{errors.nombre}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
            {errors.apellidos && <div className="error">{errors.apellidos}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="escuela">Institución educativa</label>
            <input
              type="text"
              id="escuela"
              name="escuela"
              value={formData.escuela}
              onChange={handleChange}
              required
            />
            {errors.escuela && <div className="error">{errors.escuela}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
            {errors.correo && <div className="error">{errors.correo}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
            {errors.contrasena && <div className="error">{errors.contrasena}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmarContrasena">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmarContrasena"
              name="confirmarContrasena"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              required
            />
            {errors.confirmarContrasena && <div className="error">{errors.confirmarContrasena}</div>}
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>

          {errors.general && <div className="error">{errors.general}</div>}
          {success && <div className="success">{success}</div>}
        </form>

        <Link to="/login" className="link">
          ¿Ya tienes cuenta? Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}

export default Register;
