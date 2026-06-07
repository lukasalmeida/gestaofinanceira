const service = require('../services/bill.service');

async function create(req, res) {
    try {
        const userId = req.user.id;

        const {
            description,
            amount,
            recurrence,
            dueDay
        } = req.body;

        const bill = await service.create({
            description,
            amount,
            recurrence,
            dueDay,
            userId
        });

        return res.json(bill);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

async function findAll(req, res) {
    try {
        const userId = req.user.id;

        const {
            dueDay,
            minAmount,
            maxAmount
        } = req.query;

        const bills = await service.findAll(
            userId,
            dueDay,
            minAmount,
            maxAmount
        );

        return res.json(bills);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

async function findById(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const bill = await service.findById(
            id,
            userId
        );

        if (!bill) {
            return res.status(404).json({
                message: 'Conta não encontrada'
            });
        }

        return res.json(bill);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

async function update(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const {
            description,
            amount,
            recurrence,
            dueDay
        } = req.body;

        const bill = await service.update(
            id,
            userId,
            {
                description,
                amount,
                recurrence,
                dueDay
            }
        );

        return res.json(bill);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

async function remove(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        await service.remove(
            id,
            userId
        );

        return res.json({
            message: 'Conta removida com sucesso'
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};