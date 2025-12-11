import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

function Config() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  return (
    <div className="container">
      <div className="screen">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          Volver
        </button>

        <h2>Configuración</h2>

        <div className="config-item">
          <span>Correo electrónico</span>
          <span className="config-value">{currentUser?.correo}</span>
        </div>

        <div className="config-item">
          <span>Notificaciones</span>
          <span className="config-value">Próximamente</span>
        </div>

        <div className="config-item">
          <span>Cambiar contraseña</span>
          <span className="config-value">Próximamente</span>
        </div>

        <div className="config-item">
          <span>Versión de la aplicación</span>
          <span className="config-value">1.0.0</span>
        </div>
      </div>
    </div>
  );
}

export default Config;
