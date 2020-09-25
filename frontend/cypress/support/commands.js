let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('saveLocalStorageCache', () => {
    Object.keys(localStorage).forEach(key => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key];
    });
});

Cypress.Commands.add('restoreLocalStorageCache', () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
    });
});

Cypress.Commands.add('login', (email, password) => {
    cy.get('[data-cy=login-email-input]').type(email);
    cy.get('[data-cy=login-password-input]').type(password);
    cy.get('[data-cy=login-button]').click();
});

Cypress.Commands.add('checkLoggedUser', shouldBePresent => {
    const token = localStorage.getItem('token');
    const loggedUser = localStorage.getItem('loggedUser');

    if (shouldBePresent) {
        expect(token).to.not.be.null;
        expect(loggedUser).to.not.be.null;
    } else {
        expect(token).to.be.null;
        expect(loggedUser).to.be.null;
    }
});

Cypress.Commands.add('logout', () => {
    cy.get('[data-cy=nav-logout]').click();
});
