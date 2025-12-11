import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pointsService, authService } from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [points, setPoints] = useState({
    plastico: 0,
    carton: 0,
    aluminio: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPoints();
  }, []);

  const loadPoints = async () => {
    try {
      const response = await pointsService.getMyPoints();
      setPoints(response.puntos);
    } catch (error) {
      console.error('Error al cargar puntos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="screen">
        <div className="header">
          <h2>Mis Puntos</h2>
          <button className="profile-btn" onClick={() => navigate('/profile')}>
            👤
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando puntos...</p>
          </div>
        ) : (
          <>
            <div className="points-grid">
              <div className="point-card plastico">
                <h3>Plástico</h3>
                <div className="number">{points.plastico}</div>
                <p>puntos</p>
              </div>

              <div className="point-card carton">
                <h3>Cartón</h3>
                <div className="number">{points.carton}</div>
                <p>puntos</p>
              </div>

              <div className="point-card aluminio">
                <h3>Aluminio</h3>
                <div className="number">{points.aluminio}</div>
                <p>puntos</p>
              </div>
            </div>

            <div className="total-points">
              <h2>Total de puntos</h2>
              <div className="total-number">{points.total}</div>
            </div>

            <button className="btn btn-secondary" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
