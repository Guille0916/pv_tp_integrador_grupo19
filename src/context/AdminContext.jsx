import { createContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'adminSesion';
const STORAGE_VERSION_KEY = 'clientesStorageVersion';
const STORAGE_VERSION = 'ids-secuenciales-v2';
const STORAGE_DATOS_CLIENTES = [
  'clientesRegistradosLocalmente',
  'clientesEliminadosLocalmente',
  'registroActividadClientes',
  'resumenClientesDashboard',
];

const reiniciarDatosLocalesSiHaceFalta = () => {
  if (localStorage.getItem(STORAGE_VERSION_KEY) === STORAGE_VERSION) {
    return;
  }

  STORAGE_DATOS_CLIENTES.forEach((key) => localStorage.removeItem(key));
  localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
};

// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    reiniciarDatosLocalesSiHaceFalta();

    const savedAdmin =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem('adminSeccion') ||
      localStorage.getItem('admin');

    try {
      return savedAdmin ? JSON.parse(savedAdmin) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (admin) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('adminSeccion');
    localStorage.removeItem('admin');
  }, [admin]);

  const login = (adminData) => {
    setAdmin(adminData);
  };

  const logout = () => {
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
