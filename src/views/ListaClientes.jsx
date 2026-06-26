import { useState } from 'react';
import FormAltaCliente from '../components/FormAltaCliente';

const ListaClientes = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <main className="clientes-page">
      <section className="clientes-header">
        <div>
          <p className="dashboard-kicker">Gestion de clientes</p>
          <h1>Lista de clientes</h1>
        </div>

        <button
          className="clientes-alta-btn"
          onClick={() => setMostrarFormulario((actual) => !actual)}
          type="button"
        >
          {mostrarFormulario ? 'Cerrar formulario' : 'Registrar cliente'}
        </button>
      </section>

      {mostrarFormulario && <FormAltaCliente />}
    </main>
  );
};

export default ListaClientes;
