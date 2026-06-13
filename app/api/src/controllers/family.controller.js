const { ZodError } = require('zod');
const service = require('../services/family.service');
const { createFamilySchema, joinFamilySchema } = require('../validations/family.validation');

async function create(req, res) {
  try {
    const payload = createFamilySchema.parse(req.body || {});
    const result = await service.createFamily(req.user.id, payload.name);
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
    const result = await service.joinFamily(req.user.id, payload.token);
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
    const result = await service.getMyFamily(req.user.id);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function rotateToken(req, res) {
  try {
    const result = await service.rotateInviteToken(req.user.id);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function removeMember(req, res) {
  try {
    const { memberId } = req.params;
    const result = await service.removeMember(req.user.id, memberId);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  create,
  join,
  getMe,
  rotateToken,
  removeMember,
};
