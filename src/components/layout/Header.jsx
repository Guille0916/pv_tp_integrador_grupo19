import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext.jsx';

export const Header = () => {
  const { admin, logout } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!admin) return null;

  return (
    <nav className="navbar navbar-dark bg-dark px-3 mb-4 d-flex justify-content-between">
      <span className="navbar-brand mb-0 h1">Bienvenido, {admin.nombre}</span>
      <div className="d-flex align-items-center gap-3 text-white">
        <div>
          <strong>Usuario:</strong> {admin.nombre} | <small className="text-info">sector: {admin.sector}</small>
        </div>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Cerrar Sesion
        </button>
      </div>
    </nav>
  );
};
