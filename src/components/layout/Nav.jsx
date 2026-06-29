import { NavLink } from 'react-router-dom';

const Nav = () => (
  <nav className="app-nav" aria-label="Navegacion principal">
    <NavLink aria-label="Dashboard" title="Dashboard" to="/dashboard">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10.5V20h14v-9.5" />
        <path d="M9 20v-6h6v6" />
      </svg>
    </NavLink>

    <NavLink aria-label="Clientes" title="Clientes" to="/clientes">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M7 16a3 3 0 0 1 4 0" />
        <path d="M14 10h3" />
        <path d="M14 14h3" />
      </svg>
    </NavLink>
  </nav>
);

export default Nav;
