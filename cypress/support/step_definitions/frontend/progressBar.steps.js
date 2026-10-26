import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import ProgressBarPage from '../../pages/ProgressBarPage';

When('clico no botão "Start"', () => {
  ProgressBarPage.validarPagina();
  ProgressBarPage.iniciar();
});

When('paro a barra de progresso antes dos {int}%', (limite) => {
  ProgressBarPage.pararAntesDe(limite);
});

Then('o valor da barra de progresso deve ser menor ou igual a {int}%', (limite) => {
  ProgressBarPage.validarQueEstaParada();
  ProgressBarPage.valorAtual().should('be.gt', 0).and('be.lte', limite);
  ProgressBarPage.elements.barra().invoke('text').should('match', /^\d+%$/);
});

When('clico no botão "Start" novamente e a barra chega aos 100%', () => {
  ProgressBarPage.iniciar();
  ProgressBarPage.aguardarConclusao();
});

When('reseto a barra de progresso', () => {
  ProgressBarPage.resetar();
});

Then('a barra de progresso deve voltar para 0%', () => {
  ProgressBarPage.elements.barra().should('have.attr', 'aria-valuenow', '0').and('have.text', '0%');
  ProgressBarPage.elements.botaoStartStop().should('have.text', 'Start');
  ProgressBarPage.validarQueEstaParada();
});
