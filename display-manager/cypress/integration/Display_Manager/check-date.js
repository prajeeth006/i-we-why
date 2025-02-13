/// <reference types="cypress"/>
import {dayNames,monthNames} from '../Helper/Datehelper'

it('should check date', function () {
  const d = new Date();
  const fullDate = `Today, ${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  cy.login()
  cy.get('.right-panel-wrapper').find('.display-right-panel-title').invoke('text').then((text) =>{
    console.log(fullDate, 'testing')
    cy.log(fullDate)
    expect(text.trim()).to.equal(fullDate)
  })  
})

   