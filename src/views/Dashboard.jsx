import { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext.jsx';

const ACTIVIDAD_KEY = 'registroActividadClientes';
const RESUMEN_KEY = 'resumenClientesDashboard';

const Dashboard = () => {
  const { admin } = useContext(AdminContext);
  const [metricas] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RESUMEN_KEY) || '{"clientes":0,"contactos":0,"fichas":0}');
    } catch {
      return {
        clientes: 0,
        contactos: 0,
        fichas: 0,
      };
    }
  });
  const [actividad] = useState(() => {
    try {
      const historial = JSON.parse(localStorage.getItem(ACTIVIDAD_KEY) || '[]');

      if (historial.length > 0) {
        return historial;
      }

      const resumen = JSON.parse(localStorage.getItem(RESUMEN_KEY) || '{"clientes":0}');

      if (resumen.clientes > 0) {
        return [{
          id: 'resumen-clientes',
          fecha: 'Actividad reciente',
          titulo: 'Lista de clientes cargada',
          detalle: `Se consultaron ${resumen.clientes} clientes.`,
        }];
      }

      return [];
    } catch {
      return [];
    }
  });

  const metricasSeguras = {
    clientes: 0,
    contactos: 0,
    fichas: 0,
    ...metricas,
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <h1>
            <span aria-hidden="true">{'\uD83D\uDC4B'}</span>
            Bienvenido, <span className="dashboard-user-name">{admin?.nombre}</span>
          </h1>
          <p className="dashboard-intro">
            Tenes acceso al sistema de gestion de clientes.
          </p>
          <span className="dashboard-role-pill">Sector: {admin?.sector}</span>
        </div>

        <div className="dashboard-summary">
          <div>
            <span>Clientes</span>
            <strong>{metricasSeguras.clientes}</strong>
          </div>
          <div>
            <span>Contactos</span>
            <strong>{metricasSeguras.contactos}</strong>
          </div>
          <div>
            <span>Fichas completas</span>
            <strong>{metricasSeguras.fichas}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-activity">
        <div>
          <p className="dashboard-kicker">Registro de actividad</p>
          <h2>Movimientos recientes</h2>
        </div>

        {actividad.length === 0 ? (
          <p className="dashboard-empty">
            El registro se completara cuando se cargue la lista de clientes desde la API.
          </p>
        ) : (
          <ul>
            {actividad.map((item) => (
              <li key={item.id}>
                <span>{item.fecha}</span>
                <strong>{item.titulo}</strong>
                <p>{item.detalle}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
