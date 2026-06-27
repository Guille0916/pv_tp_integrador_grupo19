import { Link } from 'react-router-dom';

const BotonRegistrarCliente = () => {
  return (
    <Link className="clientes-alta-btn" to="/clientes/registrar">
      Registrar cliente
    </Link>
  );
};

export default BotonRegistrarCliente;
