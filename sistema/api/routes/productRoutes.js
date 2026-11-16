const { Router } = require('express');
const productController = require('../controllers/productController');
const { authenticate, requireAdmin } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', productController.list);
router.get('/:id', productController.getById);
router.post('/', authenticate, requireAdmin, productController.create);
router.delete('/:id', authenticate, requireAdmin, productController.remove);

module.exports = router;
