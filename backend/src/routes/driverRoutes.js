const express = require('express');
const router = express.Router();

const driverController = require('../controllers/driverController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/', driverController.create);
router.get('/', driverController.list);
router.get('/:id', driverController.getById);
router.put('/:id', driverController.update);
router.delete('/:id', driverController.remove);

module.exports = router;
