import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../context/AdminContext.jsx';

const API_URL = 'https://fakestoreapi.com/users';
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

const crearFechaActividad = () => new Date().toLocaleString('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const tieneNombreCliente = (cliente) => {
  const firstname = cliente.name?.firstname?.trim();
  const lastname = cliente.name?.lastname?.trim();

  return Boolean(firstname && lastname);
};

const crearResumenClientes = (clientes) => ({
  clientes: clientes.length,
  contactos: clientes.filter((cliente) => cliente.email && cliente.phone).length,
  fichas: clientes.filter((cliente) => cliente.username && cliente.password).length,
});

const crearActividadCarga = (cantidadClientes) => ({
  id: Date.now(),
  tipo: 'carga-clientes',
  titulo: 'Lista de clientes cargada',
  detalle: `Se consultaron ${cantidadClientes} clientes.`,
  fecha: crearFechaActividad(),
});

const tieneDatosResumen = (resumen) => (
  resumen.clientes > 0 ||
  resumen.contactos > 0 ||
  resumen.fichas > 0
);

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
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21c0-3.5 2.8-6 7-6s7 2.5 7 6" />
        <path d="M3 9.5c0-1.6 1.2-3 2.8-3s2.8 1.4 2.8 3" />
      </svg>
    );
  }

  if (tipo === 'contactos') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.72 11.72 0 003.68.58 1 1 0 011 1v3.5a1 1 0 01-1 1A17.91 17.91 0 013 6a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.58 3.68 1 1 0 01-.21 1.11l-2.2 2.2z" />
      </svg>
    );
  }

  if (tipo === 'fichas') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 3h8l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        <path d="M15 3v5h5" />
        <path d="M9 9h6" />
        <path d="M9 13h3" />
        <path d="M9 17l1.5 1.5 4-4" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
};

const SectorIcon = ({ sector }) => {
  if (sector === 'Gerencia') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 3l7 4v5c0 4.4-2.9 7.5-7 9-4.1-1.5-7-4.6-7-9V7z" />
        <path d="M9 12l2 2 4-5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 14a8 8 0 0 1 16 0" />
      <path d="M18 14v3a3 3 0 0 1-3 3h-2" />
      <path d="M4 14v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2" />
      <path d="M20 14v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2" />
    </svg>
  );
};

const Dashboard = () => {
  const { admin } = useContext(AdminContext);
  const [metricas, setMetricas] = useState(() => leerStorage(RESUMEN_KEY, RESUMEN_INICIAL));
  const [actividad, setActividad] = useState(() => {
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
  const [cargandoResumen, setCargandoResumen] = useState(false);

  useEffect(() => {
    if (tieneDatosResumen(metricas)) {
      return;
    }

    const controller = new AbortController();

    const cargarResumenDesdeApi = async () => {
      setCargandoResumen(true);

      try {
        const respuesta = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el resumen del dashboard.');
        }

        const data = await respuesta.json();
        const clientesApi = data.filter(tieneNombreCliente);
        const resumen = crearResumenClientes(clientesApi);
        const actividadCarga = crearActividadCarga(clientesApi.length);
        const actividadActualizada = [actividadCarga];

        localStorage.setItem(RESUMEN_KEY, JSON.stringify(resumen));
        localStorage.setItem(ACTIVIDAD_KEY, JSON.stringify(actividadActualizada));
        setMetricas(resumen);
        setActividad(actividadActualizada);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setActividad([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargandoResumen(false);
        }
      }
    };

    cargarResumenDesdeApi();

    return () => controller.abort();
  }, [metricas]);

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
      valor: cargandoResumen ? '...' : metricasSeguras.clientes,
      icono: 'clientes',
    },
    {
      key: 'contactos',
      label: 'Contactos',
      valor: cargandoResumen ? '...' : metricasSeguras.contactos,
      icono: 'contactos',
    },
    {
      key: 'fichas',
      label: 'Fichas completas',
      valor: cargandoResumen ? '...' : metricasSeguras.fichas,
      icono: 'fichas',
    },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <h1>
            <span className="dashboard-welcome-emoji" aria-hidden="true">
              👋
            </span>
            Hola, <span className="dashboard-user-name">{adminName}</span>
          </h1>
          <p className="dashboard-welcome-note">Gestion de clientes lista para trabajar.</p>
          <div className="dashboard-role-box">
            <span>Sector asignado</span>
            <strong className="dashboard-role-value">
              <span className="dashboard-role-icon" aria-hidden="true">
                <SectorIcon sector={adminSector} />
              </span>
              {adminSector}
            </strong>
          </div>
        </div>

        <div className="dashboard-summary">
          <div className="dashboard-summary-header">
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
