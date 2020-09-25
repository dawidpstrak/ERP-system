import HTTP from 'http-status-codes';

describe('Users actions', () => {
    before(() => {
        cy.task('clearDatabase');
        cy.task('fillDatabase');
    });

    beforeEach(() => {
        cy.restoreLocalStorageCache(); // anty clearing local storage workaround (which cypress do after each test case)

        cy.server();

        // registering routes used in test to await for its response

        cy.route('GET', '/users').as('getUsers');
        cy.route('POST', '/auth/login').as('login');
        cy.route('POST', '/users').as('addUser');
        cy.route('PUT', '/users/*').as('updateUser');
        cy.route('DELETE', '/users/*').as('deleteUser');
    });

    afterEach(() => {
        cy.saveLocalStorageCache(); // anty clearing local storage workaround (which cypress do after each test case)
    });

    it('should create new user AS ADMIN', () => {
        cy.login('admin@erpsystem.test', 'password');

        cy.wait('@login');

        cy.get('[data-cy=add-employee-button]').click();

        cy.get('#app').find('[data-cy=employee-form]');

        cy.get('[data-cy=user-first-name-input]').type('Cypress');
        cy.get('[data-cy=user-last-name-input]').type('Test');
        cy.get('[data-cy=user-email-input]').type('Cypress@test.com');
        cy.get('[data-cy=user-password-input]').type('password');
        cy.get('[data-cy=user-birthdate-input]').click();
        cy.get('div.v-date-picker-table')
            .find('button')
            .first()
            .click();
        cy.get('[data-cy=user-submit-button]').click();

        // waiting for registered requests
        cy.wait('@addUser').should(res => {
            expect(res.status).to.equal(HTTP.CREATED);
        });
        cy.wait('@getUsers');
    });

    it('should update user AS ADMIN', () => {
        cy.get('[data-cy=employee-list] tbody tr')
            .find('button.mdi-pencil')
            .first()
            .click();

        cy.get('[data-cy=user-first-name-input]')
            .clear()
            .type('Update');
        cy.get('[data-cy=user-last-name-input]')
            .clear()
            .type('Test');
        cy.get('[data-cy=user-email-input]')
            .clear()
            .type('update@test.cypress');
        cy.get('[data-cy=user-birthdate-input]').click();
        cy.get('div.v-date-picker-table')
            .find('button')
            .first()
            .click();
        cy.get('[data-cy=user-submit-button]').click();

        cy.wait('@updateUser').should(res => {
            expect(res.status).to.equal(HTTP.OK);
        });
        cy.wait('@getUsers');
    });

    it('should delete user AS ADMIN', () => {
        cy.get('[data-cy=employee-list] tbody tr')
            .find('button.mdi-delete')
            .first()
            .click();

        cy.get('[data-cy=confirm-delete]').click();

        cy.wait('@deleteUser').should(res => {
            expect(res.status).to.equal(HTTP.NO_CONTENT);
        });
        cy.wait('@getUsers');

        cy.logout();

        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/');
        });
    });
});
