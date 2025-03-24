describe('Auth Tests', () => {
    // it('forgot password', () => {
    //     cy.visit('/');
    //     cy.get('form').within(() => {
    //         cy.get('button').click(); // Only yield textareas within form
    //     });
    // });

    // it('otp', () => {
    //     cy.visit('/');
    //     cy.get('form').within(() => {
    //         cy.get('button').click(); // Only yield textareas within form
    //     });
    // });

    it('login', () => {
        cy.visit('/');
        cy.get('form')
            .within(() => {
                cy.get('input[formControlName="email"]').clear().type('john@cena.com');
                cy.get('input[formControlName="password"]').clear().type('john');
                cy.get('button').click();
            })
            .then(() => {
                cy.url().should(
                    'equal',
                    'http://localhost:4200/views/contract/manage',
                );
            });
    });
});
