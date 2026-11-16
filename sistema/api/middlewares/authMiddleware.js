const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Necesitás iniciar sesión para continuar.' });
    }

    const payload = jwt.verify(token, env.jwt.secret);
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({ message: 'Tu usuario ya no está disponible.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Tu sesión expiró. Volvé a iniciar sesión.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Esta sección es solo para administradores.' });
  }
  return next();
};

module.exports = { authenticate, requireAdmin };
