import request from '../api/client';

export const getProducts = (query = '') => {
  const search = query.trim();
  return request(`/products${search ? `?q=${encodeURIComponent(search)}` : ''}`, {
    auth: false,
  });
};

export const getProduct = (id) => request(`/products/${id}`, { auth: false });

export const createProduct = (product) =>
  request('/products', { method: 'POST', body: product });

export const deleteProduct = (id) => request(`/products/${id}`, { method: 'DELETE' });
