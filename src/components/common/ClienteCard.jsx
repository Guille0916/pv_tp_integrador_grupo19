import BotonIcono from './BotonIcono';

const ClienteCard = ({ cliente }) => {
  const nombreCompleto = `${cliente.name?.firstname ?? ''} ${cliente.name?.lastname ?? ''}`.trim();

  return (
    <article className="cliente-card">
      <div className="cliente-card-top">
        <strong>{nombreCompleto}</strong>
      </div>

      <dl className="cliente-card-datos">
        <div>
          <dt>Email</dt>
          <dd>{cliente.email}</dd>
        </div>
        <div>
          <dt>Telefono</dt>
          <dd>{cliente.phone}</dd>
        </div>
        <div>
          <dt>Ciudad</dt>
          <dd>{cliente.address?.city}</dd>
        </div>
      </dl>

      <BotonIcono
        className="cliente-card-link"
        label="Ver ficha completa"
        to={`/clientes/${cliente.id}`}
      >
        <svg className="btn-icon" aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5 4h10l4 4v12H5z" />
          <path d="M15 4v5h5" />
          <path d="M8 13h8M8 16h6" />
        </svg>
      </BotonIcono>
    </article>
  );
};

export default ClienteCard;
