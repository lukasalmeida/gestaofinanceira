const repository = require("../repositories/transaction.repository");

async function create(data) {
  return repository.create(data);
}

async function findAll(userId) {
  return repository.findAllByUser(userId);
}

async function findById(id, userId) {
  return repository.findById(id, userId);
}

module.exports = {
  create,
  findAll,
  findById
};