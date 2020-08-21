class AbstractRepository {
    create(data, options) {
        return this.model.create(data, options);
    }

    findByPk(Pk) {
        return this.model.findByPk(Pk);
    }
}

module.exports = AbstractRepository;
