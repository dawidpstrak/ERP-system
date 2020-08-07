const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const HTTP = require('http-status-codes');

const config = require('../config');

const { User } = require('../models');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({
                attributes: ['password'],
                where: {
                    email
                }
            });

            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(HTTP.UNAUTHORIZED).send({ message: 'Wrong credentials' });
            }

            const loggedUser = await User.findOne({
                where: {
                    email
                },
                include: {
                    association: 'roles',
                    attributes: ['name']
                },
                raw: true,
                nest: true
            });

            const token = jwt.sign({ ...loggedUser }, config.app.secretKey, {
                expiresIn: 1440
            });

            return res.send({
                user: loggedUser,
                token
            });
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = AuthController;
