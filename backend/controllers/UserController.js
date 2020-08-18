const HTTP = require('http-status-codes');

const { User } = require('../models');

class EmployeeController {
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
            const employees = await this.userRepository.getAll();

            return res.status(HTTP.OK).send(employees);
        } catch (error) {
            console.error(error);
        }
    }

    async store(req, res) {
        try {
            const { roles } = req.body;

            const userRoles = await this.roleRepository.getByNames(roles);

            const newUser = await this.userRepository.create(req.body);

            await newUser.addRoles(userRoles);

            return res.status(HTTP.CREATED).send(newUser);
        } catch (error) {
            console.error(error);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;

            const user = await this.userRepository.findByPk(id);

            if (!user) {
                return res.status(HTTP.NOT_FOUND);
            }

            await user.update(req.body, { fields: User.UPDATABLE_FIELDS });

            const updatedUser = await this.userRepository.findByPk(id);

            return res.status(HTTP.OK).send(updatedUser);
        } catch (error) {
            console.error(error);
        }
    }

    async delete(req, res) {
        try {
            const { id, roles } = req.body.employee;

            const user = await this.userRepository.getByIdWithAssociation(id);

            const userRoles = await this.roleRepository.getByNames(roles);

            if (!user) {
                return res.status(HTTP.NO_CONTENT);
            }

            await user.removeRoles(userRoles);

            await user.destroy();

            return res.sendStatus(HTTP.NO_CONTENT);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = EmployeeController;
