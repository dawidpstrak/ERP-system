class LoginHandler {
    constructor(userRepository, bcrypt) {
        this.userRepository = userRepository;
        this.bcrypt = bcrypt;
    }

    async handle(email, password) {
        const user = await this.userRepository.findByEmail(email, { attributes: ['id', 'password'] });

        if (!user) {
            return null;
        }

        const isValid = this.bcrypt.compareSync(password, user.password);

        if (!isValid) {
            return null;
        }

        return this.userRepository.getByIdWithAssociation(user.id);
    }
}

module.exports = LoginHandler;
