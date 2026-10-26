# language: pt
@frontend
Funcionalidade: Browser Windows
  Como um usuário do demoqa
  Quero abrir uma nova janela a partir da página
  Para visualizar o conteúdo de exemplo

  Cenário: Abrir uma nova janela, validar a mensagem e fechá-la
    Dado que acesso o site demoqa
    Quando escolho a opção "Alerts, Frame & Windows" na página inicial
    E clico no submenu "Browser Windows"
    E clico no botão "New Window"
    Então uma nova janela deve ser aberta com a mensagem "This is a sample page"
    Quando fecho a nova janela
    Então devo voltar para a página "Browser Windows"
