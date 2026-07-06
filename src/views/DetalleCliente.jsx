import { useContext, useEffect, useState } from 'react';
<<<<<<< HEAD
import { useNavigate, useParams, Link } from 'react-router-dom'; // Agregamos Link acá
import ConfirmacionEliminar from '../components/common/ConfirmacionEliminar';
=======
import { useNavigate, useParams } from 'react-router-dom';
import BotonVolverClientes from '../components/common/BotonVolverClientes';
>>>>>>> 75c9f0dcd5cce79ef23b6e4e72b770fafdd3c41b
import { AdminContext } from '../context/AdminContext.jsx';

const API_URL = 'https://fakestoreapi.com/users';
const CLIENTES_LOCALES_KEY = 'clientesRegistradosLocalmente';
const CLIENTES_ELIMINADOS_KEY = 'clientesEliminadosLocalmente';
const ACTIVIDAD_KEY = 'registroActividadClientes';
const RESUMEN_KEY = 'resumenClientesDashboard';

const obtenerClienteLocal = (id) => {
  try {
    const clientesLocales = JSON.parse(localStorage.getItem(CLIENTES_LOCALES_KEY) || '[]');
    return clientesLocales.find((cliente) => String(cliente.id) === String(id));
  } catch {
    return null;
  }
};

const leerStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const crearFechaActividad = () => new Date().toLocaleString('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const guardarActividadDashboard = (actividad) => {
  const historial = leerStorage(ACTIVIDAD_KEY, []);
  localStorage.setItem(ACTIVIDAD_KEY, JSON.stringify([actividad, ...historial].slice(0, 5)));
};

const eliminarClienteLocal = (id) => {
  const locales = leerStorage(CLIENTES_LOCALES_KEY, []);
  const nuevosLocales = locales.filter((clienteLocal) => String(clienteLocal.id) !== String(id));
  localStorage.setItem(CLIENTES_LOCALES_KEY, JSON.stringify(nuevosLocales));
};

const eliminarClienteApi = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo eliminar el cliente.');
  }
};

const guardarClienteApiEliminado = (id) => {
  const idsEliminados = leerStorage(CLIENTES_ELIMINADOS_KEY, []).map(String);
  const idsActualizados = Array.from(new Set([...idsEliminados, String(id)]));
  localStorage.setItem(CLIENTES_ELIMINADOS_KEY, JSON.stringify(idsActualizados));
};

const actualizarResumenEliminado = () => {
  const resumen = leerStorage(RESUMEN_KEY, {
    clientes: 0,
    contactos: 0,
    fichas: 0,
  });

  localStorage.setItem(RESUMEN_KEY, JSON.stringify({
    clientes: Math.max((resumen.clientes || 0) - 1, 0),
    contactos: Math.max((resumen.contactos || 0) - 1, 0),
    fichas: Math.max((resumen.fichas || 0) - 1, 0),
  }));
};

