describe('Authorization tests', () => {
    before(() => {
        cy.task('clearDatabase');
        cy.task('fillDatabase');
    });

    beforeEach(() => {
        cy.server();

        cy.route('POST', '/auth/login').as('login');

        cy.visit('/');
    });
    it('signing in properly with CORRECT CREDENTIALS AS ADMIN', () => {
        cy.checkLoggedUser(false);

        cy.login('admin@erpsystem.test', 'password');

        cy.wait('@login');

        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/dashboard');
        });

        cy.checkLoggedUser(true);

        cy.logout();
    });

    it('signing in properly with CORRECT CREDENTIALS AS USER', () => {
        cy.checkLoggedUser(false);

        cy.login('user@erpsystem.test', 'password');

        cy.wait('@login');

        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/dashboard');
        });

        cy.checkLoggedUser(true);

        cy.logout();
    });

    it('fails to sign in with WRONG CREDENTIALS AS USER', () => {
        cy.checkLoggedUser(false);

        cy.login('wrong@email.test', 'password');

        cy.wait('@login');

        cy.location().should(loc => {
            expect(loc.pathname).to.not.eq('/dashboard');
        });

        cy.checkLoggedUser(false);
    });
});
