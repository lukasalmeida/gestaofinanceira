const service = require('../services/category.service');
const { createCategorySchema, updateCategorySchema } = require('../validations/category.validation');
const { ZodError } = require('zod');

async function create(req, res) {
  try {
    createCategorySchema.parse(req.body);
    const userId = req.user.id;
    const { name, type } = req.body;

    const category = await service.create(userId, { name, type });

    return res.json(category);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }

    return res.status(400).json({ message: error.message });
  }
}

async function findAll(req, res) {
  try {
    const userId = req.user.id;
    const categories = await service.findAll(userId);

    return res.json(categories);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function findById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const category = await service.findById(id, userId);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    return res.json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    updateCategorySchema.parse(req.body);
    const userId = req.user.id;
    const { id } = req.params;
    const { name, type } = req.body;

    const category = await service.update(id, userId, { name, type });

    return res.json(category);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }

    return res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await service.remove(id, userId);

    return res.json({ message: 'Categoria removida com sucesso' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
};
