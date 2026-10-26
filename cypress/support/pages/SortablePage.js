const VALOR_NUMERICO = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5, Six: 6 };

class SortablePage {
  path = '/sortable';

  elements = {
    abaLista: () => cy.get('#demo-tab-list'),
    itens: () => cy.get('#demo-tabpane-list .list-group-item'),
  };

  validarPagina() {
    cy.location('pathname').should('eq', this.path);
    cy.contains('h1', 'Sortable').should('be.visible');
    this.elements.abaLista().should('have.class', 'active');
  }

  ordemAtual() {
    return this.elements.itens().then(($itens) => [...$itens].map((item) => item.innerText.trim()));
  }

  /**
   * Reorganiza a lista usando apenas drag and drop (selection sort):
   * para cada posição i, arrasta o item esperado (que está em i ou abaixo)
   * até o topo do item que ocupa a posição i.
   */
  reordenar(ordemDesejada, posicao = 0) {
    if (posicao >= ordemDesejada.length) return;

    this.ordemAtual().then((ordem) => {
      const esperado = ordemDesejada[posicao];

      if (ordem[posicao] !== esperado) {
        this.elements.itens().then(($itens) => {
          const origem = $itens.eq(ordem.indexOf(esperado));
          const destino = $itens.eq(posicao);
          cy.wrap(origem).dragTo(destino, 'top');
        });
        this.elements.itens().eq(posicao).should('have.text', esperado);
      }

      this.reordenar(ordemDesejada, posicao + 1);
    });
  }

  ordenarCrescente() {
    this.ordemAtual().then((ordem) => {
      this.reordenar([...ordem].sort((a, b) => VALOR_NUMERICO[a] - VALOR_NUMERICO[b]));
    });
  }

  validarOrdemCrescente() {
    this.ordemAtual().then((ordem) => {
      const valores = ordem.map((item) => VALOR_NUMERICO[item]);
      expect(valores, `ordem atual: ${ordem.join(', ')}`).to.deep.eq([...valores].sort((a, b) => a - b));
    });
  }
}

export default new SortablePage();
