const express = require('express');
const router = express.Router();

const tripController = require('../controllers/tripController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/', tripController.create);
router.get('/', tripController.list);
router.get('/:id', tripController.getById);

// Update routes use PUT, not PATCH
router.put('/:id/dispatch', tripController.dispatch);
router.put('/:id/complete', tripController.complete);
router.put('/:id/cancel', tripController.cancel);

module.exports = router;
