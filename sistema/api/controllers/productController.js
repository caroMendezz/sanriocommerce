const { Op } = require('sequelize');
const { Product } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeProduct = (body) => {
  const name = String(body.name || '').trim();
  const character = String(body.character || '').trim();
  const description = String(body.description || '').trim();
  const material = String(body.material || '').trim();
  const emoji = String(body.emoji || '🎀').trim();
  const price = Number(body.price);
  const stock = Number(body.stock);

  if (!name) throw httpError(400, 'El nombre del peluche es obligatorio.');
  if (!character) throw httpError(400, 'Indicá a qué personaje representa.');
  if (!description) throw httpError(400, 'Escribí una descripción del peluche.');
  if (!material) throw httpError(400, 'Indicá de qué está hecho el peluche.');
  if (!Number.isFinite(price) || price <= 0) {
    throw httpError(400, 'El precio debe ser un número mayor a 0.');
  }
  if (!Number.isInteger(stock) || stock < 0) {
    throw httpError(400, 'El stock debe ser un número entero mayor o igual a 0.');
  }

  return {
    name,
    character,
    description,
    material,
    emoji: emoji.slice(0, 16) || '🎀',
    price,
    stock,
    heightCm: toPositiveInt(body.heightCm, 25),
    weightGrams: toPositiveInt(body.weightGrams, 220),
  };
};

const list = asyncHandler(async (req, res) => {
  const query = String(req.query.q || '').trim();
  const where = { active: true };

  if (query) {
    // Prefijo del nombre completo, de cualquier palabra del nombre ("he" → "Peluche Hello Kitty")
    // y del personaje ("ku" → Kuromi). Así alcanza con las dos primeras letras.
    where[Op.or] = [
      { name: { [Op.like]: `${query}%` } },
      { name: { [Op.like]: `% ${query}%` } },
      { character: { [Op.like]: `${query}%` } },
    ];
  }

  const products = await Product.findAll({
    where,
    order: [['name', 'ASC']],
  });

  res.json({ products, query });
});

const getById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    where: { id: req.params.id, active: true },
  });

  if (!product) {
    throw httpError(404, 'No encontramos ese peluche.');
  }

  res.json({ product });
});

const create = asyncHandler(async (req, res) => {
  const product = await Product.create(normalizeProduct(req.body));
  res.status(201).json({ product });
});

const remove = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product || !product.active) {
    throw httpError(404, 'Ese peluche ya no existe.');
  }

  // Baja lógica: conserva el historial de pedidos y libera el catálogo.
  product.active = false;
  await product.save();

  res.json({ message: 'Peluche eliminado del catálogo.' });
});

module.exports = { list, getById, create, remove };
