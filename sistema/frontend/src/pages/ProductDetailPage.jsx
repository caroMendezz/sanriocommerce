import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Notice from '../components/Notice';
import PaymentModal from '../components/PaymentModal';
import { useCart } from '../context/CartContext';
import { getProduct } from '../services/productService';
import { formatPrice, stockLabel } from '../utils/format';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);

  const loadProduct = () => {
    setLoading(true);
    setError('');

    return getProduct(id)
      .then((data) => setProduct(data.product))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="page-loader">
          <span className="spinner" aria-hidden="true" />
          <p>Buscando tu peluche…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <div className="empty-state">
          <span aria-hidden="true">🧸</span>
          <h2>No pudimos abrir este peluche</h2>
          <Notice>{error}</Notice>
          <Link className="btn btn-primary" to="/catalogo">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const stock = stockLabel(product.stock);
  const soldOut = product.stock <= 0;

  const handleAddToCart = () => {
    add(product, quantity);
    setFeedback(`Agregaste ${quantity} × ${product.name} al carrito 🛒`);
  };

  return (
    <div className="page detail-page">
      <Link className="back-link" to="/catalogo">
        ← Volver al catálogo
      </Link>

      <div className="detail-layout">
        <div className="detail-cover">
          <div className="detail-emoji" aria-hidden="true">
            {product.emoji}
          </div>
          <p className="detail-cover-caption">{product.character}</p>
        </div>

        <div className="detail-info">
          <span className="eyebrow">{product.character}</span>
          <h1>{product.name}</h1>
          <div className="detail-price-row">
            <span className="detail-price">{formatPrice(product.price)}</span>
            <span className={`stock-pill stock-${stock.tone}`}>{stock.text}</span>
          </div>

          <p className="detail-description">{product.description}</p>

          <dl className="detail-specs">
            <div>
              <dt>Tamaño</dt>
              <dd>{product.heightCm} cm de alto</dd>
            </div>
            <div>
              <dt>Peso</dt>
              <dd>{product.weightGrams} g</dd>
            </div>
            <div>
              <dt>Material</dt>
              <dd>{product.material}</dd>
            </div>
            <div>
              <dt>Personaje</dt>
              <dd>{product.character}</dd>
            </div>
          </dl>

          {!soldOut && (
            <div className="quantity-row">
              <span>Cantidad</span>
              <div className="quantity-control">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  aria-label="Restar una unidad"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Sumar una unidad"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <Notice tone="success">{feedback}</Notice>

          <div className="detail-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setPaymentOpen(true)}
              disabled={soldOut}
            >
              Comprar ahora
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddToCart}
              disabled={soldOut}
            >
              🛒 Agregar al carrito
            </button>
          </div>

          {soldOut && <p className="sold-out-note">Este peluche está agotado por ahora 💔</p>}
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        items={[{ productId: product.id, name: product.name, price: Number(product.price), quantity }]}
        onClose={() => setPaymentOpen(false)}
        onSuccess={() => {
          setFeedback('');
          loadProduct();
        }}
      />
    </div>
  );
}
