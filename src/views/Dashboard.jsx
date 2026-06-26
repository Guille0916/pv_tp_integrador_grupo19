import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../context/AdminContext.jsx';

const Dashboard = () => {
  const { admin } = useContext(AdminContext);
  const [metricas, setMetricas] = useState({
    clientes: 0,
    contactos: 0,
    fichas: 0,
  });
  const actividad = [];

  useEffect(() => {
    const cargarResumen = async () => {
      try {
        const respuesta = await fetch('https://fakestoreapi.com/users');

        if (!respuesta.ok) {
          throw new Error('Error al consultar FakeStore API');
        }

        const data = await respuesta.json();
        setMetricas({
          clientes: data.length,
          contactos: data.filter((cliente) => cliente.email && cliente.phone).length,
          fichas: data.filter((cliente) => cliente.username && cliente.password).length,
        });
      } catch {
        setMetricas({
          clientes: 0,
          contactos: 0,
          fichas: 0,
        });
      }
    };

    cargarResumen();

  }, []);

  return (
    <main className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-kicker">Panel de Control de Clientes</p>
          <h1>Bienvenido, {admin?.nombre}</h1>
          <p className="dashboard-intro">
            Tenes acceso como {admin?.sector}. Este es el resumen principal del sistema.
          </p>
        </div>

        <div className="dashboard-summary">
          <div>
            <span>Administrador</span>
            <strong>{admin?.sector}</strong>
          </div>
          <div>
            <span>Clientes</span>
            <strong>{metricas.clientes}</strong>
          </div>
          <div>
            <span>Fichas completas</span>
            <strong>{metricas.fichas}</strong>
          </div>
          <div>
            <span>Contactos</span>
            <strong>{metricas.contactos}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-activity">
        <div>
          <p className="dashboard-kicker">Registro de actividad</p>
          <h2>Movimientos recientes</h2>
        </div>

        {actividad.length === 0 ? (
          <p className="dashboard-empty">
            El registro se completara cuando se implemente y cargue la lista de clientes desde la API.
          </p>
        ) : (
          <ul>
            {actividad.map((item) => (
              <li key={item.id}>
                <span>{item.fecha}</span>
                <strong>{item.titulo}</strong>
                <p>{item.detalle}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
