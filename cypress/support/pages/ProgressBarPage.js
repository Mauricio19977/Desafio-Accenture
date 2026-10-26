class ProgressBarPage {
  path = '/progress-bar';

  elements = {
    barra: (opcoes) => cy.get('#progressBar [role="progressbar"]', opcoes),
    botaoStartStop: () => cy.get('#startStopButton'),
    botaoReset: () => cy.get('#resetButton'),
  };

  validarPagina() {
    cy.location('pathname').should('eq', this.path);
    cy.contains('h1', 'Progress Bar').should('be.visible');
  }

  valorAtual() {
    return this.elements.barra().invoke('attr', 'aria-valuenow').then(Number);
  }

  iniciar() {
    this.elements.botaoStartStop().should('have.text', 'Start').click();
    this.elements.botaoStartStop().should('have.text', 'Stop');
  }

  /**
   * A barra avança ~1% a cada 100ms. Esperamos ela começar a andar e paramos
   * com folga em relação ao limite, absorvendo a latência entre leitura e clique.
   */
  pararAntesDe(limite) {
    const pontoDeParada = Math.max(1, limite - 10);

    this.elements.barra().should(($barra) => {
      expect(Number($barra.attr('aria-valuenow'))).to.be.gte(pontoDeParada);
    });
    this.elements.botaoStartStop().click();
    this.elements.botaoStartStop().should('have.text', 'Start');
  }

  /** Garante que a barra realmente parou: o valor não muda após um intervalo. */
  validarQueEstaParada() {
    this.valorAtual().then((valorAntes) => {
      cy.wait(500);
      this.valorAtual().should('eq', valorAntes);
    });
  }

  aguardarConclusao() {
    this.elements.barra({ timeout: 20000 }).should('have.attr', 'aria-valuenow', '100').and('have.text', '100%');
    this.elements.botaoReset().should('be.visible').and('have.text', 'Reset');
    // O demoqa só cancela o timer um tick depois de exibir 100%: um Reset nesse intervalo
    // zera a barra, mas ela recomeça sozinha. Só resetamos com a barra de fato parada.
    this.validarQueEstaParada();
  }

  resetar() {
    this.elements.botaoReset().click();
  }
}

export default new ProgressBarPage();
