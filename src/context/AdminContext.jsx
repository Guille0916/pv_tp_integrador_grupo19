import {createContext, useState, useEffect }from 'react';

//hola aqui dejo los comentario para estudiar = aqui es cuando se  crea el contexto 
export const AdminContext = createContext();

//AQUI creando el provedor de contexto (provider)
export const AdminProvider = ({children}) => {

    //el estado global del administrador.
    const [admin, setAdmin] = useState(()=>{
        //aqui se obtiene el administrador del localStorage
        const saveAdmin = localStorage.getItem('admin');

        //aqui se retorna el administrador si existe, si no retorna null
        return saveAdmin ? JSON.parse(saveAdmin) : null;
    });
    
//funcion global guardar la sesion al precionar el boton ingresar
const  login = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('adminSeccion', JSON.stringify(adminData));
};

//funcion global para borrar la seccion al "cerrar seccion"
const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminSeccion');
}

    return (
        <AdminContext.Provider value={{ admin, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
};
