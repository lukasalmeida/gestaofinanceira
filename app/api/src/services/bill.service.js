const repository = require('../repositories/bill.repository');

async function create(data) {
    return repository.create(data);
}

async function findAll(
    userId,
    dueDay,
    minAmount,
    maxAmount
) {
    return repository.findAll(
        userId,
        dueDay,
        minAmount,
        maxAmount
    );
}

async function findById(id, userId) {
    return repository.findById(id, userId);
}

async function update(id, userId, data) {
    const bill = await repository.findById(id, userId);

    if (!bill) {
        throw new Error('Conta não encontrada');
    }

    return repository.update(id, data);
}

async function remove(id, userId) {
    const bill = await repository.findById(id, userId);

    if (!bill) {
        throw new Error('Conta não encontrada');
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