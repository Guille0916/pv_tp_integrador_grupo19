import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { AdminContext } from '../context/AdminContext.jsx';
import '../assets/static/styles/Login.css';

const sectores = ['Gerencia', 'Soporte'];

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
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      setErrorValidacion('El nombre de usuario no puede contener solo espacios en blanco.');
      return;
    }

    if (!sector) {
      setErrorValidacion('Por favor, selecciona un sector valido.');
      return;
    }

    login({ nombre: nombreLimpio, sector });
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
            <p className="text-muted small">Iniciar sesion</p>
          </div>

          {errorValidacion && (
            <Alert variant="danger" className="py-2 small text-center mb-3">
              {errorValidacion}
            </Alert>
          )}

          <form onSubmit={manejarEnvio}>
            <div className="mb-3 text-start">
              <label htmlFor="nombre" className="form-label small fw-bold text-secondary">Nombre de Usuario</label>
              <div className="login-input-icon">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20a8 8 0 0 1 16 0" />
                </svg>
                <input
                  type="text"
                  id="nombre"
                  className="form-control form-control-lg fs-6"
                  placeholder="Ej: Usuario"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4 text-start">
              <label htmlFor="sector" className="form-label small fw-bold text-secondary">Sector</label>
              <div className="login-input-icon">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                  <rect x="4" y="7" width="16" height="13" rx="2" />
                  <path d="M4 12h16" />
                </svg>
                <select
                  id="sector"
                  className="form-select form-control-lg fs-6"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecciona tu sector...</option>
                  {sectores.map((sectorDisponible) => (
                    <option key={sectorDisponible} value={sectorDisponible}>
                      {sectorDisponible}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 fw-semibold shadow-sm py-2 fs-6 login-submit-icon">
              <span>Ingresar</span>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
