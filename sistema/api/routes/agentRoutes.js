const { Router } = require('express');
const agentController = require('../controllers/agentController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/', authenticate, agentController.reply);

module.exports = router;
