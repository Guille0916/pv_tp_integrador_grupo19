import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FormAltaCliente from '../components/FormAltaCliente';

const ACTIVIDAD_KEY = 'registroActividadClientes';

const ListaClientes = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const respuesta = await fetch('https://fakestoreapi.com/users');

        if (!respuesta.ok) {
          throw new Error('No se pudo cargar la lista de clientes.');
        }

        const data = await respuesta.json();
        setClientes(data);

        const actividad = {
          id: Date.now(),
          titulo: 'Lista de clientes cargada',
          detalle: `Se consultaron ${data.length} clientes desde FakeStore API.`,
          fecha: new Date().toLocaleString('es-AR', {
            dateStyle: 'short',
            timeStyle: 'short',
          }),
        };

        const historial = JSON.parse(localStorage.getItem(ACTIVIDAD_KEY) || '[]');
        localStorage.setItem(ACTIVIDAD_KEY, JSON.stringify([actividad, ...historial].slice(0, 5)));
      } catch (err) {
        setError(err.message || 'Ocurrio un error al consultar los clientes.');
      } finally {
        setCargando(false);
      }
    };

    cargarClientes();
  }, []);

  const clientesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return clientes;

    return clientes.filter((cliente) => {
      const apellido = cliente.name?.lastname?.toLowerCase() || '';
      const ciudad = cliente.address?.city?.toLowerCase() || '';
      return apellido.includes(texto) || ciudad.includes(texto);
    });
  }, [busqueda, clientes]);

  return (
    <main className="clientes-page">
      <section className="clientes-header">
        <div>
          <p className="dashboard-kicker">Gestion de clientes</p>
          <h1>Lista de clientes</h1>
        </div>

        <button
          className="clientes-alta-btn"
          onClick={() => setMostrarFormulario((actual) => !actual)}
          type="button"
        >
          {mostrarFormulario ? 'Cerrar formulario' : 'Registrar cliente'}
        </button>
      </section>

      {mostrarFormulario && <FormAltaCliente />}

      <section className="clientes-listado">
        <div className="clientes-toolbar">
          <h2>Clientes registrados</h2>
          <input
            aria-label="Buscar por apellido o ciudad"
            placeholder="Buscar por apellido o ciudad"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {cargando && <p className="clientes-estado">Cargando clientes...</p>}
        {error && <p className="clientes-error">{error}</p>}

        {!cargando && !error && (
          <div className="clientes-table-wrap">
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Telefono</th>
                  <th>Ciudad</th>
                  <th>Ficha</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.name?.firstname} {cliente.name?.lastname}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.phone}</td>
                    <td>{cliente.address?.city}</td>
                    <td>
                      <Link to={`/clientes/${cliente.id}`}>Ver ficha</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default ListaClientes;
