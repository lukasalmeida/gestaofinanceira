const { ZodError } = require('zod');
const service = require('../services/family.service');
const { createFamilySchema, joinFamilySchema } = require('../validations/family.validation');

async function create(req, res) {
  try {
    const payload = createFamilySchema.parse(req.body || {});
    const userId = req.user.id;

    const result = await service.createFamily(userId, payload.name);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }

    return res.status(400).json({ message: error.message });
  }
}

async function join(req, res) {
  try {
    const payload = joinFamilySchema.parse(req.body);
    const userId = req.user.id;

    const result = await service.joinFamily(userId, payload.token);

    return res.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }

    return res.status(400).json({ message: error.message });
  }
}

async function getMe(req, res) {
  try {
    const userId = req.user.id;
    const result = await service.getMyFamily(userId);

    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  create,
  join,
  getMe,
};
