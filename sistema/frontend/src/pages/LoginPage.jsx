import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Notice from '../components/Notice';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  if (loading) {
    return (
      <div className="page-loader">
        <span className="spinner" aria-hidden="true" />
        <p>Cargando Sanriocommerce…</p>
      </div>
    );
  }

  if (user) return <Navigate to="/catalogo" replace />;

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPending(true);

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate('/catalogo', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-showcase">
        <span className="auth-badge">Peluches oficiales de tus personajes favoritos</span>
        <h1>
          Abrazos <span>Sanrio</span> a domicilio
        </h1>
        <p>
          Descubrí peluches suaves de Hello Kitty, Kuromi, Cinnamoroll y muchos más. Elegí,
          llená tu carrito y simulá tu compra en minutos.
        </p>
        <div className="auth-emojis" aria-hidden="true">
          <span>🎀</span>
          <span>🐰</span>
          <span>☁️</span>
          <span>🖤</span>
          <span>🍮</span>
        </div>
        <ul className="auth-benefits">
          <li>✨ Stock actualizado en tiempo real</li>
          <li>🚚 Envíos a todo el país</li>
          <li>🔒 Compra demo con pago simulado</li>
        </ul>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="auth-logo">🎀 Sanriocommerce</p>
          <h2>{mode === 'login' ? '¡Hola de nuevo!' : 'Creá tu cuenta'}</h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Iniciá sesión para ver el catálogo y tus peluches.'
              : 'Solo necesitás un email y una contraseña.'}
          </p>

          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'active' : ''}
              onClick={() => switchMode('login')}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={mode === 'register' ? 'active' : ''}
              onClick={() => switchMode('register')}
            >
              Registrarme
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label className="field">
                <span>Nombre</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  autoComplete="name"
                  required
                />
              </label>
            )}
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </label>
            <label className="field">
              <span>Contraseña</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={6}
                required
              />
            </label>

            <Notice>{error}</Notice>

            <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
              {pending
                ? 'Un momento…'
                : mode === 'login'
                  ? 'Entrar al catálogo'
                  : 'Crear cuenta y entrar'}
            </button>
          </form>

          <p className="auth-demo">
            Admin de prueba: <strong>admin@sanriocommerce.com</strong> ·{' '}
            <strong>admin123</strong>
          </p>
        </div>
      </section>
    </div>
  );
}
