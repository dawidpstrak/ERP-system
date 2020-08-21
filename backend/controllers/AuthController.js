const jwt = require('jsonwebtoken');
const HTTP = require('http-status-codes');

const config = require('../config');

class AuthController {
    /**
     * @param { UserRepository } userRepository
     * @param { LoginHandler } loginHandler
     */

    constructor(userRepository, loginHandler) {
        this.userRepository = userRepository;
        this.loginHandler = loginHandler;
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const loggedUser = await this.loginHandler.handle(email, password);

            if (!loggedUser) {
                return res.status(HTTP.UNAUTHORIZED).send({ message: 'Wrong credentials' });
            }

            const token = jwt.sign({ loggedUser }, config.app.secretKey, {
                expiresIn: 1440
            });

            return res.send({
                loggedUser,
                token
            });
        } catch (error) {
            console.error(error);

            return res.status(HTTP.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = AuthController;
