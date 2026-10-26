/**
 * Drag and drop via eventos HTML5 (dragstart → dragenter → dragover → drop → dragend).
 * O Sortable do demoqa usa react-dnd com HTML5Backend, que reage a esses eventos.
 *
 * @example cy.get('@origem').dragTo('@destino', 'top')
 * @param {string|JQuery} target alvo do drop (seletor, alias ou elemento)
 * @param {Cypress.PositionType} position ponto do alvo onde o item é solto
 */
Cypress.Commands.add('dragTo', { prevSubject: 'element' }, (subject, target, position = 'center') => {
  const dataTransfer = new DataTransfer();

  const getAlvo = () => (typeof target === 'string' ? cy.get(target) : cy.wrap(target));

  cy.wrap(subject).trigger('dragstart', { dataTransfer });
  getAlvo()
    .trigger('dragenter', position, { dataTransfer })
    .trigger('dragover', position, { dataTransfer })
    .trigger('drop', position, { dataTransfer });
  cy.wrap(subject).trigger('dragend', { dataTransfer });
});
