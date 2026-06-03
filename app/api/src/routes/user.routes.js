const express = require('express');
const controller = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', controller.createUser);
router.get('/', authMiddleware, controller.findAll);
router.put('/:id', authMiddleware, controller.updateUser);

module.exports = router;