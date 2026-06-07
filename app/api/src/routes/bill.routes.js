const express = require('express');

const controller = require('../controllers/bill.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();


router.use(authMiddleware);

router.post('/', controller.create);

router.get('/', controller.findAll);

router.get('/:id', controller.findById);

router.put('/:id', controller.update);

router.delete('/:id', controller.remove);

module.exports = router;