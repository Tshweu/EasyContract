// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    setTinyMceContent(selector: any,content:any): any;
    getTinyMceContent(param: any,param2:any): any;
    getBySelector(param: any): any;
  }
}
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
// 
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// Cypress.Commands.add("setTinyMceContent", (tinyMceId: string, content: any) => {
  
//     cy.window().should('have.property', 'tinymce')   // wait for tinyMCE
  
//     cy.wait(1000).then(() => {   // wait for editor to be ready
  
//       const win = cy.window()
//       const editor = win.tinymce.EditorManager.get() 
//         .filter((editor: any) => editor.id === fieldId)[0] 
  
//       editor.setContent(content, { format: 'text' });
//     })
//   })
Cypress.Commands.add('getBySelector', (selector, timeout=5000, ...args) => {
    return cy.get(`[id=${selector}]`, { timeout, ...args });
});

Cypress.Commands.add('setTinyMceContent', (selector, content) => {
    // wait for tinymce to be loaded
    cy.window().should('have.property', 'tinymce');
    // wait for the editor to be rendered
    cy.getBySelector(selector)
        .find('textarea')
        .as('editorTextarea')
        .should('exist');
    // set the content for the editor by its dynamic id
    cy.window().then((win) =>
        cy.get('@editorTextarea').then((element) => {
            const editorId = element.attr('id');
            const editorInstance = (
                win as any
            ).tinymce.EditorManager.get().filter(
                (editor: any) => editor.id === editorId,
            )[0];
            editorInstance.setContent(content);
        }),
    );
});

Cypress.Commands.add('getTinyMceContent', (selector) => {
    // wait for tinymce to be loaded
    cy.window().should('have.property', 'tinymce');
    // wait for the editor to be rendered
    cy.getBySelector(selector)
        .find('textarea')
        .as('editorTextarea')
        .should('exist');
    // get the content of the editor by its dynamic id
    cy.window().then((win) =>
        cy.get('@editorTextarea').then((element) => {
            const editorId = element.attr('id');
            const editorInstance = (win as any).tinymce.EditorManager.get().filter((editor:any) => editor.id === editorId)[0];
            const content = editorInstance.getContent();
            return content;
        })
    );
});