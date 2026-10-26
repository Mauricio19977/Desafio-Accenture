# language: pt
@api
Funcionalidade: Book Store API - aluguel de livros
  Como um novo cliente da Book Store
  Quero criar minha conta, me autenticar e alugar livros
  Para consultar no meu perfil os livros que reservei

  Cenário: Fluxo completo de criação de usuário e aluguel de dois livros
    Dado que crio um novo usuário com credenciais válidas
    E gero um token de acesso para o usuário
    E confirmo que o usuário está autorizado
    Quando listo os livros disponíveis
    E alugo os livros "Git Pocket Guide" e "Speaking JavaScript"
    Então os detalhes do usuário devem listar os livros alugados

  Cenário: Não permite criar usuário com senha fraca
    Quando tento criar um usuário com a senha "abc123"
    Então a API deve responder com status 400 e código "1300"

  Cenário: Não permite criar usuário com nome já existente
    Dado que crio um novo usuário com credenciais válidas
    Quando tento criar novamente um usuário com o mesmo nome
    Então a API deve responder com status 406 e mensagem "User exists!"

  Cenário: Não permite alugar livros sem token de acesso
    Dado que crio um novo usuário com credenciais válidas
    Quando tento alugar o livro "Git Pocket Guide" sem token de acesso
    Então a API deve responder com status 401 e mensagem "User not authorized!"
