/// <reference types="cypress"/>
it('label dropdown', ()=>{
    cy.login()
    cy.get('.mat-select-arrow').click()
    cy.wait(2000)
     cy.get('#mat-option-1 > .mat-option-text').click()
     cy.wait(1000)
})
