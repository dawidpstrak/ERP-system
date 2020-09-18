module.exports = async () => {
    const { sequelize } = require('../../models');
    try {
        await sequelize.sync({ force: true });
    } catch (error) {
        console.error(error);
    }
};
