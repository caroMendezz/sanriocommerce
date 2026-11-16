const bcrypt = require('bcrypt');
const env = require('./env');
const products = require('./seedData');

const seedDatabase = async () => {
  const { User, Product } = require('../models');

  const [admin, created] = await User.findOrCreate({
    where: { email: env.admin.email },
    defaults: {
      name: env.admin.name,
      email: env.admin.email,
      password: await bcrypt.hash(env.admin.password, 10),
      role: 'admin',
    },
  });

  const productCount = await Product.count();
  let createdProducts = 0;

  if (productCount === 0) {
    await Product.bulkCreate(products);
    createdProducts = products.length;
  }

  return {
    adminCreated: created,
    adminEmail: admin.email,
    createdProducts,
  };
};

module.exports = { seedDatabase };

if (require.main === module) {
  const { sequelize, seedDatabase: runSeed } = require('../models');

  (async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      const result = await runSeed();
      console.log('Base de datos lista.');
      console.log(`Admin: ${result.adminEmail}`);
      console.log(`Productos creados: ${result.createdProducts}`);
      await sequelize.close();
    } catch (error) {
      console.error('No se pudo inicializar la base de datos:', error.message);
      process.exit(1);
    }
  })();
}
