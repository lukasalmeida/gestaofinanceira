const express = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const transactionRoutes = require('./transaction.routes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;    