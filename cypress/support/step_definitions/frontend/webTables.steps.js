import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import WebTablesPage from '../../pages/WebTablesPage';
import { gerarRegistroTabela } from '../../utils/dataFactory';

const REGISTROS_ORIGINAIS = ['cierra@example.com', 'alden@example.com', 'kierra@example.com'];

let registro;
let registros = [];

When('crio um novo registro', () => {
  WebTablesPage.validarPagina();
  registro = gerarRegistroTabela();
  WebTablesPage.criarRegistro(registro);
});

Then('o novo registro deve ser exibido na tabela', () => {
  WebTablesPage.validarRegistro(registro);
});

When('edito o novo registro criado', () => {
  const { nome, sobrenome, idade, salario, departamento } = gerarRegistroTabela();
  const novosDados = { nome, sobrenome, idade, salario, departamento };

  WebTablesPage.editarRegistro(registro.email, novosDados);
  registro = { ...registro, ...novosDados };
});

Then('o registro deve ser exibido com os dados atualizados', () => {
  WebTablesPage.validarRegistro(registro);
});

When('deleto o novo registro criado', () => {
  WebTablesPage.deletarRegistro(registro.email);
});

Then('o registro não deve mais ser exibido na tabela', () => {
  WebTablesPage.validarRegistroInexistente(registro.email);
});

When('crio {int} novos registros com dados dinâmicos', (quantidade) => {
  WebTablesPage.validarPagina();
  registros = Array.from({ length: quantidade }, gerarRegistroTabela);
  registros.forEach((novo) => WebTablesPage.criarRegistro(novo));
});

Then('os {int} registros devem ser exibidos na tabela', (quantidade) => {
  expect(registros).to.have.length(quantidade);
  registros.forEach((criado) => WebTablesPage.validarRegistro(criado));
});

When('deleto todos os registros criados', () => {
  WebTablesPage.deletarRegistros(registros.map(({ email }) => email));
});

When('deleto o primeiro registro criado', () => {
  WebTablesPage.deletarRegistro(registros[0].email);
});

Then('os demais registros criados devem continuar na tabela', () => {
  registros.slice(1).forEach((restante) => WebTablesPage.validarRegistro(restante));
});

Then('nenhum dos registros criados deve ser exibido na tabela', () => {
  registros.forEach(({ email }) => WebTablesPage.validarRegistroInexistente(email));
});

Then('a tabela deve manter apenas os registros originais', () => {
  WebTablesPage.buscar('');
  WebTablesPage.elements.linhas().should('have.length', REGISTROS_ORIGINAIS.length);
  REGISTROS_ORIGINAIS.forEach((email) => WebTablesPage.elements.linhaPorEmail(email).should('be.visible'));
});
