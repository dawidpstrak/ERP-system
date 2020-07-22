const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');

class AuthController {
    async create(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({
                where: {
                    email
                }
            });

            if (!user) {
                const user = await User.create(req.body);

                return res.status(201).send(user);
            } else {
                return res.status(400).send({ message: 'User with that email already exists' });
            }
        } catch (error) {
            console.error(error);
        }
    }

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
                return res.status(401).send({ message: 'Wrong credentials' });
            }

            const loggedUser = await User.findOne({
                where: {
                    email
                }
            });

            const token = jwt.sign({ ...loggedUser }, process.env.SECRET_KEY, {
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
