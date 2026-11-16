const { Product } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const normalize = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const pick = (products, limit = 3) => products.slice(0, limit);

const reply = asyncHandler(async (req, res) => {
  const message = normalize(req.body.message).trim();

  if (!message) {
    return res.status(400).json({ message: 'Escribime qué estás buscando.' });
  }

  const products = await Product.findAll({ where: { active: true }, order: [['name', 'ASC']] });
  const available = products.filter((product) => product.stock > 0);

  let answer = '';
  let suggestions = [];

  const matched = available.filter((product) => {
    const keywords = `${normalize(product.character)} ${normalize(product.name)}`
      .split(/\s+/)
      .filter((word) => word.length > 3);
    return keywords.some((word) => message.includes(word));
  });

  if (matched.length > 0) {
    suggestions = pick(matched);
    answer = `¡Sí! Tengo ${matched.length === 1 ? 'este modelo' : 'estos modelos'} de ${
      suggestions[0].character
    }. Todos tienen stock disponible y llegan con bolsa de regalo. 💕`;
  } else if (/(hola|buenas|hey|buen dia|buenas tardes|buenas noches)/.test(message)) {
    suggestions = pick(available);
    answer =
      '¡Hola! Soy Sani, tu asistente de Sanriocommerce 🎀 Puedo recomendarte peluches por personaje, precio o tamaño. ¿Qué personaje te gusta?';
  } else if (/(envio|entrega|llega|demora|despacho)/.test(message)) {
    answer =
      'Los envíos se despachan en 24/48 h hábiles y llegan en 3 a 5 días al interior del país. El envío es gratis en compras superiores a $50.000.';
  } else if (/(pago|tarjeta|mercado ?pago|cuotas)/.test(message)) {
    answer =
      'Podés pagar con tarjeta de crédito o Mercado Pago. Esta tienda es una demo, así que el pago es simulado: nunca se cobra dinero real.';
  } else if (/(problema|ayuda|reclamo|defectuoso|devolucion|cambio)/.test(message)) {
    answer =
      'Si tenés un problema con un producto, escribinos a ayuda@sanriocommerce.com con tu email de cuenta y el número de pedido. En la página de Ayuda tenés el botón que abre el mail listo para enviar.';
  } else if (/(barato|economico|presupuesto|menos|oferta)/.test(message)) {
    suggestions = pick([...available].sort((a, b) => Number(a.price) - Number(b.price)));
    answer = 'Estos son los más accesibles del catálogo, sin perder la suavidad Sanrio ✨';
  } else if (/(grande|grandote|abrazo)/.test(message)) {
    suggestions = pick([...available].sort((a, b) => b.heightCm - a.heightCm));
    answer = 'Si buscás el abrazo más grande, estos son los peluches más altos que tenemos.';
  } else if (/(chico|pequeno|mini|llavero)/.test(message)) {
    suggestions = pick([...available].sort((a, b) => a.heightCm - b.heightCm));
    answer = 'Estos son los más compactos, ideales para llevar a todos lados 🎒';
  } else if (/(stock|disponible|hay)/.test(message)) {
    suggestions = pick(available);
    answer = `Ahora mismo hay ${available.length} modelos disponibles con stock. Te dejo algunos favoritos.`;
  } else {
    suggestions = pick(available);
    answer =
      'Puedo ayudarte a elegir un peluche 🎀 Contame qué personaje te gusta o decime "algo barato", "el más grande" o "qué hay con stock".';
  }

  return res.json({
    reply: answer,
    products: suggestions.map((product) => ({
      id: product.id,
      name: product.name,
      character: product.character,
      emoji: product.emoji,
      price: product.price,
      stock: product.stock,
    })),
  });
});

module.exports = { reply };
