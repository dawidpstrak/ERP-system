module.exports = request => {
    const credentials = {
        email: 'admin@erpsystem.test',
        password: 'password'
    };

    return request.post('/auth/login').send(credentials);
};
