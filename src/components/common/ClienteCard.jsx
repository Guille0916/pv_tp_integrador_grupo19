import BotonIcono from './BotonIcono';
import Badge from "react-bootstrap/Badge";

const ClienteCard = ({ cliente }) => {
  const nombreCompleto = `${cliente.name?.firstname ?? ''} ${cliente.name?.lastname ?? ''}`.trim();

  return (
    <article className="cliente-card">

      {/* HEADER */}
      <div className="cliente-card-top">
        <div>
          <strong className="cliente-nombre">{nombreCompleto}</strong>
          <div className="cliente-meta">
            <span>Usuario: {cliente.username}</span>
          </div>
        </div>

        <Badge bg="primary">#{cliente.id}</Badge>
      </div>

      {/* DATOS */}
      <dl className="cliente-card-datos">

        <div>
          <dt>Email</dt>
          <dd>{cliente.email || '-'}</dd>
        </div>

        <div>
          <dt>Teléfono</dt>
          <dd>{cliente.phone || '-'}</dd>
        </div>

        <div>
          <dt>Ciudad</dt>
          <dd>{cliente.address?.city || '-'}</dd>
        </div>

        <div>
          <dt>Dirección</dt>
          <dd>
            {cliente.address?.street ?? '-'} {cliente.address?.number ?? ''}
          </dd>
        </div>

        <div>
          <dt>Código Postal</dt>
          <dd>{cliente.address?.zipcode || '-'}</dd>
        </div>

      </dl>

      <hr />

      {/* BOTÓN */}
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