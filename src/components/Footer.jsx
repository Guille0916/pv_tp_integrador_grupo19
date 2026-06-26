import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext.jsx';

const Footer = () => {
  const { admin } = useContext(AdminContext);

  if (!admin) return null;

  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="app-footer-copy">
          <p>&copy; Grupo 19 - Facultad de Ingenieria - UNJu. Todos los derechos reservados.</p>
        </div>

        <div className="app-footer-social" aria-label="Redes sociales">
          <a href="#" aria-label="Instagram">
            <span>IG</span>
            Instagram 
          </a>
          <a href="#" aria-label="Facebook">
            <span>f</span>
            Facebook
          </a>
          <a href="#" aria-label="GitHub">
            <span>GH</span>
            GitHub
          </a>
          <a href="#" aria-label="LinkedIn">
            <span>in</span>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
