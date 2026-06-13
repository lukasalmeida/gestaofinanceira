const prisma = require('../config/prisma');

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  familyId: true,
  createdAt: true,
};

async function create(data) {
  return prisma.user.create({
    data,
    select: publicUserSelect,
  });
}

async function findAll() {
  return prisma.user.findMany({
    select: publicUserSelect,
    orderBy: { createdAt: 'desc' },
  });
}

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
}

async function findByIdWithPassword(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: publicUserSelect,
  });
}

module.exports = {
  create,
  findAll,
  findByEmail,
  findById,
  findByIdWithPassword,
  updateUser,
};
