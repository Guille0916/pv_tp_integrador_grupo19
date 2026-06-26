import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext.jsx';

const API_URL = 'https://fakestoreapi.com/users';

const DetalleCliente = () => {
  const { id } = useParams();
  const { admin } = useContext(AdminContext);
  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [eliminando, setEliminando] = useState(false);
  const [mensajeDelete, setMensajeDelete] = useState('');

  const puedeEliminar = admin?.sector === 'Gerencia';

  useEffect(() => {
    const controller = new AbortController();

    const obtenerCliente = async () => {
      setCargando(true);
      setError('');
      setMensajeDelete('');

      try {
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

  const eliminarCliente = async () => {
    setEliminando(true);
    setMensajeDelete('');
    setError('');

    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo simular la eliminacion del cliente.');
      }

      const data = await respuesta.json();
      setMensajeDelete(`Cliente ID ${data.id ?? id} eliminado correctamente en la simulacion.`);
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
          <Link className="detalle-back" to="/clientes">Volver a clientes</Link>
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
    password,
    phone,
    username,
  } = cliente;

  const nombreCompleto = `${name.firstname ?? ''} ${name.lastname ?? ''}`.trim() || 'Cliente sin nombre';

  return (
    <main className="detalle-page">
      <section className="detalle-shell">
        <div className="detalle-topbar">
          <Link className="detalle-back" to="/clientes">Volver a clientes</Link>
          <span className={`detalle-role ${puedeEliminar ? 'detalle-role-gerencia' : 'detalle-role-soporte'}`}>
            {admin?.sector ?? 'Sin sector'}
          </span>
        </div>

        <header className="detalle-header">
          <div>
            <p className="detalle-kicker">Ficha profunda del cliente</p>
            <h1>{nombreCompleto}</h1>
            <p>ID #{cliente.id} - {email}</p>
          </div>
          {puedeEliminar && (
            <button
              className="detalle-delete"
              disabled={eliminando}
              onClick={eliminarCliente}
              type="button"
            >
              {eliminando ? 'Eliminando...' : 'Eliminar Cliente'}
            </button>
          )}
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
          <article className="detalle-card">
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

          <article className="detalle-card">
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

          <article className="detalle-card">
            <h2>Credenciales</h2>
            <dl>
              <div>
                <dt>Usuario</dt>
                <dd>{username}</dd>
              </div>
              <div>
                <dt>Password</dt>
                <dd>{password}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>
    </main>
  );
};

export default DetalleCliente;
