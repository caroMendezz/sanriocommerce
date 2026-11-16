import request from '../api/client';

export const login = (credentials) =>
  request('/auth/login', { method: 'POST', body: credentials });

export const register = (data) => request('/auth/register', { method: 'POST', body: data });

export const me = () => request('/auth/me');
