import { useContext, useState } from 'react';
import { MdContactPhone, MdPeople, MdDescription } from 'react-icons/md';
import { AdminContext } from '../context/AdminContext.jsx';

const ACTIVIDAD_KEY = 'registroActividadClientes';
const RESUMEN_KEY = 'resumenClientesDashboard';
const RESUMEN_INICIAL = {
  clientes: 0,
  contactos: 0,
  fichas: 0,
};

const leerStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const ordenarActividadReciente = (items) => [...items].sort((a, b) => {
  const fechaA = typeof a.id === 'number' ? a.id : 0;
  const fechaB = typeof b.id === 'number' ? b.id : 0;

  return fechaB - fechaA;
});

const IconoActividad = ({ tipo }) => {
  if (tipo === 'registro-cliente') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="10" cy="8" r="4" />
        <path d="M3 20a7 7 0 0 1 14 0" />
        <path d="M19 8v6M16 11h6" />
      </svg>
    );
  }

  if (tipo === 'eliminacion-cliente') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 7h16" />
        <path d="M10 11v6M14 11v6" />
        <path d="M6 7l1 13h10l1-13" />
        <path d="M9 7V4h6v3" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 7h14" />
      <path d="M5 12h14" />
      <path d="M5 17h14" />
    </svg>
  );
};

const MetricIcon = ({ tipo }) => {
  if (tipo === 'clientes') {
    return <MdPeople aria-hidden="true" size="2.2em" />;
  }

  if (tipo === 'contactos') {
    return <MdContactPhone aria-hidden="true" size="2.2em" />;
  }

  if (tipo === 'fichas') {
    return <MdDescription aria-hidden="true" size="2.2em" />;
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
};

const Dashboard = () => {
  const { admin } = useContext(AdminContext);
  const [metricas] = useState(() => leerStorage(RESUMEN_KEY, RESUMEN_INICIAL));
  const [actividad] = useState(() => {
    const historial = leerStorage(ACTIVIDAD_KEY, []);

    if (historial.length > 0) {
      return ordenarActividadReciente(historial);
    }

    const resumen = leerStorage(RESUMEN_KEY, RESUMEN_INICIAL);

    if (resumen.clientes > 0) {
      return [{
        id: 'resumen-clientes',
        fecha: 'Actividad reciente',
        titulo: 'Lista de clientes cargada',
        detalle: `Se consultaron ${resumen.clientes} clientes.`,
      }];
    }

    return [];
  });

  const adminName = admin?.nombre || 'Administrador';
  const adminSector = admin?.sector || 'Sin sector asignado';
  const actividadReciente = actividad.slice(0, 5);

  const metricasSeguras = {
    ...RESUMEN_INICIAL,
    ...metricas,
  };

  const metricasItems = [
    {
      key: 'clientes',
      label: 'Clientes',
      valor: metricasSeguras.clientes,
      icono: 'clientes',
    },
    {
      key: 'contactos',
      label: 'Contactos',
      valor: metricasSeguras.contactos,
      icono: 'contactos',
    },
    {
      key: 'fichas',
      label: 'Fichas completas',
      valor: metricasSeguras.fichas,
      icono: 'fichas',
    },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <h1>
            <span aria-hidden="true">{'\uD83D\uDC4B'}</span>
            Bienvenido, <span className="dashboard-user-name">{adminName}</span>
          </h1>
          <p className="dashboard-intro">
            Tenes acceso al sistema de gestion de clientes.
          </p>
          <span className="dashboard-role-pill">Sector: {adminSector}</span>
        </div>

        <div className="dashboard-summary">
          <div className="dashboard-summary-header">
            <p className="dashboard-kicker">Resumen general</p>
            <h2>Estado actual</h2>
          </div>

          <div className="dashboard-summary-grid">
            {metricasItems.map((item) => (
              <article key={item.key} className="dashboard-summary-card shadow-sm">
                <div>
                  <span className="dashboard-summary-icon" aria-hidden="true">
                    <MetricIcon tipo={item.icono} />
                  </span>
                </div>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.valor}</strong>
                </div>
              </article>
            ))}
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
          <>
            <ul>
              {actividadReciente.map((item) => (
                <li key={item.id}>
                  <span className="dashboard-activity-icon">
                    <IconoActividad tipo={item.tipo} />
                  </span>
                  <div>
                    <span>{item.fecha}</span>
                    <strong>{item.titulo}</strong>
                    <p>{item.detalle}</p>
                  </div>
                </li>
              ))}
            </ul>
            {actividad.length > actividadReciente.length && (
              <p className="dashboard-activity-note">
                Mostrando los últimos {actividadReciente.length} movimientos de {actividad.length} totales.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
