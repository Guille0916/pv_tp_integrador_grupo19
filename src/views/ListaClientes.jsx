import { useEffect, useState } from 'react';
import BotonRegistrarCliente from '../components/common/BotonRegistrarCliente';
import ClienteCard from '../components/common/ClienteCard';

const ACTIVIDAD_KEY = 'registroActividadClientes';
const RESUMEN_KEY = 'resumenClientesDashboard';
const CLIENTES_LOCALES_KEY = 'clientesRegistradosLocalmente';

const crearFechaActividad = () => new Date().toLocaleString('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const leerStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const guardarResumenDashboard = (listaClientes) => {
  const resumen = {
    clientes: listaClientes.length,
    contactos: listaClientes.filter((cliente) => cliente.email && cliente.phone).length,
    fichas: listaClientes.filter((cliente) => cliente.username && cliente.password).length,
  };

  localStorage.setItem(RESUMEN_KEY, JSON.stringify(resumen));
};

const guardarActividadDashboard = (actividad) => {
  const historial = leerStorage(ACTIVIDAD_KEY, []);
  localStorage.setItem(ACTIVIDAD_KEY, JSON.stringify([actividad, ...historial].slice(0, 5)));
};

const tieneNombreCliente = (cliente) => {
  const firstname = cliente.name?.firstname?.trim();
  const lastname = cliente.name?.lastname?.trim();

  return Boolean(firstname && lastname);
};

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarClientes = async () => {
      setCargando(true);
      setError('');

      try {
        const respuesta = await fetch('https://fakestoreapi.com/users');

        if (!respuesta.ok) {
          throw new Error('No se pudo cargar la lista de clientes.');
        }

        const data = await respuesta.json();
        const clientesLocales = leerStorage(CLIENTES_LOCALES_KEY, []).filter(tieneNombreCliente);
        const clientesApi = data.filter(tieneNombreCliente);
        const clientesCompletos = [...clientesLocales, ...clientesApi];
        localStorage.setItem(CLIENTES_LOCALES_KEY, JSON.stringify(clientesLocales));
        setClientes(clientesCompletos);

        const actividad = {
          id: Date.now(),
          titulo: 'Lista de clientes cargada',
          detalle: `Se consultaron ${clientesApi.length} clientes.`,
          fecha: crearFechaActividad(),
        };

        guardarResumenDashboard(clientesCompletos);
        guardarActividadDashboard(actividad);
      } catch (err) {
        setError(err.message || 'Ocurrio un error al consultar los clientes.');
      } finally {
        setCargando(false);
      }
    };

    cargarClientes();
  }, []);

  return (
    <main className="clientes-page">
      <section className="clientes-header">
        <div>
          <p className="dashboard-kicker">Gestion de clientes</p>
          <h1>Lista de clientes</h1>
        </div>

        <BotonRegistrarCliente />
      </section>

      <section className="clientes-listado">
        <div className="clientes-toolbar">
          <h2>Clientes registrados</h2>
        </div>

        {cargando && (
          <div className="clientes-grid">
            <div className="cliente-card cliente-card-loading" />
            <div className="cliente-card cliente-card-loading" />
            <div className="cliente-card cliente-card-loading" />
          </div>
        )}

        {error && <p className="clientes-error">{error}</p>}

        {!cargando && !error && clientes.length === 0 && (
          <p className="clientes-estado">No se encontraron clientes.</p>
        )}

        {!cargando && !error && clientes.length > 0 && (
          <div className="clientes-grid">
            {clientes.map((cliente) => (
              <ClienteCard key={cliente.id} cliente={cliente} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ListaClientes;
