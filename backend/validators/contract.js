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

            const contracts = await contractRepository.findAllByUserInTimeInterval(
                startDate,
                endDate,
                user.id,
                contractId
            );

            if (contracts.length > 0) {
                return Promise.reject('There is existing contract in that time');
            }

            return Promise.resolve('User has no contract in this time. You can create one');
        })
];

const update = [...create];

module.exports = {
    create,
    update
};
