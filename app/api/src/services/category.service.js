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

async function update(id, userId, data) {
    const category = await repository.findById(id, userId);

    if (!category) {
        throw new Error("Categoria não encontrada");
    }
    return await repository.update(id, data);
}

async function remove(id, userId) {
    const category = await repository.findById(id, userId);

    if (!category) {
        throw new Error("Categoria não encontrada");
    }
    await repository.remove(id);

    return true;
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};