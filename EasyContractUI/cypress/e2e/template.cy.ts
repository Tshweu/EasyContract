import { faker } from '@faker-js/faker';

describe('My First Test', () => {
    before(() => {
        cy.visit('/');

        cy.get('input[formControlName="email"]').clear().type('john@cena.com');
        cy.get('input[formControlName="password"]').clear().type('john');
        cy.get('button').click();

        cy.url().should('equal', 'http://localhost:4200/views/contract/manage');
    });

    // it('Visits the initial templates page', () => {
    //     cy.visit('/views/template/manage');
    // });

    it('Creates new template', () => {
        cy.visit('/views/template/create');
        cy.get('input[formControlName="title"]', { timeout: 10000 }).type(faker.system.fileName());

        cy.get('iframe.tox-edit-area__iframe') // Adjust selector if needed
            .its('0.contentDocument.body')
            .should('not.be.empty')
            .then(cy.wrap)
            .click()
            .clear()
            .type('This is a test content from Cypress');
        cy.get('button[id="submit-template"]', { timeout: 10000 })
            .click()
            .then(() => {
                cy.url().should(
                    'equal',
                    'http://localhost:4200/views/template/manage',
                );
            });
    });
});
