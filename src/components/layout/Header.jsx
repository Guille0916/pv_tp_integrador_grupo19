import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext.jsx';

export const Header = () => {
    //consumir el contexto del administrador
  const { admin, logout } = useContext(AdminContext);

  //si no hay administrador logueado, no mostrar el header
    if (!admin) return null;
    
    return (
        <nav className="navbar navbar-dark bg-dark px-3 mb-4 d-flex justify-content-between">
            <span className="navbar-brand mb-0 h1">Bienvenido, {admin.nombre}</span>
            <div className ="d-flex align-items-center gap-3 text-white">
                <div>
                    {/*mostrar el nombre del administrador logueado*/}
                    <strong>Usuario:</strong>{admin.nombre}| <small className="text-info">sector: {admin.sector}</small>
                </div>
                {/*Al hacer click en el boton de cerrar sesion, se ejecuta la funcion logout del contexto*/}
                <button className="btn btn-outline-light" onClick={logout}>
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
};