import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { isAdmin, logout } = useAuth();
  const { count, clear } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [term, setTerm] = useState('');

  useEffect(() => {
    const trimmed = term.trim();

    if (trimmed.length < 2) return undefined;

    const timeout = setTimeout(() => {
      navigate(`/catalogo?q=${encodeURIComponent(trimmed)}`, { replace: true });
    }, 350);

    return () => clearTimeout(timeout);
  }, [term, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = term.trim();
    navigate(trimmed ? `/catalogo?q=${encodeURIComponent(trimmed)}` : '/catalogo');
  };

  const handleLogout = () => {
    logout();
    clear();
    navigate('/login');
  };

  const searching = location.pathname.startsWith('/catalogo');

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/catalogo" aria-label="Sanriocommerce, ir al catálogo">
          <span className="brand-mark" aria-hidden="true">
            🎀
          </span>
          <span className="brand-text">
            Sanrio<strong>commerce</strong>
          </span>
        </Link>

        <form className="search-bar" role="search" onSubmit={handleSubmit}>
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Buscar por nombre: he, kuromi, cinna..."
            aria-label="Buscar peluches por nombre"
          />
          {searching && term && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setTerm('');
                navigate('/catalogo');
              }}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </form>

        <nav className="header-actions" aria-label="Acciones de la cuenta">
          {isAdmin && (
            <NavLink className="header-link" to="/admin">
              <span aria-hidden="true">⚙️</span> Admin
            </NavLink>
          )}
          <NavLink className="header-link" to="/ayuda">
            <span aria-hidden="true">💌</span> Ayuda
          </NavLink>
          <Link className="cart-button" to="/carrito" aria-label={`Ir al carrito, ${count} productos`}>
            <span aria-hidden="true">🛒</span>
            <span className="cart-label">Carrito</span>
            <span className="cart-count">{count}</span>
          </Link>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}
