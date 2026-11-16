import request from '../api/client';

export const askAgent = (message) => request('/agent', { method: 'POST', body: { message } });
