module.exports = request => {
    const credentials = {
        email: 'user@user.com',
        password: 'password'
    };

    return request.post('/auth/login').send(credentials);
};