const DetalleCliente = () => {
  const { id } = useParams();
  const { admin } = useContext(AdminContext);
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [eliminando, setEliminando] = useState(false);
  const [mensajeDelete, setMensajeDelete] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const obtenerCliente = async () => {
      setCargando(true);
      setError('');

      try {
        const clienteLocal = obtenerClienteLocal(id);

        if (clienteLocal) {
          setCliente(clienteLocal);
          setCargando(false);
          return;
        }

        const respuesta = await fetch(`${API_URL}/${id}`, {
          signal: controller.signal,
        });

        if (!respuesta.ok) {
          throw new Error('No se pudo obtener la ficha del cliente.');
        }

        const data = await respuesta.json();
        setCliente(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Ocurrio un error al consultar la API.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    };

    obtenerCliente();

    return () => controller.abort();
  }, [id]);

  const handleEliminar = async () => {
    if (admin?.sector !== 'Gerencia' || !cliente) {
      return;
    }

    const nombreCompleto = `${cliente.name?.firstname ?? ''} ${cliente.name?.lastname ?? ''}`.trim();

    setEliminando(true);
    setMensajeDelete('');
    setError('');

    try {
      if (cliente.creadoLocalmente) {
        eliminarClienteLocal(id);
      } else {
        await eliminarClienteApi(id);
        guardarClienteApiEliminado(id);
      }

      actualizarResumenEliminado();
      guardarActividadDashboard({
        id: Date.now(),
        tipo: 'eliminacion-cliente',
        titulo: 'Cliente eliminado',
        detalle: `Se elimino ${nombreCompleto}.`,
        fecha: crearFechaActividad(),
      });

      setMensajeDelete(`Cliente ${nombreCompleto} eliminado correctamente.`);
      setMostrarConfirmacion(false);
      setTimeout(() => navigate('/clientes'), 1200);
    } catch (err) {
      setError(err.message || 'Ocurrio un error al eliminar el cliente.');
    } finally {
      setEliminando(false);
    }
  };


  if (cargando) {
    return (
      <main className="detalle-page">
        <div className="detalle-shell">
          <p className="detalle-kicker">Ficha profunda</p>
          <h1>Cargando cliente...</h1>
          <div className="detalle-skeleton" aria-hidden="true" />
          <div className="detalle-skeleton detalle-skeleton-sm" aria-hidden="true" />
        </div>
      </main>
    );
  }

  if (error && !cliente) {
    return (
      <main className="detalle-page">
        <div className="detalle-shell">
          {/* Reemplazado por Link */}
          <Link to="/clientes" className="clientes-alta-btn" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
            &larr; Volver a clientes
          </Link>
          <div className="detalle-alert detalle-alert-error">{error}</div>
        </div>
      </main>
    );
  }

  if (!cliente) {
    return null;
  }

  const {
    address = {},
    email,
    name = {},
    phone,
  } = cliente;

  const nombreCompleto = `${name.firstname ?? ''} ${name.lastname ?? ''}`.trim() || 'Cliente';
  const iniciales = `${name.firstname?.[0] ?? ''}${name.lastname?.[0] ?? ''}`.toUpperCase() || 'CL';

  return (
    <main className="detalle-page">
      <section className="detalle-shell">
        <div className="detalle-topbar">
          {/* Reemplazado por Link */}
          <Link to="/clientes" className="clientes-alta-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            &larr; Volver a clientes
          </Link>
        </div>

        <header className="detalle-header">
          <div className="detalle-persona">
            <div className="detalle-avatar" aria-hidden="true">{iniciales}</div>
            <div className="detalle-persona-main">
              <div>
                <h1>{nombreCompleto}</h1>
                <div className="detalle-meta">
                  <span>ID #{cliente.id}</span>
                </div>
              </div>
              {admin?.sector === 'Gerencia' && (
                <button
                  aria-label="Eliminar Cliente de la Base de Datos"
                  className="detalle-delete detalle-delete-icon"
                  disabled={eliminando}
                  onClick={() => setMostrarConfirmacion(true)}
                  title="Eliminar Cliente de la Base de Datos"
                  type="button"
                >
                  <svg className="btn-icon" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M4 7h16" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M6 7l1 13h10l1-13" />
                    <path d="M9 7V4h6v3" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </header>

        {admin?.sector === 'Soporte' && (
          <div className="detalle-alert detalle-alert-info">
            Perfil Soporte: acceso de solo lectura a la ficha del cliente.
          </div>
        )}

        {mensajeDelete && (
          <div className="detalle-alert detalle-alert-success">{mensajeDelete}</div>
        )}

        {error && (
          <div className="detalle-alert detalle-alert-error">{error}</div>
        )}

        <div className="detalle-grid">
          <article className="detalle-card detalle-card-contacto">
            <h2>Datos de contacto</h2>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>{email}</dd>
              </div>
              <div>
                <dt>Telefono</dt>
                <dd>{phone}</dd>
              </div>
            </dl>
          </article>

          <article className="detalle-card detalle-card-address">
            <h2>Direccion completa</h2>
            <dl>
              <div>
                <dt>Calle</dt>
                <dd>{address.street}</dd>
              </div>
              <div>
                <dt>Numero</dt>
                <dd>{address.number}</dd>
              </div>
              <div>
                <dt>Ciudad</dt>
                <dd>{address.city}</dd>
              </div>
              <div>
                <dt>Codigo postal</dt>
                <dd>{address.zipcode}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <ConfirmacionEliminar
        cliente={cliente}
        eliminando={eliminando}
        mostrar={mostrarConfirmacion}
        onCancelar={() => setMostrarConfirmacion(false)}
        onConfirmar={handleEliminar}
      />
    </main>
  );
};

export default DetalleCliente;