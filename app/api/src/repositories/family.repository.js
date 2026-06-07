const prisma = require('../config/prisma');
const { generateInviteToken } = require('../utils/inviteToken');

async function createUniqueFamily(data) {
  let attempts = 0;

  while (attempts < 10) {
    const inviteToken = generateInviteToken();

    try {
      return await prisma.family.create({
        data: {
          ...data,
          inviteToken,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        attempts += 1;
        continue;
      }

      throw error;
    }
  }

  throw new Error('Não foi possível gerar um token único para a família');
}

async function findByToken(inviteToken) {
  return prisma.family.findUnique({
    where: { inviteToken },
  });
}

async function findById(id) {
  return prisma.family.findUnique({
    where: { id },
  });
}

async function getMembers(familyId) {
  return prisma.user.findMany({
    where: { familyId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });
}

async function assignUserToFamily(userId, familyId) {
  return prisma.user.update({
    where: { id: userId },
    data: { familyId },
    select: {
      id: true,
      name: true,
      email: true,
      familyId: true,
      createdAt: true,
    },
  });
}

async function findUserFamily(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      familyId: true,
      family: true,
    },
  });

  return user;
}

module.exports = {
  createUniqueFamily,
  findByToken,
  findById,
  getMembers,
  assignUserToFamily,
  findUserFamily,
};
