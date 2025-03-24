describe('My First Test', () => {
    before(() => {
        cy.visit('/');
        cy.get('form')
            .within(() => {
                cy.get('input[formControlName="email"]')
                    .clear()
                    .type('john@cena.com');
                cy.get('input[formControlName="password"]')
                    .clear()
                    .type('john');
                cy.get('button').click();
            })
            .then(() => {
                cy.url().should(
                    'equal',
                    'http://localhost:4200/views/contract/manage',
                );
            });
    });


    it('Creates new contract', () => {
        cy.visit('/views/contract/create');

        cy.get('input[formControlName="title"]').type('Single Unit John Maleki 2024 Agreement');
        cy.get('mat-select[formControlName="templateId"]').click().get('mat-option').first().click();
        cy.get('input[formControlName="name"]').type('Thabang John');
        cy.get('input[formControlName="surname"]').type('Cena');
        cy.get('input[formControlName="email"]').type('john@mymy.com');
        cy.get('input[formControlName="idNumber"]').type('036387286212');
    
        cy.get('button[id="submit-contract"]').click();
        cy.url().should(
            'equal',
            'http://localhost:4200/views/contract/manage',
        );
    });
});
