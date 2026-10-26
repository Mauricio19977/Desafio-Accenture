/**
 * Service Object dos endpoints de conta (/Account/v1) da Book Store API.
 * Os métodos apenas executam as requisições; as validações ficam nos steps.
 * `failOnStatusCode: false` permite validar também respostas de erro.
 */
class AccountService {
  criarUsuario({ userName, password }) {
    return cy.api({
      method: 'POST',
      url: '/Account/v1/User',
      body: { userName, password },
      failOnStatusCode: false,
    });
  }

  gerarToken({ userName, password }) {
    return cy.api({
      method: 'POST',
      url: '/Account/v1/GenerateToken',
      body: { userName, password },
      failOnStatusCode: false,
    });
  }

  verificarAutorizacao({ userName, password }) {
    return cy.api({
      method: 'POST',
      url: '/Account/v1/Authorized',
      body: { userName, password },
      failOnStatusCode: false,
    });
  }

  buscarUsuario(userId, token) {
    return cy.api({
      method: 'GET',
      url: `/Account/v1/User/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    });
  }

  deletarUsuario(userId, token) {
    return cy.api({
      method: 'DELETE',
      url: `/Account/v1/User/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    });
  }
}

export default new AccountService();
