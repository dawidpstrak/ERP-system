const HTTP = require('http-status-codes');

const { User, Role } = require('../models');

class EmployeeController {
    async store(req, res) {
        try {
            const { email, roleId } = req.body;
            const user = await User.findOne({
                where: {
                    email
                }
            });

            const role = await Role.findByPk(roleId);

            if (user) {
                return res.status(HTTP.BAD_REQUEST).send({ message: 'User with that email already exists' });
            } else if (!role) {
                return res.status(HTTP.BAD_REQUEST).send({ message: 'Cannot create user with specified role' });
            }

            const newUser = await User.create(req.body);

            newUser.addRole(roleId);

            return res.status(HTTP.CREATED).send(newUser);
        } catch (error) {
            console.error(error);
        }
    }

    async index(req, res) {
        try {
            const employees = await User.findAll({
                include: {
                    association: 'role',
                    attributes: ['name'],
                    where: {
                        name: 'user'
                    }
                },
                raw: true,
                nest: true
            });

            if (employees) {
                return res.status(HTTP.OK).send(employees);
            }

            return res.status(HTTP.BAD_REQUEST).send({ message: 'No employees in database' });
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = EmployeeController;
