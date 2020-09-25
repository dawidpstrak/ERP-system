import HTTP from 'http-status-codes';

describe('Contracts actions', () => {
    before(() => {
        cy.task('clearDatabase');
        cy.task('fillDatabase');
    });

    beforeEach(() => {
        cy.restoreLocalStorageCache(); // anty clearing local storage workaround (which cypress do after each test case)

        cy.server();

        // registering routes used in test to await for its response

        cy.route('GET', '/contracts').as('getContracts');
        cy.route('GET', '/users*').as('getUsers');
        cy.route('POST', '/auth/login').as('login');
        cy.route('POST', '/contracts').as('addContract');
        cy.route('PUT', '/contracts/*').as('updateContract');
        cy.route('DELETE', '/contracts/*').as('deleteContract');
    });

    afterEach(() => {
        cy.saveLocalStorageCache(); // anty clearing local storage workaround (which cypress do after each test case)
    });

    it('should create new contract AS ADMIN', () => {
        cy.visit('/'); // fresh page to clean inputs after wrong authorization

        cy.login('admin@erpsystem.test', 'password');

        cy.wait('@login');

        cy.get('[data-cy=nav-contracts]').click();

        cy.get('[data-cy=add-contract-button]').click();

        cy.get('#app').find('[data-cy=contract-form]');

        cy.get('[data-cy=contract-user-search-input]').type('user');
        cy.wait('@getUsers');
        cy.get('[role=listbox] div')
            .first()
            .click();
        cy.get('[data-cy=contract-start-date-input]').click();
        cy.get('div.v-date-picker-table')
            .find('button')
            .first()
            .click();
        cy.get('[data-cy=contract-duration-input]').click({ force: true }); // {force: true} to workaround vuetify pointer-events: none class
        cy.get('[role=listbox] #list-item-132-0').click();
        cy.get('[data-cy=contract-vacation-days-options-select]').click({ force: true }); // as above
        cy.get('[role=listbox] #list-item-141-0').click();
        cy.get('[data-cy=contract-submit-button]').click();

        cy.wait('@addContract');
        cy.wait('@getContracts');

        cy.get('[data-cy=contracts-list] tbody')
            .find('tr')
            .its('length')
            .should('eq', 3);
    });

    it('should update contract AS ADMIN', () => {
        cy.get('[data-cy=contracts-list] tbody tr')
            .find('button.mdi-pencil')
            .first()
            .click();
        cy.get('[data-cy=contract-start-date-input]').click();
        cy.get('div.v-date-picker-table')
            .find('button')
            .first()
            .click();

        cy.get('[data-cy=contract-submit-button]').click();

        cy.wait('@updateContract').should(res => {
            expect(res.status).to.equal(HTTP.OK);
        });
        cy.wait('@getContracts');
    });

    it('should delete contract AS ADMIN', () => {
        cy.get('[data-cy=contracts-list] tbody tr')
            .find('button.mdi-delete')
            .first()
            .click();

        cy.get('[data-cy=confirm-delete]').click();

        cy.wait('@deleteContract').should(res => {
            expect(res.status).to.equal(HTTP.NO_CONTENT);
        });
        cy.wait('@getContracts');

        cy.logout();

        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/');
        });
    });
});
