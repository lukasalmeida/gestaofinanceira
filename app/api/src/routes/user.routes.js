const express = require('express');
const controller = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Lucas Almeida
 *               email:
 *                 type: string
 *                 format: email
 *                 example: lucas@email.com
 *               password:
 *                 type: string
 *                 example: Senha@123
 *     responses:
 *       200:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                     example: Lucas Almeida
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: lucas@email.com
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Token inválido ou não informado
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
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
 *               name:
 *                 type: string
 *                 example: Lucas Almeida
 *               email:
 *                 type: string
 *                 format: email
 *                 example: lucas@email.com
 *               password:
 *                 type: string
 *                 example: NovaSenha@123
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
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
 *                 email:
 *                   type: string
 *                   format: email
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Token inválido ou não informado
 */

router.post('/', controller.createUser);
router.get('/', authMiddleware, controller.findAll);
router.put('/:id', authMiddleware, controller.updateUser);

module.exports = router;