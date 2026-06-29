import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import BotonIcono from '../common/BotonIcono.jsx';
import { AdminContext } from '../../context/AdminContext.jsx';
import logoEducacion from '../../assets/logo-educacion.png';
import Nav from './Nav.jsx';

export const Header = () => {
  const { admin, logout } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!admin) return null;

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <NavLink className="app-brand" to="/dashboard" aria-label="Ir al dashboard">
          <img className="app-brand-logo" src={logoEducacion} alt="Logo educacion" />
          <strong>Gestion de clientes</strong>
        </NavLink>

        <Nav />

        <div className="app-user">
          <div className="app-user-copy">
            <span className="app-user-name">
              <svg aria-hidden="true" className="app-user-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20a8 8 0 0 1 16 0" />
              </svg>
              {admin.nombre}
            </span>
            <small>{admin.sector}</small>
          </div>
          <BotonIcono
            className="app-logout"
            label="Cerrar sesion"
            onClick={handleLogout}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M10 4H5v16h5" />
              <path d="M14 8l4 4-4 4" />
              <path d="M8 12h10" />
            </svg>
          </BotonIcono>
        </div>
      </div>
    </header>
  );
};
