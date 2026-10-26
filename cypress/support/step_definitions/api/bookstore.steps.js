import { Before, After, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import AccountService from '../../services/AccountService';
import BookStoreService from '../../services/BookStoreService';
import { gerarCredenciais } from '../../utils/dataFactory';

// Estado compartilhado entre os steps de um mesmo cenário
let contexto;

Before({ tags: '@api' }, () => {
  contexto = { credenciais: null, userId: null, token: null, livros: [], livrosAlugados: [], resposta: null };
});

// Remove o usuário criado para não deixar lixo na base do demoqa
After({ tags: '@api' }, () => {
  if (!contexto.userId) return;

  const removerUsuario = (token) =>
    AccountService.deletarUsuario(contexto.userId, token).its('status').should('eq', 204);

  if (contexto.token) {
    removerUsuario(contexto.token);
  } else {
    AccountService.gerarToken(contexto.credenciais).its('body.token').then(removerUsuario);
  }
});

const isbnDoLivro = (titulo) => {
  const livro = contexto.livros.find((l) => l.title === titulo);
  expect(livro, `livro "${titulo}" na lista de disponíveis`).to.exist;
  return livro.isbn;
};

Given('que crio um novo usuário com credenciais válidas', () => {
  contexto.credenciais = gerarCredenciais();

  AccountService.criarUsuario(contexto.credenciais).then(({ status, body }) => {
    expect(status).to.eq(201);
    expect(body.userID).to.be.a('string').and.not.be.empty;
    expect(body.username).to.eq(contexto.credenciais.userName);
    expect(body.books).to.be.an('array').that.is.empty;
    contexto.userId = body.userID;
  });
});

Given('gero um token de acesso para o usuário', () => {
  AccountService.gerarToken(contexto.credenciais).then(({ status, body }) => {
    expect(status).to.eq(200);
    expect(body.status).to.eq('Success');
    expect(body.result).to.eq('User authorized successfully.');
    expect(body.token).to.be.a('string').and.not.be.empty;
    expect(new Date(body.expires)).to.be.greaterThan(new Date());
    contexto.token = body.token;
  });
});

Given('confirmo que o usuário está autorizado', () => {
  AccountService.verificarAutorizacao(contexto.credenciais).then(({ status, body }) => {
    expect(status).to.eq(200);
    expect(body).to.eq(true);
  });
});

When('listo os livros disponíveis', () => {
  BookStoreService.listarLivros().then(({ status, body }) => {
    expect(status).to.eq(200);
    expect(body.books).to.be.an('array').and.not.be.empty;
    body.books.forEach((livro) => expect(livro).to.include.all.keys('isbn', 'title', 'author', 'publisher'));
    contexto.livros = body.books;
  });
});

When('alugo os livros {string} e {string}', (titulo1, titulo2) => {
  contexto.livrosAlugados = [titulo1, titulo2].map((titulo) => ({ titulo, isbn: isbnDoLivro(titulo) }));
  const isbns = contexto.livrosAlugados.map((l) => l.isbn);

  BookStoreService.alugarLivros(contexto.userId, isbns, contexto.token).then(({ status, body }) => {
    expect(status).to.eq(201);
    expect(body.books.map((b) => b.isbn)).to.have.members(isbns);
  });
});

Then('os detalhes do usuário devem listar os livros alugados', () => {
  AccountService.buscarUsuario(contexto.userId, contexto.token).then(({ status, body }) => {
    expect(status).to.eq(200);
    expect(body.userId).to.eq(contexto.userId);
    expect(body.username).to.eq(contexto.credenciais.userName);
    expect(body.books).to.have.length(contexto.livrosAlugados.length);

    contexto.livrosAlugados.forEach(({ titulo, isbn }) => {
      const livro = body.books.find((b) => b.isbn === isbn);
      expect(livro, `livro ${isbn} no perfil do usuário`).to.exist;
      expect(livro.title).to.eq(titulo);
    });

    cy.log(`Livros do usuário: ${body.books.map((b) => b.title).join(' | ')}`);
  });
});

When('tento criar um usuário com a senha {string}', (senha) => {
  contexto.credenciais = { ...gerarCredenciais(), password: senha };
  AccountService.criarUsuario(contexto.credenciais).then((resposta) => {
    contexto.resposta = resposta;
    // Se a API aceitar indevidamente, garante a limpeza no After
    if (resposta.status === 201) contexto.userId = resposta.body.userID;
  });
});

When('tento criar novamente um usuário com o mesmo nome', () => {
  AccountService.criarUsuario(contexto.credenciais).then((resposta) => {
    contexto.resposta = resposta;
  });
});

When('tento alugar o livro {string} sem token de acesso', (titulo) => {
  BookStoreService.listarLivros().then(({ body }) => {
    contexto.livros = body.books;
    BookStoreService.alugarLivros(contexto.userId, [isbnDoLivro(titulo)]).then((resposta) => {
      contexto.resposta = resposta;
    });
  });
});

Then('a API deve responder com status {int} e código {string}', (status, codigo) => {
  expect(contexto.resposta.status).to.eq(status);
  expect(contexto.resposta.body.code).to.eq(codigo);
});

Then('a API deve responder com status {int} e mensagem {string}', (status, mensagem) => {
  expect(contexto.resposta.status).to.eq(status);
  expect(contexto.resposta.body.message).to.eq(mensagem);
});
