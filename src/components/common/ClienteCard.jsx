import BotonIcono from './BotonIcono';
import Badge from "react-bootstrap/Badge";

const ClienteCard = ({ cliente, eliminando = false, onEliminar, puedeEliminar = false }) => {
  const nombreCompleto = `${cliente.name?.firstname ?? ''} ${cliente.name?.lastname ?? ''}`.trim();
  const iniciales = `${cliente.name?.firstname?.[0] ?? ''}${cliente.name?.lastname?.[0] ?? ''}`.toUpperCase() || 'CL';

  return (
    <article className="cliente-card">

      {/* HEADER */}
      <div className="cliente-card-top">
<<<<<<< Updated upstream
        <div>
          <strong className="cliente-nombre">{nombreCompleto}</strong>
          <div className="cliente-meta">
            <span>Usuario: {cliente.username}</span>
          </div>
        </div>

        <Badge bg="primary">#{cliente.id}</Badge>
=======
        <span className="cliente-card-avatar" aria-hidden="true">
          {iniciales}
        </span>
        <strong>{nombreCompleto || 'Cliente'}</strong>
>>>>>>> Stashed changes
      </div>

      {/* DATOS */}
      <dl className="cliente-card-datos">

        <div>
          <dt>Email</dt>
          <dd>{cliente.email || '-'}</dd>
        </div>

        <div>
<<<<<<< Updated upstream
          <dt>Teléfono</dt>
=======
          <dt>Telefono</dt>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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

=======
      <footer className="cliente-card-footer">
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
        {puedeEliminar && (
          <BotonIcono
            className="cliente-card-delete"
            disabled={eliminando}
            label="Eliminar cliente"
            onClick={() => onEliminar?.(cliente)}
          >
            <svg className="btn-icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M4 7h16" />
              <path d="M10 11v6M14 11v6" />
              <path d="M6 7l1 13h10l1-13" />
              <path d="M9 7V4h6v3" />
            </svg>
          </BotonIcono>
        )}
      </footer>
>>>>>>> Stashed changes
    </article>
  );
};

export default ClienteCard;