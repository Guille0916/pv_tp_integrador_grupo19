import BotonVolverClientes from '../components/common/BotonVolverClientes';
import FormAltaCliente from '../components/common/FormAltaCliente';

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

const guardarActividadDashboard = (actividad) => {
  const historial = leerStorage(ACTIVIDAD_KEY, []);
  localStorage.setItem(ACTIVIDAD_KEY, JSON.stringify([actividad, ...historial].slice(0, 5)));
};

const tieneNombreCliente = (cliente) => {
  const firstname = cliente.name?.firstname?.trim();
  const lastname = cliente.name?.lastname?.trim();

  return Boolean(firstname && lastname);
};

const guardarClienteLocal = (clienteCreado) => {
  const clientesLocales = leerStorage(CLIENTES_LOCALES_KEY, []).filter(tieneNombreCliente);
  const localesActualizados = [clienteCreado, ...clientesLocales];
  localStorage.setItem(CLIENTES_LOCALES_KEY, JSON.stringify(localesActualizados));
};

const RegistroCliente = () => {
  const handleClienteCreado = (clienteCreado) => {
    guardarClienteLocal(clienteCreado);

    const resumenActual = leerStorage(RESUMEN_KEY, {
      clientes: 0,
      contactos: 0,
      fichas: 0,
    });

    localStorage.setItem(RESUMEN_KEY, JSON.stringify({
      clientes: resumenActual.clientes + 1,
      contactos: resumenActual.contactos + (clienteCreado.email && clienteCreado.phone ? 1 : 0),
      fichas: resumenActual.fichas + (clienteCreado.username && clienteCreado.password ? 1 : 0),
    }));

    const nombreCompleto = `${clienteCreado.name?.firstname ?? ''} ${clienteCreado.name?.lastname ?? ''}`.trim();

    guardarActividadDashboard({
      id: Date.now(),
      tipo: 'registro-cliente',
      titulo: 'Cliente registrado',
      detalle: `Se registro ${nombreCompleto}.`,
      fecha: crearFechaActividad(),
    });
  };

  return (
    <main className="registro-page">
      <section className="registro-shell">
        <BotonVolverClientes />
        <FormAltaCliente onClienteCreado={handleClienteCreado} />
      </section>
    </main>
  );
};

export default RegistroCliente;
