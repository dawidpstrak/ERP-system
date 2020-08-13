const HTTP = require('http-status-codes');

const { User, Role } = require('../models');

class EmployeeController {
    async store(req, res) {
        try {
            const { email, role } = req.body;

            const user = await User.findOne({
                where: {
                    email
                }
            });

            const userRole = await Role.findOne({
                where: {
                    name: role
                }
            });

            if (user) {
                return res.status(HTTP.BAD_REQUEST).send({ message: 'User with that email already exists' });
            } else if (!role) {
                return res.status(HTTP.BAD_REQUEST).send({ message: 'Cannot create user with specified role' });
            }

            const newUser = await User.create(req.body);

            newUser.addRole(userRole);

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

    async update(req, res) {
        try {
            const { id } = req.body;

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(HTTP.NOT_FOUND);
            }

            await user.update(req.body, { fields: User.UPDATABLE_FIELDS });

            const updatedUser = await User.findByPk(id);

            return res.status(HTTP.OK).send(updatedUser);
        } catch (error) {
            console.error(error);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(HTTP.NOT_FOUND);
            }

            await user.destroy();

            //TODO delete userRole with user

            return res.sendStatus(HTTP.NO_CONTENT);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = EmployeeController;
