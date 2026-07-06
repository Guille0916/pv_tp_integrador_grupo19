const ConfirmacionEliminar = ({
  cliente,
  eliminando = false,
  mostrar = false,
  onCancelar,
  onConfirmar,
}) => {
  if (!mostrar || !cliente) {
    return null;
  }

  const nombreCompleto = `${cliente.name?.firstname ?? ''} ${cliente.name?.lastname ?? ''}`.trim() || 'este cliente';

  return (
    <div className="confirmacion-overlay" role="presentation">
      <section
        aria-labelledby="confirmacion-eliminar-titulo"
        aria-modal="true"
        className="confirmacion-card"
        role="dialog"
      >
        <div className="confirmacion-icono" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.3 4.2 2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
          </svg>
        </div>

        <div>
          <h2 id="confirmacion-eliminar-titulo">Eliminar cliente</h2>
          <p>
            Estas seguro de eliminar a <strong>{nombreCompleto}</strong>?
          </p>
        </div>

        <div className="confirmacion-actions">
          <button
            className="confirmacion-cancelar"
            disabled={eliminando}
            onClick={onCancelar}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="confirmacion-eliminar"
            disabled={eliminando}
            onClick={onConfirmar}
            type="button"
          >
            {eliminando ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmacionEliminar;
