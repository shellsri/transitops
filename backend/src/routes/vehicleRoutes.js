const express = require('express');
const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/', vehicleController.create);
router.get('/', vehicleController.list);
router.get('/:id', vehicleController.getById);
router.put('/:id', vehicleController.update);
router.delete('/:id', vehicleController.remove);

module.exports = router;
