module.exports = request => {
    const credentials = {
        email: 'user@erpsystem.test',
        password: 'password'
    };

    return request.post('/auth/login').send(credentials);
};
