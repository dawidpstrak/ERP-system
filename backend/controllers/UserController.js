const HTTP = require('http-status-codes');
const { Op } = require('sequelize');

const { User } = require('../models');

class UserController {
    /**
     * @param { UserRepository } userRepository
     * @param { RoleRepository } roleRepository
     */

    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    async index(req, res) {
        try {
            const { query } = req.query;

            const where = {};

            if (query) {
                where[Op.or] = {
                    firstName: {
                        [Op.like]: `%${query}%`
                    },
                    lastName: {
                        [Op.like]: `%${query}%`
                    }
                };
            }

            const employees = await this.userRepository.getAll(where);

            return res.send(employees);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async me(req, res) {
        try {
            const { id } = req.loggedUser;

            const user = await this.userRepository.getByIdWithAssociations(id);

            return res.send(user);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async store(req, res) {
        try {
            const { roles } = req.body;

            const userRoles = await this.roleRepository.getByNames(roles);

            const newUser = await this.userRepository.create(req.body, { fields: User.CREATABLE_FIELDS });

            await newUser.addRoles(userRoles);

            const newUserWithExludedPassword = await this.userRepository.findByPk(newUser.id);

            return res.status(HTTP.CREATED).send(newUserWithExludedPassword);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;

            const user = await this.userRepository.findByPk(id);

            if (!user) {
                return res.sendStatus(HTTP.NOT_FOUND);
            }

            await user.update(req.body, { fields: User.UPDATABLE_FIELDS });

            const updatedUser = await this.userRepository.findByPk(id);

            return res.send(updatedUser);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const user = await this.userRepository.findByPk(id);

            if (user) {
                await user.removeRoles(await user.getRoles());

                await user.destroy();
            }

            return res.sendStatus(HTTP.NO_CONTENT);
        } catch (error) {
            console.error(error);

            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = UserController;
