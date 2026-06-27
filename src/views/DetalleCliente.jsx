import { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext.jsx';

const API_URL = 'https://fakestoreapi.com/users';
const CLIENTES_LOCALES_KEY = 'clientesRegistradosLocalmente';

const obtenerClienteLocal = (id) => {
  try {
    const clientesLocales = JSON.parse(localStorage.getItem(CLIENTES_LOCALES_KEY) || '[]');
    return clientesLocales.find((cliente) => String(cliente.id) === String(id));
  } catch {
    return null;
  }
};

const DetalleCliente = () => {
  const { id } = useParams();
  const { admin } = useContext(AdminContext);
  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
const navigate = useNavigate();
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

const handleEliminar=async()=>{
  if(admin?.sector !== 'Gerencia'){
   alert('Accion denegada: Solo el sector de Gerencia puede eliminar clientes.');
   return;
  }
  const confirmar=window.confirm('¿Estas seguro de eliminar este cliente con ID ' + id + '?'); 
  if(!confirmar){
    return;
  }
  try{
    if(String(id).startsWith('local-')){
      const locales=JSON.parse(localStorage.getItem(CLIENTES_LOCALES_KEY) || '[]');
      const nuevosLocales=locales.filter((cliente)=>String(cliente.id) !== String(id));
      localStorage.setItem(CLIENTES_LOCALES_KEY, JSON.stringify(nuevosLocales));
      alert('Cliente eliminado correctamente.');
      setCliente(null);
      navigate('/clientes');
      return;
    }
    const respuesta=await fetch(`${API_URL}/${id}`,{
      method:'DELETE',
    });
    if(!respuesta.ok){
      throw new Error('No se pudo eliminar el cliente.');
    }
    alert('Cliente eliminado correctamente.');
    setCliente(null); // simular que el cliente ha sido eliminado
    navigate('/clientes');
  }catch(err){
    alert(err.message || 'Ocurrio un error al eliminar el cliente.');
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

  const nombreCompleto = `${name.firstname ?? ''} ${name.lastname ?? ''}`.trim() || 'Cliente';
  const iniciales = `${name.firstname?.[0] ?? ''}${name.lastname?.[0] ?? ''}`.toUpperCase() || 'CL';

  return (
    <main className="detalle-page">
      <section className="detalle-shell">
        <div className="detalle-topbar">
          <Link className="detalle-back" to="/clientes">Volver a clientes</Link>
          <span className={`detalle-role ${admin?.sector === 'Gerencia' ? 'detalle-role-gerencia' : 'detalle-role-soporte'}`}>
            {admin?.sector ?? 'Sin sector'}
          </span>
        </div>

        <header className="detalle-header">
          <div className="detalle-persona">
            <div className="detalle-avatar" aria-hidden="true">{iniciales}</div>
            <div>
              <p className="detalle-kicker">Ficha completa</p>
              <h1>{nombreCompleto}</h1>
              <div className="detalle-meta">
                <span>ID #{cliente.id}</span>
                <span>{email}</span>
                <span>{phone}</span>
              </div>
            </div>
          </div>
        </header>

        {admin?.sector === 'Soporte' && (
          <div className="detalle-alert detalle-alert-info">
            Perfil Soporte: acceso de solo lectura a la ficha del cliente.
          </div>
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
          {admin?.sector === 'Gerencia' && (
            <article className="detalle-card">
              <h2>Acciones</h2>
              <button onClick={handleEliminar} className="btn btn-danger w-100">
                Eliminar cliente  
              </button>
            </article>
          )}
        </div>
      </section>
    </main>
  );
};

export default DetalleCliente;
