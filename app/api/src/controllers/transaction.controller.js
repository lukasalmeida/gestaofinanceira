const service = require("../services/transaction.service");

async function create(req, res) {
  try {
    const userId = req.user.id;
    const { description, amount, type, categoryId } = req.body;

    const transaction = await service.create({
      description,
      amount,
      type,
      categoryId,
      userId
    });

    return res.json(transaction);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
}

async function findAll(req, res) {
  try {
    const userId = req.user.id;

    const transactions = await service.findAll(userId);

    return res.json(transactions);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
}

async function findById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await service.findById(id, userId);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction não encontrada"
      });
    }

    return res.json(transaction);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
}

module.exports = {
  create,
  findAll,
  findById
};