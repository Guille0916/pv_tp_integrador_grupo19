import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import ListaClientes from './views/ListaClientes';
import DetalleCliente from './views/DetalleCliente';
import { AdminContext, AdminProvider } from './context/AdminContext.jsx'
import {Header} from './components/layout/Header.jsx'

const RutaProtegida = ({ children }) => {
  const { admin } = useContext(AdminContext);

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AdminProvider>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/clientes" element={<RutaProtegida><ListaClientes /></RutaProtegida>} />
        <Route path="/clientes/:id" element={<RutaProtegida><DetalleCliente /></RutaProtegida>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
