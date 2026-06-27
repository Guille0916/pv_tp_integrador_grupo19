import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import ListaClientes from './views/ListaClientes';
import DetalleCliente from './views/DetalleCliente';
import RegistroCliente from './views/RegistroCliente';
import { AdminContext, AdminProvider } from './context/AdminContext.jsx'
import {Header} from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx';

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
        <div className="app-main">
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
