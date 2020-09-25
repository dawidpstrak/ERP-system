import HTTP from 'http-status-codes';

describe('Vacation requests actions', () => {
    before(() => {
        cy.task('clearDatabase');
        cy.task('fillDatabase');
    });

    beforeEach(() => {
        cy.restoreLocalStorageCache(); // anty clearing local storage workaround (which cypress do after each test case)

        cy.server();

        // registering routes used in test to await for its response

        cy.route('GET', '/vacationRequests').as('getVacationRequests');
        cy.route('POST', '/auth/login').as('login');
        cy.route('POST', '/vacationRequests').as('addVacationRequest');
        cy.route('PUT', '/vacationRequests/*').as('updateVacationRequest');
        cy.route('DELETE', '/vacationRequests/*').as('deleteVacationRequest');
    });

    afterEach(() => {
        cy.saveLocalStorageCache(); // anty clearing local storage workaround (which cypress do after each test case)
    });
    describe('AS ADMIN', () => {
        it('should create new vacation request AS ADMIN', () => {
            cy.login('admin@erpsystem.test', 'password');

            cy.wait('@login');

            cy.get('[data-cy=nav-vacations]').click();

            cy.get('[data-cy=add-vacation-button]').click();

            cy.get('#app').find('[data-cy=vacation-form]');

            cy.get('[data-cy=vacation-user-search-input]').type('user');
            cy.wait('@getVacationRequests');
            cy.get('[role=listbox] div')
                .first()
                .click();
            cy.get('[data-cy=vacation-start-date-input]').click();
            cy.get('div.v-date-picker-table')
                .find('button')
                .first()
                .click();
            cy.get('[data-cy=vacation-end-date-input]').click({ force: true }); // {force: true} because element is covered by another element
            cy.get('div.v-date-picker-table')
                .find('button')
                .last()
                .click({ force: true }); // {force: true} because element is covered by another element
            cy.get('[data-cy=vacation-submit-button]').click({ force: true }); // {force: true} because element is covered by another element

            cy.wait('@addVacationRequest').should(res => {
                expect(res.status).to.equal(HTTP.CREATED);
            });
            cy.wait('@getVacationRequests');
        });

        it('should update vacation request AS ADMIN', () => {
            cy.get('[data-cy=vacations-list] tbody tr')
                .find('button.mdi-pencil')
                .first()
                .click();
            cy.get('[data-cy=vacation-end-date-input]').click();
            cy.get('div.v-date-picker-table')
                .find('button')
                .last()
                .click({ force: true });

            cy.get('[data-cy=vacation-submit-button]').click({ force: true }); // {force: true} because element is covered by another element

            cy.wait('@updateVacationRequest').should(res => {
                expect(res.status).to.equal(HTTP.OK);
            });
            cy.wait('@getVacationRequests');
        });

        it('should delete vacation request AS ADMIN', () => {
            cy.get('[data-cy=vacations-list] tbody tr')
                .find('button.mdi-delete')
                .first()
                .click();

            cy.get('[data-cy=confirm-delete]').click();

            cy.wait('@deleteVacationRequest').should(res => {
                expect(res.status).to.equal(HTTP.NO_CONTENT);
            });
            cy.wait('@getVacationRequests');

            cy.logout();

            cy.location().should(loc => {
                expect(loc.pathname).to.eq('/');
            });
        });
    });

    describe('AS USER', () => {
        it('should create new vacation request AS USER', () => {
            cy.login('user@erpsystem.test', 'password');

            cy.wait('@login');

            cy.get('[data-cy=add-vacation-button]').click();

            cy.get('#app').find('[data-cy=vacation-form]');

            cy.get('[data-cy=vacation-start-date-input]').click();
            cy.get('div.v-date-picker-table')
                .find('button')
                .first()
                .click();
            cy.get('[data-cy=vacation-end-date-input]').click({ force: true }); // {force: true} because element is covered by another element
            cy.get('div.v-date-picker-table')
                .find('button')
                .last()
                .click({ force: true }); // {force: true} because element is covered by another element
            cy.get('[data-cy=vacation-submit-button]').click({ force: true }); // {force: true} because element is covered by another element

            cy.wait('@addVacationRequest').should(res => {
                expect(res.status).to.equal(HTTP.CREATED);
            });
            cy.wait('@getVacationRequests');
        });

        it('should update vacation request AS USER', () => {
            cy.get('[data-cy=vacations-list] tbody tr')
                .find('button.mdi-pencil')
                .first()
                .click();
            cy.get('[data-cy=vacation-end-date-input]').click();
            cy.get('div.v-date-picker-table')
                .find('button')
                .last()
                .click({ force: true }); // {force: true} because element is covered by another element

            cy.get('[data-cy=vacation-submit-button]').click({ force: true }); // {force: true} because element is covered by another element

            cy.wait('@updateVacationRequest').should(res => {
                expect(res.status).to.equal(HTTP.OK);
            });
            cy.wait('@getVacationRequests');
        });

        it('should delete vacation request AS USER', () => {
            cy.get('[data-cy=vacations-list] tbody tr')
                .find('button.mdi-delete')
                .first()
                .click({ force: true }); // {force: true} because element is covered by another element

            cy.get('[data-cy=confirm-delete]').click();

            cy.wait('@deleteVacationRequest').should(res => {
                expect(res.status).to.equal(HTTP.NO_CONTENT);
            });
            cy.wait('@getVacationRequests');

            cy.logout();

            cy.location().should(loc => {
                expect(loc.pathname).to.eq('/');
            });
        });
    });
});
