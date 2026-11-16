const sequelize = require('../config/db');
const defineUser = require('./User');
const defineProduct = require('./Product');
const defineOrder = require('./Order');
const defineOrderItem = require('./OrderItem');

const User = defineUser(sequelize);
const Product = defineProduct(sequelize);
const Order = defineOrder(sequelize);
const OrderItem = defineOrderItem(sequelize);

User.hasMany(Order, {
  foreignKey: { name: 'userId', allowNull: false },
  as: 'orders',
  onDelete: 'CASCADE',
});
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem, {
  foreignKey: { name: 'orderId', allowNull: false },
  as: 'items',
  onDelete: 'CASCADE',
});
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

OrderItem.belongsTo(Product, {
  foreignKey: { name: 'productId', allowNull: true },
  as: 'product',
  onDelete: 'SET NULL',
});
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

const seedDatabase = require('../config/seed').seedDatabase;

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  seedDatabase,
};
