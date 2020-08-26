const { body } = require('express-validator');

const di = req => {
    return req.app.get('di');
};

const create = [
    body(['startDate'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isISO8601()
        .withMessage('Invalid date format')
        .custom(async (startDate, { req }) => {
            const { id: contractId, email, endDate } = req.body;

            const contractRepository = di(req).get('repositories.contract');
            const userRepository = di(req).get('repositories.user');

            const user = await userRepository.findByEmail(email, { attributes: ['id'] });

            if (!user) {
                return Promise.reject('This user not exist');
            }

            const contracts = await contractRepository.findAllByUserInTimeInterval(
                startDate,
                endDate,
                user.id,
                contractId
            );

            if (contracts.length > 0) {
                return Promise.reject('There is existing contract in that time');
            }
        })
];

const update = [...create];

module.exports = {
    create,
    update
};
