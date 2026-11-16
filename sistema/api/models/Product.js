const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      character: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      emoji: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: '🎀',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      material: {
        type: DataTypes.STRING(160),
        allowNull: false,
      },
      heightCm: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 25,
      },
      weightGrams: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 220,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'products',
      indexes: [{ fields: ['name'] }, { fields: ['character'] }],
    },
  );
