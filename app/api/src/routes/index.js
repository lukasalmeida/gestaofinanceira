const express = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const transactionRoutes = require('./transaction.routes');
const categoryRoutes = require('./category.routes');
const familyRoutes = require('./family.routes');
const billRoutes = require('./bill.routes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/families', familyRoutes);
router.use('/bills', billRoutes);

module.exports = router;    