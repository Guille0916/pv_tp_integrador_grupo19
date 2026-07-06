import { useContext, useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import Spinner from 'react-bootstrap/Spinner';
import BotonRegistrarCliente from '../components/common/BotonRegistrarCliente';
import ClienteCard from '../components/common/ClienteCard';
import ConfirmacionEliminar from '../components/common/ConfirmacionEliminar';
import { AdminContext } from '../context/AdminContext.jsx';

const API_URL = 'https://fakestoreapi.com/users';
const ACTIVIDAD_KEY = 'registroActividadClientes';
const RESUMEN_KEY = 'resumenClientesDashboard';
const CLIENTES_LOCALES_KEY = 'clientesRegistradosLocalmente';
const CLIENTES_ELIMINADOS_KEY = 'clientesEliminadosLocalmente';

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
    return;
  }

  localStorage.setItem(ACTIVIDAD_KEY, JSON.stringify([actividad, ...historial].slice(0, 5)));
};

const eliminarClienteApi = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo eliminar el cliente.');
  }
};

const eliminarClienteLocal = (id) => {
  const locales = leerStorage(CLIENTES_LOCALES_KEY, []);
  const localesActualizados = locales.filter((clienteLocal) => String(clienteLocal.id) !== String(id));
  localStorage.setItem(CLIENTES_LOCALES_KEY, JSON.stringify(localesActualizados));
};

const guardarClienteApiEliminado = (id) => {
  const idsEliminados = leerStorage(CLIENTES_ELIMINADOS_KEY, []).map(String);
  const idsActualizados = Array.from(new Set([...idsEliminados, String(id)]));
  localStorage.setItem(CLIENTES_ELIMINADOS_KEY, JSON.stringify(idsActualizados));
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

const obtenerNombreCliente = (cliente) => (
  `${cliente.name?.firstname ?? ''} ${cliente.name?.lastname ?? ''}`.trim() || 'cliente'
);

const ListaClientes = () => {
  const { admin } = useContext(AdminContext);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [buscar, setBuscar] = useState('');
  const [eliminandoId, setEliminandoId] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  useEffect(() => {
    const cargarClientes = async () => {
      setCargando(true);
      setError('');

      try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
          throw new Error('No se pudo cargar la lista de clientes.');
        }

        const data = await respuesta.json();
        const clientesLocales = leerStorage(CLIENTES_LOCALES_KEY, []).filter(tieneNombreCliente);
        const clientesEliminados = leerStorage(CLIENTES_ELIMINADOS_KEY, []).map(String);
        const clientesApi = data
          .filter(tieneNombreCliente)
          .filter((cliente) => !clientesEliminados.includes(String(cliente.id)));
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

  const handleSolicitarEliminacion = (cliente) => {
    if (admin?.sector !== 'Gerencia') {
      return;
    }

    setClienteAEliminar(cliente);
  };

  const handleEliminarCliente = async () => {
    if (admin?.sector !== 'Gerencia' || !clienteAEliminar) {
      return;
    }

    const cliente = clienteAEliminar;
    const nombreCliente = obtenerNombreCliente(cliente);

    setEliminandoId(cliente.id);
    setError('');

    try {
      if (cliente.creadoLocalmente) {
        eliminarClienteLocal(cliente.id);
      } else {
        await eliminarClienteApi(cliente.id);
        guardarClienteApiEliminado(cliente.id);
      }

      const clientesActualizados = clientes.filter((clienteActual) => String(clienteActual.id) !== String(cliente.id));
      setClientes(clientesActualizados);
      guardarResumenDashboard(clientesActualizados);
      guardarActividadDashboard({
        id: Date.now(),
        tipo: 'eliminacion-cliente',
        titulo: 'Cliente eliminado',
        detalle: `Se elimino ${nombreCliente}.`,
        fecha: crearFechaActividad(),
      });
      setClienteAEliminar(null);
    } catch (err) {
      setError(err.message || 'Ocurrio un error al eliminar el cliente.');
    } finally {
      setEliminandoId(null);
    }
  };

  const busquedaNormalizada = normalizarTexto(buscar);
  const clientesFiltrados = clientes.filter((cliente) => coincideBusqueda(cliente, busquedaNormalizada));

  return (
    <main className="clientes-page">
      <section className="clientes-header">
        <div>
          <h1>Lista de clientes</h1>
        </div>

        <div className="clientes-header-actions">
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
          <BotonRegistrarCliente />
        </div>
      </section>
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
              <ClienteCard
                key={cliente.id}
                cliente={cliente}
                eliminando={String(eliminandoId) === String(cliente.id)}
                onEliminar={handleSolicitarEliminacion}
                puedeEliminar={admin?.sector === 'Gerencia'}
              />
            ))}
          </div>
        )}
      </section>

      <ConfirmacionEliminar
        cliente={clienteAEliminar}
        eliminando={Boolean(eliminandoId)}
        mostrar={Boolean(clienteAEliminar)}
        onCancelar={() => setClienteAEliminar(null)}
        onConfirmar={handleEliminarCliente}
      />
    </main>
  );
};

export default ListaClientes;

