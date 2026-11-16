import { useEffect, useState } from 'react';
import { checkout } from '../services/orderService';
import { formatPrice } from '../utils/format';

const initialCard = { number: '', name: '', expiry: '', cvv: '' };

export default function PaymentModal({ open, items, onClose, onSuccess }) {
  const [step, setStep] = useState('method');
  const [method, setMethod] = useState(null);
  const [card, setCard] = useState(initialCard);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const total = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  useEffect(() => {
    if (open) {
      setStep('method');
      setMethod(null);
      setCard(initialCard);
      setError('');
      setOrder(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape' && step !== 'processing') onClose();
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, step, onClose]);

  if (!open) return null;

  const chooseMethod = (value) => {
    setMethod(value);
    setError('');
    setStep(value === 'tarjeta' ? 'card' : 'wallet');
  };

  const pay = async () => {
    setError('');

    if (method === 'tarjeta') {
      const digits = card.number.replace(/\s/g, '');
      if (digits.length < 16 || !/^\d+$/.test(digits)) {
        setError('Ingresá los 16 dígitos de tu tarjeta.');
        return;
      }
      if (card.name.trim().length < 3) {
        setError('Ingresá el nombre como figura en la tarjeta.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
        setError('La fecha de vencimiento debe tener formato MM/AA.');
        return;
      }
      if (!/^\d{3,4}$/.test(card.cvv)) {
        setError('El código de seguridad debe tener 3 o 4 dígitos.');
        return;
      }
    }

    setStep('processing');

    try {
      const result = await checkout(items, method);
      setOrder(result.order);
      setStep('done');
      onSuccess?.(result.order);
    } catch (requestError) {
      setError(requestError.message);
      setStep(method === 'tarjeta' ? 'card' : 'wallet');
    }
  };

  const handleCardChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === 'number') {
      nextValue = value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (name === 'expiry') {
      nextValue = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/(\d{2})(?=\d)/, '$1/');
    }
    if (name === 'cvv') nextValue = value.replace(/\D/g, '').slice(0, 4);

    setCard((current) => ({ ...current, [name]: nextValue }));
  };

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget && step !== 'processing') onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label="Método de pago">
        {step !== 'processing' && (
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        )}

        {step === 'method' && (
          <>
            <h2>¿Cómo querés pagar?</h2>
            <p className="modal-subtitle">
              Total a pagar: <strong>{formatPrice(total)}</strong>
            </p>

            <div className="payment-options">
              <button
                type="button"
                className="payment-option"
                onClick={() => chooseMethod('tarjeta')}
              >
                <span className="payment-icon" aria-hidden="true">
                  💳
                </span>
                <span>
                  <strong>Tarjeta de crédito</strong>
                  <small>Visa, Mastercard y Amex</small>
                </span>
              </button>
              <button
                type="button"
                className="payment-option"
                onClick={() => chooseMethod('mercadopago')}
              >
                <span className="payment-icon" aria-hidden="true">
                  💙
                </span>
                <span>
                  <strong>Mercado Pago</strong>
                  <small>Pagá desde tu cuenta</small>
                </span>
              </button>
            </div>

            <p className="demo-note">
              🔒 Pago simulado con fines demostrativos. No se cobra dinero real.
            </p>
          </>
        )}

        {step === 'card' && (
          <>
            <button type="button" className="link-back" onClick={() => setStep('method')}>
              ← Elegir otro método
            </button>
            <h2>Datos de tu tarjeta</h2>
            <p className="modal-subtitle">Total: {formatPrice(total)}</p>

            <div className="card-fields">
              <label className="field">
                <span>Número de tarjeta</span>
                <input
                  name="number"
                  value={card.number}
                  onChange={handleCardChange}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  autoComplete="cc-number"
                />
              </label>
              <label className="field">
                <span>Nombre del titular</span>
                <input
                  name="name"
                  value={card.name}
                  onChange={handleCardChange}
                  placeholder="ANA GARCÍA"
                  autoComplete="cc-name"
                />
              </label>
              <div className="field-row">
                <label className="field">
                  <span>Vencimiento</span>
                  <input
                    name="expiry"
                    value={card.expiry}
                    onChange={handleCardChange}
                    placeholder="12/28"
                    autoComplete="cc-exp"
                  />
                </label>
                <label className="field">
                  <span>CVV</span>
                  <input
                    name="cvv"
                    value={card.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    autoComplete="cc-csc"
                  />
                </label>
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="button" className="btn btn-primary btn-block" onClick={pay}>
              Pagar {formatPrice(total)}
            </button>
            <p className="demo-note">🔒 Pago simulado: no se realiza ningún cobro.</p>
          </>
        )}

        {step === 'wallet' && (
          <>
            <button type="button" className="link-back" onClick={() => setStep('method')}>
              ← Elegir otro método
            </button>
            <h2>Mercado Pago</h2>
            <div className="wallet-card">
              <span aria-hidden="true">💙</span>
              <p>Vas a pagar <strong>{formatPrice(total)}</strong> desde tu cuenta de Mercado Pago.</p>
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="button" className="btn btn-primary btn-block" onClick={pay}>
              Simular pago aprobado
            </button>
            <p className="demo-note">🔒 Integración de ejemplo: el pago no es real.</p>
          </>
        )}

        {step === 'processing' && (
          <div className="payment-processing">
            <span className="spinner" aria-hidden="true" />
            <p>Procesando tu pago simulado...</p>
          </div>
        )}

        {step === 'done' && (
          <div className="payment-done">
            <span className="done-mark" aria-hidden="true">
              🌸
            </span>
            <h2>¡Pago aprobado!</h2>
            <p>
              Tu pedido <strong>#{order?.id}</strong> quedó registrado por{' '}
              <strong>{formatPrice(order?.total ?? total)}</strong>.
            </p>
            <p className="demo-note">Prepararemos tus peluches con mucho cariño 💗</p>
            <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
