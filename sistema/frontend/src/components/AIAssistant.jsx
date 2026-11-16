import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { askAgent } from '../services/agentService';
import { formatPrice } from '../utils/format';

const quickPrompts = ['Algo barato', 'El más grande', '¿Tenés Kuromi?', '¿Cómo pago?'];

const welcome = {
  role: 'agent',
  text: '¡Hola! Soy Sani, tu asistente de Sanriocommerce 🎀 Decime qué personaje te gusta y te recomiendo un peluche.',
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open, pending]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || pending) return;

    setMessages((current) => [...current, { role: 'user', text: message }]);
    setInput('');
    setPending(true);

    try {
      const data = await askAgent(message);
      setMessages((current) => [
        ...current,
        { role: 'agent', text: data.reply, products: data.products },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: 'agent', text: `Ups, algo salió mal: ${error.message}`, error: true },
      ]);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="assistant-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Cerrar asistente Sani' : 'Abrir asistente Sani'}
        aria-expanded={open}
      >
        {open ? '✕' : '✨'}
      </button>

      {open && (
        <section className="assistant-panel" aria-label="Asistente Sani">
          <header className="assistant-header">
            <div>
              <strong>Sani</strong>
              <span>Asistente Sanriocommerce</span>
            </div>
            <span className="assistant-status">En línea</span>
          </header>

          <div className="assistant-messages" ref={listRef}>
            {messages.map((message, index) => (
              <div key={index} className={`message message-${message.role}`}>
                <p>{message.text}</p>
                {message.products?.length > 0 && (
                  <div className="message-products">
                    {message.products.map((product) => (
                      <Link
                        key={product.id}
                        to={`/producto/${product.id}`}
                        className="message-product"
                        onClick={() => setOpen(false)}
                      >
                        <span aria-hidden="true">{product.emoji}</span>
                        <span>
                          <strong>{product.name}</strong>
                          <small>{formatPrice(product.price)}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {pending && (
              <div className="message message-agent">
                <p className="typing">Sani está escribiendo…</p>
              </div>
            )}
          </div>

          <div className="assistant-quick">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => send(prompt)} disabled={pending}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="assistant-form"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribile a Sani..."
              aria-label="Mensaje para el asistente"
            />
            <button type="submit" disabled={pending || !input.trim()}>
              Enviar
            </button>
          </form>
        </section>
      )}
    </>
  );
}
