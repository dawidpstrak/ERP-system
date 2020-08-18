class AbstractRepository {
    async create(data, options) {
        return await this.model.create(data, options);
    }

    async findByPk(Pk) {
        return await this.model.findByPk(Pk);
    }
}

module.exports = AbstractRepository;
