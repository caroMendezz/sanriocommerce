const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

const register = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (name.length < 2) {
    throw httpError(400, 'Ingresá tu nombre (mínimo 2 caracteres).');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw httpError(400, 'Ingresá un email válido.');
  }
  if (password.length < 6) {
    throw httpError(400, 'La contraseña debe tener al menos 6 caracteres.');
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw httpError(409, 'Ya existe una cuenta con ese email.');
  }

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role: 'cliente',
  });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!email || !password) {
    throw httpError(400, 'Completá tu email y contraseña.');
  }

  const user = await User.findOne({ where: { email } });
  const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !passwordMatches) {
    throw httpError(401, 'Email o contraseña incorrectos.');
  }

  res.json({ token: signToken(user), user: publicUser(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = { register, login, me };
