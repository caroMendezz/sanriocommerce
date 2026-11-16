import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-brand">🎀 Sanriocommerce</p>
        <p className="footer-copy">
          Peluches suaves inspirados en tus personajes favoritos. Tienda de demostración: los
          pagos son simulados y no se realizan cobros reales.
        </p>
        <div className="footer-links">
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/carrito">Carrito</Link>
          <Link to="/ayuda">Ayuda</Link>
        </div>
      </div>
    </footer>
  );
}
