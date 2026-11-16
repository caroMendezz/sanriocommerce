import { useState } from 'react';
import { Link } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function CartPage() {
  const { items, total, count, updateQuantity, remove, clear } = useCart();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paid, setPaid] = useState(false);

  if (count === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <span aria-hidden="true">🛒</span>
          <h1>Tu carrito está vacío</h1>
          <p>Sumá un peluche y volvé para completar tu compra.</p>
          <Link className="btn btn-primary" to="/catalogo">
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="cart-heading">
        <div>
          <span className="eyebrow">Tu selección</span>
          <h1>Carrito de compras</h1>
          <p>
            {count} {count === 1 ? 'peluche' : 'peluches'} listos para abrazar.
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={clear}>
          Vaciar carrito
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <article className="cart-item" key={item.productId}>
              <Link className="cart-item-cover" to={`/producto/${item.productId}`} aria-hidden="true">
                {item.emoji}
              </Link>
              <div className="cart-item-info">
                <span className="product-character">{item.character}</span>
                <Link className="cart-item-name" to={`/producto/${item.productId}`}>
                  {item.name}
                </Link>
                <span className="cart-item-unit">{formatPrice(item.price)} c/u</span>
              </div>
              <div className="quantity-control">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label={`Restar una unidad de ${item.name}`}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  aria-label={`Sumar una unidad de ${item.name}`}
                >
                  +
                </button>
              </div>
              <span className="cart-item-subtotal">
                {formatPrice(Number(item.price) * item.quantity)}
              </span>
              <button
                type="button"
                className="cart-item-remove"
                onClick={() => remove(item.productId)}
                aria-label={`Quitar ${item.name} del carrito`}
              >
                ✕
              </button>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Resumen</h2>
          <div className="summary-row">
            <span>Productos</span>
            <span>{count}</span>
          </div>
          <div className="summary-row">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => setPaymentOpen(true)}
          >
            Finalizar compra
          </button>
          <Link className="summary-continue" to="/catalogo">
            Seguir comprando
          </Link>
          <p className="demo-note">🔒 Pago simulado: no se cobra dinero real.</p>
        </aside>
      </div>

      <PaymentModal
        open={paymentOpen}
        items={items}
        onClose={() => {
          if (paid) clear();
          setPaid(false);
          setPaymentOpen(false);
        }}
        onSuccess={() => setPaid(true)}
      />
    </div>
  );
}
