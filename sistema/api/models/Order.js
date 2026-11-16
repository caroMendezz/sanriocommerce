const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      paymentMethod: {
        type: DataTypes.ENUM('tarjeta', 'mercadopago'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pagado'),
        allowNull: false,
        defaultValue: 'pagado',
      },
    },
    {
      tableName: 'orders',
    },
  );
