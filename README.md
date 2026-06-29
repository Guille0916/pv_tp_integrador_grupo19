# PV TP Integrador - Grupo 19

## Descripción del proyecto

Aplicación web desarrollada con React y Vite orientada a la gestión y consulta de clientes.

El sistema permite iniciar sesión mediante sectores con permisos diferenciados, visualizar información de clientes, realizar búsquedas y gestionar acciones según el rol del usuario.

La aplicación implementa control de acceso mediante contexto de React y rutas protegidas.

---

## Integrantes

- Acho Gimenez Guillermo Miguel - GitHub: Guille0916
- Giron Luciano Gabriel - GitHub: Lucianogiron10
- Quintanilla Anahi Mikaela - GitHub: AniQuintanilla13-debug
- Mamani Noe Franco - GitHub: Francozxy
- Fernandez Lautaro Ariel - GitHub: lautarofernandez17

---

## Roles disponibles

### Soporte

Permisos:

- Iniciar sesión.
- Acceder al dashboard.
- Consultar clientes.
- Buscar clientes.
- Visualizar detalle de clientes.

### Gerencia

Permisos:

- Iniciar sesión.
- Acceder al dashboard.
- Consultar clientes.
- Buscar clientes.
- Visualizar detalle de clientes.
- Eliminar clientes.

El rol Administrador no forma parte de la lógica de permisos del sistema.

---

## Tecnologías utilizadas

- React 19
- Vite
- JavaScript
- React Router DOM
- React Bootstrap
- Bootstrap
- CSS

---

## API utilizada

Para la gestión de datos de clientes se utiliza:

FakeStore API

https://fakestoreapi.com/

---

## Estructura principal del proyecto

```txt
src/
  assets/
  components/
    common/
    layout/
  context/
  views/
```

## Funcionalidades implementadas

- Login con nombre y sector.
- Persistencia de sesion con LocalStorage.
- Rutas protegidas para dashboard, clientes, registro y detalle.
- Header con datos del usuario y cierre de sesion.
- Footer con redes sociales y derechos.
- Dashboard con saludo, metricas y registro de actividad.
- Listado de clientes en cards.
- Busqueda de clientes por apellido o ciudad.
- Estados de carga, exito y error durante el consumo de la API.
- Formulario de alta con validaciones y peticion POST.
- Ficha completa de cliente con direccion, geolocalizacion y credenciales.
- Boton de eliminacion disponible solo para Gerencia.

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run lint
```
