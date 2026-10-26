import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import SortablePage from '../../pages/SortablePage';

const paraLista = (texto) => texto.split(',').map((item) => item.trim());

Given('a lista está na ordem {string}', (ordem) => {
  SortablePage.validarPagina();
  SortablePage.reordenar(paraLista(ordem));
  SortablePage.ordemAtual().should('deep.eq', paraLista(ordem));
});

When('ordeno os elementos em ordem crescente usando drag and drop', () => {
  SortablePage.ordenarCrescente();
});

Then('os elementos devem estar na ordem {string}', (ordem) => {
  SortablePage.ordemAtual().should('deep.eq', paraLista(ordem));
  SortablePage.validarOrdemCrescente();
});
