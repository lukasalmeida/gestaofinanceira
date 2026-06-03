    const express = require("express");

const controller = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Cadastra uma nova transação
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - amount
 *               - type
 *               - categoryId
 *               - date
 *             properties:
 *               description:
 *                 type: string
 *                 example: Salário Maio
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum:
 *                   - INCOME
 *                   - EXPENSE
 *                 example: INCOME
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-01T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Transação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido ou não informado
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Lista todas as transações do usuário
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-01-01
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-12-31
 *     responses:
 *       200:
 *         description: Lista de transações
 *       401:
 *         description: Token inválido ou não informado
 */

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Busca uma transação pelo ID
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Transação encontrada
 *       404:
 *         description: Transação não encontrada
 *       401:
 *         description: Token inválido ou não informado
 */

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Atualiza uma transação
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: Mercado
 *               amount:
 *                 type: number
 *                 example: 150.50
 *               type:
 *                 type: string
 *                 enum:
 *                   - INCOME
 *                   - EXPENSE
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *       404:
 *         description: Transação não encontrada
 *       401:
 *         description: Token inválido ou não informado
 */

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Remove uma transação
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Transação removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transação removida com sucesso
 *       404:
 *         description: Transação não encontrada
 *       401:
 *         description: Token inválido ou não informado
 */

router.use(authMiddleware);

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get('/summary', authMiddleware, controller.summary);
router.get('/category-summary', authMiddleware, controller.categorySummary);

router.get("/:id", controller.findById);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.remove);

module.exports = router;