/**
 * Service Object dos endpoints de livros (/BookStore/v1) da Book Store API.
 */
class BookStoreService {
  listarLivros() {
    return cy.api({
      method: 'GET',
      url: '/BookStore/v1/Books',
      failOnStatusCode: false,
    });
  }

  alugarLivros(userId, isbns, token) {
    return cy.api({
      method: 'POST',
      url: '/BookStore/v1/Books',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: {
        userId,
        collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
      },
      failOnStatusCode: false,
    });
  }
}

export default new BookStoreService();
