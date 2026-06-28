import { useEffect, useState } from 'react';
import BotonRegistrarCliente from '../components/common/BotonRegistrarCliente';
import ClienteCard from '../components/common/ClienteCard';
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Placeholder from "react-bootstrap/Placeholder";
import Card from "react-bootstrap/Card";
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
const clientesFiltrados = clientes.filter((cliente) => {
    const busquedaMinuscula = buscar.toLowerCase();
    
    const primerNombre = cliente.name?.firstname || '';
    const apellido = cliente.name?.lastname || '';
    const nombreCompleto = `${primerNombre} ${apellido}`.toLowerCase();
    
    const ciudad = (cliente.address?.city || '').toLowerCase();

    return nombreCompleto.includes(busquedaMinuscula) || ciudad.includes(busquedaMinuscula);
  });
  return (
    <main className="clientes-page">
      <section className="clientes-header">
        <div>
          <p className="dashboard-kicker">Gestion de clientes</p>
          <h1>Lista de clientes</h1>
        </div>

        <BotonRegistrarCliente />
      </section>

     <div className="my-3 px-3">
        <input
          type="text"
          className="form-control"
          placeholder=" Buscar por nombre o ciudad..."
          style={{ 
            maxWidth: '300px',
            backgroundColor: '#ffffff',
            color: '#000000',
            border: '1px solid #ced4da'
          }}
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
      </div>
      <section className="clientes-listado">
        <div className="clientes-toolbar">
          <h2>Clientes registrados</h2>
        </div>
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
              No hay clientes que coincidan con la búsqueda realizada.
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
