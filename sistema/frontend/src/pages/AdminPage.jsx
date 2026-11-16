import { useEffect, useState } from 'react';
import Notice from '../components/Notice';
import { useAuth } from '../context/AuthContext';
import { createProduct, deleteProduct, getProducts } from '../services/productService';
import { formatPrice, stockLabel } from '../utils/format';

const emptyForm = {
  name: '',
  character: '',
  emoji: '🎀',
  description: '',
  material: '',
  heightCm: 25,
  weightGrams: 220,
  price: '',
  stock: 10,
};

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, setPending] = useState(false);

  const loadProducts = () =>
    getProducts()
      .then((data) => setProducts(data.products))
      .catch((requestError) => setError(requestError.message));

  useEffect(() => {
    loadProducts();
  }, []);

  if (!isAdmin) {
    return (
      <div className="page">
        <div className="empty-state">
          <span aria-hidden="true">🔒</span>
          <h1>Sección solo para administradores</h1>
          <p>Tu cuenta es de cliente, así que no podés publicar ni eliminar productos.</p>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setPending(true);

    try {
      await createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        heightCm: Number(form.heightCm),
        weightGrams: Number(form.weightGrams),
      });
      setForm(emptyForm);
      setSuccess('¡Peluche publicado en el catálogo! 🎀');
      await loadProducts();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPending(false);
    }
  };

  const handleRemove = async (product) => {
    const confirmed = window.confirm(`¿Eliminar "${product.name}" del catálogo?`);
    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await deleteProduct(product.id);
      setSuccess(`"${product.name}" se eliminó del catálogo.`);
      await loadProducts();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const soldOut = products.filter((product) => product.stock === 0).length;

  return (
    <div className="page admin-page">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">Panel de administración</span>
          <h1>Gestión del catálogo</h1>
          <p>Publicá peluches nuevos y eliminá los que ya no querés mostrar.</p>
        </div>
      </div>

      <div className="admin-stats">
        <article>
          <span>Productos activos</span>
          <strong>{products.length}</strong>
        </article>
        <article>
          <span>Unidades en stock</span>
          <strong>{totalStock}</strong>
        </article>
        <article>
          <span>Agotados</span>
          <strong>{soldOut}</strong>
        </article>
      </div>

      <Notice>{error}</Notice>
      <Notice tone="success">{success}</Notice>

      <div className="admin-layout">
        <section className="admin-form-card">
          <h2>Publicar un peluche</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="field-row">
              <label className="field">
                <span>Nombre</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Peluche Hello Kitty"
                  required
                />
              </label>
              <label className="field">
                <span>Personaje</span>
                <input
                  name="character"
                  value={form.character}
                  onChange={handleChange}
                  placeholder="Hello Kitty"
                  required
                />
              </label>
            </div>

            <div className="field-row">
              <label className="field field-small">
                <span>Emoji de portada</span>
                <input name="emoji" value={form.emoji} onChange={handleChange} maxLength={16} />
              </label>
              <label className="field">
                <span>Precio (ARS)</span>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                />
              </label>
              <label className="field">
                <span>Stock</span>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  required
                />
              </label>
            </div>

            <div className="field-row">
              <label className="field">
                <span>Alto (cm)</span>
                <input
                  type="number"
                  name="heightCm"
                  value={form.heightCm}
                  onChange={handleChange}
                  min="1"
                />
              </label>
              <label className="field">
                <span>Peso (g)</span>
                <input
                  type="number"
                  name="weightGrams"
                  value={form.weightGrams}
                  onChange={handleChange}
                  min="1"
                />
              </label>
              <label className="field">
                <span>Material</span>
                <input
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  placeholder="Felpa hipoalergénica"
                  required
                />
              </label>
            </div>

            <label className="field">
              <span>Descripción</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Contá cómo es el peluche, su textura y para quién es ideal."
                required
              />
            </label>

            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? 'Publicando…' : 'Publicar peluche'}
            </button>
          </form>
        </section>

        <section className="admin-list-card">
          <h2>Productos publicados</h2>
          {products.length === 0 ? (
            <p className="admin-empty">Todavía no hay productos en el catálogo.</p>
          ) : (
            <ul className="admin-list">
              {products.map((product) => {
                const stock = stockLabel(product.stock);
                return (
                  <li key={product.id}>
                    <span className="admin-item-emoji" aria-hidden="true">
                      {product.emoji}
                    </span>
                    <div className="admin-item-info">
                      <strong>{product.name}</strong>
                      <small>
                        {product.character} · {formatPrice(product.price)}
                      </small>
                    </div>
                    <span className={`stock-pill stock-${stock.tone}`}>{stock.text}</span>
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => handleRemove(product)}
                    >
                      Eliminar
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
