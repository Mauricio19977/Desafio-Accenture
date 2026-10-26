# language: pt
@frontend
Funcionalidade: Practice Form
  Como um estudante
  Quero preencher o formulário de cadastro
  Para registrar meus dados no sistema

  Contexto:
    Dado que acesso o site demoqa
    Quando escolho a opção "Forms" na página inicial
    E clico no submenu "Practice Form"
    E preencho todo o formulário com valores aleatórios
    E anexo o arquivo "arquivo-upload.txt"
    E submeto o formulário

  Cenário: Submeter o formulário com valores aleatórios e upload de arquivo .txt
    Então um popup de confirmação deve ser exibido com os dados informados
    Quando fecho o popup pelo teclado
    Então o popup não deve mais ser exibido

  # BUG conhecido do demoqa: o botão "Close" lança "TypeError: findDOMNode is not a function"
  # (API removida no React 19) e o popup não fecha. Fora da execução padrão; rode com: npm run test:bugs
  @bug
  Cenário: Fechar o popup de confirmação pelo botão Close
    Então um popup de confirmação deve ser exibido com os dados informados
    Quando fecho o popup pelo botão "Close"
    Então o popup não deve mais ser exibido
