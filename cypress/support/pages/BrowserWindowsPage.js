/**
 * O Cypress roda o app dentro de uma única aba e não controla janelas extras
 * (https://docs.cypress.io/app/references/trade-offs#Multiple-tabs).
 * Por isso o window.open é interceptado: validamos que a nova janela foi
 * solicitada com a URL correta e abrimos o conteúdo dela na aba de teste.
 */
class BrowserWindowsPage {
  path = '/browser-windows';

  elements = {
    botaoNovaJanela: () => cy.get('#windowButton'),
    tituloJanela: () => cy.get('#sampleHeading'),
  };

  validarPagina() {
    cy.location('pathname').should('eq', this.path);
    cy.contains('h1', 'Browser Windows').should('be.visible');
  }

  interceptarNovaJanela() {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('novaJanela');
    });
  }

  clicarEmNovaJanela() {
    this.elements.botaoNovaJanela().click();
  }

  /** Garante que uma janela (popup com dimensões, não uma aba) foi aberta e navega até ela. */
  validarEAcessarNovaJanela() {
    cy.get('@novaJanela')
      .should('have.been.calledOnce')
      .its('firstCall.args')
      .then(([url, alvo, caracteristicas]) => {
        expect(url).to.eq('/sample');
        expect(alvo).to.eq('_blank');
        expect(caracteristicas, 'abre como janela, com largura e altura').to.match(/width=\d+.*height=\d+/);
        cy.visit(url);
      });
  }

  validarMensagemNovaJanela(mensagem) {
    cy.location('pathname').should('eq', '/sample');
    this.elements.tituloJanela().should('be.visible').and('have.text', mensagem);
  }

  /** "Fecha" a janela retornando à página de origem e confirma que ela segue funcional. */
  fecharNovaJanela() {
    cy.go('back');
    this.validarPagina();
    this.elements.botaoNovaJanela().should('be.visible');
  }
}

export default new BrowserWindowsPage();
