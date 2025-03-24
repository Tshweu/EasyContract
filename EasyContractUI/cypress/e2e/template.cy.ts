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
        cy.setTinyMceContent('mce',"Some contract stuff").then(()=>{

            cy.get('input[formControlName="title"]',{timeout: 10000}).type(faker.system.fileName());
            cy.get('button[id="submit-template"]',{timeout: 10000})
                .click()
                .then(() => {
                    cy.url().should(
                        'equal',
                        'http://localhost:4200/views/template/manage',
                    );
                });
        });
        
    });
});
