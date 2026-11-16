const express = require('express');
const env = require('./config/env');
const { sequelize, seedDatabase } = require('./models');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const agentRoutes = require('./routes/agentRoutes');

const app = express();

app.use(cors);
app.use(express.json({ limit: '200kb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'sanriocommerce-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/agent', agentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    const result = await seedDatabase();

    if (result.adminCreated) {
      console.log(`Usuario admin creado: ${result.adminEmail} / ${env.admin.password}`);
    }
    if (result.createdProducts > 0) {
      console.log(`Catálogo inicial cargado: ${result.createdProducts} peluches.`);
    }

    app.listen(env.port, () => {
      console.log(`Sanriocommerce API escuchando en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la API:', error.message);
    console.error(
      'Revisá que MySQL esté corriendo y que el archivo .env tenga los datos correctos.',
    );
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

module.exports = { app, start };
