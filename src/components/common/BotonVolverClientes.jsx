import BotonIcono from './BotonIcono';

const BotonVolverClientes = () => (
  <BotonIcono
    className="detalle-back detalle-back-icon"
    label="Volver a clientes"
    to="/clientes"
  >
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  </BotonIcono>
);

export default BotonVolverClientes;
