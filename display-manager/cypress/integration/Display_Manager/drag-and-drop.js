/// <reference types="cypress"/>
it('drag and drop', ()=>{
    const dataTransfer = new DataTransfer()
    cy.login()
    cy.get('.mat-tab-header-pagination-after > .mat-tab-header-pagination-chevron').click()
    cy.wait(1000)
    cy.get('#mat-tab-label-0-4 > .mat-tab-label-content').click()
    cy.wait(1000)
    cy.get(':nth-child(4) > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click()
    cy.wait(1000)
    cy.get(':nth-child(6) > .app-draggable').trigger('dragstart',{
      dataTransfer
    })
    cy.wait(4000)
    cy.get('display-manager-screens > :nth-child(1) > :nth-child(2)').trigger('drop',{
      dataTransfer
    })
  })