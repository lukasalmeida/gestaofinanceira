const repository = require('../repositories/category.repository');

async function create(data) {
    return await repository.create(data);
}

async function findAll(userId) {
    return await repository.findAllByUser(userId);
}

async function findById(id, userId) {
    return await repository.findById(id, userId);
}

module.exports = {
    create,
    findAll,
    findById
};