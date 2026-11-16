import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Notice from '../components/Notice';
import { getProducts } from '../services/productService';

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getProducts(query)
      .then((data) => {
        if (active) setProducts(data.products);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div className="page catalog-page">
      <section className="catalog-hero">
        <div>
          <span className="eyebrow">Colección 2026</span>
          <h1>
            Peluches que <span>abrazan</span> de verdad
          </h1>
          <p>
            Los personajes más tiernos de Sanrio en felpa ultra suave. Elegí tu favorito,
            mirá el detalle y sumalo al carrito.
          </p>
          <div className="hero-tags">
            <span>🚚 Envíos a todo el país</span>
            <span>🎁 Bolsa de regalo incluida</span>
          </div>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <span className="hero-emoji hero-emoji-lg">🎀</span>
          <span className="hero-emoji">🐰</span>
          <span className="hero-emoji">☁️</span>
          <span className="hero-emoji">🍮</span>
        </div>
      </section>

      <section className="catalog-section">
        <div className="catalog-heading">
          <div>
            <h2>{query ? `Resultados para “${query}”` : 'Todos los peluches'}</h2>
            <p>
              {loading
                ? 'Buscando en la tienda…'
                : `${products.length} ${products.length === 1 ? 'peluche encontrado' : 'peluches encontrados'}`}
            </p>
          </div>
          {query && (
            <Link className="btn btn-ghost" to="/catalogo">
              Ver todo el catálogo
            </Link>
          )}
        </div>

        <Notice>{error}</Notice>

        {loading ? (
          <div className="grid-loading">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton-card" aria-hidden="true" />
            ))}
          </div>
        ) : products.length === 0 && !error ? (
          <div className="empty-state">
            <span aria-hidden="true">🎀</span>
            <h3>No encontramos peluches con “{query}”</h3>
            <p>Probá con las primeras letras del nombre, por ejemplo “he” o “ku”.</p>
            <Link className="btn btn-primary" to="/catalogo">
              Ver todos los peluches
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
