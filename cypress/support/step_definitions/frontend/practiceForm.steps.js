import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PracticeFormPage from '../../pages/PracticeFormPage';
import { gerarAluno, formatarDataPopup } from '../../utils/dataFactory';

const PASTA_UPLOAD = 'cypress/fixtures/upload';

let aluno;
let arquivo;

When('preencho todo o formulário com valores aleatórios', () => {
  aluno = gerarAluno();
  PracticeFormPage.validarPagina();
  PracticeFormPage.preencherFormulario(aluno);
});

When('anexo o arquivo {string}', (nomeArquivo) => {
  expect(nomeArquivo, 'o upload deve ser um arquivo .txt').to.match(/\.txt$/);
  arquivo = nomeArquivo;
  PracticeFormPage.anexarArquivo(`${PASTA_UPLOAD}/${nomeArquivo}`);
});

When('submeto o formulário', () => {
  PracticeFormPage.enviarFormulario();
});

Then('um popup de confirmação deve ser exibido com os dados informados', () => {
  PracticeFormPage.elements.popup().should('be.visible');
  PracticeFormPage.elements.tituloPopup().should('have.text', 'Thanks for submitting the form');

  PracticeFormPage.lerDadosPopup().should('deep.eq', {
    'Student Name': `${aluno.nome} ${aluno.sobrenome}`,
    'Student Email': aluno.email,
    Gender: aluno.genero,
    Mobile: aluno.celular,
    'Date of Birth': formatarDataPopup(aluno.nascimento),
    Subjects: aluno.materias.join(', '),
    Hobbies: aluno.hobbies.join(', '),
    Picture: arquivo,
    Address: aluno.endereco,
    'State and City': `${aluno.estado} ${aluno.cidade}`,
  });
});

When('fecho o popup pelo teclado', () => {
  PracticeFormPage.fecharPopupComEsc();
});

When('fecho o popup pelo botão {string}', () => {
  PracticeFormPage.fecharPopupNoBotao();
});

Then('o popup não deve mais ser exibido', () => {
  PracticeFormPage.elements.popup().should('not.exist');
});
