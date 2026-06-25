import { useState } from 'react';
import '../assets/static/styles/Login.css';

const Login = () => {
  // Estados para capturar lo que escribe el usuario
  const [nombre, setNombre] = useState('');
  const [sector, setSector] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Por ahora mostramos en consola para verificar que funciona.
    // El Integrante 2 va a usar estos datos para el AdminContext.
    console.log('Datos enviados:', { nombre, sector });
    
    alert(`¡Bienvenido ${nombre} del sector ${sector}!`);
  };

  return (
    <div className="bg-login-gradient d-flex align-items-center justify-content-center vh-100 w-100 position-fixed top-0 start-0">
      <div className="card login-card shadow-lg border-0 animate-fade-in">
        <div className="card-body p-5">
          
          {/* Icono decorativo superior */}
          <div className="text-center mb-4">
            <div className="login-icon-box bg-primary text-white mx-auto shadow d-flex align-items-center justify-content-center">
              <span className="fs-3">🔐</span>
            </div>
            <h2 className="fw-bold mt-3 mb-1 text-dark fs-3">Panel de Control</h2>
            <p className="text-muted small">Ingresá tus credenciales de Administrador</p>
          </div>

          {/* Formulario de la consigna */}
          <form onSubmit={manejarEnvio}>
            
            {/* Campo: Nombre */}
            <div className="mb-3 text-start">
              <label htmlFor="nombre" className="form-label small fw-bold text-secondary">Nombre de Usuario</label>
              <input 
                type="text" 
                id="nombre" 
                className="form-control form-control-lg fs-6" 
                placeholder="Ej: Guillermo" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required 
              />
            </div>

            {/* Campo: Sector */}
            <div className="mb-4 text-start">
              <label htmlFor="sector" className="form-label small fw-bold text-secondary">Sector / Rol</label>
              <select 
                id="sector" 
                className="form-select form-control-lg fs-6" 
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                required
              >
                <option value="" disabled>Seleccioná tu sector...</option>
                <option value="Gerencia">Gerencia</option>
                <option value="Soporte">Soporte</option>
                <option value="Administración">Administración</option>
              </select>
            </div>

            {/* Botón Ingresar */}
            <button type="submit" className="btn btn-primary btn-lg w-100 fw-semibold shadow-sm py-2 fs-6">
              Ingresar al Sistema
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;