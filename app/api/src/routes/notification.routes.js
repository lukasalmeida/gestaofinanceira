const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const controller = require('../controllers/notification.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/bills-due', controller.getBillDue);
router.post('/mark-read', controller.markRead);
router.post('/mark-all-read', controller.markAllRead);

module.exports = router;
