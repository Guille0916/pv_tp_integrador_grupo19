import BotonIcono from './BotonIcono';

const BotonRegistrarCliente = () => {
  return (
    <BotonIcono
      className="clientes-alta-btn"
      label="Registrar cliente"
      to="/clientes/registrar"
    >
      <svg className="btn-icon" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </BotonIcono>
  );
};

export default BotonRegistrarCliente;
