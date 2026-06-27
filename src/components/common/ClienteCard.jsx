import { Link } from 'react-router-dom';

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

      <Link className="cliente-card-link" to={`/clientes/${cliente.id}`}>
        <span>Ver ficha completa</span>
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </article>
  );
};

export default ClienteCard;
