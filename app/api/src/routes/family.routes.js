const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const controller = require('../controllers/family.controller');

const router = express.Router();

router.use(authMiddleware);

router.post('/create', controller.create);
router.post('/join', controller.join);
router.get('/me', controller.getMe);
router.post('/rotate-token', controller.rotateToken);
router.delete('/members/:memberId', controller.removeMember);

module.exports = router;
