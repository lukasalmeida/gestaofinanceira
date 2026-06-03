const express = require('express');

const controller = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Realiza o cadastro das categorias
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Salário
 *               type:
 *                 type: string
 *                 enum:
 *                   - INCOME
 *                   - EXPENSE
 *                 example: INCOME
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categoria adicionada com sucesso
 *       401:
 *         description: Erro ao cadastrar categoria
 *   get:
 *     summary: Lista todas as categorias do usuário
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listar categorias
 * 
 * /categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alimentação
 *               type:
 *                 type: string
 *                 enum:
 *                   - INCOME
 *                   - EXPENSE
 *                 example: EXPENSE
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 *                   enum:
 *                     - INCOME
 *                     - EXPENSE
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Token inválido ou não informado
 *   delete:
 *     summary: Remove uma categoria
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoria removida com sucesso
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Token inválido ou não informado
 * 
 */

router.use(authMiddleware);

router.post('/', controller.create);
router.get('/', controller.findAll);

router.get('/:id', controller.findById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
