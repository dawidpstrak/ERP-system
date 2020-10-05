class AbstractRepository {
    create(data, options) {
        return this.model.create(data, options);
    }

    findOne(options = {}) {
        return this.model.findOne({
            ...options
        });
    }

    findByPk(Pk) {
        return this.model.findByPk(Pk);
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
