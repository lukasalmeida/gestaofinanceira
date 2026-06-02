const express = require('express');

const controller = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);

module.exports = router;
