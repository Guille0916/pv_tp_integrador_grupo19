import { Link } from 'react-router-dom';

const ClienteCard = ({ cliente, eliminando = false, onEliminar, puedeEliminar = false }) => {
  const nombreCompleto = `${cliente.name?.firstname ?? ''} ${cliente.name?.lastname ?? ''}`.trim();
  const iniciales = `${cliente.name?.firstname?.[0] ?? ''}${cliente.name?.lastname?.[0] ?? ''}`.toUpperCase() || 'CL';

  return (
    <article className="cliente-card">
      <div className="cliente-card-top">
        <span className="cliente-card-avatar" aria-hidden="true">
          {iniciales}
        </span>
        <strong>{nombreCompleto || 'Cliente'}</strong>
      </div>

      <dl className="cliente-card-datos">
        <div>
          <dt>Email</dt>
          <dd>{cliente.email || '-'}</dd>
        </div>

        <div>
          <dt>Telefono</dt>
          <dd>{cliente.phone || '-'}</dd>
        </div>

        <div>
          <dt>Ciudad</dt>
          <dd>{cliente.address?.city || '-'}</dd>
        </div>
      </dl>

      <footer className="cliente-card-footer">
        {/* Cambiado a Link común */}
        <Link
          className="cliente-card-link"
          aria-label="Ver ficha completa"
          to={`/clientes/${cliente.id}`}
        >
          <svg className="btn-icon" aria-hidden="true" viewBox="0 0 24 24">
            <path d="M5 4h10l4 4v12H5z" />
            <path d="M15 4v5h5" />
            <path d="M8 13h8M8 16h6" />
          </svg>
        </Link>

        {/* Cambiado a button común */}
        {puedeEliminar && (
          <button
            type="button"
            className="cliente-card-delete"
            disabled={eliminando}
            aria-label="Eliminar cliente"
            onClick={() => onEliminar?.(cliente)}
          >
            <svg className="btn-icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M4 7h16" />
              <path d="M10 11v6M14 11v6" />
              <path d="M6 7l1 13h10l1-13" />
              <path d="M9 7V4h6v3" />
            </svg>
          </button>
        )}
      </footer>
    </article>
  );
};

export default ClienteCard;