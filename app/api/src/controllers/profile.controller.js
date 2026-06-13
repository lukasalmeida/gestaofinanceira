const { ZodError } = require('zod');
const service = require('../services/profile.service');
const {
  updateProfileSchema,
  updateAvatarSchema,
  updateAccountSchema,
} = require('../validations/profile.validation');

async function getMe(req, res) {
  try {
    const user = await service.getProfile(req.user.id);
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function updateMe(req, res) {
  try {
    const payload = updateProfileSchema.parse(req.body);
    const user = await service.updateProfile(req.user.id, payload);
    return res.json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }

    return res.status(400).json({ message: error.message });
  }
}

async function updateAvatar(req, res) {
  try {
    const payload = updateAvatarSchema.parse(req.body);
    const user = await service.updateAvatar(req.user.id, payload.avatarUrl);
    return res.json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }

    return res.status(400).json({ message: error.message });
  }
}

async function updatePassword(req, res) {
  try {
    const payload = updateAccountSchema.parse(req.body);
    const user = await service.updatePassword(
      req.user.id,
      payload.currentPassword,
      payload.password
    );
    return res.json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }

    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getMe,
  updateMe,
  updateAvatar,
  updatePassword,
};
