const service = require('../services/category.service');

async function create(req, res) {
    try {
        const userId = req.user.id;
        const {name, type} = req.body;

        const category = await service.create({
            name,
            type,
            userId
        });

        return res.json(category);
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

async function findAll(req, res) {
    try {
        const UserId = req.user.id;

        const categories = await service.findAll(UserId);

        return res.json(categories);
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

async function findById(req, res) {
    try {
        const UserId = req.user.id;
        const {id} = req.params;

        const category = await service.findById(id, UserId);

        if (!category) {
            return res.status(404).json({
                message: 'Categoria não encontrada'
            });
        }

        return res.json(category);
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

async function update(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name, type } = req.body;

        const category = await service.update(id, userId, {
            name,
            type
        });

        if (!category) {
            return res.status(404).json({
                message: 'Categoria não encontrada'
            });
        }

        return res.json(category);
    } catch (error) {
        return res.status(400).json({message: error.message});
    }   
}

async function remove(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const category = await service.remove(id, userId);
        
        if (!category) {
            return res.status(404).json({
                message: 'Categoria não encontrada'
            });
        }

        return res.json({message: 'Categoria removida com sucesso'});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove  
};