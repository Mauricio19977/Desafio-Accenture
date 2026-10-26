import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import BrowserWindowsPage from '../../pages/BrowserWindowsPage';

When('clico no botão "New Window"', () => {
  BrowserWindowsPage.validarPagina();
  BrowserWindowsPage.interceptarNovaJanela();
  BrowserWindowsPage.clicarEmNovaJanela();
});

Then('uma nova janela deve ser aberta com a mensagem {string}', (mensagem) => {
  BrowserWindowsPage.validarEAcessarNovaJanela();
  BrowserWindowsPage.validarMensagemNovaJanela(mensagem);
});

When('fecho a nova janela', () => {
  BrowserWindowsPage.fecharNovaJanela();
});

Then('devo voltar para a página {string}', () => {
  BrowserWindowsPage.validarPagina();
});
