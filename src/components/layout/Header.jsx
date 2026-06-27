import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext.jsx';
import logoEducacion from '../../assets/logo-educacion.png';

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

        <nav className="app-nav" aria-label="Navegacion principal">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/clientes">Clientes</NavLink>
        </nav>

        <div className="app-user">
          <div className="app-user-copy">
            <span>{admin.nombre}</span>
            <small>{admin.sector}</small>
          </div>
          <button className="app-logout" onClick={handleLogout} type="button">
            Cerrar Sesion
          </button>
        </div>
      </div>
    </header>
  );
};
