const { Router } = require('express');
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/', authenticate, orderController.create);

module.exports = router;
