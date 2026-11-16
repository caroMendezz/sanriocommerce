const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const parsePort = (value, fallback) => {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 ? port : fallback;
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parsePort(process.env.PORT, 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET || 'sanriocommerce-dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '2d',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parsePort(process.env.DB_PORT, 3306),
    name: process.env.DB_NAME || 'sanriocommerce',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },
  admin: {
    name: process.env.ADMIN_NAME || 'Administradora Sanrio',
    email: process.env.ADMIN_EMAIL || 'admin@sanriocommerce.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
};
