const { sequelize, Order, OrderItem, Product } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

const PAYMENT_METHODS = ['tarjeta', 'mercadopago'];

const create = asyncHandler(async (req, res) => {
  const { items, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw httpError(400, 'Tu carrito está vacío.');
  }
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    throw httpError(400, 'Elegí un método de pago válido.');
  }

  const normalizedItems = items.map((item) => ({
    productId: Number(item.productId),
    quantity: Math.max(1, Math.trunc(Number(item.quantity) || 1)),
  }));

  const orderId = await sequelize.transaction(async (transaction) => {
    const order = await Order.create(
      { userId: req.user.id, paymentMethod, status: 'pagado', total: 0 },
      { transaction },
    );

    let total = 0;

    for (const item of normalizedItems) {
      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product || !product.active) {
        throw httpError(404, 'Uno de los peluches ya no está disponible.');
      }
      if (product.stock < item.quantity) {
        throw httpError(409, `No hay stock suficiente de ${product.name}.`);
      }

      product.stock -= item.quantity;
      await product.save({ transaction });

      total += Number(product.price) * item.quantity;

      await OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          emoji: product.emoji,
          unitPrice: product.price,
          quantity: item.quantity,
        },
        { transaction },
      );
    }

    order.total = total;
    await order.save({ transaction });

    return order.id;
  });

  const order = await Order.findByPk(orderId, {
    include: [{ model: OrderItem, as: 'items' }],
  });

  res.status(201).json({
    message: 'Pago simulado aprobado. ¡Gracias por tu compra!',
    order,
  });
});

module.exports = { create };
