class AbstractRepository {
    create(data, options) {
        return this.model.create(data, options);
    }

    findByPk(Pk) {
        return this.model.findByPk(Pk);
    }

    findOneById(id, options) {
        return this.model.findOne({
            where: {
                id
            },
            ...options
        });
    }

    getAll() {
        return this.model.findAll();
    }

    getAllByUser(userId, options = {}) {
        return this.model.findAll({
            where: {
                userId
            },
            ...options
        });
    }
}

module.exports = AbstractRepository;
