import { useState } from 'react';
import '../assets/static/styles/Login.css';

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [sector, setSector] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', { nombre, sector });
    
    alert(`¡Bienvenido ${nombre} del sector ${sector}!`);
  };

  return (
    <div className="contenedor-login">
      <div className="card card-login border-0 shadow-lg" >
        <div className="card-body bg-transparent p-5">
          <h3 className="mt-3 text-center mb-4">  Panel  de Control</h3>
          <div className="text-center mb-4">
            <div className="login-icon-box mx-auto d-flex align-items-center justify-content-center">
              <img src="https://img.icons8.com/?size=100&id=OAHfGI3jkWNU&format=png&color=000000" alt= "icn-login"/>
            </div>
            <p className="text-inicio fw-bold mb-4">Iniciar sesion</p>
          </div>

          <form onSubmit={manejarEnvio}>
            
            <div className="mb-3 text-start">
              <label htmlFor="nombre" className="form-label small fw-bold text-secondary"> Usuario</label>
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
                <option value="" disabled> Seleciona sector...</option>
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