class WebTablesPage {
  path = '/webtables';

  elements = {
    botaoAdicionar: () => cy.get('#addNewRecordButton'),
    busca: () => cy.get('#searchBox'),
    corpoTabela: () => cy.get('table tbody'),
    linhas: () => cy.get('table tbody tr'),
    linhaPorEmail: (email) => cy.contains('table tbody tr', email),
    modal: () => cy.get('.modal-content'),
    campo: {
      nome: () => cy.get('#firstName'),
      sobrenome: () => cy.get('#lastName'),
      email: () => cy.get('#userEmail'),
      idade: () => cy.get('#age'),
      salario: () => cy.get('#salary'),
      departamento: () => cy.get('#department'),
    },
    enviar: () => cy.get('#submit'),
  };

  validarPagina() {
    cy.location('pathname').should('eq', this.path);
    cy.contains('h1', 'Web Tables').should('be.visible');
  }

  preencherModal(registro) {
    Object.entries(this.elements.campo).forEach(([chave, campo]) => {
      if (registro[chave] !== undefined) campo().clear().type(registro[chave]);
    });
    this.elements.enviar().click();
    this.elements.modal().should('not.exist');
  }

  criarRegistro(registro) {
    this.elements.botaoAdicionar().click();
    this.elements.modal().should('be.visible');
    this.preencherModal(registro);
  }

  /** Filtra a tabela pela busca para isolar o registro, independente da paginação. */
  buscar(texto) {
    if (texto) {
      this.elements.busca().clear().type(texto);
    } else {
      this.elements.busca().clear();
    }
  }

  /** Filtra pelo e-mail (único) e aguarda a tabela estabilizar com apenas a linha do registro. */
  filtrarPorEmail(email) {
    this.buscar(email);
    this.elements.linhas().should('have.length', 1).and('contain', email);
  }

  editarRegistro(email, novosDados) {
    this.filtrarPorEmail(email);
    this.elements.linhaPorEmail(email).find('[id^="edit-record-"]').click();
    this.elements.campo.email().should('have.value', email);
    this.preencherModal(novosDados);
  }

  deletarRegistro(email) {
    this.filtrarPorEmail(email);
    this.elements.linhaPorEmail(email).find('[id^="delete-record-"]').click();
    this.elements.corpoTabela().should('not.contain', email);
  }

  /**
   * Exclui, pelo botão de delete, cada registro que ainda estiver na tabela.
   * Hoje o demoqa descarta todos os registros adicionados a cada exclusão (ver cenário @bug),
   * então nem sempre é preciso um clique por registro; o resultado final é o mesmo.
   */
  deletarRegistros(emails) {
    emails.forEach((email) => {
      this.buscar(email);
      // Aguarda o filtro ser aplicado: toda linha exibida (se houver) é do e-mail buscado
      this.elements
        .corpoTabela()
        .should(($corpo) => {
          expect([...$corpo.find('tr')].every((linha) => linha.innerText.includes(email))).to.be.true;
        })
        .then(($corpo) => {
        if ($corpo.text().includes(email)) {
          this.deletarRegistro(email);
        } else {
          cy.log(`${email} já havia sido removido da tabela`);
        }
      });
    });
    this.buscar('');
  }

  validarRegistro({ nome, sobrenome, idade, email, salario, departamento }) {
    this.filtrarPorEmail(email);
    this.elements
      .linhaPorEmail(email)
      .find('td')
      .then(($celulas) => {
        const valores = [...$celulas].slice(0, 6).map((td) => td.innerText.trim());
        expect(valores).to.deep.eq([nome, sobrenome, idade, email, salario, departamento]);
      });
  }

  validarRegistroInexistente(email) {
    this.buscar(email);
    this.elements.corpoTabela().should('not.contain', email);
  }
}

export default new WebTablesPage();
