import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import Spinner from 'react-bootstrap/Spinner';
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
  const esCargaClientes = (item) => item.tipo === 'carga-clientes' || item.titulo === 'Lista de clientes cargada';

  if (
    actividad.tipo === 'carga-clientes' &&
    historial.some(esCargaClientes)
  ) {
    const cargaExistente = historial.find(esCargaClientes);
    const historialSinCargasDuplicadas = historial.filter((item) => !esCargaClientes(item));
    localStorage.setItem(
      ACTIVIDAD_KEY,
      JSON.stringify([cargaExistente, ...historialSinCargasDuplicadas].slice(0, 5))
    );
    return;
  }

  localStorage.setItem(ACTIVIDAD_KEY, JSON.stringify([actividad, ...historial].slice(0, 5)));
};

const tieneNombreCliente = (cliente) => {
  const firstname = cliente.name?.firstname?.trim();
  const lastname = cliente.name?.lastname?.trim();

  return Boolean(firstname && lastname);
};

const normalizarTexto = (texto = '') => texto.toLowerCase().trim();

const coincideBusqueda = (cliente, busqueda) => {
  const apellido = normalizarTexto(cliente.name?.lastname);
  const ciudad = normalizarTexto(cliente.address?.city);

  return apellido.includes(busqueda) || ciudad.includes(busqueda);
};

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [buscar, setBuscar] = useState('');

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
          tipo: 'carga-clientes',
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
  const busquedaNormalizada = normalizarTexto(buscar);
  const clientesFiltrados = clientes.filter((cliente) => coincideBusqueda(cliente, busquedaNormalizada));

  return (
    <main className="clientes-page">
      <section className="clientes-header">
        <div>
          <h1>Lista de clientes</h1>
        </div>

        <BotonRegistrarCliente />
      </section>

      <div className="clientes-search">
        <svg className="clientes-search-icon" aria-hidden="true" viewBox="0 0 24 24">
          <path d="m21 21-4.35-4.35" />
          <circle cx="11" cy="11" r="7" />
        </svg>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por apellido o ciudad..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
      </div>
      <section className="clientes-listado">
        {cargando && (
          <div className="clientes-grid">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="mb-3">
                <Card.Body>
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>

                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={8} />
                    <Placeholder xs={5} />
                    <Placeholder xs={7} />
                  </Placeholder>

                  <div className="text-center mt-3">
                    <Spinner animation="border" variant="primary" />
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mt-3">
            <Alert.Heading>Error al cargar clientes</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}
        {!cargando && !error && clientesFiltrados.length === 0 && (
          <Alert variant="warning" className="mt-3 text-center">
            <Alert.Heading>No se encontraron clientes</Alert.Heading>
            <p className="mb-0">
              No hay clientes que coincidan con la busqueda realizada.
            </p>
          </Alert>
        )}

        {!cargando && !error && clientesFiltrados.length > 0 && (
          <div className="clientes-grid">
            {clientesFiltrados.map((cliente) => (
              <ClienteCard key={cliente.id} cliente={cliente} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ListaClientes;
