const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');

async function getProfile(userId) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
}

async function updateProfile(userId, data) {
  const user = await userRepository.findByIdWithPassword(userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  if (data.email && data.email !== user.email) {
    const existing = await userRepository.findByEmail(data.email);

    if (existing && existing.id !== userId) {
      throw new Error('E-mail já está em uso');
    }
  }

  return userRepository.updateUser(userId, {
    ...(data.name ? { name: data.name } : {}),
    ...(data.email ? { email: data.email } : {}),
  });
}

async function updateAvatar(userId, avatarUrl) {
  return userRepository.updateUser(userId, { avatarUrl });
}

async function updatePassword(userId, currentPassword, newPassword) {
  const user = await userRepository.findByIdWithPassword(userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatch) {
    throw new Error('Senha atual incorreta');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  return userRepository.updateUser(userId, { password: passwordHash });
}

module.exports = {
  getProfile,
  updateProfile,
  updateAvatar,
  updatePassword,
};
