const prisma = require('../config/prisma');
const { buildOwnershipWhere } = require('../utils/familyScope');

async function create(data) {
  return prisma.category.create({ data });
}

async function findAllByScope(scope) {
  return prisma.category.findMany({
    where: buildOwnershipWhere(scope),
    orderBy: { createdAt: 'desc' },
  });
}

async function findById(id) {
  return prisma.category.findUnique({
    where: { id },
  });
}

async function update(id, data) {
  return prisma.category.update({
    where: { id },
    data,
  });
}

async function remove(id) {
  return prisma.category.delete({
    where: { id },
  });
}

module.exports = {
  create,
  findAllByScope,
  findById,
  update,
  remove,
};
