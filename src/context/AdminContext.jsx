import { createContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'adminSesion';

// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
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
