import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

function Profile() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="screen profile-screen">
        <button className="back-btn" onClick={() => navigate('/home')}>
          Volver
        </button>

        <div className="profile-icon">👤</div>

        <div className="profile-info">
          <div className="profile-email">{currentUser?.correo}</div>
        </div>

        <div className="menu-item" onClick={() => navigate('/config')}>
          <span>Configuración</span>
          <span>→</span>
        </div>

        <div className="menu-item" onClick={handleLogout}>
          <span>Cerrar sesión</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
