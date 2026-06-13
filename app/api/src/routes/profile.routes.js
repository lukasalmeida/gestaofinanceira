const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const controller = require('../controllers/profile.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', controller.getMe);
router.put('/me', controller.updateMe);
router.put('/me/avatar', controller.updateAvatar);
router.put('/me/password', controller.updatePassword);

module.exports = router;
