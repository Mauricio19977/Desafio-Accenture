/**
 * Página inicial do demoqa e menu lateral (comum a todas as páginas internas).
 */
class HomePage {
  elements = {
    cards: () => cy.get('.category-cards .card'),
    itensMenuLateral: () => cy.get('.left-pannel .element-list li'),
  };

  acessar() {
    cy.visit('/');
    this.elements.cards().should('have.length.greaterThan', 0);
  }

  escolherCard(nome) {
    this.elements.cards().contains('h5', nome).click();
  }

  clicarNoSubmenu(nome) {
    this.elements.itensMenuLateral().contains(nome).should('be.visible').click();
  }
}

export default new HomePage();
