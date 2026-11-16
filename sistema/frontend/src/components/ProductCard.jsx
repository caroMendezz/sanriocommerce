import { Link } from 'react-router-dom';
import { formatPrice, stockLabel } from '../utils/format';

export default function ProductCard({ product }) {
  const stock = stockLabel(product.stock);

  return (
    <article className="product-card">
      <Link className="product-card-link" to={`/producto/${product.id}`}>
        <div className="product-cover" aria-hidden="true">
          <span className="product-emoji">{product.emoji}</span>
        </div>
        <div className="product-body">
          <span className="product-character">{product.character}</span>
          <h3>{product.name}</h3>
          <p className="product-meta">
            {product.heightCm} cm · {product.weightGrams} g
          </p>
          <div className="product-footer">
            <span className="product-price">{formatPrice(product.price)}</span>
            <span className={`stock-pill stock-${stock.tone}`}>{stock.text}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
