import FormAltaCliente from "./components/clientes/FormAltaCliente";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import ListaClientes from './views/ListaClientes';
import DetalleCliente from './views/DetalleCliente';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/clientes" element={<ListaClientes />} />

        <Route path="/clientes/nuevo" element={<FormAltaCliente />} />

        <Route path="/clientes/:id" element={<DetalleCliente />} />

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;