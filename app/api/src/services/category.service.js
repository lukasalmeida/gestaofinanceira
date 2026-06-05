const repository = require('../repositories/category.repository');
const transactionRepository = require('../repositories/transaction.repository');

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

    // Verificar se há transações relacionadas
    const transactionCount = await transactionRepository.countByCategory(id);
    
    if (transactionCount > 0) {
        throw new Error(`Esta categoria possui ${transactionCount} transação(ões) relacionada(s) e não pode ser removida`);
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