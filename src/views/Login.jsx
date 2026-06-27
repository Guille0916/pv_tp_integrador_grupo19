import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext.jsx';
import { Alert } from 'react-bootstrap'; 
import '../assets/static/styles/Login.css';

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [sector, setSector] = useState('');
  const [errorValidacion, setErrorValidacion] = useState(''); 
  const { admin, login } = useContext(AdminContext);
  const navigate = useNavigate();

  if (admin) {
    return <Navigate to="/dashboard" replace />;
  }

  const manejarEnvio = (e) => {
    e.preventDefault();
    setErrorValidacion(''); 

    
    if (nombre.trim() === '') {
      setErrorValidacion('El nombre de usuario no puede contener solo espacios en blanco.');
      return; 
    }

    
    if (sector === '') {
      setErrorValidacion('Por favor, selecciona un sector válido.');
      return; 
    }

    
    login({ nombre: nombre.trim(), sector });
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="bg-login-gradient d-flex align-items-center justify-content-center vh-100 w-100 position-fixed top-0 start-0">
      <div className="card login-card shadow-lg border-0 animate-fade-in">
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="login-icon-box bg-primary text-white mx-auto shadow d-flex align-items-center justify-content-center">
              <span className="fs-3" aria-hidden="true">ID</span>
            </div>
            <h2 className="fw-bold mt-3 mb-1 text-dark fs-3">Panel de Control</h2>
            <p className="text-muted small">Iniciar sesión</p>
          </div>

          
          {errorValidacion && (
            <Alert variant="danger" className="py-2 small text-center mb-3">
              {errorValidacion}
            </Alert>
          )}

          <form onSubmit={manejarEnvio}>
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

            <div className="mb-4 text-start">
              <label htmlFor="sector" className="form-label small fw-bold text-secondary">Sector</label>
              <select
                id="sector"
                className="form-select form-control-lg fs-6"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                required
              >
                <option value="" disabled>Selecciona tu sector...</option>
                <option value="Gerencia">Gerencia</option>
                <option value="Soporte">Soporte</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 fw-semibold shadow-sm py-2 fs-6">
              Ingresar 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
