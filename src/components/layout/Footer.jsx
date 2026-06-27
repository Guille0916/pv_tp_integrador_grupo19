import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext.jsx';

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
            <span>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17" cy="7" r="1" />
              </svg>
            </span>
            Instagram
          </a>
          <a href="#" aria-label="Facebook">
            <span>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M14 8h2V4h-3c-3 0-5 2-5 5v2H6v4h2v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1h1z" />
              </svg>
            </span>
            Facebook
          </a>
          <a href="#" aria-label="LinkedIn">
            <span>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M5 9h4v11H5zM5 4h4v4H5zM11 9h4v1.5c.7-1 1.8-1.7 3.4-1.7 2.6 0 4.1 1.8 4.1 5V20h-4v-5.7c0-1.3-.6-2-1.7-2-1 0-1.8.7-1.8 2V20h-4z" />
              </svg>
            </span>
            LinkedIn
          </a>
          <a
            href="https://github.com/Guille0916/pv_tp_integrador_grupo19"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <svg aria-hidden="true">
                <use href="/icons.svg#github-icon" />
              </svg>
            </span>
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
