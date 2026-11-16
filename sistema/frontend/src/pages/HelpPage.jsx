const HELP_EMAIL = 'ayuda@sanriocommerce.com';
const subject = encodeURIComponent('Ayuda con mi pedido en Sanriocommerce');
const body = encodeURIComponent(
  [
    'Hola equipo de Sanriocommerce:',
    '',
    'Mi nombre es:',
    'Email de mi cuenta:',
    'Número de pedido (si tenés):',
    '',
    'Contanos qué pasó:',
    '',
    '',
    'Adjunto captura o foto del problema (si aplica).',
  ].join('\n'),
);
const mailto = `mailto:${HELP_EMAIL}?subject=${subject}&body=${body}`;

export default function HelpPage() {
  return (
    <div className="page help-page">
      <section className="help-hero">
        <span className="eyebrow">Estamos para ayudarte</span>
        <h1>💌 Ayuda y contacto</h1>
        <p>
          Si algo salió mal con tu pedido, escribinos y lo resolvemos. El botón abre tu cliente
          de correo con el mail ya preparado.
        </p>
        <a className="btn btn-primary" href={mailto}>
          Abrir mail de ayuda
        </a>
        <p className="help-address">
          Correo de ejemplo: <strong>{HELP_EMAIL}</strong>
        </p>
      </section>

      <section className="help-grid">
        <article className="help-card">
          <span aria-hidden="true">📦</span>
          <h2>Problemas con un pedido</h2>
          <p>
            Contanos el número de pedido, qué producto falta o llegó distinto y cómo querés que
            lo resolvamos.
          </p>
        </article>
        <article className="help-card">
          <span aria-hidden="true">🧵</span>
          <h2>Producto dañado</h2>
          <p>
            Adjuntá una foto del peluche y del embalaje. Con eso podemos coordinar el cambio sin
            más vueltas.
          </p>
        </article>
        <article className="help-card">
          <span aria-hidden="true">💳</span>
          <h2>Pagos y stock</h2>
          <p>
            Los pagos de esta tienda son simulados. Si una compra descontó stock y no querés
            seguir, avisanos y lo revisamos.
          </p>
        </article>
      </section>

      <section className="help-details">
        <h2>¿Qué incluir en el mail?</h2>
        <ul>
          <li>Tu nombre completo y el email con el que te registraste.</li>
          <li>El número de pedido que aparece al confirmar la compra.</li>
          <li>Una descripción del problema y, si podés, una captura de pantalla.</li>
          <li>Qué solución esperás: cambio, reembolso simulado o información.</li>
        </ul>
        <p className="help-times">Respondemos de lunes a viernes, de 9 a 18 h. 💗</p>
      </section>
    </div>
  );
}
