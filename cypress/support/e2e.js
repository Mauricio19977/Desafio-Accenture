import 'cypress-plugin-api';
import './commands';

// O demoqa carrega scripts de terceiros (anúncios/analytics) que lançam exceções
// não relacionadas à aplicação. Sem este handler o Cypress falharia o teste por
// erros que não são do sistema sob teste.
Cypress.on('uncaught:exception', () => false);
