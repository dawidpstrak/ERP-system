module.exports = request => {
    const credentials = {
        email: 'admin@admin.com',
        password: 'password'
    };

    return request.post('/auth/login').send(credentials);
};
