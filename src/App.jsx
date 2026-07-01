import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/layout/Footer.jsx';
import { Header } from './components/layout/Header.jsx';
import { AdminContext, AdminProvider } from './context/AdminContext.jsx';
import Dashboard from './views/Dashboard';
import DetalleCliente from './views/DetalleCliente';
import ListaClientes from './views/ListaClientes';
import Login from './views/Login';
import RegistroCliente from './views/RegistroCliente';

const RutaProtegida = ({ children }) => {
  const { admin } = useContext(AdminContext);

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const Inicio = () => {
  const { admin } = useContext(AdminContext);
  return <Navigate to={admin ? '/dashboard' : '/login'} replace />;
};

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Header />
          <div className="app-main app-page-background">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
              <Route path="/clientes" element={<RutaProtegida><ListaClientes /></RutaProtegida>} />
              <Route path="/clientes/registrar" element={<RutaProtegida><RegistroCliente /></RutaProtegida>} />
              <Route path="/clientes/:id" element={<RutaProtegida><DetalleCliente /></RutaProtegida>} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
