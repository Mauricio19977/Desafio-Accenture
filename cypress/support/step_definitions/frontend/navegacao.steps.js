import { Given, When } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../../pages/HomePage';

Given('que acesso o site demoqa', () => {
  HomePage.acessar();
});

When('escolho a opção {string} na página inicial', (card) => {
  HomePage.escolherCard(card);
});

When('clico no submenu {string}', (submenu) => {
  HomePage.clicarNoSubmenu(submenu);
});
