// ***********************************************
import '@4tw/cypress-drag-drop'

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
Cypress.Commands.add('login', () => {
    cy.visit('http://cms.dev.env.works/sitecore/login/default.aspx')
    cy.get('#UserName').type('displaye2e')
    cy.get('#Password').type('displaye2e')
    cy.get('#LogInBtn').click()
    cy.wait(2000)
    //cy.get('#StartButton').click()
    //cy.get('#Popup1 > #StartMenu > .scStartMenuContent > .scStartMenuContentColumns > :nth-child(1) > :nth-child(1) > .scStartMenuLeft > [title="Configure displays"] > .scStartMenuLeftOptionDescription > .scStartMenuLeftOptionDisplayName').click()
    cy.visit('http://cms.dev.env.works/sitecore/shell/client/Applications/DisplayManager')
    cy.wait(2000)
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
