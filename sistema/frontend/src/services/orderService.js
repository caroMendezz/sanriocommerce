import request from '../api/client';

export const checkout = (items, paymentMethod) =>
  request('/orders', {
    method: 'POST',
    body: {
      paymentMethod,
      items: items.map((item) => ({
        productId: item.productId ?? item.id,
        quantity: item.quantity,
      })),
    },
  });
