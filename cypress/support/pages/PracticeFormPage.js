import { formatarDataCampo } from '../utils/dataFactory';

const HOBBY_ID = { Sports: 1, Reading: 2, Music: 3 };

class PracticeFormPage {
  path = '/automation-practice-form';

  elements = {
    nome: () => cy.get('#firstName'),
    sobrenome: () => cy.get('#lastName'),
    email: () => cy.get('#userEmail'),
    genero: (valor) => cy.get(`#genterWrapper input[value="${valor}"]`),
    celular: () => cy.get('#userNumber'),
    dataNascimento: () => cy.get('#dateOfBirthInput'),
    seletorMes: () => cy.get('.react-datepicker__month-select'),
    seletorAno: () => cy.get('.react-datepicker__year-select'),
    diaCalendario: (dia) =>
      cy.get(`.react-datepicker__day--${String(dia).padStart(3, '0')}:not(.react-datepicker__day--outside-month)`),
    materias: () => cy.get('#subjectsInput'),
    opcaoMateria: (materia) => cy.contains('.subjects-auto-complete__option', materia),
    hobby: (hobby) => cy.get(`#hobbies-checkbox-${HOBBY_ID[hobby]}`),
    upload: () => cy.get('#uploadPicture'),
    endereco: () => cy.get('#currentAddress'),
    estado: () => cy.get('#state'),
    cidade: () => cy.get('#city'),
    opcaoSelect: (container, texto) => cy.contains(`${container} [id*="-option-"]`, texto),
    enviar: () => cy.get('#submit'),
    popup: () => cy.get('.modal-content'),
    tituloPopup: () => cy.get('#example-modal-sizes-title-lg'),
    linhasPopup: () => cy.get('.modal-body table tbody tr'),
    fecharPopup: () => cy.get('#closeLargeModal'),
  };

  validarPagina() {
    cy.location('pathname').should('eq', this.path);
    cy.contains('h1', 'Practice Form').should('be.visible');
  }

  preencherFormulario(aluno) {
    this.elements.nome().type(aluno.nome);
    this.elements.sobrenome().type(aluno.sobrenome);
    this.elements.email().type(aluno.email);
    // O input de rádio fica atrás do label customizado do Bootstrap
    this.elements.genero(aluno.genero).check({ force: true });
    this.elements.celular().type(aluno.celular);
    this.selecionarDataNascimento(aluno.nascimento);
    aluno.materias.forEach((materia) => this.selecionarMateria(materia));
    aluno.hobbies.forEach((hobby) => this.elements.hobby(hobby).check({ force: true }));
    this.elements.endereco().type(aluno.endereco);
    this.selecionarOpcao('#state', this.elements.estado, aluno.estado);
    this.selecionarOpcao('#city', this.elements.cidade, aluno.cidade);
  }

  selecionarDataNascimento({ dia, mes, ano }) {
    this.elements.dataNascimento().click();
    this.elements.seletorMes().select(String(mes));
    this.elements.seletorAno().select(String(ano));
    this.elements.diaCalendario(dia).click();
    this.elements.dataNascimento().should('have.value', formatarDataCampo({ dia, mes, ano }));
  }

  /** Digita parte do nome e clica na opção — {enter} sem opção destacada submeteria o form. */
  selecionarMateria(materia) {
    this.elements.materias().type(materia.slice(0, 3));
    this.elements.opcaoMateria(materia).click();
  }

  selecionarOpcao(container, campo, texto) {
    campo().click();
    this.elements.opcaoSelect(container, texto).click();
    campo().should('contain.text', texto);
  }

  anexarArquivo(caminho) {
    this.elements.upload().selectFile(caminho);
  }

  enviarFormulario() {
    this.elements.enviar().click();
  }

  /** Retorna o conteúdo do popup como objeto { Label: Valor }. */
  lerDadosPopup() {
    return this.elements.linhasPopup().then(($linhas) =>
      Object.fromEntries([...$linhas].map((linha) => [...linha.cells].map((c) => c.innerText.trim())))
    );
  }

  fecharPopupComEsc() {
    this.elements.popup().should('be.visible');
    cy.get('body').type('{esc}');
  }

  fecharPopupNoBotao() {
    this.elements.fecharPopup().should('have.text', 'Close').click();
  }
}

export default new PracticeFormPage();
