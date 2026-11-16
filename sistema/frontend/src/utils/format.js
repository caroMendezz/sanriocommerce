const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export const formatPrice = (value) => currencyFormatter.format(Number(value) || 0);

export const stockLabel = (stock) => {
  if (stock <= 0) return { text: 'Sin stock', tone: 'out' };
  if (stock <= 5) return { text: `¡Últimas ${stock} unidades!`, tone: 'low' };
  return { text: `${stock} disponibles`, tone: 'ok' };
};
